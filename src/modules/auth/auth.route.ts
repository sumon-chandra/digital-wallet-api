import { Router } from "express";
import { AuthControllers } from "./auth.controller";

export const AuthRouter = Router();

AuthRouter.post("/login", AuthControllers.credentialsLogin);
AuthRouter.post("/refresh-token", AuthControllers.getNewUserAccessToken);
AuthRouter.post("/logout", AuthControllers.logout);
