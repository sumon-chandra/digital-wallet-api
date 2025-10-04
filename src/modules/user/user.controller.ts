import { Request, Response } from "express";
import { catchAsync } from "../../utils/catch-async";
import { sendResponse } from "../../utils/send-response";
import { UserServices } from "./user.service";
import httpStatus from "http-status-codes";
import { UserQuery } from "./user.interface";

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
	const query = req.query as UserQuery;
	const users = await UserServices.getAllUsers(query);
	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "Users Retrieved Successfully!",
		data: users,
	});
});

const getUserByPhoneOrEmail = catchAsync(async (req: Request, res: Response) => {
	const query = req.query.search as string;
	const user = await UserServices.getUserByPhoneOrEmail({ search: query });
	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "User Retrieved Successfully!",
		data: user,
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

const getMe = catchAsync(async (req: Request, res: Response) => {
	const userId = req.user.userId;
	const user = await UserServices.getMe(userId);
	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "User Retrieved Successfully!",
		data: user,
	});
});

const getSingleUser = catchAsync(async (req: Request, res: Response) => {
	const userId = req.params.id;
	const user = await UserServices.getSingleUser(userId);
	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "User Retrieved Successfully!",
		data: user,
	});
});

export const UserControllers = {
	createUser,
	getAllUsers,
	changeAgentActiveStatus,
	getMe,
	getSingleUser,
	getUserByPhoneOrEmail,
};
