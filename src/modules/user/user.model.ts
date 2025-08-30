import { model, Schema } from "mongoose";
import { IUser } from "./user.interface";
import { IsActive, Role } from "../../interfaces/common";

const userSchema = new Schema<IUser>(
	{
		name: { type: String, required: true },
		email: { type: String, unique: true, required: true },
		role: { type: String, enum: Object.values(Role), default: Role.USER },
		password: { type: String },
		isEmailVerified: { type: Boolean, default: false },
		isActive: { type: String, enum: Object.values(IsActive), default: IsActive.INACTIVE },
		address: { type: String },
		createdAt: { type: Date, default: Date.now },
	},
	{ timestamps: true, versionKey: false }
);

export const User = model<IUser>("User", userSchema);
