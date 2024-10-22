import type { DatabaseModule } from "@/database/DatabaseModule";
import type { RepositoryProvider } from "@/database/Repository";
import type { Route } from "@/server/Server";
import { DtoMiddleware } from "@/server/middleware/DtoMiddleware";
import { idSchema } from "@/server/middleware/Schemas";
import {
	type NextFunction,
	type Request,
	type Response,
	Router,
} from "express";
import { UserQuerySchema, UserSchema, UserUpdateSchema } from "./User";
import { UserController } from "./UserController";

/**
 * 1. Pasar instancia de express por construtor.
 * 2. Crear Router y hacer un getter.
 */
export class UserRoute implements Route {
	private router: Router;
	private userController: UserController;
	private path = "/user";

	constructor(repositoryProvider: RepositoryProvider) {
		this.router = Router();
		this.userController = new UserController(repositoryProvider);
		this.initializeRoutes();
	}

	private initializeRoutes() {
		// * GET /user?id=1 | /user
		// TODO: Agregar filtro (ya) y paginación (pendiente).
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

		// * DELETE /user?id=1
		this.router.delete(
			"/",
			(req: Request, res: Response, next: NextFunction) =>
				DtoMiddleware.getInstance().validateQuery(req, res, next, idSchema),
			this.userController.deleteUser.bind(this.userController),
		);
	}

	get getRouter() {
		return this.router;
	}

	get getPath() {
		return this.path;
	}
}
