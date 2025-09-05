import httpStatus from "http-status-codes";
import mongoose from "mongoose";
import Wallet from "../wallet/wallet.model";
import { Role, TransactionType } from "../../interfaces/common";
import AppError from "../../helpers/app-error";
import { Transaction } from "../transaction/transaction.model";

const topUpWallet = async (userId: string, amount: number, role: string) => {
	if (!userId) throw new AppError(httpStatus.BAD_REQUEST, "User Not Found. Please check the User ID.");
	if (role !== Role.USER) throw new AppError(httpStatus.FORBIDDEN, "Only general users can top up their wallet.");
	if (amount < 10) throw new AppError(httpStatus.BAD_REQUEST, "Top up amount must be at least 10.");

	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		const wallet = await Wallet.findOne({ userId }).session(session);
		if (!wallet) {
			throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
		}

		const balanceBefore = wallet.balance;
		wallet.balance += amount;

		await wallet.save({ session });

		const transaction = await Transaction.create(
			[
				{
					userId,
					walletId: wallet._id,
					type: TransactionType.TOP_UP,
					amount: amount.toFixed(2),
					balanceBefore: balanceBefore.toFixed(2),
					balanceAfter: wallet.balance.toFixed(2),
				},
			],
			{ session }
		);

		await session.commitTransaction();
		session.endSession();

		return { wallet, transaction: transaction[0] };
	} catch (error) {
		await session.abortTransaction();
		session.endSession();
		// eslint-disable-next-line no-console
		console.log(error);
		throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to Top Up Wallet! Please try again.");
	}
};

const withdrawWallet = async (userId: string, amount: number, role: string) => {
	if (!userId) throw new AppError(httpStatus.BAD_REQUEST, "User Not Found. Please check the User ID.");
	if (role !== Role.USER) throw new AppError(httpStatus.FORBIDDEN, "Only general users can withdraw from their wallet.");
	if (amount < 10) throw new AppError(httpStatus.BAD_REQUEST, "Withdrawal amount must be at least 10.");

	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		const wallet = await Wallet.findOne({ userId }).session(session);
		if (!wallet) {
			throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
		}

		if (wallet.balance < amount) throw new AppError(httpStatus.BAD_REQUEST, "Insufficient balance");

		const balanceBefore = wallet.balance;
		wallet.balance -= amount;

		await wallet.save({ session });

		const transaction = await Transaction.create(
			[
				{
					userId,
					walletId: wallet._id,
					type: TransactionType.WITHDRAW,
					amount,
					balanceBefore,
					balanceAfter: wallet.balance,
				},
			],
			{ session }
		);

		await session.commitTransaction();
		session.endSession();

		return { wallet, transaction: transaction[0] };
	} catch (error) {
		await session.abortTransaction();
		session.endSession();
		throw error;
	}
};

const sendMoney = async (senderId: string, receiverId: string, amount: number, role: string) => {
	if (!senderId) throw new AppError(httpStatus.BAD_REQUEST, "Sender Not Found. Please check the Sender ID.");
	if (!receiverId) throw new AppError(httpStatus.BAD_REQUEST, "Receiver Not Found. Please check the Receiver ID.");
	if (role !== Role.USER) throw new AppError(httpStatus.FORBIDDEN, "Only general users can withdraw from their wallet.");
	if (amount < 1) throw new AppError(httpStatus.BAD_REQUEST, "You must send money at least 1.");

	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		if (senderId === receiverId) throw new AppError(httpStatus.BAD_REQUEST, "Cannot send money to yourself");

		const senderWallet = await Wallet.findOne({ userId: senderId }).session(session);
		const receiverWallet = await Wallet.findOne({ userId: receiverId }).session(session);

		if (!senderWallet || !receiverWallet) throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");

		if (senderWallet.balance < amount) throw new AppError(httpStatus.BAD_REQUEST, "Insufficient balance");

		const senderBalanceBefore = senderWallet.balance;
		const receiverBalanceBefore = receiverWallet.balance;

		// Deduct from sender
		senderWallet.balance -= amount;
		await senderWallet.save({ session });

		// Add to receiver
		receiverWallet.balance += amount;
		await receiverWallet.save({ session });

		// Record sender transaction
		await Transaction.create(
			[
				{
					userId: senderId,
					walletId: senderWallet._id,
					type: TransactionType.SEND_MONEY,
					amount,
					balanceBefore: senderBalanceBefore,
					balanceAfter: senderWallet.balance,
					receiverId,
				},
			],
			{ session }
		);

		// Record receiver transaction (optional but useful for history)
		await Transaction.create(
			[
				{
					userId: receiverId,
					walletId: receiverWallet._id,
					type: TransactionType.RECEIVE_MONEY,
					amount,
					balanceBefore: receiverBalanceBefore,
					balanceAfter: receiverWallet.balance,
					senderId,
				},
			],
			{ session }
		);

		await session.commitTransaction();
		session.endSession();

		return { senderWallet, receiverWallet };
	} catch (error) {
		await session.abortTransaction();
		session.endSession();
		throw error;
	}
};

export const WalletServices = {
	topUpWallet,
	withdrawWallet,
	sendMoney,
};
