-- AlterTable
ALTER TABLE "FixedExpense" ADD COLUMN "reportId" TEXT;

-- AlterTable
ALTER TABLE "MonthlyExpense" ADD COLUMN "reportId" TEXT;

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Report_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_FixedExpenseToReport" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_FixedExpenseToReport_A_fkey" FOREIGN KEY ("A") REFERENCES "FixedExpense" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_FixedExpenseToReport_B_fkey" FOREIGN KEY ("B") REFERENCES "Report" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_MonthlyExpenseToReport" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_MonthlyExpenseToReport_A_fkey" FOREIGN KEY ("A") REFERENCES "MonthlyExpense" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_MonthlyExpenseToReport_B_fkey" FOREIGN KEY ("B") REFERENCES "Report" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Report_userId_month_year_key" ON "Report"("userId", "month", "year");

-- CreateIndex
CREATE UNIQUE INDEX "_FixedExpenseToReport_AB_unique" ON "_FixedExpenseToReport"("A", "B");

-- CreateIndex
CREATE INDEX "_FixedExpenseToReport_B_index" ON "_FixedExpenseToReport"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MonthlyExpenseToReport_AB_unique" ON "_MonthlyExpenseToReport"("A", "B");

-- CreateIndex
CREATE INDEX "_MonthlyExpenseToReport_B_index" ON "_MonthlyExpenseToReport"("B");
