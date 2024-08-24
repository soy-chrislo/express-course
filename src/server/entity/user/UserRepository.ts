import type { Repository } from "@/database/Repository";
import { UserDomain, type UserDto } from "./User";
import type { DatabaseModule } from "@/database/DatabaseModule";
import type { QueryResult } from "pg";

export class UserRepository implements Repository<UserDto, UserDomain> {
	constructor(private dbModule: DatabaseModule) {}

	async create(userDto: UserDto): Promise<UserDomain> {
		try {
			const { name, age } = userDto;

			const query = `
				INSERT INTO users (name, age)
				VALUES ($1, $2)
				RETURNING id, name, age
			`;

			const values = [name ?? "not defined", age ?? 0];

			const result = (await this.dbModule.query(query, values)) as QueryResult;

			if (result.rows.length === 0) throw new Error("Failed to create user");

			return new UserDomain(
				result.rows[0].id,
				result.rows[0].name,
				result.rows[0].age,
			);
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

		const query = `
			UPDATE users
			SET ${fields.join(", ")}
			WHERE id = $${dto.id}
			RETURNING id, name, age
		`;

		const result = (await this.dbModule.query(query, values)) as QueryResult;

		if (result.rows.length === 0) throw new Error("Failed to update user");

		return new UserDomain(
			result.rows[0].id,
			result.rows[0].name,
			result.rows[0].age,
		);
	}

	async delete(id: string): Promise<void> {
		throw new Error("Method not implemented.");
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

		const result = (await this.dbModule.query(query, values)) as QueryResult;
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

		const result = (await this.dbModule.query(query, values)) as QueryResult;
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

		const result = (await this.dbModule.query(query, [])) as QueryResult;
		return result.rows.map((row) => new UserDomain(row.id, row.name, row.age));
	}
}
