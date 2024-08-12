import type { NextFunction } from "express";
import type { HttpRequest, HttpResponse } from "../Server";

export class AuthMiddleware {
	public authenticate(req: HttpRequest, res: HttpResponse, next: NextFunction) {
		if (req.headers.authorization) {
			next();
		} else {
			res.status(401).json({ message: "Unauthorized" });
		}
	}
}
