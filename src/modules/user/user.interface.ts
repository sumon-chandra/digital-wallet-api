import { Types } from "mongoose";
import { AgentStatus, IsActive, Role } from "../../interfaces/common";

export interface IUser {
	_id?: Types.ObjectId;
	name: string;
	email: string;
	role: Role;
	phone?: string;
	agent?: { isApproved: boolean; status: AgentStatus };
	password?: string;
	isEmailVerified?: boolean;
	isActive?: IsActive;
	address?: string;
	createdAt?: Date;
}

export interface IUserResponse {
	id: string;
	name: string;
	email: string;
	phone: string | null;
	balance: number;
	status: IsActive;
	joinDate: string;
	lastActive: string | null;
	transactions: number;
}

export interface UserQuery {
	phone?: string;
	email?: string;
	name?: string;
	search?: string;
}
