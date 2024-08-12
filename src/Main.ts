import { App } from "./App";

// Facade pattern
// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class Main {
	static async main() {
		console.log("entrypoint de la aplicación");

		const app = new App();
		app.setupMiddlewares(); // Global middlewares first
		app.setupRoutes();
		app.start();
	}
}
