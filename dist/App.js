import { Environment } from "./env/Environment.js";
import { HealthCheckRoute } from "./server/health-check/HealthCheckRoute.js";
import { Server } from "./server/Server.js";
export class App {
    server;
    constructor() {
        this.server = new Server();
    }
    setupRoutes() {
        const routes = [new HealthCheckRoute()];
        for (const route of routes) {
            console.log(`Registrando ruta ${route.getPath}`);
            this.server.use(route.getPath, route.getRouter);
        }
    }
    start() {
        const port = Environment.getInstance().getPort;
        this.server.listen(port, () => console.log("Servidor iniciado en el puerto ", port));
    }
}
