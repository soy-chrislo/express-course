import { AppError, ResourceNotFoundError } from "@/server/helper/Error";
import type { HttpRequest, HttpResponse } from "@/server/Server";
import type { NextFunction } from "express";

export class UserController {
	public getUser(_req: HttpRequest, _res: HttpResponse, next: NextFunction) {
		try {
			return _res.json({ name: "John Doe" });
		} catch (error) {
			next(error);
		}
	}
	public createUser(req: HttpRequest, res: HttpResponse) {
		const { body } = req;
		res.json(body);
	}
}
