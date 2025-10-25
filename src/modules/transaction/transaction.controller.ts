import httpStatus from "http-status-codes";
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catch-async";
import { sendResponse } from "../../utils/send-response";
import { JwtPayload } from "jsonwebtoken";
import { TransactionServices } from "./transaction.service";

const getUserTransaction = catchAsync(async (req: Request, res: Response) => {
	const user = req.user as JwtPayload;
	const type = req.query.type as string | undefined;
	const filterOptions = {
		limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
		page: req.query.page ? parseInt(req.query.page as string, 10) : undefined,
		sort: req.query.sort as string | undefined,
		type,
	};
	const getUserTransactionResponse = await TransactionServices.getUserTransactions(user, filterOptions);

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "Get User Transaction Successful!",
		data: getUserTransactionResponse,
	});
});

const getWalletTransaction = catchAsync(async (req: Request, res: Response) => {
	const { userId } = req.user as JwtPayload;
	const filterOptions = {
		limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
		page: req.query.page ? parseInt(req.query.page as string, 10) : undefined,
		sort: req.query.sort as string | undefined,
	};
	const getWalletTransactionResponse = await TransactionServices.getWalletTransactions(userId, filterOptions);

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "Get Wallet Transaction Successful!",
		data: getWalletTransactionResponse,
	});
});

export const TransactionControllers = {
	getUserTransaction,
	getWalletTransaction,
};
