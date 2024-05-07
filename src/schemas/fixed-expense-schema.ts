import { z } from "zod";

const createSchema = (messages?: { label?: string; amount?: string }) => {
  const {
    label = "Label must be at least 1 character long",
    amount = "Amount must be greater than 0",
  } = messages || {};

  return z.object({
    label: z.string().min(1, label),
    amount: z.coerce.number().min(1, amount),
    tags: z
      .string()
      .optional()
      .or(
        z.array(
          z.object({
            value: z.string(),
            label: z.string(),
          })
        )
      )
      .optional(),
    notes: z.string().optional(),
  });
};

export const fixedExpenseSchema = createSchema();
export const getFixedExpenseSchema = createSchema;
