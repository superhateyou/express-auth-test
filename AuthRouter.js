import { Router } from "express";
import authController from "./AuthController.js";
import { check } from "express-validator";
import authMiddleware from "./middleware/AuthMiddleware.js";
import roleMiddleware from "./middleware/RoleMiddleware.js";

const AuthRouter = new Router();

AuthRouter.post(
  "/registration",
  [
    check("username", "Invalid username").notEmpty(),
    check("password", "Invalid password").notEmpty(),
    check("password", "Invalid password").isLength({ min: 2, max: 8 }),
  ],
  authController.registration
);
AuthRouter.post("/login", authMiddleware, authController.login);
AuthRouter.get("/users", [roleMiddleware(["ADMIN"])], authController.getUsers);

export default AuthRouter;
