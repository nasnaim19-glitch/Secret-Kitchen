import prisma from "../config/prisma.js";
import logger from "../config/logger.js";

export async function getAllRecipes(req, res) {
  try {
    const isAuthenticated = Boolean(req.user);

    const recipes = await prisma.recipe.findMany({
      where: isAuthenticated
        ? {}
        : {
            isSecret: false,
          },
      include: {
        cuisine: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    logger.info(
      `Recipes retrieved successfully | Count: ${recipes.length} | Authenticated: ${isAuthenticated} | IP: ${req.ip}`
    );

    return res.status(200).json(recipes);
  } catch (error) {
    logger.error(`Get recipes failed: ${error.stack || error.message}`);

    return res.status(500).json({
      message: "Failed to fetch recipes",
    });
  }
}

export async function getRecipeById(req, res) {
  try {
    const recipeId = Number(req.params.id);

    if (!Number.isInteger(recipeId) || recipeId <= 0) {
      logger.warn(
        `Invalid recipe ID: ${req.params.id} | IP: ${req.ip}`
      );

      return res.status(400).json({
        message: "Invalid recipe ID",
      });
    }

    const recipe = await prisma.recipe.findUnique({
      where: {
        id: recipeId,
      },
      include: {
        cuisine: true,
      },
    });

    if (!recipe) {
      logger.warn(
        `Recipe not found | Recipe ID: ${recipeId} | IP: ${req.ip}`
      );

      return res.status(404).json({
        message: "Recipe not found",
      });
    }

    if (recipe.isSecret && !req.user) {
      logger.warn(
        `Unauthorized access to secret recipe | Recipe ID: ${recipeId} | IP: ${req.ip}`
      );

      return res.status(401).json({
        message: "Login is required to view this secret recipe",
      });
    }

    logger.info(
      `Recipe retrieved successfully | Recipe ID: ${recipe.id} | Authenticated: ${Boolean(req.user)} | IP: ${req.ip}`
    );

    return res.status(200).json(recipe);
  } catch (error) {
    logger.error(`Get recipe by ID failed: ${error.stack || error.message}`);

    return res.status(500).json({
      message: "Failed to fetch recipe",
    });
  }
}