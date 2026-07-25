import prisma from "../config/prisma.js";

export async function getAllCuisines(req, res) {
  try {
    const cuisines = await prisma.cuisine.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return res.status(200).json(cuisines);
  } catch (error) {
    console.error("GET CUISINES ERROR:", error);

    return res.status(500).json({
      message: "Failed to fetch cuisines",
    });
  }
}

export async function getCuisineById(req, res) {
  try {
    const cuisineId = Number(req.params.id);

    if (!Number.isInteger(cuisineId) || cuisineId <= 0) {
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
      return res.status(404).json({
        message: "Cuisine not found",
      });
    }

    return res.status(200).json(cuisine);
  } catch (error) {
    console.error("GET CUISINE BY ID ERROR:", error);

    return res.status(500).json({
      message: "Failed to fetch cuisine",
    });
  }
}