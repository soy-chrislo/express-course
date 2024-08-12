export class AppError extends Error {
	public statusCode: number;
	public errorCode: string;
	public details: Array<unknown>;
	constructor(
		message: string,
		statusCode: number,
		errorCode: string,
		details: Array<unknown>,
	) {
		super(message);
		this.statusCode = statusCode;
		this.errorCode = errorCode;
		this.details = details;
	}
}

export class ResourceNotFoundError extends AppError {
	constructor(details: Array<unknown>) {
		super("Resource not found", 404, "RESOURCE_NOT_FOUND", details);
	}
}
