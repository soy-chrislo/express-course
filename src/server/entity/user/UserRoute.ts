import {
	type NextFunction,
	type Request,
	type Response,
	Router,
} from "express";
import { UserController } from "./UserController";
import type { Route } from "@/server/Server";
import { UserQuerySchema, UserSchema, UserUpdateSchema } from "./User";
import { DtoMiddleware } from "@/server/middleware/DtoMiddleware";
import type { DatabaseModule } from "@/database/DatabaseModule";
import { idSchema } from "@/server/middleware/Schemas";

/**
 * 1. Pasar instancia de express por construtor.
 * 2. Crear Router y hacer un getter.
 */
export class UserRoute implements Route {
	private router: Router;
	private userController: UserController;
	private path = "/user";

	constructor(databaseModule: DatabaseModule) {
		this.router = Router();
		this.userController = new UserController(databaseModule);
		this.initializeRoutes();
	}

	private initializeRoutes() {
		// * GET /user?id=1 | /user
		this.router.get(
			"/",
			(req: Request, res: Response, next: NextFunction) =>
				DtoMiddleware.getInstance().validateQuery(
					req,
					res,
					next,
					UserQuerySchema,
				),
			this.userController.getUser.bind(this.userController),
		);

		// * POST /user
		this.router.post(
			"/",
			(req: Request, res: Response, next: NextFunction) =>
				DtoMiddleware.getInstance().validateDto(req, res, next, UserSchema),
			this.userController.createUser.bind(this.userController),
		);

		// * PATCH /user?id=1 { name: "Chrislo" }
		this.router.patch(
			"/",
			(req: Request, res: Response, next: NextFunction) =>
				DtoMiddleware.getInstance().validateQuery(req, res, next, idSchema),
			(req: Request, res: Response, next: NextFunction) =>
				DtoMiddleware.getInstance().validateDto(
					req,
					res,
					next,
					UserUpdateSchema,
				),
			this.userController.updateUser.bind(this.userController),
		);
	}

	get getRouter() {
		return this.router;
	}

	get getPath() {
		return this.path;
	}
}
