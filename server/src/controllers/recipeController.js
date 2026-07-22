import prisma from "../config/prisma.js";

export async function getAllRecipes(req, res) {
  try {
    const recipes = await prisma.recipe.findMany({
      include: {
        cuisine: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return res.status(200).json(recipes);
  } catch (error) {
    console.error("GET RECIPES ERROR:", error);

    return res.status(500).json({
      message: "Failed to fetch recipes",
    });
  }
}

export async function getRecipeById(req, res) {
  try {
    const recipeId = Number(req.params.id);

    if (!Number.isInteger(recipeId) || recipeId <= 0) {
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
      return res.status(404).json({
        message: "Recipe not found",
      });
    }

    return res.status(200).json(recipe);
  } catch (error) {
    console.error("GET RECIPE BY ID ERROR:", error);

    return res.status(500).json({
      message: "Failed to fetch recipe",
    });
  }
}