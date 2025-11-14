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
UserRouter.get("/me", checkAuth(...Object.values(Role)), UserControllers.getMe);
UserRouter.get("/get-user-by-phone-email", checkAuth(...Object.values(Role)), UserControllers.getUserByPhoneOrEmail);
UserRouter.get("/select-user-for-transaction", checkAuth(...Object.values(Role)), UserControllers.selectUserForTransaction);
UserRouter.patch("/update-profile", checkAuth(...Object.values(Role)), UserControllers.updateUser);
UserRouter.patch("/change-agent-active-status/:id", checkAuth(Role.ADMIN), UserControllers.changeAgentActiveStatus);
UserRouter.patch("/change-user-status-role/:id", checkAuth(Role.ADMIN), UserControllers.changeUserStatusRole);
UserRouter.get("/:id", checkAuth(...Object.values(Role)), UserControllers.getSingleUser);
