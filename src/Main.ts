import { HealthCheckRoute } from "./server/health-check/HealthCheckRoute";
import { Server } from "./server/Server";

// Facade pattern
// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class Main {
	static async main() {
		console.log("entrypoint de la aplicación");
		const server = new Server();

		server.get("/", (_req, res) => {
			res.send("Hello World!");
		});

		const healthCheckRoute = new HealthCheckRoute();
		server.use(healthCheckRoute.getPath, healthCheckRoute.getRouter);

		server.listen(3000, () =>
			console.log("Servidor iniciado en el puerto 3000"),
		);
	}
}
