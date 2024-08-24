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

	public async getUser(
		req: HttpRequest,
		res: HttpResponse,
		next: NextFunction,
	) {
		try {
			/**
			 * If there is no query, get all users.
			 * BAD: !req.query
			 * BAD: req.query = {}
			 */
			if (Object.keys(req.query).length === 0) {
				const allUsers = await this.userService.getAllUsers();
				return res.json({ users: allUsers });
			}

			const { mode, ...dto } = req.query as UserDto & {
				mode: "find" | "findOne";
			};

			const queryMode = mode === undefined ? "find" : mode;

			if (queryMode === "find") {
				const users = await this.userService.getAllUsers({ ...dto });
				return res.json({ users });
			}

			const user = await this.userService.getUser({ ...dto });
			return res.json(user ? { user } : { message: "User not found" });
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

	public async updateUser(req: HttpRequest, res: HttpResponse) {
		const { id } = req.query;
		const { body } = req as { body: UserDto };
		const user: UserDto = {
			id: Number(id),
			name: body.name,
			age: body.age,
		};
		const result = await this.userService.updateUser(user);
		res.json({ user: result });
	}
}
