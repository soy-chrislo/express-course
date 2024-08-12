import type { HttpRequest, HttpResponse } from "@/server/Server";

export class UserController {
	public getUser(_req: HttpRequest, res: HttpResponse) {
		res.json({ message: "User" });
	}

	public createUser(req: HttpRequest, res: HttpResponse) {
		const { body } = req;
		res.json(body);
	}
}
