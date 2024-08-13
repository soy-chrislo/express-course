import { Environment } from "./variables/Environment";
import { HealthCheckRoute } from "./server/health-check/HealthCheckRoute";
import { type Route, Server } from "./server/Server";
import { UsageMiddleware } from "./server/middleware/UsageMiddleware";
import { UserRoute } from "./server/entity/user/UserRoute";
import { DatabaseModule } from "./database/DatabaseModule";
import type { DatabaseDriver } from "./database/Database";
import { PostgresDriver } from "./database/PostgresDriver";

export class App {
	private server: Server;
	private databaseDriver: DatabaseDriver;
	private databaseModule: DatabaseModule;

	constructor() {
		this.server = new Server();
		this.databaseDriver = new PostgresDriver();
		this.databaseModule = new DatabaseModule(this.databaseDriver);
	}

	public async setupDatabase() {
		await this.databaseModule.connect();
		await this.databaseModule.query(
			`
			CREATE TABLE IF NOT EXISTS users (
				id SERIAL PRIMARY KEY,
				name VARCHAR(255) NOT NULL,
				age INTEGER NOT NULL
			);
			`,
			[],
		);
	}

	public setupRoutes() {
		const routes: Route[] = [
			new HealthCheckRoute(),
			new UserRoute(this.databaseModule),
		];

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
