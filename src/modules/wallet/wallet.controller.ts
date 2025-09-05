import httpStatus from "http-status-codes";
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catch-async";
import { sendResponse } from "../../utils/send-response";
import { WalletServices } from "./wallet.service";
import { JwtPayload } from "jsonwebtoken";

const topUpWallet = catchAsync(async (req: Request, res: Response) => {
	const { amount } = req.body;
	const { userId, role } = req.user as JwtPayload;
	const topUpResponse = await WalletServices.topUpWallet(userId, amount, role);

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.CREATED,
		message: "Wallet Top Up Successful!",
		data: topUpResponse,
	});
});

const withdrawWallet = catchAsync(async (req: Request, res: Response) => {
	const { amount } = req.body;
	const { userId, role } = req.user as JwtPayload;
	const withdrawalResponse = await WalletServices.withdrawWallet(userId, amount, role);

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.CREATED,
		message: "Wallet Withdrawal Successful!",
		data: withdrawalResponse,
	});
});

const sendMoney = catchAsync(async (req: Request, res: Response) => {
	const { amount, receiverId } = req.body;
	const { userId, role } = req.user as JwtPayload;
	const sendMoneyResponse = await WalletServices.sendMoney(userId, receiverId, amount, role);

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.CREATED,
		message: "Send Money Successful!",
		data: sendMoneyResponse,
	});
});

export const WalletControllers = {
	topUpWallet,
	withdrawWallet,
	sendMoney,
};
