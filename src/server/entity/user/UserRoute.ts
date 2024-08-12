import {
	type NextFunction,
	type Request,
	type Response,
	Router,
} from "express";
import { UserController } from "./UserController";
import type { Route } from "@/server/Server";
import { UserSchema } from "./User";
import { DtoMiddleware } from "@/server/middleware/DtoMiddleware";

/**
 * 1. Pasar instancia de express por construtor.
 * 2. Crear Router y hacer un getter.
 */
export class UserRoute implements Route {
	private router: Router;
	private userController: UserController;
	private path = "/user";

	constructor() {
		this.router = Router();
		this.userController = new UserController();
		this.initializeRoutes();
	}

	private initializeRoutes() {
		this.router.get("/", this.userController.getUser.bind(this.userController));
		this.router.post(
			"/",
			(req: Request, res: Response, next: NextFunction) =>
				DtoMiddleware.getInstance().validateDto(req, res, next, UserSchema),
			this.userController.createUser.bind(this.userController),
		);
	}

	get getRouter() {
		return this.router;
	}

	get getPath() {
		return this.path;
	}
}
