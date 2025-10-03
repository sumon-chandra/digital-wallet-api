import bcrypt from "bcryptjs";
import httpStatus from "http-status-codes";
import AppError from "../../helpers/app-error";
import { User } from "../user/user.model";
import { IUser } from "../user/user.interface";
import { createAccessTokenWithRefreshToken, createUserTokens } from "../../utils/user-token";

const credentialsLogin = async (payload: Partial<IUser>) => {
	const { email, password } = payload;
	const existingUser = await User.findOne({ email });

	if (!existingUser) {
		throw new AppError(httpStatus.BAD_REQUEST, "Please register first.");
	}

	if (!existingUser.isEmailVerified) {
		throw new AppError(httpStatus.FORBIDDEN, "User is not verified.");
	}

	const isPasswordCorrect = await bcrypt.compare(password!, existingUser.password!);

	if (!isPasswordCorrect) {
		throw new AppError(httpStatus.BAD_REQUEST, "Incorrect Password");
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { password: _, ...restUser } = existingUser.toObject();
	const userTokens = createUserTokens(existingUser);

	return {
		accessToken: userTokens.accessToken,
		refreshToken: userTokens.refreshToken,
		user: restUser,
	};
};

const getNewUserAccessToken = async (refreshToken: string) => {
	// console.log({ refreshToken });
	const newAccessToken = await createAccessTokenWithRefreshToken(refreshToken);

	return {
		accessToken: newAccessToken,
	};
};

export const AuthServices = {
	credentialsLogin,
	getNewUserAccessToken,
};
