import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import RecipeCard from "../RecipeCard";

const recipe = {
  id: 2,
  name: "Secret Baked Fish",
  description: "Tender baked fish with Mediterranean herbs.",
  imageUrl: "https://example.com/fish.jpg",
  rating: 5,
};

function renderRecipeCard() {
  render(
    <MemoryRouter>
      <RecipeCard recipe={recipe} />
    </MemoryRouter>
  );
}

test("renders the recipe information", () => {
  renderRecipeCard();

  expect(
    screen.getByRole("heading", {
      name: "Secret Baked Fish",
    })
  ).toBeInTheDocument();

  expect(
    screen.getByText(
      "Tender baked fish with Mediterranean herbs."
    )
  ).toBeInTheDocument();

  expect(screen.getByText("⭐ 5/5")).toBeInTheDocument();
});

test("renders the recipe image with the correct alternative text", () => {
  renderRecipeCard();

  const image = screen.getByRole("img", {
    name: "Secret Baked Fish",
  });

  expect(image).toBeInTheDocument();
  expect(image).toHaveAttribute(
    "src",
    "https://example.com/fish.jpg"
  );
});

test("renders a View Details link to the recipe details page", () => {
  renderRecipeCard();

  const detailsLink = screen.getByRole("link", {
    name: "View Details",
  });

  expect(detailsLink).toBeInTheDocument();
  expect(detailsLink).toHaveAttribute("href", "/recipes/2");
});