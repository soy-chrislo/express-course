import { z } from "zod";

export class UserDomain {
	id: number;
	name: string;
	age: number;
	password: string;

	constructor(id: number, name: string, age: number, password: string) {
		this.id = id;
		this.name = name;
		this.age = age;
		this.password = password;
	}
}

// export type UserDto = Partial<Omit<UserDomain, "id">>;
export type UserDto = Partial<UserDomain>;

// POST
export const UserSchema = z.object({
	name: z.string(),
	age: z.number(),
	password: z.string(),
});

// En query, todo es string.
// GET
/*
	GET - /users?id=123&name=Chrislo
*/

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

// PATCH
export const UserUpdateSchema = z.object({
	name: z.string().optional(),
	age: z.number().optional(),
	password: z.string().optional(),
});
