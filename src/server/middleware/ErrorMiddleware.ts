import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "../helper/Error";

export class ErrorMiddleware {
	public handleError(
		error: Error,
		_req: Request,
		res: Response,
		_next: NextFunction,
	) {
		if (error instanceof ZodError) {
			// Tenemos la libertad de personalizar zod
			return res.status(400).json({ message: "un error de zod" });
		}

		if (!(error instanceof AppError)) {
			return res.status(500).json({
				success: false,
				statusCode: 500,
				errorCode: "INTERNAL_SERVER_ERROR",
				details: [error.message],
				timestamp: new Date().toISOString(),
			});
		}
		const appError = error as AppError;

		const errorResponse = {
			success: false,
			statusCode: appError.statusCode,
			errorCode: appError.errorCode,
			details: appError.details,
			timestamp: new Date().toISOString(),
		};
		return res.status(appError.statusCode).json(errorResponse);
	}
}
