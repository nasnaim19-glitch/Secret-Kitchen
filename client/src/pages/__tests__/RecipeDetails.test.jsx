import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, test, vi } from "vitest";
import axios from "axios";

import RecipeDetails from "../RecipeDetails";

vi.mock("axios");

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

function renderRecipeDetails(path = "/recipes/2") {
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/recipes/:id" element={<RecipeDetails />} />
      </Routes>
    </MemoryRouter>
  );
}

const secretRecipe = {
  id: 2,
  name: "Secret Baked Fish",
  description: "Tender baked fish with Mediterranean herbs.",
  prepTime: 35,
  servings: 4,
  category: "MAIN_DISH",
  rating: 5,
  ingredients: "Fish, olive oil, garlic and lemon",
  instructions: "Season the fish and bake.",
  imageUrl: "https://example.com/fish.jpg",
  isSecret: true,
  cuisine: {
    name: "Mediterranean",
    country: "Mediterranean Region",
  },
};

test("loads and displays recipe details without a token", async () => {
  axios.get.mockResolvedValue({
    data: {
      ...secretRecipe,
      isSecret: false,
      name: "Mediterranean Salad",
    },
  });

  renderRecipeDetails("/recipes/1");

  expect(screen.getByText("Loading recipe...")).toBeInTheDocument();

  expect(
    await screen.findByRole("heading", {
      name: "Mediterranean Salad",
    })
  ).toBeInTheDocument();

  expect(axios.get).toHaveBeenCalledWith(
    "http://localhost:3001/api/recipes/1",
    {}
  );

  expect(
    screen.getByRole("link", {
      name: "← Back to recipes",
    })
  ).toHaveAttribute("href", "/recipes");

  expect(
    screen.queryByText("🔒 Secret Recipe")
  ).not.toBeInTheDocument();
});

test("sends the token and displays a secret recipe", async () => {
  localStorage.setItem("token", "test-jwt-token");

  axios.get.mockResolvedValue({
    data: secretRecipe,
  });

  renderRecipeDetails();

  expect(
    await screen.findByRole("heading", {
      name: "Secret Baked Fish",
    })
  ).toBeInTheDocument();

  expect(axios.get).toHaveBeenCalledWith(
    "http://localhost:3001/api/recipes/2",
    {
      headers: {
        Authorization: "Bearer test-jwt-token",
      },
    }
  );

  expect(screen.getByText("🔒 Secret Recipe")).toBeInTheDocument();
  expect(screen.getByText("35 minutes")).toBeInTheDocument();
  expect(screen.getByText("MAIN DISH")).toBeInTheDocument();
  expect(screen.getByText("Mediterranean")).toBeInTheDocument();
  expect(screen.getByText("Mediterranean Region")).toBeInTheDocument();
  expect(
    screen.getByText("Fish, olive oil, garlic and lemon")
  ).toBeInTheDocument();
  expect(
    screen.getByText("Season the fish and bake.")
  ).toBeInTheDocument();

  expect(
    screen.getByRole("img", {
      name: "Secret Baked Fish",
    })
  ).toHaveAttribute("src", "https://example.com/fish.jpg");
});

test("shows the server error message when loading a recipe fails", async () => {
  const consoleErrorMock = vi
    .spyOn(console, "error")
    .mockImplementation(() => {});

  axios.get.mockRejectedValue({
    response: {
      data: {
        message: "Login is required to view this secret recipe",
      },
    },
  });

  renderRecipeDetails();

  expect(
    await screen.findByText(
      "Login is required to view this secret recipe"
    )
  ).toBeInTheDocument();

  consoleErrorMock.mockRestore();
});

test("shows the fallback error message when the server sends no message", async () => {
  const consoleErrorMock = vi
    .spyOn(console, "error")
    .mockImplementation(() => {});

  axios.get.mockRejectedValue(new Error("Network error"));

  renderRecipeDetails();

  expect(
    await screen.findByText("Failed to load recipe details.")
  ).toBeInTheDocument();

  consoleErrorMock.mockRestore();
});