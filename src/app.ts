import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import expressSession from "express-session";
import { router } from "./routes";

const app = express();
app.use(
	expressSession({
		secret: "secret",
		resave: false,
		saveUninitialized: false,
	})
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
	res.status(200).send("Welcome to the Tour Management System");
});

export default app;
