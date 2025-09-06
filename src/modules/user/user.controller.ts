import { Request, Response } from "express";
import { catchAsync } from "../../utils/catch-async";
import { sendResponse } from "../../utils/send-response";
import { UserServices } from "./user.service";
import httpStatus from "http-status-codes";

const createUser = catchAsync(async (req: Request, res: Response) => {
	const user = await UserServices.createUser(req.body);

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.CREATED,
		message: "User Created Successfully!",
		data: user,
	});
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
	const users = await UserServices.getAllUsers();

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "Users Retrieved Successfully!",
		data: users,
	});
});

const changeAgentActiveStatus = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const { agentStatus } = req.body;
	await UserServices.changeAgentActiveStatus(id, agentStatus);

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: `Change Agent Active Status to ${agentStatus}`,
		data: null,
	});
});

export const UserControllers = {
	createUser,
	getAllUsers,
	changeAgentActiveStatus,
};
