import { FilterQuery } from "mongoose";
import { ITransaction } from "./transaction.interface";
import { Transaction } from "./transaction.model";
import { JwtPayload } from "jsonwebtoken";
import { Role } from "../../interfaces/common";

interface GetTransactionTypes {
	filters: FilterQuery<ITransaction>;
	options?: { limit?: number; page?: number; sort?: string };
	projection?: string;
}

const getTransactionsFunc = async ({ filters, options, projection }: GetTransactionTypes) => {
	const { limit = 20, page = 1, sort = "-createdAt" } = options || {};

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

const getUserTransactions = async (user: JwtPayload, options?: { limit?: number; page?: number; sort?: string }) => {
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

export const TransactionServices = {
	getUserTransactions,
	getWalletTransactions,
};
