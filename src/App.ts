import { HealthCheckRoute } from "./server/health-check/HealthCheckRoute";
import { Server } from "./server/Server";

export class App {
	private server: Server;

	constructor() {
		this.server = new Server();
	}

	public setupRoutes() {
		const healthCheckRoute = new HealthCheckRoute();
		this.server.use(healthCheckRoute.getPath, healthCheckRoute.getRouter);
	}

	public start() {
		this.server.listen(3000, () =>
			console.log("Servidor iniciado en el puerto 3000"),
		);
	}
}
