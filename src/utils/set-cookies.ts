import { Response } from "express";

export interface TokenInfo {
	accessToken?: string;
	refreshToken?: string;
}

const cookieOptions = {
	httpOnly: true,
	secure: true, // true in production, false in dev
	sameSite: "none" as const, // cross-site requests
	path: "/", // available on all backend routes
	domain: "deg-wallet-api.vercel.app",
};

export const setAuthCookies = (res: Response, token: TokenInfo) => {
	if (token.accessToken) {
		res.cookie("accessToken", token.accessToken, cookieOptions);
	}

	if (token.refreshToken) {
		res.cookie("refreshToken", token.refreshToken, cookieOptions);
	}
};
