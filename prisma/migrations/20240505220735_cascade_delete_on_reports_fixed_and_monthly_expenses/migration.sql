-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ReportFixedExpense" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "label" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "reportId" TEXT NOT NULL,
    CONSTRAINT "ReportFixedExpense_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ReportFixedExpense" ("amount", "createdAt", "id", "label", "notes", "reportId", "updatedAt") SELECT "amount", "createdAt", "id", "label", "notes", "reportId", "updatedAt" FROM "ReportFixedExpense";
DROP TABLE "ReportFixedExpense";
ALTER TABLE "new_ReportFixedExpense" RENAME TO "ReportFixedExpense";
CREATE TABLE "new_ReportMonthlyExpense" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "label" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "notes" TEXT,
    "installments" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "reportId" TEXT NOT NULL,
    CONSTRAINT "ReportMonthlyExpense_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ReportMonthlyExpense" ("amount", "createdAt", "id", "installments", "label", "notes", "reportId", "updatedAt") SELECT "amount", "createdAt", "id", "installments", "label", "notes", "reportId", "updatedAt" FROM "ReportMonthlyExpense";
DROP TABLE "ReportMonthlyExpense";
ALTER TABLE "new_ReportMonthlyExpense" RENAME TO "ReportMonthlyExpense";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
