import { z } from "zod";

export interface UserEntity {
	id: number;
	name: string;
	age: number;
}

export type UserDto = Partial<Omit<UserEntity, "id">>;

// Joi & Zod
export const UserSchema = z.object({
	name: z.string(),
	age: z.number(),
});
