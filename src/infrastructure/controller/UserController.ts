import { Request, Response } from "express";
import {
  RegisterUser,
  RegisterUserRequest,
} from "../../application/usecase/UserRegister";

export class AuthController {
  constructor(private readonly registerUser: RegisterUser) {}

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const registerRequest: RegisterUserRequest = {
        username: req.body.username.trim(),
        email: req.body.email.trim(),
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
      };

      const result = await this.registerUser.execute(registerRequest);

      if (result.isFailure) {
        res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: result.error,
        });
        return;
      }

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: result.value,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal server error",
        errors: [
          {
            field: "server",
            message: "An unexpected error occurred",
          },
        ],
      });
    }
  };
}
