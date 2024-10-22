import type { DatabaseActions } from "./database/DatabaseActions";
import { DatabaseModule } from "./database/DatabaseModule";
import { PostgresDriver } from "./database/PostgresDriver";
import type { RepositoryProvider } from "./database/Repository";
import { PostgresProvider } from "./database/provider/PostgresProvider";
import { type Route, Server } from "./server/Server";
import { UserRoute } from "./server/entity/user/UserRoute";
import { PostgresUserRepository } from "./server/entity/user/repository/PostgresUserRepository";
import { HealthCheckRoute } from "./server/health-check/HealthCheckRoute";
import { UsageMiddleware } from "./server/middleware/UsageMiddleware";
import { Environment } from "./variables/Environment";

export class App {
	private server: Server;
	private databaseDriver: DatabaseActions;
	private databaseModule: DatabaseModule;
	private repositoryProvider: RepositoryProvider;

	constructor() {
		this.server = new Server();
		this.databaseDriver = new PostgresDriver();
		this.repositoryProvider = new PostgresProvider(
			// Como argumento a repository databaseDriver vs databaseModule.
			new PostgresUserRepository(this.databaseDriver),
		);
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
			new UserRoute(this.repositoryProvider),
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
