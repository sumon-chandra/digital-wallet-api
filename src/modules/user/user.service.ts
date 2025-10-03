import { startSession } from "mongoose";
import httpStatus from "http-status-codes";
import AppError from "../../helpers/app-error";
import { IUser, IUserResponse } from "./user.interface";
import { User } from "./user.model";
import bcrypt from "bcryptjs";
import { envVars } from "../../config/env";
import { AgentStatus, Role } from "../../interfaces/common";
import Wallet from "../wallet/wallet.model";

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

const getAllUsers = async (): Promise<IUserResponse[]> => {
	const users = await User.aggregate([
		{
			$match: {
				role: Role.USER,
			},
		},
		{
			$lookup: {
				from: "wallets",
				localField: "_id",
				foreignField: "userId",
				as: "wallet",
			},
		},
		{
			$lookup: {
				from: "transactions",
				localField: "_id",
				foreignField: "userId",
				as: "transactions",
			},
		},
		{
			$addFields: {
				balance: { $first: "$wallet.balance" },
				transactionCount: { $size: "$transactions" },
				lastActive: { $max: "$transactions.createdAt" },
			},
		},
		{
			$project: {
				_id: 0,
				id: "$_id",
				name: 1,
				email: 1,
				address: 1,
				balance: 1,
				transactionCount: "$transactionCount",
				phone: 1,
				status: "$isActive",
				lastActive: { $dateToString: { format: "%d %B %Y", date: "$lastActive" } },
				joinDate: { $dateToString: { format: "%d %B %Y", date: "$createdAt" } },
			},
		},
	]);
	return users;
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

export const UserServices = {
	createUser,
	getAllUsers,
	changeAgentActiveStatus,
	getMe,
	getSingleUser,
};
