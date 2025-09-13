import { Response } from "express";

export interface TokenInfo {
	accessToken?: string;
	refreshToken?: string;
}

export const setAuthCookies = (res: Response, token: TokenInfo) => {
	if (token.accessToken) {
		res.cookie("accessToken", token.accessToken, {
			httpOnly: true,
			secure: false,
			sameSite: "none",
		});
	}

	if (token.refreshToken) {
		res.cookie("refreshToken", token.refreshToken, {
			httpOnly: true,
			secure: false,
			sameSite: "none",
		});
	}
};
