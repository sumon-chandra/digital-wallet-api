import { Types } from "mongoose";
import { TransactionType } from "../../interfaces/common";

export interface ITransaction {
	userId: Types.ObjectId;
	walletId: Types.ObjectId;
	type: TransactionType;
	amount: number;
	balanceBefore?: number;
	balanceAfter?: number;
	receiverId?: Types.ObjectId;
	createdAt?: Date;
}
