import { model, Schema } from "mongoose";
import { ITransaction } from "./transaction.interface";
import { TransactionType } from "../../interfaces/common";

const transactionSchema = new Schema<ITransaction>(
	{
		userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
		walletId: { type: Schema.Types.ObjectId, ref: "Wallet", required: true },
		type: { type: String, enum: TransactionType, required: true },
		amount: { type: Number, required: true },
		balanceBefore: { type: Number },
		balanceAfter: { type: Number },
		receiverId: { type: Schema.Types.ObjectId, ref: "User" },
		senderId: { type: Schema.Types.ObjectId, ref: "User" },

		agentId: { type: Schema.Types.ObjectId, ref: "User" },
		commission: { type: Number, default: 0 },
	},
	{ timestamps: true, versionKey: false }
);

transactionSchema.pre("save", function (next) {
	if (this.type !== TransactionType.SEND_MONEY) {
		this.receiverId = undefined;
	}
	if (this.type !== TransactionType.RECEIVE_MONEY) {
		this.senderId = undefined;
	}
	next();
});

export const Transaction = model<ITransaction>("Transaction", transactionSchema);
