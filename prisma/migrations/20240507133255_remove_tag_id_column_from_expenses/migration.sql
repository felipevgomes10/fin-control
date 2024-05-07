/*
  Warnings:

  - You are about to drop the column `tagId` on the `FixedExpense` table. All the data in the column will be lost.
  - You are about to drop the column `tagId` on the `MonthlyExpense` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_FixedExpense" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "label" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "notes" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "FixedExpense_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_FixedExpense" ("amount", "createdAt", "id", "label", "notes", "updatedAt", "userId") SELECT "amount", "createdAt", "id", "label", "notes", "updatedAt", "userId" FROM "FixedExpense";
DROP TABLE "FixedExpense";
ALTER TABLE "new_FixedExpense" RENAME TO "FixedExpense";
CREATE TABLE "new_MonthlyExpense" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "label" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "notes" TEXT,
    "userId" TEXT NOT NULL,
    "installments" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "MonthlyExpense_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_MonthlyExpense" ("amount", "createdAt", "id", "installments", "label", "notes", "updatedAt", "userId") SELECT "amount", "createdAt", "id", "installments", "label", "notes", "updatedAt", "userId" FROM "MonthlyExpense";
DROP TABLE "MonthlyExpense";
ALTER TABLE "new_MonthlyExpense" RENAME TO "MonthlyExpense";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
