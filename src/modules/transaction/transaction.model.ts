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
		receiverId: { type: Schema.Types.ObjectId, ref: "User" }, // Only for Sent Money
	},
	{ timestamps: true, versionKey: false }
);

transactionSchema.pre("save", function (next) {
	if (this.type !== TransactionType.SEND_MONEY) {
		this.receiverId = undefined;
	}
	next();
});

export const Transaction = model<ITransaction>("Transaction", transactionSchema);
