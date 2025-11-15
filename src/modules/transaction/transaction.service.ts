/* eslint-disable @typescript-eslint/no-explicit-any */
import { FilterQuery, Types } from "mongoose";
import { ITransaction } from "./transaction.interface";
import { Transaction } from "./transaction.model";
import { JwtPayload } from "jsonwebtoken";
import { Role, TransactionType } from "../../interfaces/common";

interface GetTransactionTypes {
	filters: FilterQuery<ITransaction>;
	options?: { limit?: number; page?: number; sort?: string; type?: string; startDate?: string; endDate?: string };
	projection?: string;
}

const getTransactionsFunc = async ({ filters, options, projection }: GetTransactionTypes) => {
	const { limit = 20, page = 1, sort = "-createdAt", type, startDate, endDate } = options || {};
	if (type) {
		filters.type = type;
	}
	if (startDate) {
		filters.createdAt = { ...filters.createdAt, $gte: new Date(startDate) };
	}
	if (endDate) {
		filters.createdAt = { ...filters.createdAt, $lte: new Date(endDate) };
	}
	if (startDate && endDate) {
		filters.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
	}
	const skip = (page - 1) * limit;

	const transactions = await Transaction.find(filters)
		.select(projection || "")
		.sort(sort)
		.skip(skip)
		.limit(limit)
		.exec();

	const total = await Transaction.countDocuments(filters);
	const totalCommission = await Transaction.aggregate([{ $match: filters }, { $group: { _id: null, total: { $sum: "$commission" } } }]);

	return {
		data: transactions,
		meta: {
			total,
			totalCommission: totalCommission[0]?.total || 0,
			page,
			limit,
			totalPages: Math.ceil(total / limit),
		},
	};
};

const getUserTransactions = async (user: JwtPayload, options?: { limit?: number; page?: number; sort?: string; type?: string }) => {
	if (user.role === Role.USER) {
		return getTransactionsFunc({ filters: { userId: user.userId }, options, projection: "-agentId -commission" });
	}
	if (user.role === Role.AGENT) {
		return getTransactionsFunc({ filters: { agentId: user.userId }, options });
	}
	return getTransactionsFunc({ filters: {}, options });
};

const getWalletTransactions = async (walletId: string, options?: { limit?: number; page?: number; sort?: string }) => {
	return getTransactionsFunc({ filters: { walletId }, options });
};

const getDateWiseTransactionSummary = async (options?: { startDate?: string; endDate?: string; userId?: string; role?: string }) => {
	const { startDate, endDate, userId, role } = options || {};

	const match: Record<string, any> = {};
	if (userId && role === Role.USER) match.userId = new Types.ObjectId(userId);
	if (userId && role === Role.AGENT) match.agentId = new Types.ObjectId(userId);
	if (startDate || endDate) {
		match.createdAt = {};
		if (startDate) match.createdAt.$gte = new Date(startDate);
		if (endDate) match.createdAt.$lte = new Date(endDate);
	}

	const pipeline: any[] = [
		{ $match: match },
		{
			$group: {
				_id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
				cashIn: { $sum: { $cond: [{ $eq: ["$type", TransactionType.CASH_IN] }, "$amount", 0] } },
				cashOut: { $sum: { $cond: [{ $eq: ["$type", TransactionType.CASH_OUT] }, "$amount", 0] } },
				sendMoney: { $sum: { $cond: [{ $eq: ["$type", TransactionType.SEND_MONEY] }, "$amount", 0] } },
				add: { $sum: { $cond: [{ $eq: ["$type", TransactionType.TOP_UP] }, "$amount", 0] } },
				withdraw: { $sum: { $cond: [{ $eq: ["$type", TransactionType.WITHDRAW] }, "$amount", 0] } },
				receive: { $sum: { $cond: [{ $eq: ["$type", TransactionType.RECEIVE_MONEY] }, "$amount", 0] } },
				total: { $sum: "$amount" },
				count: { $sum: 1 },
			},
		},
		{ $sort: { _id: -1 } },
		{
			$project: {
				_date: "$_id",
				cashIn: 1,
				cashOut: 1,
				sendMoney: 1,
				add: 1,
				withdraw: 1,
				receive: 1,
				total: 1,
				count: 1,
			},
		},
	];

	const rows = await Transaction.aggregate(pipeline).exec();

	const data = rows.map((r: any) => ({
		date: r._date,
		cashIn: r.cashIn || 0,
		cashOut: r.cashOut || 0,
		sendMoney: r.sendMoney || 0,
		add: r.add || 0,
		withdraw: r.withdraw || 0,
		total: r.total || 0,
		count: r.count || 0,
	}));

	return data;
};
export const TransactionServices = {
	getUserTransactions,
	getWalletTransactions,
	getDateWiseTransactionSummary,
};
