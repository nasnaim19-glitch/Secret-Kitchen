import prisma from "../config/prisma.js";
import logger from "../config/logger.js";

export async function getAllCuisines(req, res) {
  try {
    const cuisines = await prisma.cuisine.findMany({
      orderBy: {
        name: "asc",
      },
    });

    logger.info(
      `Cuisines retrieved successfully | Count: ${cuisines.length} | IP: ${req.ip}`
    );

    return res.status(200).json(cuisines);
  } catch (error) {
    logger.error(
      `Get cuisines failed: ${error.stack || error.message}`
    );

    return res.status(500).json({
      message: "Failed to fetch cuisines",
    });
  }
}

export async function getCuisineById(req, res) {
  try {
    const cuisineId = Number(req.params.id);

    if (!Number.isInteger(cuisineId) || cuisineId <= 0) {
      logger.warn(
        `Invalid cuisine ID: ${req.params.id} | IP: ${req.ip}`
      );

      return res.status(400).json({
        message: "Invalid cuisine ID",
      });
    }

    const isAuthenticated = Boolean(req.user);

    const cuisine = await prisma.cuisine.findUnique({
      where: {
        id: cuisineId,
      },
      include: {
        recipes: {
          where: isAuthenticated
            ? {}
            : {
                isSecret: false,
              },
          orderBy: {
            name: "asc",
          },
        },
      },
    });

    if (!cuisine) {
      logger.warn(
        `Cuisine not found | Cuisine ID: ${cuisineId} | IP: ${req.ip}`
      );

      return res.status(404).json({
        message: "Cuisine not found",
      });
    }

    logger.info(
      `Cuisine retrieved successfully | Cuisine ID: ${cuisine.id} | Recipes count: ${cuisine.recipes.length} | Authenticated: ${isAuthenticated} | IP: ${req.ip}`
    );

    return res.status(200).json(cuisine);
  } catch (error) {
    logger.error(
      `Get cuisine by ID failed: ${error.stack || error.message}`
    );

    return res.status(500).json({
      message: "Failed to fetch cuisine",
    });
  }
}