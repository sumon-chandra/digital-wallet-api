import { startSession } from "mongoose";
import httpStatus from "http-status-codes";
import AppError from "../../helpers/app-error";
import { IUser } from "./user.interface";
import { User } from "./user.model";
import bcrypt from "bcryptjs";
import { envVars } from "../../config/env";
import { Role } from "../../interfaces/common";
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
			userData.agent = { isApproved: false };
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

const getAllUsers = async (): Promise<IUser[]> => {
	const users = await User.find();
	return users;
};

export const UserServices = {
	createUser,
	getAllUsers,
};
