-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "realName" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
    "department" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectCode" TEXT NOT NULL,
    "telecomCode" TEXT NOT NULL,
    "projectName" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "projectType" TEXT NOT NULL,
    "projectAddress" TEXT NOT NULL,
    "contractAmount" REAL NOT NULL,
    "managerId" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Project_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "contactPerson" TEXT,
    "contactPhone" TEXT,
    "address" TEXT,
    "industry" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "FinancialRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "recordType" TEXT NOT NULL,
    "costCategory" TEXT,
    "amount" REAL NOT NULL,
    "description" TEXT NOT NULL,
    "invoiceNo" TEXT,
    "payee" TEXT,
    "transactionDate" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "attachment" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "FinancialRecord_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Supplier" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "contactPerson" TEXT,
    "contactPhone" TEXT,
    "email" TEXT,
    "address" TEXT,
    "bankAccount" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "PurchaseOrder" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderNo" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "supplierId" TEXT NOT NULL,
    "totalAmount" REAL NOT NULL,
    "orderDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expectedDate" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PurchaseOrder_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PurchaseOrder_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PurchaseItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderId" TEXT NOT NULL,
    "deviceName" TEXT NOT NULL,
    "deviceSpec" TEXT,
    "brand" TEXT,
    "quantity" INTEGER NOT NULL,
    "unitPrice" REAL NOT NULL,
    "totalPrice" REAL NOT NULL,
    CONSTRAINT "PurchaseItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "PurchaseOrder" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Logistics" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "purchaseOrderId" TEXT NOT NULL,
    "logisticsNo" TEXT NOT NULL,
    "logisticsCompany" TEXT NOT NULL,
    "shipDate" DATETIME,
    "expectedArrival" DATETIME,
    "actualArrival" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'in_transit',
    "receiver" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Logistics_purchaseOrderId_fkey" FOREIGN KEY ("purchaseOrderId") REFERENCES "PurchaseOrder" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "taskType" TEXT,
    "assigneeId" TEXT,
    "priority" TEXT NOT NULL DEFAULT 'medium',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "startDate" DATETIME,
    "dueDate" DATETIME,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "parentTaskId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Task_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Task_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProgressLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "taskId" TEXT,
    "stage" TEXT NOT NULL,
    "progressDesc" TEXT NOT NULL,
    "issues" TEXT,
    "photos" TEXT,
    "reporterId" TEXT NOT NULL,
    "reportDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ProgressLog_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ProgressLog_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "ProgressLog_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Deliverable" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "docType" TEXT NOT NULL,
    "docName" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Deliverable_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AfterSales" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "serviceType" TEXT NOT NULL,
    "issueDesc" TEXT NOT NULL,
    "handlerId" TEXT,
    "solution" TEXT,
    "serviceDate" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "warrantyExpire" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "AfterSales_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "AfterSales_handlerId_fkey" FOREIGN KEY ("handlerId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Project_projectCode_key" ON "Project"("projectCode");

-- CreateIndex
CREATE INDEX "Project_managerId_idx" ON "Project"("managerId");

-- CreateIndex
CREATE INDEX "Project_status_idx" ON "Project"("status");

-- CreateIndex
CREATE INDEX "FinancialRecord_projectId_idx" ON "FinancialRecord"("projectId");

-- CreateIndex
CREATE INDEX "FinancialRecord_recordType_idx" ON "FinancialRecord"("recordType");

-- CreateIndex
CREATE INDEX "FinancialRecord_transactionDate_idx" ON "FinancialRecord"("transactionDate");

-- CreateIndex
CREATE UNIQUE INDEX "PurchaseOrder_orderNo_key" ON "PurchaseOrder"("orderNo");

-- CreateIndex
CREATE INDEX "PurchaseOrder_projectId_idx" ON "PurchaseOrder"("projectId");

-- CreateIndex
CREATE INDEX "PurchaseOrder_supplierId_idx" ON "PurchaseOrder"("supplierId");

-- CreateIndex
CREATE INDEX "PurchaseOrder_status_idx" ON "PurchaseOrder"("status");

-- CreateIndex
CREATE INDEX "PurchaseItem_orderId_idx" ON "PurchaseItem"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "Logistics_logisticsNo_key" ON "Logistics"("logisticsNo");

-- CreateIndex
CREATE INDEX "Logistics_purchaseOrderId_idx" ON "Logistics"("purchaseOrderId");

-- CreateIndex
CREATE INDEX "Logistics_logisticsNo_idx" ON "Logistics"("logisticsNo");

-- CreateIndex
CREATE INDEX "Task_projectId_idx" ON "Task"("projectId");

-- CreateIndex
CREATE INDEX "Task_assigneeId_idx" ON "Task"("assigneeId");

-- CreateIndex
CREATE INDEX "Task_status_idx" ON "Task"("status");

-- CreateIndex
CREATE INDEX "ProgressLog_projectId_idx" ON "ProgressLog"("projectId");

-- CreateIndex
CREATE INDEX "ProgressLog_reporterId_idx" ON "ProgressLog"("reporterId");

-- CreateIndex
CREATE INDEX "ProgressLog_reportDate_idx" ON "ProgressLog"("reportDate");

-- CreateIndex
CREATE INDEX "Deliverable_projectId_idx" ON "Deliverable"("projectId");

-- CreateIndex
CREATE INDEX "Deliverable_docType_idx" ON "Deliverable"("docType");

-- CreateIndex
CREATE INDEX "AfterSales_projectId_idx" ON "AfterSales"("projectId");

-- CreateIndex
CREATE INDEX "AfterSales_status_idx" ON "AfterSales"("status");
