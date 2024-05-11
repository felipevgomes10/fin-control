import type { FixedExpense, Tag } from "@prisma/client";

export type CachedFixedExpenses = Omit<
  FixedExpense,
  "createdAt" | "updatedAt"
> & {
  createdAt: string;
  updatedAt: string;
  tags: (Omit<Tag, "createdAt" | "updatedAt"> & {
    createdAt: string;
    updatedAt: string;
  })[];
};
