import type { Request, Response } from "express";
import type { HttpRequest, HttpResponse } from "../Server";

export class Adapter {
	public static adaptRequest(req: Request): HttpRequest {
		return {
			body: req.body,
			params: req.params,
			query: req.query,
			headers: { ...req.headers },
		};
	}

	public static adaptResponse(res: Response): HttpResponse {
		return {
			json: (body: Record<string, unknown>) => res.json(body),
			status: (code: number) => res.status(code),
		};
	}
}
