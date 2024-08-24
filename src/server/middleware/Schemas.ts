import { z } from "zod";

export const idSchema = z.object({
	id: z
		.string()
		.regex(/^\d+$/)
		.transform((value) => Number.parseInt(value, 10)),
});
