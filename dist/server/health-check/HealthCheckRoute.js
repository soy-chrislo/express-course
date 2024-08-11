import { Router } from "express";
import { HealthCheckController } from "./HealthCheckController.js";
export class HealthCheckRoute {
    router;
    healthCheckController;
    path = "/health-check";
    constructor() {
        this.router = Router();
        this.healthCheckController = new HealthCheckController();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get("/", (req, res) => {
            const adaptedReq = {
                body: req.body,
                params: req.params,
                query: req.query,
            };
            const adaptedRes = {
                json: (body) => res.json(body),
            };
            this.healthCheckController.getStatus(adaptedReq, adaptedRes);
        });
    }
    get getRouter() {
        return this.router;
    }
    get getPath() {
        return this.path;
    }
}
