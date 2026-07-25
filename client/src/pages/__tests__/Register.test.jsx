import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, test, vi } from "vitest";
import axios from "axios";

import Register from "../Register";

vi.mock("axios");

beforeEach(() => {
  vi.clearAllMocks();
});

function renderRegister() {
  render(
    <MemoryRouter>
      <Register />
    </MemoryRouter>
  );
}

test("renders the Register form", () => {
  renderRegister();

  expect(
    screen.getByRole("heading", {
      name: "Create Account",
    })
  ).toBeInTheDocument();

  expect(screen.getByLabelText("First name")).toBeInTheDocument();
  expect(screen.getByLabelText("Last name")).toBeInTheDocument();
  expect(screen.getByLabelText("Email")).toBeInTheDocument();
  expect(screen.getByLabelText("Password")).toBeInTheDocument();

  expect(
    screen.getByRole("button", {
      name: "Register",
    })
  ).toBeInTheDocument();

  expect(
    screen.getByRole("link", {
      name: "Log in",
    })
  ).toHaveAttribute("href", "/login");
});

test("submits the Register form and clears the fields", async () => {
  axios.post.mockResolvedValue({
    data: {
      message: "User registered successfully",
    },
  });

  renderRegister();

  fireEvent.change(screen.getByLabelText("First name"), {
    target: {
      value: "Test",
    },
  });

  fireEvent.change(screen.getByLabelText("Last name"), {
    target: {
      value: "User",
    },
  });

  fireEvent.change(screen.getByLabelText("Email"), {
    target: {
      value: "newuser@example.com",
    },
  });

  fireEvent.change(screen.getByLabelText("Password"), {
    target: {
      value: "123456",
    },
  });

  fireEvent.click(
    screen.getByRole("button", {
      name: "Register",
    })
  );

  await waitFor(() => {
    expect(axios.post).toHaveBeenCalledWith(
      "http://localhost:3001/api/auth/register",
      {
        firstName: "Test",
        lastName: "User",
        email: "newuser@example.com",
        password: "123456",
      }
    );
  });

  expect(
    await screen.findByText("User registered successfully")
  ).toBeInTheDocument();

  expect(screen.getByLabelText("First name")).toHaveValue("");
  expect(screen.getByLabelText("Last name")).toHaveValue("");
  expect(screen.getByLabelText("Email")).toHaveValue("");
  expect(screen.getByLabelText("Password")).toHaveValue("");
});

test("displays the server error message when registration fails", async () => {
  const consoleErrorMock = vi
    .spyOn(console, "error")
    .mockImplementation(() => {});

  axios.post.mockRejectedValue({
    response: {
      data: {
        message: "Email is already registered",
      },
    },
  });

  renderRegister();

  fireEvent.change(screen.getByLabelText("First name"), {
    target: {
      value: "Test",
    },
  });

  fireEvent.change(screen.getByLabelText("Last name"), {
    target: {
      value: "User",
    },
  });

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
      name: "Register",
    })
  );

  expect(
    await screen.findByText("Email is already registered")
  ).toBeInTheDocument();

  consoleErrorMock.mockRestore();
});