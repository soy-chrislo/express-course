import type { Repository } from "@/database/Repository";
import type { UserDto, UserEntity } from "./User";
import type { DatabaseModule } from "@/database/DatabaseModule";

export class UserRepository implements Repository<UserEntity> {
	constructor(private dbModule: DatabaseModule) {}

	async create(userDto: UserDto): Promise<UserEntity> {
		try {
			const { name, age } = userDto;

			const query = `
				INSERT INTO users (name, age)
				VALUES ($1, $2)
				RETURNING id, name, age
			`;

			const values = [name ?? "not defined", age ?? 0];

			const result = (await this.dbModule.query(query, values)) as {
				rows: UserEntity[] | [];
			};
			if (result.rows.length === 0) throw new Error("Failed to create user");
			return {
				id: result.rows[0].id,
				name: result.rows[0].name,
				age: result.rows[0].age,
			};
		} catch (error) {
			console.log(error);
			throw error;
		}
	}
	async update(userDto: UserDto): Promise<UserEntity> {
		throw new Error("Method not implemented.");
	}
	async delete(id: string): Promise<void> {
		throw new Error("Method not implemented.");
	}
	async find(
		properties: Record<string, unknown>,
		relations: string[] = [],
	): Promise<UserEntity> {
		throw new Error("Method not implemented.");
	}
	async findAll(): Promise<UserEntity[]> {
		throw new Error("Method not implemented.");
	}
}
