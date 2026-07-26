# Secret Kitchen

## Project Overview

Secret Kitchen is a Full-Stack web application for browsing and discovering recipes.

The application provides two different levels of access:

- Guest users can browse cuisines and public recipes without creating an account.
- Registered users can log in and unlock exclusive secret recipes available only after authentication.

The project was developed as part of a Full-Stack Software Engineering course and demonstrates modern software development practices including authentication, testing, Docker, CI/CD, logging, Git workflows, and database management.

---

## Features

- Browse cuisines
- Browse public recipes
- View recipe details
- User registration
- User login using JWT authentication
- Protected secret recipes
- Secure password hashing with bcrypt
- REST API
- Prisma ORM with PostgreSQL
- Logging
- Docker support
- GitHub Actions CI
- Unit Testing
- Code Coverage

---

## Technologies

### Frontend

- React
- Vite
- React Router
- Axios
- Styled Components
- Vitest
- Testing Library

### Backend

- Node.js
- Express
- Prisma ORM
- PostgreSQL
- JWT
- bcrypt
- Winston
- Morgan

---

## Project Structure

```text
Secret-Kitchen
│
├── client
├── server
├── LICENSES_ALL
└── README.md
```

---

## Installation

Clone the repository:

```bash
git clone https://github.com/nasnaim19-glitch/Secret-Kitchen.git
```

Enter the project:

```bash
cd Secret-Kitchen
```

Install frontend dependencies:

```bash
cd client
npm install
```

Install backend dependencies:

```bash
cd ../server
npm install
```

---

## Environment Variables

Create a `.env` file inside the `server` folder.

Example:

```text
DATABASE_URL=your_database_url
JWT_SECRET=your_secret_key
```

Do **not** commit your `.env` file.

---

## Running the Project

Backend:

```bash
cd server
npm run dev
```

Frontend:

```bash
cd client
npm run dev
```

---

## Testing

Backend:

```bash
cd server
npm test
npm run test:coverage
```

Frontend:

```bash
cd client
npm test
npm run test:coverage
```

The project includes automated unit tests with more than **70% code coverage**.

---

## Docker

Build the Docker image:

```bash
docker build -t secret-kitchen-server .
```

Run the Docker container:

```bash
docker run -p 3001:3001 secret-kitchen-server
```

The Docker image is published on Docker Hub.

---

## Continuous Integration

The project uses GitHub Actions.

Every Push and Pull Request automatically:

- Installs dependencies
- Runs tests
- Generates the Prisma Client
- Builds the Docker image

---

## Authentication

Authentication is implemented using:

- JWT
- bcrypt password hashing
- Protected routes
- Authentication middleware

Secret recipes are accessible only after successful login.

---

## Logging

The backend uses Winston for application logging and Morgan for HTTP request logging.

---

## Third-Party Licenses

Third-party packages and their licenses are documented in the `LICENSES_ALL` file.

---

## Version

Current release:

```text
v1.0.0
```

---

## Author

Developed as part of a Full-Stack Software Engineering course.