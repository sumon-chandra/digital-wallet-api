import { Router } from "express";
import { UserRouter } from "../modules/user/user.route";
import { AuthRouter } from "../modules/auth/auth.route";
import { WalletRouter } from "../modules/wallet/wallet.route";

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
	{
		path: "/auth",
		route: AuthRouter,
	},
	{
		path: "/wallet",
		route: WalletRouter,
	},
];

moduleRouters.forEach((route) => {
	router.use(route.path, route.route);
});
