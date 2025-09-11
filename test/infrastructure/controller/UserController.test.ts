import { Request, Response } from "express";
import { AuthController } from "../../../src/infrastructure/controller/UserController";
import { RegisterUser } from "../../../src/application/usecase/UserRegister";
import { Result } from "../../../src/domain/value-object/Result";

const mockRegisterUser: jest.Mocked<RegisterUser> = {
  execute: jest.fn(),
} as any;

const mockRequest = (body: any): Partial<Request> => ({
  body,
});

const mockResponse = () => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
};

describe("AuthController - register", () => {
  let controller: AuthController;

  beforeEach(() => {
    controller = new AuthController(mockRegisterUser);
    jest.clearAllMocks();
  });

  it("should return 201 when registration is successful", async () => {
    const mockReq = mockRequest({
      username: "johndoe ",
      email: " johndoe@example.com",
      password: "password123",
      passwordConfirm: "password123",
    });

    const mockRes = mockResponse();

    const fakeUser = {
      id: "user-123",
      username: "johndoe",
      email: "johndoe@example.com",
    };

    mockRegisterUser.execute.mockResolvedValue(Result.success(fakeUser));

    await controller.register(mockReq as Request, mockRes);

    expect(mockRegisterUser.execute).toHaveBeenCalledWith({
      username: "johndoe",
      email: "johndoe@example.com",
      password: "password123",
      passwordConfirm: "password123",
    });

    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: true,
      message: "User registered successfully",
      data: fakeUser,
    });
  });

  it("should return 400 when registration validation fails", async () => {
    const mockReq = mockRequest({
      username: "janedoe",
      email: "janedoe@example.com",
      password: "123456",
      passwordConfirm: "654321",
    });

    const mockRes = mockResponse();

    const validationErrors = [
      {
        field: "passwordConfirm",
        message: "Password confirmation does not match.",
      },
    ];

    mockRegisterUser.execute.mockResolvedValue(
      Result.failure(validationErrors),
    );

    await controller.register(mockReq as Request, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      message: "Validation failed",
      errors: validationErrors,
    });
  });

  it("should return 500 on unexpected errors", async () => {
    const mockReq = mockRequest({
      username: "erroruser",
      email: "error@example.com",
      password: "pass",
      passwordConfirm: "pass",
    });

    const mockRes = mockResponse();

    mockRegisterUser.execute.mockRejectedValue(new Error("Database is down"));

    await controller.register(mockReq as Request, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      message: "Internal server error",
      errors: [
        {
          field: "server",
          message: "An unexpected error occurred",
        },
      ],
    });
  });

  it("should handle empty username after trimming", async () => {
    const mockReq = mockRequest({
      username: "   ",
      email: "test@example.com",
      password: "password123",
      passwordConfirm: "password123",
    });

    const mockRes = mockResponse();

    const validationErrors = [
      { field: "username", message: "Username is required." },
    ];

    mockRegisterUser.execute.mockResolvedValue(
      Result.failure(validationErrors),
    );

    await controller.register(mockReq as Request, mockRes);

    expect(mockRegisterUser.execute).toHaveBeenCalledWith({
      username: "",
      email: "test@example.com",
      password: "password123",
      passwordConfirm: "password123",
    });

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      message: "Validation failed",
      errors: validationErrors,
    });
  });

  it("should handle empty email after trimming", async () => {
    const mockReq = mockRequest({
      username: "johndoe",
      email: "   ", 
      password: "password123",
      passwordConfirm: "password123",
    });

    const mockRes = mockResponse();

    const validationErrors = [
      { field: "email", message: "Invalid email format." },
    ];

    mockRegisterUser.execute.mockResolvedValue(
      Result.failure(validationErrors),
    );

    await controller.register(mockReq as Request, mockRes);

    expect(mockRegisterUser.execute).toHaveBeenCalledWith({
      username: "johndoe",
      email: "",
      password: "password123",
      passwordConfirm: "password123",
    });

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      message: "Validation failed",
      errors: validationErrors,
    });
  });

  it("should properly sanitize input data while preserving passwords", async () => {
    const mockReq = mockRequest({
      username: "  johndoe  ",
      email: "  JOHNDOE@EXAMPLE.COM  ",
      password: "  password123  ", 
      passwordConfirm: "  password123  ",
    });

    const mockRes = mockResponse();

    const fakeUser = {
      id: "user-123",
      username: "johndoe",
      email: "johndoe@example.com",
    };

    mockRegisterUser.execute.mockResolvedValue(Result.success(fakeUser));

    await controller.register(mockReq as Request, mockRes);

    expect(mockRegisterUser.execute).toHaveBeenCalledWith({
      username: "johndoe",
      email: "JOHNDOE@EXAMPLE.COM",
      password: "  password123  ",
      passwordConfirm: "  password123  ",
    });

    expect(mockRes.status).toHaveBeenCalledWith(201);
  });

  it("should handle missing request body fields gracefully", async () => {
    const mockReq = mockRequest({
      username: "johndoe",
    });

    const mockRes = mockResponse();

    await controller.register(mockReq as Request, mockRes)
    expect(mockRes.status).toHaveBeenCalledWith(500);
  });
});
