import { Router } from "express";
import { UserRepository } from "../../domain/repositories/UserRepository";
import { RegisterUser } from "../../application/usecase/UserRegister";
import { AuthController } from "../controller/UserController";

export const createAuthRoutes = (userRepository: UserRepository): Router => {
  const router = Router();
  const registerUser = new RegisterUser(userRepository);
  const authController = new AuthController(registerUser);

  router.post("/register", authController.register);
  return router;
};
