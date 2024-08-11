import type { Request, Response } from "express";
import { HealthCheckService } from "./HealthCheckService";

export class HealthCheckController {
	private healthCheckService: HealthCheckService;

	constructor() {
		this.healthCheckService = new HealthCheckService();
	}

	public getStatus(_req: Request, res: Response) {
		const status = this.healthCheckService.getStatus();
		res.json(status);
	}
}
