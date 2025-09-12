import { UserRepository } from "../../domain/repositories/UserRepository";
import { ValidationError } from "./UserRegister";
import { Result } from "../../domain/value-object/Result";
import { Email } from "../../domain/value-object/Email";

export interface UserLoginRequest {
  email: string;
  password: string;
}

export interface UserLoginResponse {
  jwt: string;
}

export class UserLogin {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(
    req: UserLoginRequest,
  ): Promise<Result<UserLoginResponse, ValidationError[]>> {
    const errors: ValidationError[] = [];

    const emailResult = Email.create(req.email);
    if (emailResult.isFailure) {
      errors.push({
        field: "email",
        message: "Invalid email format",
      });
    }

    if (!req.password || req.password.trim() === "") {
      errors.push({
        field: "password",
        message: "Password is required",
      });
    }

    if (errors.length > 0) {
      return Result.failure(errors);
    }

    const email = emailResult.value;
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      errors.push({
        field: "general",
        message: "Invalid email or password",
      });
      return Result.failure(errors);
    }

    const isPasswordMatch = await user.password.compareWith(req.password);
    if (!isPasswordMatch) {
      errors.push({
        field: "general",
        message: "Invalid email or password",
      });
      return Result.failure(errors);
    }

    return Result.success({ jwt: "angget wae jwt" });
  }
}
