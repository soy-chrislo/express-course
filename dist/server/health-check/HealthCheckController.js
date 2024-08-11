import { HealthCheckService } from "./HealthCheckService.js";
export class HealthCheckController {
    healthCheckService;
    constructor() {
        this.healthCheckService = new HealthCheckService();
    }
    getStatus(_req, res) {
        const status = this.healthCheckService.getStatus();
        res.json(status);
    }
}
