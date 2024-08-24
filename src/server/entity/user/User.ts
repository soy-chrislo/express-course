import { z } from "zod";

export class UserDomain {
	id: number;
	name: string;
	age: number;

	constructor(id: number, name: string, age: number) {
		this.id = id;
		this.name = name;
		this.age = age;
	}
}

// export type UserDto = Partial<Omit<UserDomain, "id">>;
export type UserDto = Partial<UserDomain>;

// Joi & Zod
export const UserSchema = z.object({
	name: z.string(),
	age: z.number(),
});

// En query, todo es string.
export const UserQuerySchema = z.object({
	id: z
		.string()
		.regex(/^\d+$/)
		.transform((value) => Number.parseInt(value, 10))
		.optional(),
	name: z.string().optional(),
	age: z.string().optional(),
	mode: z.enum(["find", "findOne"]).default("find"),
});

export const UserUpdateSchema = z.object({
	name: z.string().optional(),
	age: z.number().optional(),
});
