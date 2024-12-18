import express, {
	type Request,
	type Response,
	type Application,
	type Router,
	type RequestHandler,
	type NextFunction,
} from "express";
import { ErrorMiddleware } from "./middleware/ErrorMiddleware";

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

	public use(handler: Router | RequestHandler, path?: string) {
		if (path) {
			this.app.use(path, handler);
		} else {
			this.app.use(handler);
		}
	}

	public setupMiddlewares() {
		this.app.use(express.json());
		// this.app.use(new ErrorMiddleware().handleError);
		setTimeout(() => {
			this.app.use(
				(error: Error, req: Request, res: Response, next: NextFunction) =>
					new ErrorMiddleware().handleError(error, req, res, next),
			);
		}, 0);
	}
}

export interface HttpRequest {
	body: Record<string, unknown>;
	params: Record<string, unknown>;
	query: Record<string, unknown>;
	headers: Record<string, unknown>;
}

export type HttpResponse = {
	json: (body: Record<string, unknown>) => HttpResponse;
	status: (code: number) => HttpResponse;
};

export interface Route {
	getPath: string;
	getRouter: Router;
}
