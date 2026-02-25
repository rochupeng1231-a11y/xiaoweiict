# 架构文档

## 项目概述

**项目名称**：ICT 项目管理系统

**项目目标**：构建一套轻量级 ICT 项目管理系统，用于管理从电信公司分包的小型 ICT 项目。

---

## 技术架构

```
┌─────────────────────────────────────────────────────────┐
│                      前端层 (Vue 3)                      │
│  Vue 3 + TypeScript + Vite + Element Plus + Pinia       │
└─────────────────────────────────────────────────────────┘
                            │ HTTP/REST API
                            ▼
┌─────────────────────────────────────────────────────────┐
│                      后端层 (Express)                     │
│  Express + TypeScript + Prisma ORM + JWT                │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                    数据层 (Prisma)                       │
│  SQLite (开发) / PostgreSQL (生产)                       │
└─────────────────────────────────────────────────────────┘
```

---

## 项目结构

```
xiaoweiICT/
├── frontend/                    # Vue 3 前端应用
│   ├── public/                 # 静态资源
│   ├── src/
│   │   ├── assets/             # 资源文件（图片、样式等）
│   │   ├── components/         # 可复用组件
│   │   │   ├── Layout/         # 布局组件
│   │   │   ├── ProjectCard/    # 项目卡片组件
│   │   │   ├── FinancialChart/ # 财务图表组件
│   │   │   └── common/         # 通用组件
│   │   ├── views/              # 页面视图
│   │   │   ├── Dashboard/      # 仪表盘
│   │   │   ├── Project/        # 项目管理
│   │   │   │   ├── List.vue
│   │   │   │   ├── Detail.vue
│   │   │   │   └── Form.vue
│   │   │   ├── Finance/        # 财务管理
│   │   │   ├── Purchase/       # 采购管理
│   │   │   ├── Progress/       # 进度管理
│   │   │   ├── Deliverable/    # 交付管理
│   │   │   └── Auth/           # 认证相关
│   │   ├── stores/             # Pinia 状态管理
│   │   │   ├── user.ts         # 用户状态
│   │   │   ├── project.ts      # 项目状态
│   │   │   └── ...
│   │   ├── api/                # API 客户端
│   │   │   ├── request.ts      # axios 封装
│   │   │   ├── project.ts      # 项目 API
│   │   │   ├── finance.ts      # 财务 API
│   │   │   ├── purchase.ts     # 采购 API
│   │   │   └── ...
│   │   ├── router/             # 路由配置
│   │   │   └── index.ts
│   │   ├── types/              # TypeScript 类型定义
│   │   │   ├── project.d.ts
│   │   │   ├── finance.d.ts
│   │   │   └── index.d.ts
│   │   ├── utils/              # 工具函数
│   │   │   ├── format.ts       # 格式化函数
│   │   │   ├── validate.ts     # 验证函数
│   │   │   └── constants.ts    # 常量定义
│   │   ├── composables/        # 组合式函数
│   │   └── App.vue
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
├── backend/                     # Express 后端应用
│   ├── src/
│   │   ├── config/             # 配置文件
│   │   │   ├── database.ts     # 数据库配置
│   │   │   ├── jwt.ts          # JWT 配置
│   │   │   └── index.ts        # 统一导出
│   │   ├── middleware/         # 中间件
│   │   │   ├── auth.ts         # 认证中间件
│   │   │   ├── error.ts        # 错误处理中间件
│   │   │   ├── validation.ts   # 参数验证中间件
│   │   │   └── logger.ts       # 日志中间件
│   │   ├── routes/             # 路由定义
│   │   │   ├── index.ts        # 路由聚合
│   │   │   ├── auth.ts         # 认证路由
│   │   │   ├── projects.ts     # 项目路由
│   │   │   ├── finance.ts      # 财务路由
│   │   │   ├── purchase.ts     # 采购路由
│   │   │   ├── tasks.ts        # 任务路由
│   │   │   └── deliverables.ts # 交付文档路由
│   │   ├── controllers/        # 控制器（请求处理）
│   │   │   ├── project.controller.ts
│   │   │   ├── finance.controller.ts
│   │   │   ├── purchase.controller.ts
│   │   │   ├── task.controller.ts
│   │   │   └── ...
│   │   ├── services/           # 业务逻辑层
│   │   │   ├── project.service.ts
│   │   │   ├── finance.service.ts
│   │   │   ├── purchase.service.ts
│   │   │   ├── task.service.ts
│   │   │   └── ...
│   │   ├── validators/         # 请求验证 schema（Zod）
│   │   │   ├── project.validator.ts
│   │   │   ├── finance.validator.ts
│   │   │   └── ...
│   │   ├── types/              # TypeScript 类型
│   │   │   └── index.ts
│   │   ├── utils/              # 工具函数
│   │   │   ├── logger.ts       # 日志工具
│   │   │   ├── helpers.ts      # 辅助函数
│   │   │   └── errors.ts       # 自定义错误类
│   │   └── app.ts              # 应用入口
│   ├── prisma/
│   │   └── schema.prisma       # 数据库模型定义
│   ├── package.json
│   └── tsconfig.json
│
├── memory-bank/                 # 项目知识库
│   ├── architecture.md         # 架构文档（本文件）
│   └── changelog.md            # 变更日志
│
├── docs/                        # 项目文档
│   ├── design-document.md      # 设计文档
│   ├── tech-stack.md           # 技术栈说明
│   └── api.md                  # API 文档
│
├── CLAUDE.md                    # Claude Code 指导文档
├── README.md                    # 项目说明
└── .gitignore
```

---

## 数据库结构

### Prisma Schema 概览

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite" // 开发环境，生产改为 postgresql
  url      = env("DATABASE_URL")
}

// 用户表
model User {
  id           String   @id @default(uuid())
  username     String   @unique
  passwordHash String
  realName     String
  role         String   @default("user") // admin/user
  department   String?
  phone        String?
  email        String?
  status       String   @default("active")
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  managedProjects Project[] @relation("ProjectManager")
  assignedTasks   Task[]
  progressLogs    ProgressLog[]
  afterSales      AfterSales[]
}

// 项目表
model Project {
  id             String   @id @default(uuid())
  projectCode    String   @unique
  telecomCode    String   // 电信项目编号
  projectName    String
  customerName   String
  projectType    String   // 网络布线/安防监控/视频会议等
  projectAddress String
  contractAmount Decimal  @db.Decimal(12, 2)
  managerId      String
  startDate      DateTime
  endDate        DateTime
  status         String   @default("pending") // 待立项/需求调研/方案确认/采购中/实施中/待验收/已交付/已结算
  description    String?
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  manager         User              @relation("ProjectManager", fields: [managerId], references: [id])
  financialRecords FinancialRecord[]
  purchaseOrders  PurchaseOrder[]
  tasks           Task[]
  progressLogs    ProgressLog[]
  deliverables    Deliverable[]
  afterSales      AfterSales[]

  @@index([managerId])
  @@index([status])
}

// 客户表
model Customer {
  id            String   @id @default(uuid())
  name          String
  contactPerson String?
  contactPhone  String?
  address       String?
  industry      String?
  createdAt     DateTime @default(now())
}

// 收支记录表
model FinancialRecord {
  id               String   @id @default(uuid())
  projectId        String
  project          Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)
  recordType       String   // income/expense
  costCategory     String?  // 设备采购/工程施工/差旅费用/业务费用
  amount           Decimal  @db.Decimal(12, 2)
  description      String
  invoiceNo        String?
  payee            String?  // 收款人/付款人
  transactionDate  DateTime
  status           String   @default("pending") // 待支付/已支付/待收款/已收款
  attachment       String?  // 附件路径
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  @@index([projectId])
  @@index([recordType])
  @@index([transactionDate])
}

// 供应商表
model Supplier {
  id            String   @id @default(uuid())
  name          String
  contactPerson String?
  contactPhone  String?
  email         String?
  address       String?
  bankAccount   String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  purchaseOrders PurchaseOrder[]
}

// 采购单表
model PurchaseOrder {
  id            String   @id @default(uuid())
  orderNo       String   @unique
  projectId     String
  project       Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)
  supplierId    String
  supplier      Supplier @relation(fields: [supplierId], references: [id])
  totalAmount   Decimal  @db.Decimal(12, 2)
  orderDate     DateTime @default(now())
  expectedDate  DateTime?
  status        String   @default("pending") // 待确认/已确认/已发货/已完成/已取消
  notes         String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  items     PurchaseItem[]
  logistics Logistics[]

  @@index([projectId])
  @@index([supplierId])
  @@index([status])
}

// 采购明细表
model PurchaseItem {
  id          String   @id @default(uuid())
  orderId     String
  order       PurchaseOrder @relation(fields: [orderId], references: [id], onDelete: Cascade)
  deviceName  String
  deviceSpec  String?
  brand       String?
  quantity    Int
  unitPrice   Decimal  @db.Decimal(12, 2)
  totalPrice  Decimal  @db.Decimal(12, 2)

  @@index([orderId])
}

// 物流信息表
model Logistics {
  id               String   @id @default(uuid())
  purchaseOrderId  String
  purchaseOrder    PurchaseOrder @relation(fields: [purchaseOrderId], references: [id], onDelete: Cascade)
  logisticsNo      String   @unique // 物流单号
  logisticsCompany String   // 物流公司
  shipDate         DateTime?
  expectedArrival  DateTime?
  actualArrival    DateTime?
  status           String   @default("in_transit") // 在途/已签收/异常
  receiver         String?
  notes            String?
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  @@index([purchaseOrderId])
  @@index([logisticsNo])
}

// 任务表
model Task {
  id          String   @id @default(uuid())
  projectId   String
  project     Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)
  title       String
  description String?
  taskType    String?  // 任务类型
  assigneeId  String?
  assignee    User?    @relation(fields: [assigneeId], references: [id])
  priority    String   @default("medium") // high/medium/low
  status      String   @default("pending") // 待开始/进行中/已完成/已取消
  startDate   DateTime?
  dueDate     DateTime?
  progress    Int      @default(0)
  parentTaskId String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  progressLogs ProgressLog[]

  @@index([projectId])
  @@index([assigneeId])
  @@index([status])
}

// 进度日志表
model ProgressLog {
  id            String   @id @default(uuid())
  projectId     String
  project       Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)
  taskId        String?
  task          Task?    @relation(fields: [taskId], references: [id])
  stage         String   // 当前阶段
  progressDesc  String   // 进度描述
  issues        String?  // 遇到问题
  photos        String?  // 现场照片（JSON 数组）
  reporterId    String
  reporter      User     @relation(fields: [reporterId], references: [id])
  reportDate    DateTime @default(now())
  createdAt     DateTime @default(now())

  @@index([projectId])
  @@index([reporterId])
  @@index([reportDate])
}

// 交付文档表
model Deliverable {
  id        String   @id @default(uuid())
  projectId String
  project   Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)
  docType   String   // 文档类型（开工报告/验收报告/竣工图纸等）
  docName   String   // 文档名称
  filePath  String   // 文件路径
  version   Int      @default(1)
  status    String   @default("draft") // 草稿/已发布
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([projectId])
  @@index([docType])
}

// 售后服务表
model AfterSales {
  id             String   @id @default(uuid())
  projectId      String
  project        Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)
  serviceType    String   // 服务类型
  issueDesc      String   // 问题描述
  handlerId      String?
  handler        User?    @relation(fields: [handlerId], references: [id])
  solution       String?  // 解决方案
  serviceDate    DateTime?
  status         String   @default("pending") // 待处理/处理中/已完成
  warrantyExpire DateTime? // 质保到期日期
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  @@index([projectId])
  @@index([status])
}
```

---

## 模块化设计原则

### 前端模块化

1. **组件拆分原则**
   - 单个组件代码不超过 300 行
   - 可复用的 UI 片段抽取为独立组件
   - 复杂页面拆分为多个子组件

2. **API 模块化**
   - 每个业务模块一个 API 文件（`api/project.ts`, `api/finance.ts`）
   - 统一的 request 封装处理认证、错误

3. **状态管理模块化**
   - 按业务领域划分 Store（`stores/user.ts`, `stores/project.ts`）
   - 全局状态与局部状态分离

4. **路由模块化**
   - 路由配置分模块定义
   - 使用路由懒加载

### 后端模块化

1. **分层架构**
   ```
   Request → Middleware → Route → Controller → Service → Prisma → Database
   ```

2. **职责分离**
   - **Controller**：处理 HTTP 请求/响应，不包含业务逻辑
   - **Service**：包含业务逻辑，可被多个 Controller 复用
   - **Validator**：请求参数验证（使用 Zod）
   - **Middleware**：横切关注点（认证、日志、错误处理）

3. **模块文件大小限制**
   - 单个文件不超过 400 行
   - 超过限制时拆分子模块

4. **禁止单文件**
   - 不允许所有路由写在一个文件
   - 不允许所有业务逻辑写在一个 Service

---

## API 端点设计

### 认证相关
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/logout` - 用户登出
- `GET /api/auth/me` - 获取当前用户信息

### 项目管理
- `GET /api/projects` - 获取项目列表
- `POST /api/projects` - 创建项目
- `GET /api/projects/:id` - 获取项目详情
- `PUT /api/projects/:id` - 更新项目
- `DELETE /api/projects/:id` - 删除项目
- `GET /api/projects/:id/summary` - 获取项目概况（财务、进度）

### 财务管理
- `GET /api/projects/:id/financial` - 获取收支记录
- `POST /api/projects/:id/financial` - 添加收支记录
- `PUT /api/financial/:id` - 更新收支记录
- `DELETE /api/financial/:id` - 删除收支记录
- `GET /api/projects/:id/profit` - 获取利润分析
- `GET /api/reports/monthly` - 月度财务报表

### 采购管理
- `POST /api/purchase-orders` - 创建采购订单
- `GET /api/purchase-orders` - 获取采购订单列表
- `GET /api/purchase-orders/:id` - 获取采购订单详情
- `PUT /api/purchase-orders/:id` - 更新采购订单
- `DELETE /api/purchase-orders/:id` - 删除采购订单
- `GET /api/suppliers` - 获取供应商列表
- `POST /api/suppliers` - 添加供应商

### 物流管理
- `POST /api/purchase-orders/:id/logistics` - 添加物流信息
- `GET /api/purchase-orders/:id/logistics` - 获取物流信息
- `PUT /api/logistics/:id` - 更新物流信息
- `PUT /api/logistics/:id/confirm` - 确认收货

### 任务管理
- `GET /api/projects/:id/tasks` - 获取任务列表
- `POST /api/projects/:id/tasks` - 创建任务
- `GET /api/tasks/:id` - 获取任务详情
- `PUT /api/tasks/:id` - 更新任务
- `DELETE /api/tasks/:id` - 删除任务

### 进度管理
- `GET /api/projects/:id/progress` - 获取进度日志
- `POST /api/projects/:id/progress` - 提交进度日志

### 交付文档
- `GET /api/projects/:id/deliverables` - 获取交付文档列表
- `POST /api/projects/:id/deliverables` - 上传交付文档
- `DELETE /api/deliverables/:id` - 删除交付文档

### 售后服务
- `GET /api/projects/:id/after-sales` - 获取售后服务记录
- `POST /api/projects/:id/after-sales` - 添加售后服务记录

---

## 开发规范

### 代码规范
- 使用 TypeScript 严格模式
- 遵循 ESLint 和 Prettier 配置
- 函数命名使用 camelCase
- 类/类型/接口使用 PascalCase
- 常量使用 UPPER_SNAKE_CASE

### Git 提交规范
```
feat: 新功能
fix: 修复 bug
docs: 文档更新
style: 代码格式调整
refactor: 重构
test: 测试相关
chore: 构建/工具链更新
```

---

*最后更新：2026-02-25*
