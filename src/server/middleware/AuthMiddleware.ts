import type { NextFunction, Request, Response } from "express";

export class AuthMiddleware {
	public authenticate(req: Request, res: Response, next: NextFunction) {
		if (req.headers.authorization) {
			next();
		} else {
			res.status(401).json({ message: "Unauthorized" });
		}
	}
}
