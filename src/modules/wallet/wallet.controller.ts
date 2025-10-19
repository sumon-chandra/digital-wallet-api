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
	console.log({ sendMoneyReqUser: req.user });
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

const getAgentCommissionHistory = catchAsync(async (req: Request, res: Response) => {
	const { userId } = req.user;
	const { page, limit } = req.query;
	const commissionHistory = await WalletServices.getAgentCommissionHistory(userId, { page: Number(page) || 1, limit: Number(limit) || 10 });

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.CREATED,
		message: "Commission History Retrieved Successfully.",
		data: commissionHistory,
	});
});

const getAllWallets = catchAsync(async (req: Request, res: Response) => {
	const query = req.query as Record<string, string>;
	const wallets = await WalletServices.getAllWallets(query);

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "All Wallets Retrieved Successfully.",
		data: wallets,
	});
});

const changeWalletStatus = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const { walletStatus } = req.body;
	await WalletServices.changeWalletStatus(id, walletStatus);

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "Changed Wallet Status Successfully.",
		data: null,
	});
});

export const WalletControllers = {
	topUpWallet,
	withdrawWallet,
	sendMoney,
	cashIn,
	cashOut,
	getAgentCommissionHistory,
	getAllWallets,
	changeWalletStatus,
};
