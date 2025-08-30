/* eslint-disable @typescript-eslint/no-explicit-any */
import { IErrorSources, IGenericErrorResponse } from "../interfaces/error.types";

export const handlerZodError = (err: any): IGenericErrorResponse => {
	const errorSources: IErrorSources[] = [];

	err.issues.forEach((issue: any) => {
		errorSources.push({
			path: issue.path[issue.path.length - 1],
			message: issue.message,
		});
	});

	return {
		statusCode: 400,
		message: "Zod Error",
		errorSources,
	};
};
