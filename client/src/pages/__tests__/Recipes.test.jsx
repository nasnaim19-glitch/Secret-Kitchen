import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, test, vi } from "vitest";
import axios from "axios";

import Recipes from "../Recipes";

vi.mock("axios");

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

function renderRecipes() {
  render(
    <MemoryRouter>
      <Recipes />
    </MemoryRouter>
  );
}

test("shows public-user notice and loads recipes without a token", async () => {
  axios.get.mockResolvedValue({
    data: [
      {
        id: 1,
        name: "Mediterranean Salad",
        description: "Fresh Mediterranean salad.",
        imageUrl: "https://example.com/salad.jpg",
        rating: 5,
      },
    ],
  });

  renderRecipes();

  expect(
    screen.getByText("Loading recipes...")
  ).toBeInTheDocument();

  expect(
    await screen.findByText("Mediterranean Salad")
  ).toBeInTheDocument();

  expect(
    screen.getByText(/You are viewing public recipes/i)
  ).toBeInTheDocument();

  expect(
    screen.getByRole("link", {
      name: "Log in",
    })
  ).toHaveAttribute("href", "/login");

  expect(axios.get).toHaveBeenCalledWith(
    "http://localhost:3001/api/recipes",
    {}
  );
});

test("loads recipes with an Authorization header for a logged-in user", async () => {
  localStorage.setItem("token", "test-jwt-token");

  axios.get.mockResolvedValue({
    data: [
      {
        id: 2,
        name: "Secret Baked Fish",
        description: "Secret Mediterranean fish recipe.",
        imageUrl: "https://example.com/fish.jpg",
        rating: 5,
      },
    ],
  });

  renderRecipes();

  expect(
    await screen.findByText("Secret Baked Fish")
  ).toBeInTheDocument();

  expect(
    screen.queryByText(/You are viewing public recipes/i)
  ).not.toBeInTheDocument();

  expect(axios.get).toHaveBeenCalledWith(
    "http://localhost:3001/api/recipes",
    {
      headers: {
        Authorization: "Bearer test-jwt-token",
      },
    }
  );
});

test("shows an empty message when no recipes are returned", async () => {
  axios.get.mockResolvedValue({
    data: [],
  });

  renderRecipes();

  expect(
    await screen.findByText("No recipes were found.")
  ).toBeInTheDocument();
});

test("shows an error message when loading recipes fails", async () => {
  const consoleErrorMock = vi
    .spyOn(console, "error")
    .mockImplementation(() => {});

  axios.get.mockRejectedValue(new Error("Network error"));

  renderRecipes();

  expect(
    await screen.findByText("Failed to load recipes.")
  ).toBeInTheDocument();

  consoleErrorMock.mockRestore();
});