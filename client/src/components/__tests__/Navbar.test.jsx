import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, vi } from "vitest";

import Navbar from "../Navbar";

const navigateMock = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");

  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

beforeEach(() => {
  localStorage.clear();
  navigateMock.mockClear();
});

function renderNavbar() {
  render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>
  );
}

test("renders navigation links for a guest", () => {
  renderNavbar();

  expect(
    screen.getByRole("heading", {
      name: "Secret Kitchen",
    })
  ).toBeInTheDocument();

  expect(
    screen.getByRole("link", {
      name: "Home",
    })
  ).toHaveAttribute("href", "/");

  expect(
    screen.getByRole("link", {
      name: "Cuisines",
    })
  ).toHaveAttribute("href", "/cuisines");

  expect(
    screen.getByRole("link", {
      name: "Recipes",
    })
  ).toHaveAttribute("href", "/recipes");

  expect(
    screen.getByRole("link", {
      name: "Login",
    })
  ).toHaveAttribute("href", "/login");

  expect(
    screen.queryByRole("button", {
      name: "Logout",
    })
  ).not.toBeInTheDocument();
});

test("renders the user name and Logout button for a logged-in user", () => {
  localStorage.setItem("token", "valid-token");
  localStorage.setItem(
    "user",
    JSON.stringify({
      firstName: "Test",
      lastName: "User",
      email: "testuser@example.com",
    })
  );

  renderNavbar();

  expect(screen.getByText("Hello, Test")).toBeInTheDocument();

  expect(
    screen.getByRole("button", {
      name: "Logout",
    })
  ).toBeInTheDocument();

  expect(
    screen.queryByRole("link", {
      name: "Login",
    })
  ).not.toBeInTheDocument();
});

test("removes authentication data and navigates to Login on logout", () => {
  localStorage.setItem("token", "valid-token");
  localStorage.setItem(
    "user",
    JSON.stringify({
      firstName: "Test",
      lastName: "User",
      email: "testuser@example.com",
    })
  );

  renderNavbar();

  fireEvent.click(
    screen.getByRole("button", {
      name: "Logout",
    })
  );

  expect(localStorage.getItem("token")).toBeNull();
  expect(localStorage.getItem("user")).toBeNull();
  expect(navigateMock).toHaveBeenCalledWith("/login");
});