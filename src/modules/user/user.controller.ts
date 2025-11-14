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
	const query = req.query as Record<string, string>;
	const users = await UserServices.getAllUsers(query);
	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "Users Retrieved Successfully!",
		data: users,
	});
});

const getAllAgents = catchAsync(async (req: Request, res: Response) => {
	const query = req.query as Record<string, string>;
	const agents = await UserServices.getAllAgents(query);
	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "Agents Retrieved Successfully!",
		data: agents,
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

const selectUserForTransaction = catchAsync(async (req: Request, res: Response) => {
	const { search, method, role } = req.query as Record<string, string>;
	const user = await UserServices.selectUserForTransaction({ search, method, role });
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

const updateUser = catchAsync(async (req: Request, res: Response) => {
	const payload = req.body;
	const userId = req.user.userId;
	const updateResponse = await UserServices.updateUser(userId, payload);
	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "User Updated Successfully!",
		data: updateResponse,
	});
});

const changeUserStatusRole = catchAsync(async (req: Request, res: Response) => {
	const userId = req.params.id;
	const payload = req.body;
	await UserServices.changeUserStatusRole(userId, payload);
	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "User Status and Role Updated Successfully!",
		data: null,
	});
});

export const UserControllers = {
	createUser,
	getAllUsers,
	getAllAgents,
	changeAgentActiveStatus,
	getMe,
	getSingleUser,
	getUserByPhoneOrEmail,
	updateUser,
	changeUserStatusRole,
	selectUserForTransaction,
};
