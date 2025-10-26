import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { router } from "./routes";
import { globalErrorHandler } from "./middlewares/global-error-handler";

const app = express();

app.use(
	cors({
		origin: ["http://localhost:5173", "https://digital-wallet-blue.vercel.app"],
		credentials: true,
	})
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1", router);
app.use(globalErrorHandler);

app.get("/", (req: Request, res: Response) => {
	res.status(200).send("Welcome to the Digital Wallet API.");
});

export default app;
