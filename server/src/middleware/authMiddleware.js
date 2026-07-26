import jwt from "jsonwebtoken";
import logger from "../config/logger.js";

export function authenticateToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      logger.warn(
        `Authentication failed: missing token | IP: ${req.ip}`
      );

      return res.status(401).json({
        message: "Authentication token is required",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      userId: decoded.userId,
      email: decoded.email,
    };

    next();
  } catch (error) {
    logger.error(
      `Authentication failed: ${error.message} | IP: ${req.ip}`
    );

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}

export function optionalAuthenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    req.user = null;
    return next();
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      userId: decoded.userId,
      email: decoded.email,
    };
  } catch (error) {
    logger.warn(
      `Optional authentication failed: ${error.message} | IP: ${req.ip}`
    );

    req.user = null;
  }

  next();
}