import { PrismaClient, RecipeCategory } from "../../generated/prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting Seed...");

  // מוחקים קודם מתכונים ורק אחר כך מטבחים,
  // בגלל הקשר בין Recipe ל-Cuisine
  await prisma.recipe.deleteMany();
  await prisma.cuisine.deleteMany();

  console.log("Old seed data deleted.");

  // יצירת המטבחים
  const mediterranean = await prisma.cuisine.create({
    data: {
      name: "Mediterranean",
      country: "Mediterranean Region",
      description:
        "Fresh Mediterranean cuisine with vegetables, olive oil, herbs and colorful dishes.",
      imageUrl:
        "https://images.unsplash.com/photo-1547592180-85f173990554",
    },
  });

  const italian = await prisma.cuisine.create({
    data: {
      name: "Italian",
      country: "Italy",
      description:
        "Traditional Italian cuisine with pasta, tomatoes, cheese and fresh herbs.",
      imageUrl:
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5",
    },
  });

  const french = await prisma.cuisine.create({
    data: {
      name: "French",
      country: "France",
      description:
        "Classic French cuisine known for elegant dishes, pastries and rich flavors.",
      imageUrl:
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0",
    },
  });

  const asian = await prisma.cuisine.create({
    data: {
      name: "Asian",
      country: "Asia",
      description:
        "Asian-inspired cuisine with rice, noodles, vegetables and aromatic spices.",
      imageUrl:
        "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f",
    },
  });

  const moroccan = await prisma.cuisine.create({
    data: {
      name: "Moroccan",
      country: "Morocco",
      description:
        "Traditional Moroccan cuisine with warm spices, couscous and slow-cooked dishes.",
      imageUrl:
        "https://images.unsplash.com/photo-1533777324565-a040eb52facd",
    },
  });

  console.log("Cuisines created.");

  // יצירת המתכונים
  await prisma.recipe.createMany({
    data: [
      {
        recipeCode: "MED-001",
        name: "Mediterranean Salad",
        description:
          "A fresh salad with tomatoes, cucumber, olives and feta cheese.",
        ingredients:
          "Tomatoes, cucumber, red onion, olives, feta cheese, olive oil, lemon juice, salt",
        instructions:
          "Chop the vegetables. Add olives and feta cheese. Mix with olive oil, lemon juice and salt.",
        prepTime: 15,
        servings: 4,
        imageUrl:
          "https://images.unsplash.com/photo-1540420773420-3366772f4999",
        category: RecipeCategory.MAIN_DISH,
        rating: 5,
        isSecret: false,
        cuisineId: mediterranean.id,
      },
      {
        recipeCode: "MED-002",
        name: "Secret Baked Fish",
        description:
          "Tender baked fish prepared with a secret Mediterranean herb mixture.",
        ingredients:
          "Fish fillets, olive oil, garlic, lemon, parsley, thyme, salt, black pepper",
        instructions:
          "Season the fish with the ingredients. Bake at 190 degrees for approximately 25 minutes.",
        prepTime: 35,
        servings: 4,
        imageUrl:
          "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2",
        category: RecipeCategory.MAIN_DISH,
        rating: 5,
        isSecret: true,
        cuisineId: mediterranean.id,
      },
      {
        recipeCode: "ITA-001",
        name: "Classic Tomato Pasta",
        description:
          "Italian pasta served with a simple tomato and basil sauce.",
        ingredients:
          "Pasta, tomatoes, garlic, olive oil, basil, salt, black pepper",
        instructions:
          "Cook the pasta. Prepare the tomato sauce with garlic and olive oil. Mix and serve with basil.",
        prepTime: 30,
        servings: 4,
        imageUrl:
          "https://images.unsplash.com/photo-1473093295043-cdd812d0e601",
        category: RecipeCategory.MAIN_DISH,
        rating: 4,
        isSecret: false,
        cuisineId: italian.id,
      },
      {
        recipeCode: "ITA-002",
        name: "Secret Tiramisu",
        description:
          "A creamy Italian dessert made from a secret family recipe.",
        ingredients:
          "Ladyfingers, mascarpone, coffee, eggs, sugar, cocoa powder",
        instructions:
          "Prepare the cream. Dip the ladyfingers in coffee. Arrange layers and refrigerate before serving.",
        prepTime: 45,
        servings: 8,
        imageUrl:
          "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9",
        category: RecipeCategory.DESSERT,
        rating: 5,
        isSecret: true,
        cuisineId: italian.id,
      },
      {
        recipeCode: "FRE-001",
        name: "French Onion Soup",
        description:
          "A rich soup with caramelized onions, bread and melted cheese.",
        ingredients:
          "Onions, butter, vegetable stock, bread, cheese, salt, black pepper",
        instructions:
          "Caramelize the onions. Add stock and cook. Serve with bread and melted cheese.",
        prepTime: 60,
        servings: 4,
        imageUrl:
          "https://images.unsplash.com/photo-1547592166-23ac45744acd",
        category: RecipeCategory.MAIN_DISH,
        rating: 4,
        isSecret: false,
        cuisineId: french.id,
      },
      {
        recipeCode: "FRE-002",
        name: "Secret Chocolate Souffle",
        description:
          "A light French chocolate dessert with a soft and rich center.",
        ingredients:
          "Dark chocolate, butter, eggs, sugar, flour, vanilla",
        instructions:
          "Melt the chocolate and butter. Mix with the remaining ingredients. Bake until risen.",
        prepTime: 40,
        servings: 4,
        imageUrl:
          "https://images.unsplash.com/photo-1578985545062-69928b1d9587",
        category: RecipeCategory.DESSERT,
        rating: 5,
        isSecret: true,
        cuisineId: french.id,
      },
      {
        recipeCode: "ASI-001",
        name: "Vegetable Noodles",
        description:
          "Quick noodles with colorful vegetables and soy sauce.",
        ingredients:
          "Noodles, carrots, bell pepper, cabbage, soy sauce, garlic, sesame oil",
        instructions:
          "Cook the noodles. Stir-fry the vegetables. Add noodles and sauce, then mix well.",
        prepTime: 25,
        servings: 3,
        imageUrl:
          "https://images.unsplash.com/photo-1569718212165-3a8278d5f624",
        category: RecipeCategory.MAIN_DISH,
        rating: 4,
        isSecret: false,
        cuisineId: asian.id,
      },
      {
        recipeCode: "ASI-002",
        name: "Secret Coconut Rice",
        description:
          "A fragrant rice dish cooked with coconut milk and secret spices.",
        ingredients:
          "Rice, coconut milk, water, ginger, garlic, salt, green onion",
        instructions:
          "Wash the rice. Cook it with coconut milk, water and spices until tender.",
        prepTime: 35,
        servings: 4,
        imageUrl:
          "https://images.unsplash.com/photo-1512058564366-18510be2db19",
        category: RecipeCategory.MAIN_DISH,
        rating: 5,
        isSecret: true,
        cuisineId: asian.id,
      },
      {
        recipeCode: "MOR-001",
        name: "Vegetable Couscous",
        description:
          "Traditional couscous served with vegetables and Moroccan spices.",
        ingredients:
          "Couscous, carrots, zucchini, chickpeas, vegetable stock, cumin, turmeric",
        instructions:
          "Cook the vegetables with spices. Prepare the couscous and serve together.",
        prepTime: 50,
        servings: 6,
        imageUrl:
          "https://images.unsplash.com/photo-1530469912745-a215c6b256ea",
        category: RecipeCategory.MAIN_DISH,
        rating: 4,
        isSecret: false,
        cuisineId: moroccan.id,
      },
      {
        recipeCode: "MOR-002",
        name: "Secret Moroccan Cookies",
        description:
          "Sweet Moroccan cookies flavored with almonds and orange blossom.",
        ingredients:
          "Flour, almonds, sugar, eggs, orange blossom water, baking powder",
        instructions:
          "Mix all ingredients. Shape the cookies and bake until lightly golden.",
        prepTime: 40,
        servings: 12,
        imageUrl:
          "https://images.unsplash.com/photo-1499636136210-6f4ee915583e",
        category: RecipeCategory.DESSERT,
        rating: 5,
        isSecret: true,
        cuisineId: moroccan.id,
      },
    ],
  });

  console.log("10 recipes created.");
  console.log("Seed completed successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("Seed failed:", error);
    await prisma.$disconnect();
    process.exit(1);
  });