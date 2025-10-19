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
	});

	res.cookie("refreshToken", token.refreshToken, {
		httpOnly: true,
		secure: true,
		sameSite: "none",
	});
};
