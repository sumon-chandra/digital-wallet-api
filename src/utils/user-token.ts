import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import { IUser } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import { generateToken, verifyToken } from "./jwt";
import AppError from "../helpers/app-error";
import { IsActive } from "../interfaces/common";

export const createUserTokens = (user: Partial<IUser>) => {
	const jwtPayload = {
		userId: user._id,
		email: user.email,
		role: user.role,
	};

	const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES);
	const refreshToken = generateToken(jwtPayload, envVars.JWT_REFRESH_SECRET, envVars.JWT_REFRESH_EXPIRES);

	return {
		accessToken,
		refreshToken,
	};
};

export const createAccessTokenWithRefreshToken = async (refreshToken: string) => {
	const verifiedToken = verifyToken(refreshToken, envVars.JWT_REFRESH_SECRET) as JwtPayload;

	const isUserExist = await User.findOne({ email: verifiedToken.email });

	if (!isUserExist) {
		throw new AppError(httpStatus.NOT_FOUND, "User does not exist.");
	}

	if (isUserExist.isActive === IsActive.BLOCKED) {
		throw new AppError(httpStatus.FORBIDDEN, "User is blocked.");
	}

	if (isUserExist.isActive === IsActive.INACTIVE) {
		throw new AppError(httpStatus.FORBIDDEN, "User is inactive.");
	}

	const jwtPayload = {
		userId: isUserExist._id,
		email: isUserExist.email,
		role: isUserExist.role,
	};

	const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES);

	return accessToken;
};
