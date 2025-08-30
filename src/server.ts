/* eslint-disable no-console */
import mongoose from "mongoose";
import { Server } from "node:http";
import app from "./app";
import { envVars } from "./routes/config/env";

let server: Server;

const connectServer = async () => {
	try {
		await mongoose.connect(envVars.MONGODB_URI);
		console.log("MongoDB connected successfully!");
		server = app.listen(envVars.PORT, () => {
			console.log(`Server is listing on port http://localhost:${envVars.PORT}`);
		});
	} catch (error) {
		console.log(error);
	}
};

(async () => {
	await connectServer();
})();

process.on("unhandledRejection", () => {
	console.log("Unhandled Rejection founded!! Server shut down.");
	if (server) {
		server.close(() => {
			process.exit(1);
		});
	}

	process.exit(1);
});

process.on("uncaughtException", () => {
	console.log("Uncaught Exception founded!! Server shut down.");
	if (server) {
		server.close(() => {
			process.exit(1);
		});
	}

	process.exit(1);
});

process.on("SIGTERM", () => {
	console.log("SIGTERM founded");
	if (server) {
		server.close(() => {
			process.exit(1);
		});
	}

	process.exit(1);
});
