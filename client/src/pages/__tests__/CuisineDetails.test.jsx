import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, test, vi } from "vitest";
import axios from "axios";

import CuisineDetails from "../CuisineDetails";

vi.mock("axios");

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

function renderCuisineDetails(path = "/cuisines/1") {
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/cuisines/:id" element={<CuisineDetails />} />
      </Routes>
    </MemoryRouter>
  );
}

const publicCuisine = {
  id: 1,
  name: "Mediterranean",
  country: "Mediterranean Region",
  description: "Fresh Mediterranean cuisine.",
  imageUrl: "https://example.com/mediterranean.jpg",
  recipes: [
    {
      id: 1,
      name: "Mediterranean Salad",
      description: "Fresh salad.",
      imageUrl: "https://example.com/salad.jpg",
      rating: 5,
    },
  ],
};

const authenticatedCuisine = {
  ...publicCuisine,
  recipes: [
    ...publicCuisine.recipes,
    {
      id: 2,
      name: "Secret Baked Fish",
      description: "Secret fish recipe.",
      imageUrl: "https://example.com/fish.jpg",
      rating: 5,
    },
  ],
};

test("loads and displays cuisine details for a guest", async () => {
  axios.get.mockResolvedValue({
    data: publicCuisine,
  });

  renderCuisineDetails();

  expect(screen.getByText("Loading cuisine...")).toBeInTheDocument();

  expect(
    await screen.findByRole("heading", {
      name: "Mediterranean",
    })
  ).toBeInTheDocument();

  expect(
    screen.getByText("Mediterranean Region")
  ).toBeInTheDocument();

  expect(
    screen.getByText("Fresh Mediterranean cuisine.")
  ).toBeInTheDocument();

  expect(
    screen.getByRole("link", {
      name: "← Back to cuisines",
    })
  ).toHaveAttribute("href", "/cuisines");

  expect(
    screen.getByText(/You are viewing public recipes/i)
  ).toBeInTheDocument();

  expect(
    screen.getByRole("link", {
      name: "Log in",
    })
  ).toHaveAttribute("href", "/login");

  expect(
    screen.getByText("Mediterranean Salad")
  ).toBeInTheDocument();

  expect(axios.get).toHaveBeenCalledWith(
    "http://localhost:3001/api/cuisines/1",
    {}
  );
});

test("sends the token and displays secret recipes for a logged-in user", async () => {
  localStorage.setItem("token", "test-jwt-token");

  axios.get.mockResolvedValue({
    data: authenticatedCuisine,
  });

  renderCuisineDetails();

  expect(
    await screen.findByText("Secret Baked Fish")
  ).toBeInTheDocument();

  expect(
    screen.queryByText(/You are viewing public recipes/i)
  ).not.toBeInTheDocument();

  expect(axios.get).toHaveBeenCalledWith(
    "http://localhost:3001/api/cuisines/1",
    {
      headers: {
        Authorization: "Bearer test-jwt-token",
      },
    }
  );
});

test("shows an empty message when the cuisine has no recipes", async () => {
  axios.get.mockResolvedValue({
    data: {
      ...publicCuisine,
      recipes: [],
    },
  });

  renderCuisineDetails();

  expect(
    await screen.findByText(
      "No recipes were found for this cuisine."
    )
  ).toBeInTheDocument();
});

test("shows the server error message when loading cuisine details fails", async () => {
  const consoleErrorMock = vi
    .spyOn(console, "error")
    .mockImplementation(() => {});

  axios.get.mockRejectedValue({
    response: {
      data: {
        message: "Cuisine not found",
      },
    },
  });

  renderCuisineDetails();

  expect(
    await screen.findByText("Cuisine not found")
  ).toBeInTheDocument();

  consoleErrorMock.mockRestore();
});

test("shows the fallback error message when the server sends no message", async () => {
  const consoleErrorMock = vi
    .spyOn(console, "error")
    .mockImplementation(() => {});

  axios.get.mockRejectedValue(new Error("Network error"));

  renderCuisineDetails();

  expect(
    await screen.findByText("Failed to load cuisine details.")
  ).toBeInTheDocument();

  consoleErrorMock.mockRestore();
});