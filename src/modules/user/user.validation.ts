import { z } from "zod";

export const createUserZodSchema = z.object({
	name: z.string().min(2).max(100),
	email: z.string().email(),
	password: z
		.string()
		.min(8, "Password should be at least 8 characters long.")
		.regex(/[a-zA-Z]/, "Include at least one letter in your password.")
		.regex(/\d/, "Don’t forget to add a number in your password.")
		.regex(/[!@#$%^&*(),.?":{}|<>]/, "Please include at least one special character like !, @, or #."),
	address: z.string().max(200).optional(),
});
