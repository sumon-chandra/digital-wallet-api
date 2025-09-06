import { Types } from "mongoose";
import { AgentStatus, IsActive, Role } from "../../interfaces/common";

export interface IUser {
	_id?: Types.ObjectId;
	name: string;
	email: string;
	role: Role;
	agent?: { isApproved: boolean; status: AgentStatus };
	password?: string;
	isEmailVerified?: boolean;
	isActive?: IsActive;
	address?: string;
	createdAt?: Date;
}
