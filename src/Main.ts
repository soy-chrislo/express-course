import { Server } from "./server/Server";

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class Main {
	static async main() {
		console.log("entrypoint de la aplicación");
		const server = new Server();

		server.get("/", (req, res) => {
			res.send("Hello World!");
		});
		server.listen(3000, () =>
			console.log("Servidor iniciado en el puerto 3000"),
		);
	}
}
