import { Router } from "express";

export const router = Router();

interface ModuleRouterTypes {
	path: string;
	route: Router;
}

const moduleRouters: ModuleRouterTypes[] = [];

moduleRouters.forEach((route) => {
	router.use(route.path, route.route);
});
