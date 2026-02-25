/*
  Warnings:

  - You are about to drop the column `brand` on the `PurchaseItem` table. All the data in the column will be lost.
  - You are about to drop the column `deviceName` on the `PurchaseItem` table. All the data in the column will be lost.
  - You are about to drop the column `deviceSpec` on the `PurchaseItem` table. All the data in the column will be lost.
  - You are about to drop the column `totalPrice` on the `PurchaseItem` table. All the data in the column will be lost.
  - Added the required column `itemCode` to the `PurchaseItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `itemName` to the `PurchaseItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subtotal` to the `PurchaseItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unit` to the `PurchaseItem` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PurchaseItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderId" TEXT NOT NULL,
    "itemCode" TEXT NOT NULL,
    "itemName" TEXT NOT NULL,
    "specification" TEXT,
    "unit" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" REAL NOT NULL,
    "subtotal" REAL NOT NULL,
    "notes" TEXT,
    CONSTRAINT "PurchaseItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "PurchaseOrder" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_PurchaseItem" ("id", "orderId", "quantity", "unitPrice") SELECT "id", "orderId", "quantity", "unitPrice" FROM "PurchaseItem";
DROP TABLE "PurchaseItem";
ALTER TABLE "new_PurchaseItem" RENAME TO "PurchaseItem";
CREATE INDEX "PurchaseItem_orderId_idx" ON "PurchaseItem"("orderId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
