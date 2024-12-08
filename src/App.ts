import type { DatabaseActions } from "./database/DatabaseActions";
import { DatabaseModule } from "./database/DatabaseModule";
import { PostgresDriver } from "./database/PostgresDriver";
import type { RepositoryProvider } from "./database/Repository";
import { SqliteDriver } from "./database/SqliteDriver";
import { PostgresProvider } from "./database/provider/PostgresProvider";
import { type Route, Server } from "./server/Server";
import { UserRoute } from "./server/entity/user/UserRoute";
import { PostgresUserRepository } from "./server/entity/user/repository/PostgresUserRepository";
import { HealthCheckRoute } from "./server/health-check/HealthCheckRoute";
import { UsageMiddleware } from "./server/middleware/UsageMiddleware";
import { Environment } from "./variables/Environment";

/**
 * Clase que representa de la aplicación principal del servidor.
 * Se encarga de inicializar el servidor, la base de datos,
 * configurar rutas, middlewares y arrancar el servidor.
 */

/**
 * Constructor de la clase App.
 * Inicializa el servidor, el controlador de base de datos,
 * el proveedor de repositorios y el módulo de base de datos.
 */

/**
 * Inicializa y configura la base de datos.
 * Establece la conexión y prepara la base de datos para su uso.
 * @returns Una promesa que se resuelve cuando la base de datos está lista.
 */

/**
 * Configura las rutas del servidor.
 * Registra las rutas de verificación de estado y de usuario.
 */

/**
 * Configura los middlewares del servidor.
 * Agrega los middlewares necesarios para el funcionamiento de la aplicación.
 */

/**
 * Inicia el servidor.
 * Comienza a escuchar peticiones en el puerto especificado.
 */
export class App {
	private server: Server;
	private databaseDriver: DatabaseActions;
	private databaseModule: DatabaseModule;
	private repositoryProvider: RepositoryProvider;

	constructor() {
		this.server = new Server();
		// this.databaseDriver = new PostgresDriver();
		this.databaseDriver = new SqliteDriver();
		this.repositoryProvider = new PostgresProvider(
			new PostgresUserRepository(this.databaseDriver),
		);
		this.databaseModule = new DatabaseModule(this.databaseDriver);
	}

	/**
	 * Configura la base de datos conectándose a ella y realizando las operaciones de configuración necesarias.
	 * Este método es asíncrono y esperará a que la conexión y la configuración se completen.
	 *
	 * @returns Una promesa que se resuelve cuando la configuración de la base de datos está completa.
	 */
	public async setupDatabase() {
		await this.databaseModule.connect();
		await this.databaseModule.setup();
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
