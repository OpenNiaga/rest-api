import {
  RegisterUser,
  RegisterUserRequest,
} from "../../../src/application/usecase/UserRegister";
import { User } from "../../../src/domain/entity/User";
import { UserRepository } from "../../../src/domain/repositories/UserRepository";
import { Email } from "../../../src/domain/value-object/Email";
import { Password } from "../../../src/domain/value-object/Password";

describe("UserRegister Usecase Test", () => {
  let mockRepo: jest.Mocked<UserRepository>;
  let usecase: RegisterUser;

  beforeEach(() => {
    mockRepo = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findByUsername: jest.fn(),
      save: jest.fn(),
    };

    usecase = new RegisterUser(mockRepo);
  });

  const validRequest: RegisterUserRequest = {
    username: "johndoe",
    email: "john@example.com",
    password: "SecureP@ssword123",
    passwordConfirm: "SecureP@ssword123",
  };

  it("Should register a user successfully", async () => {
    mockRepo.findByEmail.mockResolvedValue(null);
    mockRepo.findByUsername.mockResolvedValue(null);

    mockRepo.save.mockImplementation(async () => {
      const emailResult = Email.create(validRequest.email);
      if (emailResult.isFailure) throw new Error("Invalid email");

      const email = emailResult.value;
      const password = await Password.create(validRequest.password);

      return User.reconstruct(
        "user-123",
        email,
        validRequest.username,
        password,
        new Date(),
        new Date(),
      );
    });

    const result = await usecase.execute(validRequest);

    expect(result.isSuccess).toBeTruthy();
    expect(result.value).toEqual({
      id: "user-123",
      username: "johndoe",
      email: "john@example.com",
    });
  });

  it("Should return username required", async () => {
    const result = await usecase.execute({
      ...validRequest,
      username: "",
    });
    expect(result.isFailure).toBeTruthy();
  });

  it("Should return invalid email format", async () => {
    const result = await usecase.execute({
      ...validRequest,
      email: "rizal",
    });
    expect(result.isFailure).toBeTruthy();
  });

  it("Should return password is required", async () => {
    const result = await usecase.execute({
      ...validRequest,
      password: "",
    });
    expect(result.isFailure).toBeTruthy();
  });

  it("Should return email already in use", async () => {
    const existingEmail = Email.create(validRequest.email).value;
    const dummyUser = User.reconstruct(
      "exisiting-user-id",
      existingEmail,
      "existing-username",
      await Password.create("SomePassword123"),
      new Date(),
      new Date(),
    );

    mockRepo.findByEmail.mockResolvedValue(dummyUser);
    mockRepo.findByUsername.mockResolvedValue(null);

    const result = await usecase.execute(validRequest);
    expect(result.isFailure).toBeTruthy();
  });

  it("Should return username already in use", async () => {
    const dummyUser = User.reconstruct(
      "exisiting-user-id",
      Email.create(validRequest.email).value,
      "existing-username",
      await Password.create("SomePassword123"),
      new Date(),
      new Date(),
    );

    mockRepo.findByEmail.mockResolvedValue(null);
    mockRepo.findByUsername.mockResolvedValue(dummyUser);

    const result = await usecase.execute(validRequest);
    expect(result.isFailure).toBeTruthy();
  });
});
