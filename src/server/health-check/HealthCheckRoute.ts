import { type Request, type Response, Router } from "express";
import { HealthCheckController } from "./HealthCheckController.js";
import type { HttpRequest, HttpResponse, Route } from "../Server";

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
			(req: Request, res: Response) => {
				const adaptedReq: HttpRequest = {
					body: req.body,
					params: req.params,
					query: req.query,
				};
				const adaptedRes: HttpResponse = {
					json: (body) => res.json(body),
				};

				this.healthCheckController.getStatus(adaptedReq, adaptedRes);
			},
			// this.healthCheckController.getStatus.bind(this.healthCheckController),
		);
	}

	get getRouter() {
		return this.router;
	}

	get getPath() {
		return this.path;
	}
}
