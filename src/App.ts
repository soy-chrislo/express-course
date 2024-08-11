import { Environment } from "./variables/Environment.js";
import { HealthCheckRoute } from "./server/health-check/HealthCheckRoute.js";
import { type Route, Server } from "./server/Server.js";

export class App {
	private server: Server;

	constructor() {
		this.server = new Server();
	}

	public setupRoutes() {
		const routes: Route[] = [new HealthCheckRoute()];

		for (const route of routes) {
			console.log(`Registrando ruta ${route.getPath}`);
			this.server.use(route.getPath, route.getRouter);
		}
	}

	public start() {
		const port = Environment.getInstance().getPort;
		this.server.listen(port, () =>
			console.log("Servidor iniciado en el puerto ", port),
		);
	}
}
