import { User } from "../../domain/entity/User";
import { UserRepository } from "../../domain/repositories/UserRepository";
import { Email } from "../../domain/value-object/Email";
import { Password } from "../../domain/value-object/Password";
import { Result } from "../../domain/value-object/Result";

export interface RegisterUserRequest {
  username: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

export interface RegisterUserResponse {
  id: string;
  username: string;
  email: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export class RegisterUser {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(
    req: RegisterUserRequest,
  ): Promise<Result<RegisterUserResponse, ValidationError[]>> {
    const errors: ValidationError[] = [];

    if (!req.username || req.username.trim().length === 0) {
      errors.push({
        field: "username",
        message: "Username is required.",
      });
    }

    const emailResult = Email.create(req.email);
    if (emailResult.isFailure) {
      errors.push({
        field: "email",
        message: emailResult.error || "Invalid email format.",
      });
    }

    if (!req.password || req.password.trim().length === 0) {
      errors.push({
        field: "password",
        message: "Password is required.",
      });
    }

    if (req.password !== req.passwordConfirm) {
      errors.push({
        field: "passwordConfirm",
        message: "Password confirmation does not match.",
      });
    }

    if (errors.length > 0) {
      return Result.failure(errors);
    }

    const email = emailResult.value!;
    const existingUser = await this.userRepo.findByEmail(email);
    if (existingUser != null) {
      errors.push({
        field: "email",
        message: "Email already in use.",
      });
    }

    const username = req.username.trim();
    const existingUsername = await this.userRepo.findByUsername(username);

    if (existingUsername != null) {
      errors.push({
        field: "username",
        message: "Username already in use.",
      });
    }

    if (errors.length > 0) {
      return Result.failure(errors);
    }

    const password = await Password.create(req.password);
    const user = User.create(email, username, password);
    const savedUser = await this.userRepo.save(user);
    if (savedUser == null) {
      return Result.failure([
        {
          field: "general",
          message: "Error saving user.",
        },
      ]);
    }

    return Result.success({
      id: savedUser.id!,
      username: savedUser.username,
      email: savedUser.email.toString(),
    });
  }
}
