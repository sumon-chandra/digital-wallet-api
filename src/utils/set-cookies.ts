import { Response } from "express";

export interface TokenInfo {
	accessToken?: string;
	refreshToken?: string;
}

export const setAuthCookies = (res: Response, token: TokenInfo) => {
	res.cookie("accessToken", token.accessToken, {
		httpOnly: true,
		secure: true,
		sameSite: "none",
		path: "/",
		maxAge: 7 * 24 * 60 * 60 * 1000,
	});

	res.cookie("refreshToken", token.refreshToken, {
		httpOnly: true,
		secure: true,
		sameSite: "none",
		path: "/",
		maxAge: 7 * 24 * 60 * 60 * 1000,
	});
};
