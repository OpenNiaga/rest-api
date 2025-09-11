import { Request, Response } from "express";

// Mock dependencies
const mockRegisterUser: RegisterUser = {
  execute: jest.fn(),
};

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

    const fakeUser = { id: 1, username: "johndoe", email: "johndoe@example.com" };

    (mockRegisterUser.execute as jest.Mock).mockResolvedValue(
      Result.ok(fakeUser)
    );

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
      { field: "passwordConfirm", message: "Passwords do not match" },
    ];

    (mockRegisterUser.execute as jest.Mock).mockResolvedValue(
      Result.fail(validationErrors)
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

    (mockRegisterUser.execute as jest.Mock).mockRejectedValue(
      new Error("Database is down")
    );

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
});
