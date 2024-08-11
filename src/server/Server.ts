import express, {
	type Request,
	type Response,
	type Application,
	type Router,
} from "express";

export class Server {
	private app: Application;

	constructor() {
		this.app = express();
	}

	public listen(port: number, callback: () => void) {
		this.app.listen(port, callback);
	}

	public get(path: string, callback: (req: Request, res: Response) => void) {
		this.app.get(path, callback);
	}

	public use(path: string, router: Router) {
		this.app.use(path, router);
	}
}
