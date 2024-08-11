import { Router } from "express";
import { HealthCheckController } from "./HealthCheckController";

/**
 * 1. Pasar instancia de express por construtor.
 * 2. Crear Router y hacer un getter.
 */
export class HealthCheckRoute {
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
			// (req, res) => this.healthCheckController.getStatus(req, res),
			this.healthCheckController.getStatus.bind(this.healthCheckController),
		);
	}

	get getRouter() {
		return this.router;
	}

	get getPath() {
		return this.path;
	}
}
