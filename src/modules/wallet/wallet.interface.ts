import { Types } from "mongoose";
import { WalletStatus } from "../../interfaces/common";

export interface IWallet {
	_id?: Types.ObjectId;
	userId: Types.ObjectId;
	balance: number;
	status: WalletStatus;
	createdAt?: Date;
}
