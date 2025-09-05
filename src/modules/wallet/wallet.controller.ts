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

const cashIn = catchAsync(async (req: Request, res: Response) => {
	const { amount, cashInUserId } = req.body;
	const { userId, role } = req.user as JwtPayload;
	const cashInResponse = await WalletServices.cashIn(cashInUserId, userId, amount, role);

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.CREATED,
		message: "Cash In Successful!",
		data: cashInResponse,
	});
});

const cashOut = catchAsync(async (req: Request, res: Response) => {
	const { amount, cashOutUserId } = req.body;
	const { userId, role } = req.user as JwtPayload;
	const cashOutResponse = await WalletServices.cashOut(cashOutUserId, userId, amount, role);

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.CREATED,
		message: "Cash Out Successful!",
		data: cashOutResponse,
	});
});

export const WalletControllers = {
	topUpWallet,
	withdrawWallet,
	sendMoney,
	cashIn,
	cashOut,
};
