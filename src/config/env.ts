import dotEnv from "dotenv";
dotEnv.config();

interface EnvTypes {
	MONGODB_URI: string;
	NODE_ENV: "development" | "production";
	PORT: string;
	BCRYPT_SALT_ROUND: string;
}

const loadEnv = (): EnvTypes => {
	const envVarsArray = ["MONGODB_URI", "NODE_ENV", "PORT", "BCRYPT_SALT_ROUND"];

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
	};
};

export const envVars = loadEnv();
