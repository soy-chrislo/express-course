import type { RepositoryProvider } from "@/database/Repository";
import type { HttpRequest, HttpResponse } from "@/server/Server";
import type { NextFunction } from "express";
import type { UserDto } from "./User";
import { UserService } from "./UserService";

export class UserController {
	private userService: UserService;

	constructor(repositoryProvider: RepositoryProvider) {
		this.userService = new UserService(repositoryProvider);
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
			...body,
		};
		const result = await this.userService.createUser(user);
		res.json({ user: result });
	}

	public async updateUser(
		req: HttpRequest,
		res: HttpResponse,
		next: NextFunction,
	) {
		const { id } = req.query;
		const { body } = req as { body: UserDto };
		const user: UserDto = {
			id: id,
			name: body.name,
			age: body.age,
		};

		try {
			const result = await this.userService.updateUser(user);
			res.json({ user: result });
		} catch (error) {
			return next(error);
		}
	}

	public async deleteUser(req: HttpRequest, res: HttpResponse) {
		const { id } = req.query;
		const result = await this.userService.deleteUser({ id: id });
		res.json({ user: result });
	}
}
