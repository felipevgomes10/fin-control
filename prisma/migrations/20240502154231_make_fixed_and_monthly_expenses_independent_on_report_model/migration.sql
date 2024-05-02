/*
  Warnings:

  - You are about to drop the `_FixedExpenseToReport` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_MonthlyExpenseToReport` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `reportId` on the `FixedExpense` table. All the data in the column will be lost.
  - You are about to drop the column `reportId` on the `MonthlyExpense` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "_FixedExpenseToReport_B_index";

-- DropIndex
DROP INDEX "_FixedExpenseToReport_AB_unique";

-- DropIndex
DROP INDEX "_MonthlyExpenseToReport_B_index";

-- DropIndex
DROP INDEX "_MonthlyExpenseToReport_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_FixedExpenseToReport";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_MonthlyExpenseToReport";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "ReportFixedExpense" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "label" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "reportId" TEXT NOT NULL,
    CONSTRAINT "ReportFixedExpense_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ReportMonthlyExpense" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "label" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "notes" TEXT,
    "installments" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "reportId" TEXT NOT NULL,
    CONSTRAINT "ReportMonthlyExpense_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

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
