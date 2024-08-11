import { HealthCheckService } from "./HealthCheckService";
import type { HttpRequest, HttpResponse } from "../Server";

export class HealthCheckController {
	private healthCheckService: HealthCheckService;

	constructor() {
		this.healthCheckService = new HealthCheckService();
	}

	public getStatus(_req: HttpRequest, res: HttpResponse) {
		const status = this.healthCheckService.getStatus();
		res.json(status);
	}
}
