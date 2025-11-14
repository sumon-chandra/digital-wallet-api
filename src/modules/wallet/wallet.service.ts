import httpStatus from "http-status-codes";
import mongoose, { Types } from "mongoose";
import Wallet from "../wallet/wallet.model";
import { AgentStatus, Role, TransactionType, WalletStatus } from "../../interfaces/common";
import AppError from "../../helpers/app-error";
import { Transaction } from "../transaction/transaction.model";
import { COMMISSION_RATE } from "./wallet.constant";
import { QueryBuilder } from "../../utils/query-builder";
import { User } from "../user/user.model";

interface PaginationOptions {
	page?: number;
	limit?: number;
	skip?: number;
}

const topUpWallet = async (userId: string, amount: number, role: string) => {
	if (!userId) throw new AppError(httpStatus.BAD_REQUEST, "User Not Found. Please check the User ID.");
	if (role !== Role.USER) throw new AppError(httpStatus.FORBIDDEN, "Only general users can top up their wallet.");
	if (amount < 10) throw new AppError(httpStatus.BAD_REQUEST, "Top up amount must be at least 10.");

	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		const wallet = await Wallet.findOne({ userId }).session(session);
		if (!wallet) throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
		if (wallet.status === WalletStatus.BLOCKED) throw new AppError(httpStatus.CONFLICT, "Your wallet is blocked. You can not top up to your wallet.");

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
		if (!wallet) throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
		if (wallet.status === WalletStatus.BLOCKED)
			throw new AppError(httpStatus.CONFLICT, "Your wallet is blocked. You can not withdraw from your wallet.");
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
		if (senderWallet.status === WalletStatus.BLOCKED)
			throw new AppError(httpStatus.CONFLICT, "Your wallet is blocked. You cannot send money to others wallet");
		if (receiverWallet.status === WalletStatus.BLOCKED)
			throw new AppError(httpStatus.CONFLICT, "Your receiver wallet is blocked. You cannot send money to blocked wallet");
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

		// Record receiver transaction
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

const cashIn = async (cashInUserId: string, agentId: string, amount: number, role: string) => {
	if (!cashInUserId) throw new AppError(httpStatus.BAD_REQUEST, "User Not Found. Please check the User ID.");
	if (!agentId) throw new AppError(httpStatus.BAD_REQUEST, "Agent Not Found. Please check the Agent ID.");
	if (role !== Role.AGENT) throw new AppError(httpStatus.FORBIDDEN, "Only agents can cash in to user wallets.");
	if (amount < 1) throw new AppError(httpStatus.BAD_REQUEST, "You must cash in at least 1.");

	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		const agent = await User.findOne({ _id: agentId, role: Role.AGENT }).session(session);
		if (agent?.agent?.status === (AgentStatus.SUSPENDED || AgentStatus.INACTIVE))
			throw new AppError(httpStatus.BAD_REQUEST, `You are not allowed to cash in. Because you account is ${agent?.agent?.status.toLowerCase()}`);

		const userWallet = await Wallet.findOne({ userId: cashInUserId }).session(session);
		const agentWallet = await Wallet.findOne({ userId: agentId }).session(session);

		if (!userWallet) throw new AppError(httpStatus.NOT_FOUND, "User wallet not found.");
		if (!agentWallet) throw new AppError(httpStatus.NOT_FOUND, "Agent wallet not found.");
		if (agentWallet.status === WalletStatus.BLOCKED)
			throw new AppError(httpStatus.CONFLICT, "Your wallet is blocked. You cannot cash in to others wallet");
		if (userWallet.status === WalletStatus.BLOCKED)
			throw new AppError(httpStatus.CONFLICT, "Your receiver wallet is blocked. You cannot cash in to blocked wallet");
		if (agentWallet.balance < amount) throw new AppError(httpStatus.BAD_REQUEST, "Insufficient agent balance.");

		const commission = amount * COMMISSION_RATE;
		userWallet.balance += amount;
		agentWallet.balance -= amount;
		agentWallet.balance += commission;

		await userWallet.save({ session });
		await agentWallet.save({ session });

		await Transaction.create(
			[
				{
					userId: cashInUserId,
					walletId: userWallet._id,
					type: TransactionType.CASH_IN,
					amount,
					balanceBefore: userWallet.balance - amount,
					balanceAfter: userWallet.balance,
					agentId,
					commission,
				},
			],
			{ session }
		);

		await session.commitTransaction();
		session.endSession();

		return { userWallet, agentWallet };
	} catch (error) {
		await session.abortTransaction();
		session.endSession();
		throw error;
	}
};

const cashOut = async (cashOutUserId: string, agentId: string, amount: number, role: string) => {
	if (!cashOutUserId) throw new AppError(httpStatus.BAD_REQUEST, "User Not Found. Please check the User ID.");
	if (!agentId) throw new AppError(httpStatus.BAD_REQUEST, "Agent Not Found. Please check the Agent ID.");
	if (role !== Role.USER) throw new AppError(httpStatus.FORBIDDEN, "Only agents can perform cash-out operations.");
	if (amount < 1) throw new AppError(httpStatus.BAD_REQUEST, "You must cash out at least 1.");

	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		const agent = await User.findOne({ _id: agentId, role: Role.AGENT }).session(session);
		if (agent?.agent?.status === (AgentStatus.SUSPENDED || AgentStatus.INACTIVE))
			throw new AppError(httpStatus.BAD_REQUEST, `You are not allowed to cash out. Because you account is ${agent?.agent?.status.toLowerCase()}`);

		const userWallet = await Wallet.findOne({ userId: cashOutUserId }).session(session);
		const agentWallet = await Wallet.findOne({ userId: agentId }).session(session);

		if (!userWallet || !agentWallet) throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
		if (agentWallet.status === WalletStatus.BLOCKED)
			throw new AppError(httpStatus.CONFLICT, "Your wallet is blocked. You cannot cash out to others wallet");
		if (userWallet.status === WalletStatus.BLOCKED)
			throw new AppError(httpStatus.CONFLICT, "Your receiver wallet is blocked. You cannot cash out to blocked wallet");
		if (userWallet.balance < amount) throw new AppError(httpStatus.BAD_REQUEST, "Insufficient user balance.");

		const commission = Math.round(amount * COMMISSION_RATE);
		userWallet.balance -= amount;
		agentWallet.balance += amount;
		agentWallet.balance += commission;

		await userWallet.save({ session });
		await agentWallet.save({ session });

		await Transaction.create(
			[
				{
					userId: cashOutUserId,
					walletId: userWallet._id,
					type: TransactionType.CASH_OUT,
					amount,
					balanceBefore: userWallet.balance + amount,
					balanceAfter: userWallet.balance,
					agentId,
					commission,
				},
			],
			{ session }
		);

		await session.commitTransaction();
		session.endSession();

		return { userWallet, agentWallet };
	} catch (error) {
		await session.abortTransaction();
		session.endSession();
		throw error;
	}
};

const getAgentCommissionHistory = async (agentId: string, { page = 1, limit = 10 }: PaginationOptions) => {
	const skip = (page - 1) * limit;

	const commissions = await Transaction.find({ agentId })
		.select("type amount commission createdAt userId")
		.sort({ createdAt: -1 })
		.skip(skip)
		.limit(limit);

	const totalCommission = await Transaction.aggregate([
		{
			$match: {
				agentId: new Types.ObjectId(agentId),
			},
		},
		{
			$group: {
				_id: null,
				total: { $sum: "$commission" },
			},
		},
	]);

	return {
		commissions,
		totalCommission: Math.round(totalCommission[0]?.total) || 0,
		pagination: { page, limit },
	};
};

const getAllWallets = async (query: Record<string, string>) => {
	const queryBuilder = new QueryBuilder(Wallet.find(), query);
	const wallets = queryBuilder.filter().sort().paginate();
	const [data, meta] = await Promise.all([wallets.build(), queryBuilder.getMeta()]);
	return { data, meta };
};

const changeWalletStatus = async (walletId: string, walletStatus: WalletStatus) => {
	const wallet = await Wallet.findById(walletId);
	if (!wallet) throw new AppError(httpStatus.NOT_FOUND, "Wallet not found. Check the wallet ID.");
	if (!Object.values(WalletStatus).includes(walletStatus)) {
		throw new AppError(httpStatus.BAD_REQUEST, "Invalid wallet status.");
	}

	wallet.status = walletStatus;
	await wallet.save();
};

export const WalletServices = {
	topUpWallet,
	withdrawWallet,
	sendMoney,
	cashIn,
	cashOut,
	getAgentCommissionHistory,
	getAllWallets,
	changeWalletStatus,
};
