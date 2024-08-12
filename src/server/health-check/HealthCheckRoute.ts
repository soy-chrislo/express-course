import { Router } from "express";
import { HealthCheckController } from "./HealthCheckController";
import type { Route } from "../Server";
import { AuthMiddleware } from "../middleware/AuthMiddleware";

/**
 * 1. Pasar instancia de express por construtor.
 * 2. Crear Router y hacer un getter.
 */
export class HealthCheckRoute implements Route {
	private router: Router;
	private healthCheckController: HealthCheckController;
	private path = "/health-check";

	constructor() {
		this.router = Router();
		this.healthCheckController = new HealthCheckController();
		this.initializeRoutes();
	}

	private initializeRoutes() {
		this.router.get(
			"/",
			new AuthMiddleware().authenticate,
			// (req: Request, res: Response, next: NextFunction) => {
			// 	new AuthMiddleware().authenticate(
			// 		Adapter.adaptRequest(req),
			// 		Adapter.adaptResponse(res),
			// 		next,
			// 	);
			// },
			this.healthCheckController.getStatus.bind(this.healthCheckController),
			// (req: Request, res: Response) => {
			// 	this.healthCheckController.getStatus(
			// 		Adapter.adaptRequest(req),
			// 		Adapter.adaptResponse(res),
			// 	);
			// },
		);
	}

	get getRouter() {
		return this.router;
	}

	get getPath() {
		return this.path;
	}
}
