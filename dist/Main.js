import { App } from "./App.js";
export class Main {
    static async main() {
        console.log("entrypoint de la aplicación");
        const app = new App();
        app.setupRoutes();
        app.start();
    }
}
