import { FilterQuery } from "mongoose";
import { ITransaction } from "./transaction.interface";
import { Transaction } from "./transaction.model";

interface GetTransactionTypes {
	filters: FilterQuery<ITransaction>;
	options?: { limit?: number; page?: number; sort?: string };
}

const getTransactionsFunc = async ({ filters, options }: GetTransactionTypes) => {
	const { limit = 20, page = 1, sort = "-createdAt" } = options || {};

	const skip = (page - 1) * limit;

	const transactions = await Transaction.find(filters).sort(sort).skip(skip).limit(limit).exec();

	const total = await Transaction.countDocuments(filters);

	return {
		data: transactions,
		meta: {
			total,
			page,
			limit,
			totalPages: Math.ceil(total / limit),
		},
	};
};

const getUserTransactions = async (userId: string, options?: { limit?: number; page?: number; sort?: string }) => {
	return getTransactionsFunc({ filters: { userId }, options });
};

const getWalletTransactions = async (walletId: string, options?: { limit?: number; page?: number; sort?: string }) => {
	return getTransactionsFunc({ filters: { walletId }, options });
};

export const TransactionServices = {
	getUserTransactions,
	getWalletTransactions,
};
