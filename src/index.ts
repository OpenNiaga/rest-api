import express, { Application } from "express";
import { json, urlencoded } from "body-parser";
import { createAuthRoutes } from "./infrastructure/routes/AuthRoutes";
import { InMemoryUserRepository } from "./infrastructure/repositories/UserRepository";

const config = {
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || "defaultSecret",
  db: {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USER || "user",
    password: process.env.DB_PASS || "password",
    database: process.env.DB_NAME || "mydb",
  },
};

const app: Application = express();

app.use(json());
app.use(urlencoded({ extended: true }));

const userRepository = new InMemoryUserRepository();

app.use("/api/auth", createAuthRoutes(userRepository));

app.use((req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

app.listen(config.port, () => {
  console.log(`🚀 Server listening on http://localhost:${config.port}`);
});
