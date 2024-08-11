import { App } from "./App.js";

// Facade pattern
// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class Main {
	static async main() {
		console.log("entrypoint de la aplicación");

		const app = new App();
		app.setupRoutes();
		app.start();
	}
}
