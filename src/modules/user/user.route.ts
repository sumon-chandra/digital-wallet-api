import { Router } from "express";
import { validateRequest } from "../../middlewares/validated-request";
import { createUserZodSchema } from "./user.validation";
import { UserControllers } from "./user.controller";

export const UserRouter = Router();

UserRouter.post("/register", validateRequest(createUserZodSchema), UserControllers.createUser);
UserRouter.get("/", UserControllers.getAllUsers);
