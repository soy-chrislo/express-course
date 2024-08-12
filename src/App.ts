import { Environment } from "./variables/Environment";
import { HealthCheckRoute } from "./server/health-check/HealthCheckRoute";
import { type Route, Server } from "./server/Server";
import { UsageMiddleware } from "./server/middleware/UsageMiddleware";
import { UserRoute } from "./server/entity/user/UserRoute";

export class App {
	private server: Server;

	constructor() {
		this.server = new Server();
	}

	public setupRoutes() {
		const routes: Route[] = [new HealthCheckRoute(), new UserRoute()];

		for (const route of routes) {
			console.log(`Registrando ruta ${route.getPath}`);
			this.server.use(route.getRouter, route.getPath);
		}
	}

	public setupMiddlewares() {
		const usageMiddleware = new UsageMiddleware();
		// this.server.use(express.json());
		this.server.setupMiddlewares();
		this.server.use(usageMiddleware.reportUsage);
	}

	public start() {
		const port = Environment.getInstance().getPort;
		this.server.listen(port, () =>
			console.log("Servidor iniciado en el puerto ", port),
		);
	}
}
