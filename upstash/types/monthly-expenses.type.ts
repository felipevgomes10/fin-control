import type { MonthlyExpense, Tag } from "@prisma/client";

export type CachedMonthlyExpenses = Omit<
  MonthlyExpense,
  "createdAt" | "updatedAt"
> & {
  createdAt: string;
  updatedAt: string;
  tags: (Omit<Tag, "createdAt" | "updatedAt"> & {
    createdAt: string;
    updatedAt: string;
  })[];
};
