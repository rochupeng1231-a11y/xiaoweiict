/*
  Warnings:

  - You are about to drop the column `payee` on the `FinancialRecord` table. All the data in the column will be lost.
  - Added the required column `creatorId` to the `FinancialRecord` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_FinancialRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "recordType" TEXT NOT NULL,
    "costCategory" TEXT,
    "amount" REAL NOT NULL,
    "description" TEXT NOT NULL,
    "invoiceNo" TEXT,
    "paymentMethod" TEXT,
    "remark" TEXT,
    "transactionDate" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "attachment" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "FinancialRecord_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "FinancialRecord_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_FinancialRecord" ("amount", "attachment", "costCategory", "createdAt", "description", "id", "invoiceNo", "projectId", "recordType", "status", "transactionDate", "updatedAt") SELECT "amount", "attachment", "costCategory", "createdAt", "description", "id", "invoiceNo", "projectId", "recordType", "status", "transactionDate", "updatedAt" FROM "FinancialRecord";
DROP TABLE "FinancialRecord";
ALTER TABLE "new_FinancialRecord" RENAME TO "FinancialRecord";
CREATE INDEX "FinancialRecord_projectId_idx" ON "FinancialRecord"("projectId");
CREATE INDEX "FinancialRecord_creatorId_idx" ON "FinancialRecord"("creatorId");
CREATE INDEX "FinancialRecord_recordType_idx" ON "FinancialRecord"("recordType");
CREATE INDEX "FinancialRecord_transactionDate_idx" ON "FinancialRecord"("transactionDate");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
