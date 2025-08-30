import { Router } from "express";
import { UserRouter } from "../modules/user/user.route";

export const router = Router();

interface ModuleRouterTypes {
	path: string;
	route: Router;
}

const moduleRouters: ModuleRouterTypes[] = [
	{
		path: "/users",
		route: UserRouter,
	},
];

moduleRouters.forEach((route) => {
	router.use(route.path, route.route);
});
