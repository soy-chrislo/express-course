import { z } from "zod";

export class UserDomain {
	id: string;
	name: string;
	age: number;

	constructor(id: string, name: string, age: number) {
		this.id = id;
		this.name = name;
		this.age = age;
	}

	getUserCredentials() {
		throw new Error("Not implemented yet")
	}
}

// export type UserDto = Partial<Omit<UserDomain, "id">>;
export type UserDto = Partial<Omit<UserDomain, "getUserCredentials">>;

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
		.uuid()
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
