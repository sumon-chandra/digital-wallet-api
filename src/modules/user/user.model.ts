import { model, Schema } from "mongoose";
import { IUser } from "./user.interface";
import { IsActive, Role } from "../../interfaces/common";

const userSchema = new Schema<IUser>(
	{
		name: { type: String, required: true },
		email: { type: String, unique: true, required: true },
		password: { type: String },
		role: { type: String, enum: Object.values(Role), default: Role.USER },
		agent: {
			isApproved: {
				type: Boolean,
				default: true,
				required: function () {
					return this.role === Role.AGENT;
				},
			},
		},
		isEmailVerified: { type: Boolean, default: true },
		isActive: { type: String, enum: Object.values(IsActive), default: IsActive.ACTIVE },
		address: { type: String },
		createdAt: { type: Date, default: Date.now },
	},
	{ timestamps: true, versionKey: false }
);

userSchema.pre("save", function (next) {
	if (this.role !== Role.AGENT) {
		this.agent = undefined;
	}
	next();
});

export const User = model<IUser>("User", userSchema);
