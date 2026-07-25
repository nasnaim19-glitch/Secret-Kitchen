import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";

import app from "../src/app.js";

async function loginAndGetToken() {
  const response = await request(app)
    .post("/api/auth/login")
    .send({
      email: "testuser@example.com",
      password: "123456",
    });

  assert.equal(response.statusCode, 200);
  assert.equal(typeof response.body.token, "string");

  return response.body.token;
}

test("GET / returns that the Secret Kitchen API is running", async () => {
  const response = await request(app).get("/");

  assert.equal(response.statusCode, 200);
  assert.equal(response.body.message, "Secret Kitchen API is running 🚀");
});

test("GET /api/recipes returns only public recipes for a guest", async () => {
  const response = await request(app).get("/api/recipes");

  assert.equal(response.statusCode, 200);
  assert.ok(Array.isArray(response.body));
  assert.ok(response.body.length > 0);

  const containsSecretRecipe = response.body.some(
    (recipe) => recipe.isSecret === true
  );

  assert.equal(containsSecretRecipe, false);
});

test("GET /api/recipes returns secret recipes for an authenticated user", async () => {
  const token = await loginAndGetToken();

  const response = await request(app)
    .get("/api/recipes")
    .set("Authorization", `Bearer ${token}`);

  assert.equal(response.statusCode, 200);
  assert.ok(Array.isArray(response.body));
  assert.ok(response.body.length > 0);

  const containsSecretRecipe = response.body.some(
    (recipe) => recipe.isSecret === true
  );

  assert.equal(containsSecretRecipe, true);
});

test("GET /api/cuisines returns a list of cuisines", async () => {
  const response = await request(app).get("/api/cuisines");

  assert.equal(response.statusCode, 200);
  assert.ok(Array.isArray(response.body));
  assert.ok(response.body.length > 0);
});

test("GET /api/cuisines/1 returns cuisine details for a guest", async () => {
  const response = await request(app).get("/api/cuisines/1");

  assert.equal(response.statusCode, 200);
  assert.equal(response.body.id, 1);
  assert.ok(Array.isArray(response.body.recipes));

  const containsSecretRecipe = response.body.recipes.some(
    (recipe) => recipe.isSecret === true
  );

  assert.equal(containsSecretRecipe, false);
});

test("GET /api/cuisines/1 returns secret recipes for an authenticated user", async () => {
  const token = await loginAndGetToken();

  const response = await request(app)
    .get("/api/cuisines/1")
    .set("Authorization", `Bearer ${token}`);

  assert.equal(response.statusCode, 200);
  assert.equal(response.body.id, 1);
  assert.ok(Array.isArray(response.body.recipes));

  const containsSecretRecipe = response.body.recipes.some(
    (recipe) => recipe.isSecret === true
  );

  assert.equal(containsSecretRecipe, true);
});

test("GET /api/cuisines/invalid returns 400", async () => {
  const response = await request(app).get("/api/cuisines/invalid");

  assert.equal(response.statusCode, 400);
  assert.equal(response.body.message, "Invalid cuisine ID");
});

test("GET /api/cuisines/999999 returns 404", async () => {
  const response = await request(app).get("/api/cuisines/999999");

  assert.equal(response.statusCode, 404);
  assert.equal(response.body.message, "Cuisine not found");
});

test("GET /api/recipes/999999 returns 404", async () => {
  const response = await request(app).get("/api/recipes/999999");

  assert.equal(response.statusCode, 404);
  assert.equal(response.body.message, "Recipe not found");
});

test("GET /api/recipes/invalid returns 400", async () => {
  const response = await request(app).get("/api/recipes/invalid");

  assert.equal(response.statusCode, 400);
  assert.equal(response.body.message, "Invalid recipe ID");
});

test("GET /api/recipes/2 blocks a secret recipe for a guest", async () => {
  const response = await request(app).get("/api/recipes/2");

  assert.equal(response.statusCode, 401);
  assert.equal(
    response.body.message,
    "Login is required to view this secret recipe"
  );
});

test("GET /api/recipes/2 returns a secret recipe for an authenticated user", async () => {
  const token = await loginAndGetToken();

  const response = await request(app)
    .get("/api/recipes/2")
    .set("Authorization", `Bearer ${token}`);

  assert.equal(response.statusCode, 200);
  assert.equal(response.body.id, 2);
  assert.equal(response.body.isSecret, true);
});

test("POST /api/auth/login returns 400 when fields are missing", async () => {
  const response = await request(app)
    .post("/api/auth/login")
    .send({});

  assert.equal(response.statusCode, 400);
  assert.equal(response.body.message, "Email and password are required");
});

test("POST /api/auth/login returns 401 for a user that does not exist", async () => {
  const response = await request(app)
    .post("/api/auth/login")
    .send({
      email: "missing-user@example.com",
      password: "123456",
    });

  assert.equal(response.statusCode, 401);
  assert.equal(response.body.message, "Invalid email or password");
});

test("POST /api/auth/login returns 401 for an incorrect password", async () => {
  const response = await request(app)
    .post("/api/auth/login")
    .send({
      email: "testuser@example.com",
      password: "wrong-password",
    });

  assert.equal(response.statusCode, 401);
  assert.equal(response.body.message, "Invalid email or password");
});

test("POST /api/auth/login returns a JWT token for valid credentials", async () => {
  const response = await request(app)
    .post("/api/auth/login")
    .send({
      email: "testuser@example.com",
      password: "123456",
    });

  assert.equal(response.statusCode, 200);
  assert.equal(response.body.message, "Login successful");
  assert.equal(typeof response.body.token, "string");
  assert.ok(response.body.token.length > 0);
  assert.equal(response.body.user.email, "testuser@example.com");
});

test("GET /api/auth/profile returns 401 without a token", async () => {
  const response = await request(app).get("/api/auth/profile");

  assert.equal(response.statusCode, 401);
  assert.equal(response.body.message, "Authentication token is required");
});

test("GET /api/auth/profile returns user details with a valid token", async () => {
  const token = await loginAndGetToken();

  const response = await request(app)
    .get("/api/auth/profile")
    .set("Authorization", `Bearer ${token}`);

  assert.equal(response.statusCode, 200);
  assert.equal(
    response.body.message,
    "Protected route accessed successfully"
  );
  assert.equal(response.body.user.email, "testuser@example.com");
});

test("POST /api/auth/register returns 400 when fields are missing", async () => {
  const response = await request(app)
    .post("/api/auth/register")
    .send({});

  assert.equal(response.statusCode, 400);
  assert.equal(response.body.message, "All fields are required");
});

test("POST /api/auth/register creates a new user", async () => {
  const uniqueEmail = `register-${Date.now()}-${Math.random()}@example.com`;

  const response = await request(app)
    .post("/api/auth/register")
    .send({
      firstName: "Test",
      lastName: "Register",
      email: uniqueEmail,
      password: "123456",
    });

  assert.equal(response.statusCode, 201);
  assert.equal(response.body.message, "User registered successfully");
  assert.equal(response.body.user.firstName, "Test");
  assert.equal(response.body.user.lastName, "Register");
  assert.equal(response.body.user.email, uniqueEmail);

  // הסיסמה לא אמורה לחזור בתשובת השרת
  assert.equal(response.body.user.password, undefined);
});

test("POST /api/auth/register returns 409 for a duplicate email", async () => {
  const uniqueEmail = `duplicate-${Date.now()}-${Math.random()}@example.com`;

  const userData = {
    firstName: "Duplicate",
    lastName: "User",
    email: uniqueEmail,
    password: "123456",
  };

  const firstResponse = await request(app)
    .post("/api/auth/register")
    .send(userData);

  assert.equal(firstResponse.statusCode, 201);
  assert.equal(
    firstResponse.body.message,
    "User registered successfully"
  );

  const secondResponse = await request(app)
    .post("/api/auth/register")
    .send(userData);

  assert.equal(secondResponse.statusCode, 409);
  assert.equal(
    secondResponse.body.message,
    "Email is already registered"
  );
});

test("GET /api/auth/profile returns 401 with an invalid token", async () => {
  const response = await request(app)
    .get("/api/auth/profile")
    .set("Authorization", "Bearer invalid-token");

  assert.equal(response.statusCode, 401);
  assert.equal(response.body.message, "Invalid or expired token");
});