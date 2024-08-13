import { App } from "./App";

export class Main {
	static async main() {
		console.log("entrypoint de la aplicación");

		const app = new App();
		await app.setupDatabase();
		app.setupMiddlewares(); // Global middlewares first
		app.setupRoutes();
		app.start();
	}
}
