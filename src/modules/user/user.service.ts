import { startSession } from "mongoose";
import httpStatus from "http-status-codes";
import AppError from "../../helpers/app-error";
import { IUser } from "./user.interface";
import { User } from "./user.model";
import bcrypt from "bcryptjs";
import { envVars } from "../../config/env";
import { AgentStatus, IsActive, Role } from "../../interfaces/common";
import Wallet from "../wallet/wallet.model";
import { usersWithAggregate } from "../../utils/users-with-aggregate";

const INITIAL_WALLET_BALANCE = 50;

const createUser = async (payload: Partial<IUser>) => {
	const session = await startSession();
	session.startTransaction();
	try {
		const { name, email, password, role, ...rest } = payload;
		const ifUserExist = await User.findOne({ email }).session(session);
		if (ifUserExist) {
			throw new AppError(httpStatus.BAD_REQUEST, "You are already registered. Please log in.");
		}

		const hashedPassword = await bcrypt.hash(password as string, Number(envVars.BCRYPT_SALT_ROUND));

		const userData: Partial<IUser> = {
			name,
			email,
			password: hashedPassword,
			role: role || Role.USER,
			...rest,
		};

		if (role === Role.AGENT) {
			userData.agent = { isApproved: false, status: AgentStatus.ACTIVE };
		}

		const user = await User.create([userData], { session });

		await Wallet.create(
			[
				{
					userId: user[0]._id,
					balance: INITIAL_WALLET_BALANCE,
				},
			],
			{ session }
		);

		await session.commitTransaction();
		return user;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error: any) {
		await session.abortTransaction();
		// eslint-disable-next-line no-console
		console.log(error);
		throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "User creation failed");
	} finally {
		session.endSession();
	}
};

const getAllUsers = async (query: Record<string, string>) => {
	const users = usersWithAggregate({ role: Role.USER, query });
	return users;
};

const getAllAgents = async (query: Record<string, string>) => {
	const agents = usersWithAggregate({ role: Role.AGENT, query });
	return agents;
};

const getMe = async (userId: string) => {
	const user = await User.findById(userId).select("-password");
	if (!user) {
		throw new AppError(httpStatus.NOT_FOUND, "User Not Found!");
	}

	const walletData = await Wallet.aggregate([{ $match: { userId: user._id } }, { $project: { balance: 1, _id: 0 } }]);

	const balance = walletData.length > 0 ? walletData[0].balance : 0;

	return {
		...user.toObject(),
		balance,
	};
};

const getSingleUser = async (userId: string) => {
	const user = await User.findById(userId).select("-password");
	if (!user) {
		throw new AppError(httpStatus.NOT_FOUND, "User Not Found!");
	}

	const walletData = await Wallet.aggregate([{ $match: { userId: user._id } }, { $project: { balance: 1, _id: 0 } }]);

	const balance = walletData.length > 0 ? walletData[0].balance : 0;

	return {
		...user.toObject(),
		balance,
	};
};

const getUserByPhoneOrEmail = async (query: { search: string }) => {
	if (!query.search) {
		throw new AppError(httpStatus.BAD_REQUEST, "Please add Phone number or Email address!!");
	}
	const user = await User.findOne({
		$or: [{ phone: String(query.search) }, { email: String(query.search).toLowerCase() }],
	}).select("_id name email phone");
	if (!user) {
		throw new AppError(httpStatus.NOT_FOUND, "User Not Found by Phone or Email");
	}
	return user;
};

const updateUser = async (userId: string, payload: Partial<IUser>) => {
	if (!userId) {
		throw new AppError(httpStatus.BAD_REQUEST, "User ID is required");
	}
	const user = await User.findByIdAndUpdate(userId, payload, { new: true });
	if (!user) {
		throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
	}
	return user;
};

const changeAgentActiveStatus = async (agentId: string, status: AgentStatus) => {
	if (!Object.values(AgentStatus).includes(status)) {
		throw new AppError(httpStatus.BAD_REQUEST, "Invalid status.");
	}

	const agent = await User.findOne({ _id: agentId, role: Role.AGENT });
	if (!agent) throw new AppError(httpStatus.NOT_FOUND, "Agent Not Found.");

	if (agent.agent) {
		agent.agent.status = status;
	}
	await agent.save();
};

const changeUserStatusRole = async (userId: string, payload: { status: IsActive; role: Role }) => {
	if (payload.role && !Object.values(Role).includes(payload.role)) {
		throw new AppError(httpStatus.BAD_REQUEST, "Invalid role.");
	}

	if (payload.status && !Object.values(IsActive).includes(payload.status)) {
		throw new AppError(httpStatus.BAD_REQUEST, "Invalid status.");
	}

	const user = await User.findById(userId);
	if (!user) throw new AppError(httpStatus.NOT_FOUND, "User Not Found.");

	if (payload.status) user.isActive = payload.status;
	if (payload.role) user.role = payload.role;
	await user.save();
};

export const UserServices = {
	createUser,
	getAllUsers,
	getAllAgents,
	changeAgentActiveStatus,
	getMe,
	getSingleUser,
	getUserByPhoneOrEmail,
	updateUser,
	changeUserStatusRole,
};
