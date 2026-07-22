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