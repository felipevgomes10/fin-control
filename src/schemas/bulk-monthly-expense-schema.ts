import { z } from "zod";

const createSchema = (messages?: { label?: string; amount?: string }) => {
  const {
    label = "Label must be at least 1 character long",
    amount = "Amount must be greater than 0",
  } = messages || {};

  return z.array(
    z.object({
      label: z.string().min(1, label),
      tags: z.array(z.string().cuid()).optional(),
      amount: z.coerce.number().min(1, amount),
      notes: z.string().optional(),
      installments: z.coerce.number().optional().default(1),
    })
  );
};

export const bulkMonthlyExpensesSchema = createSchema();
export const getBulkMonthlyExpensesSchema = createSchema;
