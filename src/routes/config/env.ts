import dotEnv from "dotenv";
dotEnv.config();

interface EnvTypes {
	MONGODB_URI: string;
	NODE_ENV: "development" | "production";
	PORT: string;
}

const loadEnv = (): EnvTypes => {
	const envVarsArray = ["MONGODB_URI", "NODE_ENV", "PORT"];

	envVarsArray.forEach((env) => {
		if (!process.env[env]) {
			throw new Error(`${env} environment variable not found!`);
		}
	});

	return {
		NODE_ENV: process.env.NODE_ENV as "development" | "production",
		MONGODB_URI: process.env.MONGODB_URI as string,
		PORT: process.env.PORT as string,
	};
};

export const envVars = loadEnv();
