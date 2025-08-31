import { Schema, model } from "mongoose";
import { IWallet } from "./wallet.interface";
import { WalletStatus } from "../../interfaces/common";

const walletSchema = new Schema<IWallet>({
	userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
	balance: { type: Number, required: true },
	status: { type: String, enum: WalletStatus, default: WalletStatus.ACTIVE },
	createdAt: { type: Date, default: Date.now },
});

const Wallet = model<IWallet>("Wallet", walletSchema);

export default Wallet;
