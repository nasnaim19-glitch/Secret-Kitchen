import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import CuisineCard from "../CuisineCard";

const cuisine = {
  id: 1,
  name: "Mediterranean",
  country: "Mediterranean Region",
  imageUrl: "https://example.com/mediterranean.jpg",
};

function renderCuisineCard() {
  render(
    <MemoryRouter>
      <CuisineCard cuisine={cuisine} />
    </MemoryRouter>
  );
}

test("renders the cuisine information", () => {
  renderCuisineCard();

  expect(
    screen.getByRole("heading", {
      name: "Mediterranean",
    })
  ).toBeInTheDocument();

  expect(
    screen.getByText("Mediterranean Region")
  ).toBeInTheDocument();
});

test("renders the cuisine image with the correct alternative text", () => {
  renderCuisineCard();

  const image = screen.getByRole("img", {
    name: "Mediterranean",
  });

  expect(image).toBeInTheDocument();
  expect(image).toHaveAttribute(
    "src",
    "https://example.com/mediterranean.jpg"
  );
});

test("renders a View Cuisine link to the cuisine details page", () => {
  renderCuisineCard();

  const detailsLink = screen.getByRole("link", {
    name: "View Cuisine",
  });

  expect(detailsLink).toBeInTheDocument();
  expect(detailsLink).toHaveAttribute("href", "/cuisines/1");
});