import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, test, vi } from "vitest";
import axios from "axios";

import Cuisines from "../Cuisines";

vi.mock("axios");

beforeEach(() => {
  vi.clearAllMocks();
});

function renderCuisines() {
  render(
    <MemoryRouter>
      <Cuisines />
    </MemoryRouter>
  );
}

test("loads and displays cuisines from the server", async () => {
  axios.get.mockResolvedValue({
    data: [
      {
        id: 1,
        name: "Mediterranean",
        country: "Mediterranean Region",
        imageUrl: "https://example.com/mediterranean.jpg",
      },
      {
        id: 2,
        name: "Italian",
        country: "Italy",
        imageUrl: "https://example.com/italian.jpg",
      },
    ],
  });

  renderCuisines();

  expect(
    screen.getByText("Loading cuisines...")
  ).toBeInTheDocument();

  expect(
    await screen.findByText("Mediterranean")
  ).toBeInTheDocument();

  expect(screen.getByText("Italian")).toBeInTheDocument();

  expect(axios.get).toHaveBeenCalledWith(
    "http://localhost:3001/api/cuisines"
  );
});

test("shows an empty message when no cuisines are returned", async () => {
  axios.get.mockResolvedValue({
    data: [],
  });

  renderCuisines();

  expect(
    await screen.findByText("No cuisines were found.")
  ).toBeInTheDocument();
});

test("shows an error message when loading cuisines fails", async () => {
  const consoleErrorMock = vi
    .spyOn(console, "error")
    .mockImplementation(() => {});

  axios.get.mockRejectedValue(new Error("Network error"));

  renderCuisines();

  expect(
    await screen.findByText("Failed to load cuisines.")
  ).toBeInTheDocument();

  consoleErrorMock.mockRestore();
});