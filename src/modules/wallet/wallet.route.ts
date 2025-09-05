import { Router } from "express";
import { checkAuth } from "../../middlewares/check-auth";
import { Role } from "../../interfaces/common";
import { WalletControllers } from "./wallet.controller";

export const WalletRouter = Router();

WalletRouter.post("/top-up", checkAuth(Role.USER), WalletControllers.topUpWallet);
WalletRouter.post("/withdraw", checkAuth(Role.USER), WalletControllers.withdrawWallet);
