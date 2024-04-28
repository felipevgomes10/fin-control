import { z } from "zod";

export const fixedExpensesSchema = z.object({
  label: z.string().min(1, "Label must be at least 1 character long"),
  amount: z.coerce.number().min(1, "Amount must be greater than 0"),
  notes: z.string().optional(),
});
