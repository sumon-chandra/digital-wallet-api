import httpStatus from "http-status-codes";
import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import { User } from "../modules/user/user.model";
import AppError from "../helpers/app-error";
import { IsActive } from "../interfaces/common";

export const checkAuth =
	(...authRoles: string[]) =>
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const accessToken = req.headers.authorization || req.cookies.accessToken;

			if (!accessToken) {
				throw new AppError(403, "There is no token received");
			}

			const verifiedToken = verifyToken(accessToken, envVars.JWT_ACCESS_SECRET) as JwtPayload;

			const existingUser = await User.findOne({ email: verifiedToken.email });

			if (!existingUser) {
				throw new AppError(httpStatus.NOT_FOUND, "User does not exist.");
			}

			if (existingUser.isActive === IsActive.BLOCKED || existingUser.isActive === IsActive.INACTIVE) {
				throw new AppError(httpStatus.FORBIDDEN, `User is ${existingUser.isActive}`);
			}

			if (!existingUser.isEmailVerified) {
				throw new AppError(httpStatus.FORBIDDEN, "User is not verified.");
			}

			if (!authRoles.includes(verifiedToken.role)) {
				throw new AppError(403, "You have no permission to access this page!");
			}

			req.user = verifiedToken;

			next();
		} catch (error) {
			next(error);
		}
	};
