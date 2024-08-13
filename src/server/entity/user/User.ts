import { z } from "zod";

export class UserEntity {
	id: number;
	name: string;
	age: number;

	constructor(id: number, name: string, age: number) {
		this.id = id;
		this.name = name;
		this.age = age;
	}
}

export type UserDto = Partial<Omit<UserEntity, "id">>;

// Joi & Zod
export const UserSchema = z.object({
	name: z.string(),
	age: z.number(),
});
