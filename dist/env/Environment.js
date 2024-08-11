import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
export class Environment {
    static instance;
    variables = ["PORT"];
    files = [
        ["production", "prod.env"],
        ["development", "dev.env"],
        ["test", "test.env"],
    ];
    port;
    constructor() {
        this.checkVariables();
        this.port = Number.parseInt(process.env.PORT);
    }
    static getInstance() {
        if (!Environment.instance) {
            Environment.instance = new Environment();
        }
        return Environment.instance;
    }
    checkVariables() {
        const NODE_ENV = process.env.NODE_ENV;
        if (NODE_ENV === undefined) {
            const contexts = this.files.map((file) => file[0]).join(", ");
            throw new Error(`No se ha definido el entorno de ejecución, entornos disponibles: ${contexts}`);
        }
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const contextFolder = path.join(__dirname, "context");
        const envFile = this.files.find((file) => file[0] === NODE_ENV);
        if (envFile === undefined) {
            throw new Error(`No se ha encontrado el archivo de configuración para el entorno 
				${NODE_ENV}`);
        }
        const envFilePath = path.join(contextFolder, envFile[1]);
        dotenv.config({ path: envFilePath });
        const missingKeys = this.variables.filter((key) => !process.env[key]);
        if (missingKeys.length > 0) {
            throw new Error(`Faltan las siguientes variables de entorno: ${missingKeys.join(", ")}`);
        }
    }
    get getPort() {
        return this.port;
    }
}
