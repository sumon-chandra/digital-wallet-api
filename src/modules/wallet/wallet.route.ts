import { Router } from "express";
import { checkAuth } from "../../middlewares/check-auth";
import { Role } from "../../interfaces/common";
import { WalletControllers } from "./wallet.controller";

export const WalletRouter = Router();

// General User Routes
WalletRouter.post("/top-up", checkAuth(Role.USER), WalletControllers.topUpWallet);
WalletRouter.post("/withdraw", checkAuth(Role.USER), WalletControllers.withdrawWallet);
WalletRouter.post("/send-money", checkAuth(Role.USER), WalletControllers.sendMoney);

// Agent Routes
WalletRouter.post("/cash-in", checkAuth(Role.AGENT), WalletControllers.cashIn);
WalletRouter.post("/cash-out", checkAuth(Role.AGENT), WalletControllers.cashOut);
WalletRouter.get("/commission", checkAuth(Role.AGENT), WalletControllers.getAgentCommissionHistory);
