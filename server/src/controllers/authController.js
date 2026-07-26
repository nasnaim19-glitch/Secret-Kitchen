import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import prisma from "../config/prisma.js";
import logger from "../config/logger.js";

export async function register(req, res) {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      logger.warn(
        `Registration rejected: missing required fields | IP: ${req.ip}`
      );

      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    if (existingUser) {
      logger.warn(
        `Registration rejected: email already registered | IP: ${req.ip}`
      );

      return res.status(409).json({
        message: "Email is already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: normalizedEmail,
        password: hashedPassword,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        createdAt: true,
      },
    });

    logger.info(
      `User registered successfully | User ID: ${newUser.id} | IP: ${req.ip}`
    );

    return res.status(201).json({
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    logger.error(`Registration failed: ${error.stack || error.message}`);

    return res.status(500).json({
      message: "Failed to register user",
    });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      logger.warn(
        `Login rejected: email or password missing | IP: ${req.ip}`
      );

      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    if (!user) {
      logger.warn(
        `Login failed: invalid credentials | IP: ${req.ip}`
      );

      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {
      logger.warn(
        `Login failed: invalid credentials | User ID: ${user.id} | IP: ${req.ip}`
      );

      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    logger.info(
      `User logged in successfully | User ID: ${user.id} | IP: ${req.ip}`
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (error) {
    logger.error(`Login failed: ${error.stack || error.message}`);

    return res.status(500).json({
      message: "Failed to login",
    });
  }
}