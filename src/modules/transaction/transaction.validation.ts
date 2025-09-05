import z from "zod";

export const TopUpZodSchema = z.object({
	amount: z.number().min(10, "Top up amount must be at least 10"),
});
