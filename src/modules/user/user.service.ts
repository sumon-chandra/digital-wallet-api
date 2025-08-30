import httpStatus from "http-status-codes";
import AppError from "../../helpers/app-error";
import { IUser } from "./user.interface";
import { User } from "./user.model";
import bcrypt from "bcryptjs";
import { envVars } from "../../config/env";

const createUser = async (payload: Partial<IUser>) => {
	const { email, password, ...rest } = payload;

	const ifUserExist = await User.findOne({ email });

	if (ifUserExist) {
		throw new AppError(httpStatus.BAD_REQUEST, "You are already registered. Please log in.");
	}

	const hashedPassword = await bcrypt.hash(password as string, Number(envVars.BCRYPT_SALT_ROUND));

	const user = await User.create({
		email,
		password: hashedPassword,
		...rest,
	});

	return user;
};

const getAllUsers = async (): Promise<IUser[]> => {
	const users = await User.find();
	return users;
};

export const UserServices = {
	createUser,
	getAllUsers,
};
