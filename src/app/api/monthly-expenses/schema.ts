import { z } from "zod";

export const monthlyExpensesSchema = z.object({
  label: z.string().min(1, "Label must be at least 1 character long"),
  amount: z.coerce.number().min(1, "Amount must be greater than 0"),
  notes: z.string().optional(),
  installments: z.coerce.number().optional().default(0),
});
