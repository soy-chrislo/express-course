import type { HttpRequest, HttpResponse } from "@/server/Server";
import type { NextFunction } from "express";
import { UserService } from "./UserService";
import type { DatabaseModule } from "@/database/DatabaseModule";
import type { UserDto } from "./User";

export class UserController {
	private userService: UserService;

	constructor(databaseModule: DatabaseModule) {
		this.userService = new UserService(databaseModule);
	}

	public getUser(_req: HttpRequest, _res: HttpResponse, next: NextFunction) {
		try {
			return _res.json({ name: "John Doe" });
		} catch (error) {
			return next(error);
		}
	}
	public async createUser(req: HttpRequest, res: HttpResponse) {
		const { body } = req as { body: UserDto };
		const user: UserDto = {
			name: body.name,
			age: body.age,
		};
		const result = await this.userService.createUser(user);
		res.json({ user: result });
	}
}
