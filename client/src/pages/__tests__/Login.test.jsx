import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, test, vi } from "vitest";
import axios from "axios";

import Login from "../Login";

vi.mock("axios");

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
  vi.clearAllMocks();
});

function renderLogin() {
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );
}

test("renders the Login form", () => {
  renderLogin();

  expect(
    screen.getByRole("heading", {
      name: "Log In",
    })
  ).toBeInTheDocument();

  expect(
    screen.getByLabelText("Email")
  ).toBeInTheDocument();

  expect(
    screen.getByLabelText("Password")
  ).toBeInTheDocument();

  expect(
    screen.getByRole("button", {
      name: "Log In",
    })
  ).toBeInTheDocument();

  expect(
    screen.getByRole("link", {
      name: "Create account",
    })
  ).toHaveAttribute("href", "/register");
});

test("submits the Login form and stores authentication data", async () => {
  axios.post.mockResolvedValue({
    data: {
      message: "Login successful",
      token: "test-jwt-token",
      user: {
        id: 2,
        firstName: "Test",
        lastName: "User",
        email: "testuser@example.com",
      },
    },
  });

  renderLogin();

  fireEvent.change(screen.getByLabelText("Email"), {
    target: {
      value: "testuser@example.com",
    },
  });

  fireEvent.change(screen.getByLabelText("Password"), {
    target: {
      value: "123456",
    },
  });

  fireEvent.click(
    screen.getByRole("button", {
      name: "Log In",
    })
  );

  await waitFor(() => {
    expect(axios.post).toHaveBeenCalledWith(
      "http://localhost:3001/api/auth/login",
      {
        email: "testuser@example.com",
        password: "123456",
      }
    );
  });

  expect(localStorage.getItem("token")).toBe(
    "test-jwt-token"
  );

  expect(
    JSON.parse(localStorage.getItem("user"))
  ).toEqual({
    id: 2,
    firstName: "Test",
    lastName: "User",
    email: "testuser@example.com",
  });

  expect(navigateMock).toHaveBeenCalledWith("/");
});

test("displays the server error message when Login fails", async () => {
  const consoleErrorMock = vi
    .spyOn(console, "error")
    .mockImplementation(() => {});

  axios.post.mockRejectedValue({
    response: {
      data: {
        message: "Invalid email or password",
      },
    },
  });

  renderLogin();

  fireEvent.change(screen.getByLabelText("Email"), {
    target: {
      value: "testuser@example.com",
    },
  });

  fireEvent.change(screen.getByLabelText("Password"), {
    target: {
      value: "wrong-password",
    },
  });

  fireEvent.click(
    screen.getByRole("button", {
      name: "Log In",
    })
  );

  expect(
    await screen.findByText("Invalid email or password")
  ).toBeInTheDocument();

  expect(localStorage.getItem("token")).toBeNull();
  expect(navigateMock).not.toHaveBeenCalled();

  consoleErrorMock.mockRestore();
});