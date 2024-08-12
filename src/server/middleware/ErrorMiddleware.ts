import type { NextFunction, Request, Response } from "express";
import { AppError } from "../helper/Error";

export class ErrorMiddleware {
	public handleError(
		error: Error,
		_req: Request,
		res: Response,
		_next: NextFunction,
	) {
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
