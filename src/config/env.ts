import dotEnv from "dotenv";
dotEnv.config();

interface EnvTypes {
	MONGODB_URI: string;
	NODE_ENV: "development" | "production";
	PORT: string;
	BCRYPT_SALT_ROUND: string;
	JWT_ACCESS_SECRET: string;
	JWT_ACCESS_EXPIRES: string;
	JWT_REFRESH_SECRET: string;
	JWT_REFRESH_EXPIRES: string;
}

const loadEnv = (): EnvTypes => {
	const envVarsArray = [
		"MONGODB_URI",
		"NODE_ENV",
		"PORT",
		"BCRYPT_SALT_ROUND",
		"JWT_ACCESS_SECRET",
		"JWT_ACCESS_EXPIRES",
		"JWT_REFRESH_SECRET",
		"JWT_REFRESH_EXPIRES",
	];

	envVarsArray.forEach((env) => {
		if (!process.env[env]) {
			throw new Error(`${env} environment variable not found!`);
		}
	});

	return {
		NODE_ENV: process.env.NODE_ENV as "development" | "production",
		MONGODB_URI: process.env.MONGODB_URI as string,
		PORT: process.env.PORT as string,
		BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND as string,
		JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
		JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES as string,
		JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
		JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES as string,
	};
};

export const envVars = loadEnv();
