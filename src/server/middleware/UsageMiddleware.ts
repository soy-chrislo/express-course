import type { NextFunction, Request, Response } from "express";

export class UsageMiddleware {
	public reportUsage(req: Request, _res: Response, next: NextFunction) {
		console.log("Request received:", req.method, req.path);
		next();
	}
}
