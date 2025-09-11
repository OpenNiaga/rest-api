import { UserRepository } from "../../../src/domain/repositories/UserRepository";
import express from "express";
import { createAuthRoutes } from "../../../src/infrastructure/routes/AuthRoutes";
import { User } from "../../../src/domain/entity/User";
import { Email } from "../../../src/domain/value-object/Email";
import { Password } from "../../../src/domain/value-object/Password";
import request from "supertest";

const mockUserRepository: jest.Mocked<UserRepository> = {
  save: jest.fn(),
  findByEmail: jest.fn(),
  findByUsername: jest.fn(),
  findById: jest.fn(),
};

const app = express();
app.use(express.json());
app.use("/auth", createAuthRoutes(mockUserRepository));

describe("POST /auth/register", () => {
  it("should register a new user succesfully", async () => {
    const email = Email.create("jhon@example.com").value;
    const password = await Password.create("password");
    const fakeUser = User.reconstruct(
      "123",
      email,
      "Jhon",
      password,
      new Date(),
      new Date(),
    );
    mockUserRepository.save.mockResolvedValue(fakeUser);

    const res = await request(app).post("/auth/register").send({
      username: fakeUser.username,
      email: email.toString(),
      password: password.toString(),
      passwordConfirm: password.toString(),
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({
      success: true,
      message: "User registered successfully",
      data: {
        id: fakeUser.id,
        email: email.toString(),
        username: fakeUser.username,
      },
    });
  });
});
