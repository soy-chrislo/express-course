import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";

/**
 * 1. Singleton.
 * 2. Clase normal, se instancia y ejecuta el método.
 * 3. Método estático.
 */
export class DtoMiddleware {
	private static instance: DtoMiddleware;

	private constructor() {}

	public static getInstance() {
		if (!DtoMiddleware.instance) {
			DtoMiddleware.instance = new DtoMiddleware();
		}
		return DtoMiddleware.instance;
	}

	public validateDto(
		req: Request,
		_res: Response,
		next: NextFunction,
		schema: ZodSchema<unknown>,
	) {
		try {
			const { body } = req;
			schema.parse(body);
			next();
		} catch (error) {
			next(error);
		}
	}
}
