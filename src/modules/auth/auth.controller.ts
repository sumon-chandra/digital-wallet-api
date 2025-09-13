import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catch-async";
import { sendResponse } from "../../utils/send-response";
import { setAuthCookies } from "../../utils/set-cookies";
import { AuthServices } from "./auth.service";

const credentialsLogin = catchAsync(async (req: Request, res: Response) => {
	const loginInfo = await AuthServices.credentialsLogin(req.body);
	if(loginInfo.accessToken && loginInfo.refreshToken && loginInfo.user) {
		setAuthCookies(res, loginInfo);
	}
	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "User Login Successfully!",
		data: loginInfo,
	});
});

const logout = catchAsync(async (req: Request, res: Response) => {
	res.clearCookie("accessToken", {
		httpOnly: true,
		secure: false,
		sameSite: "lax",
	});
	res.clearCookie("refreshToken", {
		httpOnly: true,
		secure: false,
		sameSite: "lax",
	});

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "User Logged Out Successfully!",
		data: null,
	});
});

export const AuthControllers = {
	credentialsLogin,
	logout,
};
