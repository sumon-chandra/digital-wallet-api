import { Router } from "express";
import { checkAuth } from "../../middlewares/check-auth";
import { Role } from "../../interfaces/common";
import { TransactionControllers } from "./transaction.controller";

export const TransactionRouter = Router();

TransactionRouter.get("/", checkAuth(...Object.values(Role)), TransactionControllers.getUserTransaction);
TransactionRouter.get("/summery", checkAuth(...Object.values(Role)), TransactionControllers.getDateWiseTransactionSummary);
