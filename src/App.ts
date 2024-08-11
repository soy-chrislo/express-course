import { HealthCheckRoute } from "./server/health-check/HealthCheckRoute";
import { type Route, Server } from "./server/Server";

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
		this.server.listen(3000, () =>
			console.log("Servidor iniciado en el puerto 3000"),
		);
	}
}
