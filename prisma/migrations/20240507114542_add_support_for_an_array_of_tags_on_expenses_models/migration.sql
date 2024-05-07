-- CreateTable
CREATE TABLE "_FixedExpenseToTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_FixedExpenseToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "FixedExpense" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_FixedExpenseToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_MonthlyExpenseToTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_MonthlyExpenseToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "MonthlyExpense" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_MonthlyExpenseToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_FixedExpense" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "label" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "notes" TEXT,
    "userId" TEXT NOT NULL,
    "tagId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "FixedExpense_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_FixedExpense" ("amount", "createdAt", "id", "label", "notes", "tagId", "updatedAt", "userId") SELECT "amount", "createdAt", "id", "label", "notes", "tagId", "updatedAt", "userId" FROM "FixedExpense";
DROP TABLE "FixedExpense";
ALTER TABLE "new_FixedExpense" RENAME TO "FixedExpense";
CREATE TABLE "new_MonthlyExpense" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "label" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "notes" TEXT,
    "userId" TEXT NOT NULL,
    "tagId" TEXT,
    "installments" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "MonthlyExpense_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_MonthlyExpense" ("amount", "createdAt", "id", "installments", "label", "notes", "tagId", "updatedAt", "userId") SELECT "amount", "createdAt", "id", "installments", "label", "notes", "tagId", "updatedAt", "userId" FROM "MonthlyExpense";
DROP TABLE "MonthlyExpense";
ALTER TABLE "new_MonthlyExpense" RENAME TO "MonthlyExpense";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "_FixedExpenseToTag_AB_unique" ON "_FixedExpenseToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_FixedExpenseToTag_B_index" ON "_FixedExpenseToTag"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MonthlyExpenseToTag_AB_unique" ON "_MonthlyExpenseToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_MonthlyExpenseToTag_B_index" ON "_MonthlyExpenseToTag"("B");
