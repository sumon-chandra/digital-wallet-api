import { Router } from "express";
import { validateRequest } from "../../middlewares/validated-request";
import { createUserZodSchema } from "./user.validation";
import { UserControllers } from "./user.controller";
import { checkAuth } from "../../middlewares/check-auth";
import { Role } from "../../interfaces/common";

export const UserRouter = Router();

UserRouter.post("/register", validateRequest(createUserZodSchema), UserControllers.createUser);
UserRouter.get("/", checkAuth(Role.ADMIN), UserControllers.getAllUsers);
UserRouter.get("/agents", checkAuth(Role.ADMIN), UserControllers.getAllAgents);
UserRouter.get("/me", checkAuth(Role.USER, Role.ADMIN), UserControllers.getMe);
UserRouter.get("/get-user-by-phone-email", checkAuth(...Object.values(Role)), UserControllers.getUserByPhoneOrEmail);

// Admin Routes
UserRouter.patch("/change-agent-active-status/:id", checkAuth(Role.ADMIN), UserControllers.changeAgentActiveStatus);

UserRouter.get("/:id", checkAuth(...Object.values(Role)), UserControllers.getSingleUser);
