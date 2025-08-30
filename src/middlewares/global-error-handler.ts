/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { handleCastError } from "../helpers/handle-cast-error";
import { handlerDuplicateError } from "../helpers/handle-duplicate-error";
import { handlerValidationError } from "../helpers/handle-validation-error";
import { handlerZodError } from "../helpers/handle-zod-error";
import { IErrorSources } from "../interfaces/error.types";
import AppError from "../helpers/app-error";
import { envVars } from "../routes/config/env";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const globalErrorHandler = async (err: any, req: Request, res: Response, next: NextFunction) => {
	if (envVars.NODE_ENV === "development") {
		console.log(err);
	}

	let errorSources: IErrorSources[] = [];
	let statusCode = 500;
	let message = "Something Went Wrong!!";

	//Duplicate error
	if (err.code === 11000) {
		const simplifiedError = handlerDuplicateError(err);
		statusCode = simplifiedError.statusCode;
		message = simplifiedError.message;
	}
	// Object ID error / Cast Error
	else if (err.name === "CastError") {
		const simplifiedError = handleCastError(err);
		statusCode = simplifiedError.statusCode;
		message = simplifiedError.message;
	} else if (err.name === "ZodError") {
		const simplifiedError = handlerZodError(err);
		statusCode = simplifiedError.statusCode;
		message = simplifiedError.message;
		errorSources = simplifiedError.errorSources as IErrorSources[];
	}
	//Mongoose Validation Error
	else if (err.name === "ValidationError") {
		const simplifiedError = handlerValidationError(err);
		statusCode = simplifiedError.statusCode;
		errorSources = simplifiedError.errorSources as IErrorSources[];
		message = simplifiedError.message;
	} else if (err instanceof AppError) {
		statusCode = err.statusCode;
		message = err.message;
	} else if (err instanceof Error) {
		statusCode = 500;
		message = err.message;
	}

	res.status(statusCode).json({
		success: false,
		message,
		errorSources,
		err: envVars.NODE_ENV === "development" ? err : null,
		stack: envVars.NODE_ENV === "development" ? err.stack : null,
	});
};
