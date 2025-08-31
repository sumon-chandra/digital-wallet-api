import { Types } from "mongoose";
import { IsActive, Role } from "../../interfaces/common";

export interface IUser {
	_id?: Types.ObjectId;
	name: string;
	email: string;
	role: Role;
	agent?: { isApproved: boolean };
	password?: string;
	isEmailVerified?: boolean;
	isActive?: IsActive;
	address?: string;
	createdAt?: Date;
}
