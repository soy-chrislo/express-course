import type { DatabaseActions } from "@/database/DatabaseActions";
import { PostgresDriver } from "@/database/PostgresDriver";
import type { Repository } from "@/database/Repository";
import { EntityNotFoundError } from "@/server/helper/Error";
import type { QueryResult } from "pg";
import { UserDomain, type UserDto } from "../User";

export class PostgresUserRepository implements Repository<UserDto, UserDomain> {
	private postgresDriver: PostgresDriver;

	constructor(databaseDriver: DatabaseActions) {
		if (!(databaseDriver instanceof PostgresDriver)) {
			throw new Error(
				`Invalid database driver, expected PostgresDriver, received: ${typeof databaseDriver}`,
			);
		}

		this.postgresDriver = databaseDriver;
	}

	async create(userDto: UserDto): Promise<UserDomain> {
		try {
			const { name, age } = userDto;

			const query = `
				INSERT INTO users (name, age)
				VALUES ($1, $2)
				RETURNING id, name, age
			`;

			const values = [name ?? "not defined", age ?? 0];

			const result = (await this.postgresDriver.query(
				query,
				values,
			)) as QueryResult;

			if (result.rows.length === 0) throw new Error("Failed to create user");

			const user = result.rows[0];
			return new UserDomain(user.id, user.name, user.age);
		} catch (error) {
			console.log(error);
			throw error;
		}
	}

	async update(dto: UserDto): Promise<UserDomain> {
		const fields: string[] = [];
		const values: unknown[] = [];
		let index = 1;

		if (dto.id === undefined) throw new Error("No id provided");

		for (const [key, value] of Object.entries(dto)) {
			if (key === "id" || value === undefined) continue;
			fields.push(`${key} = $${index}`);
			values.push(value);
			index++;
		}

		if (fields.length === 0) throw new Error("No fields to update");

		const selectQuery = `
			SELECT id, name, age
			FROM users
			WHERE id = $1;
		`;

		const selectResult = (await this.postgresDriver.query(selectQuery, [
			dto.id,
		])) as QueryResult;

		if (selectResult.rows.length === 0) {
			throw new EntityNotFoundError(["User", dto.id]);
		}

		const query = `
			UPDATE users
			SET ${fields.join(", ")}
			WHERE id = $${dto.id}
			RETURNING id, name, age
		`;

		const result = (await this.postgresDriver.query(
			query,
			values,
		)) as QueryResult;

		// * OLD -> if (result.rows.length === 0) throw new Error("Failed to update user");
		if (result.rows.length === 0) {
			throw new Error(`Failed to update user with id ${dto.id}`);
		}

		return new UserDomain(
			result.rows[0].id,
			result.rows[0].name,
			result.rows[0].age,
		);
	}

	async delete(id: number): Promise<UserDomain> {
		const result = (await this.postgresDriver.query(
			"SELECT * FROM users WHERE id = $1",
			[id],
		)) as QueryResult;
		const user = result.rows;
		if (user.length === 0) {
			throw new Error(`User with id ${id} not found`);
		}
		await this.postgresDriver.query("DELETE FROM users WHERE id = $1", [id]);
		return user[0];
	}

	async find(
		properties: Record<string, unknown>,
		relations: string[] = [],
	): Promise<UserDomain[]> {
		const keys = Object.keys(properties);
		const values = Object.values(properties);

		if (keys.length === 0) throw new Error("No properties provided");

		const whereClauses = keys
			.map((key, index) => `${key} = $${index + 1}`)
			.join(" AND ");

		const query = `
			SELECT id, name, age
			FROM users
			WHERE ${whereClauses};
		`;

		const result = (await this.postgresDriver.query(
			query,
			values,
		)) as QueryResult;
		if (result.rows.length === 0) return [];

		return result.rows.map((row) => new UserDomain(row.id, row.name, row.age));
	}

	async findOne(
		properties: Record<string, unknown>,
		relations?: string[],
	): Promise<UserDomain | null> {
		const keys = Object.keys(properties);
		const values = Object.values(properties);

		if (keys.length === 0) throw new Error("No properties provided");

		const whereClauses = keys
			.map((key, index) => `${key} = $${index + 1}`)
			.join(" AND ");

		const query = `
			SELECT id, name, age
			FROM users
			WHERE ${whereClauses}
			LIMIT 1;
		`;

		const result = (await this.postgresDriver.query(
			query,
			values,
		)) as QueryResult;
		if (result.rows.length === 0) return null;

		return new UserDomain(
			result.rows[0].id,
			result.rows[0].name,
			result.rows[0].age,
		);
	}

	async findAll(): Promise<UserDomain[]> {
		const query = `
			SELECT id, name, age
			FROM users;
		`;

		const result = (await this.postgresDriver.query(query, [])) as QueryResult;
		return result.rows.map((row) => new UserDomain(row.id, row.name, row.age));
	}
}
