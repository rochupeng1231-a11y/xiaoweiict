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
│   │   │   ├── DashboardView.vue      # 仪表盘
│   │   │   ├── LoginView.vue          # 登录页面
│   │   │   ├── Project/               # 项目管理
│   │   │   │   ├── ListView.vue       # 项目列表
│   │   │   │   ├── DetailView.vue     # 项目详情
│   │   │   │   └── FormView.vue       # 项目表单
│   │   │   ├── Financial/             # 财务管理
│   │   │   │   └── ListView.vue       # 财务记录列表
│   │   │   └── Supplier/              # 供应商管理
│   │   │       └── ListView.vue       # 供应商列表
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
│   │   │   ├── financial.routes.ts   # 财务路由
│   │   │   ├── supplier.routes.ts    # 供应商路由
│   │   │   └── purchase.routes.ts    # 采购路由
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

**数据库类型**：SQLite（开发环境），可切换至 PostgreSQL（生产环境）

**金额字段类型说明**：由于 SQLite 不支持原生 Decimal 类型，所有金额字段（如 `contractAmount`、`amount`、`totalAmount` 等）使用 `Float` 类型存储。在应用层进行金额计算和格式化。

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
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
  contractAmount Float
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
  creatorId        String
  creator          User     @relation("FinancialRecordCreator", fields: [creatorId], references: [id], onDelete: Cascade)
  recordType       String   // income/expense
  costCategory     String?  // material/labor/equipment/transport/subcontract/other/refund
  amount           Float
  description      String
  invoiceNo        String?  @map("invoiceNo")
  paymentMethod    String?  // cash/transfer/check/other
  remark           String?
  transactionDate  DateTime
  status           String   @default("pending") // pending/confirmed/cancelled
  attachment       String?  // 附件路径
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  @@index([projectId])
  @@index([creatorId])
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
  totalAmount   Float
  orderDate     DateTime @default(now())
  expectedDate  DateTime?
  status        String   @default("pending") // pending/confirmed/shipped/completed/cancelled
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
  id            String   @id @default(uuid())
  orderId       String
  order         PurchaseOrder @relation(fields: [orderId], references: [id], onDelete: Cascade)
  itemCode      String
  itemName      String
  specification String?
  unit          String
  quantity      Int
  unitPrice     Float
  subtotal      Float
  notes         String?

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

## 文件详细说明

### 后端核心文件

#### `backend/src/app.ts`
**作用**：应用入口，Express 服务器初始化
- 配置中间件（JSON 解析、CORS、静态文件）
- 注册所有路由模块
- 配置全局错误处理中间件
- 启动 HTTP 服务器（端口 3000）

#### `backend/src/routes/*.routes.ts`
**作用**：定义 API 端点和请求处理映射

| 文件 | 路由前缀 | 主要端点 |
|------|----------|----------|
| `auth.routes.ts` | `/api/auth` | login, logout, me |
| `project.routes.ts` | `/api/projects` | CRUD, summary, search |
| `financial.routes.ts` | `/api/financial` | CRUD, stats (all/project) |
| `supplier.routes.ts` | `/api/suppliers` | CRUD, search |
| `purchase.routes.ts` | `/api/purchase` | orders CRUD, items, logistics |

**路由注册流程**：
1. 在 `app.ts` 中 `import` 路由模块
2. 使用 `app.use('/api', routerRegistry)` 注册
3. 各路由文件导出 `Router` 实例

#### `backend/src/controllers/*.controller.ts`
**作用**：HTTP 请求处理器，连接验证层与服务层

```typescript
// 典型控制器结构
export const createRecord = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. 获取请求参数
    const data = req.body
    // 2. 调用服务层
    const result = await service.create(data)
    // 3. 返回响应
    res.json({ success: true, data: result })
  } catch (error) {
    // 4. 错误处理
    next(error)
  }
}
```

#### `backend/src/services/*.service.ts`
**作用**：业务逻辑层，可复用的核心功能

**财务服务示例** (`financial.service.ts`)：
- `createFinancialRecord()` - 创建记录，自动关联创建者
- `getFinancialRecords()` - 分页查询，支持多条件筛选
- `getProjectFinancialStats()` - 统计项目收支、利润、利润率
- `getAllFinancialStats()` - 汇总所有项目财务数据

**设计原则**：
- 不包含 HTTP 相关代码
- 返回标准化的数据结构
- 抛出 `BusinessError` 表示业务规则违反

#### `backend/src/validators/*.validator.ts`
**作用**：使用 Zod 定义请求参数验证规则

```typescript
// 示例：财务记录验证
export const createFinancialRecordSchema = z.object({
  projectId: z.string().uuid(),
  recordType: z.enum(['income', 'expense']),
  amount: z.number().positive(),
  // 条件验证：支出必须有 costCategory
}).refine(data => {
  return data.recordType !== 'expense' || data.costCategory
})
```

**使用方式**：在中间件中调用 `schema.parse(req.body)` 自动验证

#### `backend/src/middleware/*.ts`
**作用**：横切关注点处理

| 中间件 | 功能 |
|--------|------|
| `auth.ts` | JWT 验证，提取用户信息到 `req.user` |
| `error.ts` | 统一错误处理，返回标准化错误响应 |
| `validation.ts` | Zod schema 验证，自动返回 400 错误 |
| `logger.ts` | 请求日志记录 |

#### `backend/src/utils/errors.ts`
**作用**：自定义错误类和错误处理工具

```typescript
export class BusinessError extends Error {
  constructor(message: string, public statusCode: number = 400) {
    super(message)
    this.name = 'BusinessError'
  }
}

export function handleError(error: unknown, next: NextFunction) {
  if (error instanceof BusinessError) {
    next(error)
  } else if (error instanceof z.ZodError) {
    next(new BusinessError('参数验证失败', 400))
  } else {
    next(error)
  }
}
```

#### `backend/prisma/schema.prisma`
**作用**：数据库模型定义，Prisma ORM 的核心

**数据类型说明**：
- SQLite 不支持 Decimal，所有金额字段使用 Float
- 金额字段：`contractAmount`, `amount`, `totalAmount`, `unitPrice`, `subtotal`
- 在应用层进行金额计算和格式化（保留两位小数）

**关键字段说明**：
- `FinancialRecord` 包含 `creatorId` 关联创建者（User 模型）
- `FinancialRecord` 字段：`invoiceNo`, `paymentMethod`, `remark`
- `FinancialRecord.costCategory`：material/labor/equipment/transport/subcontract/other/refund
- `PurchaseItem` 字段：`itemCode`, `itemName`, `specification`, `unit`, `quantity`, `unitPrice`, `subtotal`, `notes`

### 前端核心文件

#### `frontend/src/main.ts`
**作用**：Vue 应用入口
- 创建 Vue 应用实例
- 注册 Pinia、Router、Element Plus
- 挂载应用到 DOM

#### `frontend/src/App.vue`
**作用**：根组件，渲染路由视图

#### `frontend/src/router/index.ts`
**作用**：路由配置，定义页面路径映射

```typescript
const routes = [
  { path: '/login', component: () => import('@/views/LoginView.vue') },
  { path: '/', component: MainLayout, children: [
    { path: '', component: () => import('@/views/DashboardView.vue') },
    { path: 'projects', component: () => import('@/views/Project/ListView.vue') },
    { path: 'financial', component: () => import('@/views/Financial/ListView.vue') },
    { path: 'suppliers', component: () => import('@/views/Supplier/ListView.vue') },
  ]}
]
```

#### `frontend/src/api/request.ts`
**作用**：Axios 封装，统一 HTTP 请求处理

**功能**：
- 自动添加 JWT Token 到请求头
- 统一错误处理（401 跳转登录、500 提示错误）
- 响应数据标准化处理

```typescript
// 拦截器示例
service.interceptors.request.use(config => {
  const userStore = useUserStore()
  if (userStore.token) {
    config.headers.Authorization = `Bearer ${userStore.token}`
  }
  return config
})
```

#### `frontend/src/api/*.ts`
**作用**：业务模块 API 客户端

| 文件 | 主要方法 |
|------|----------|
| `auth.ts` | login, getCurrentUser, logout |
| `project.ts` | getProjects, getProject, createProject... |
| `financial.ts` | getFinancialRecords, createFinancialRecord, getStats... |
| `supplier.ts` | getSuppliers, createSupplier... |
| `purchase.ts` | getOrders, createOrder... |

**注意**：不同 API 返回结构不同
- Projects API: `{ data: { data: [...], total: ... } }` (嵌套)
- Financial API: `{ data: [...], pagination: {...} }` (扁平)

#### `frontend/src/views/*/*.vue`
**作用**：页面视图组件

**财务管理页面** (`Financial/ListView.vue`)：
- 统计卡片：总收入、总支出、利润、利润率
- 筛选栏：项目、类型、状态
- 表格：收支记录列表，支持编辑/删除
- 对话框：新建/编辑表单

**供应商管理页面** (`Supplier/ListView.vue`)：
- 搜索栏：按名称/联系人搜索
- 表格：供应商列表
- 对话框：新建/编辑表单

#### `frontend/src/stores/user.ts`
**作用**：用户状态管理（Pinia）

```typescript
export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    userInfo: null as User | null
  }),
  actions: {
    async login(credentials) { /* ... */ },
    logout() { /* 清除状态 */ }
  }
})
```

#### `frontend/src/components/Layout/MainLayout.vue`
**作用**：主布局组件

**结构**：
- 侧边栏：导航菜单
- 顶部栏：用户信息、登出按钮
- 内容区：路由视图出口

**菜单配置**：
```typescript
const menuItems = [
  { path: '/projects', icon: FolderOpened, title: '项目管理' },
  { path: '/financial', icon: Money, title: '财务管理' },
  { path: '/suppliers', icon: User, title: '供应商管理' },
  // ...
]
```

### 数据修复脚本

#### `backend/src/scripts/fixFinancialData.ts`
**作用**：修复财务记录中文编码问题

**操作流程**：
1. 删除所有现有财务记录
2. 为每个项目创建新的收入和支出记录
3. 使用正确的 UTF-8 编码

#### `backend/src/scripts/fixSupplierData.ts`
**作用**：修复供应商数据中文编码问题

**示例数据**：
- 北京科技有限公司（张经理）
- 上海智能设备公司（李经理）
- 深圳网络科技公司（王经理）
- 广州系统集成公司（赵经理）
- 杭州安防设备公司（刘经理）

---

## 架构设计决策

### 1. 为什么选择 SQLite 而非 PostgreSQL 开发环境？

**原因**：
- **零配置**：无需安装数据库服务，开箱即用
- **文件便携**：数据库存储在单个文件中，易于备份和移动
- **跨平台**：在 Windows/Mac/Linux 上行为一致
- **开发效率**：Prisma 迁移更快速

**权衡**：
- 生产环境仍切换到 PostgreSQL（并发性能更好）
- 使用 Prisma 抽象层，迁移成本极低

### 2. 为什么使用 Float 而非 Decimal？

**原因**：
- SQLite 不支持原生 Decimal 类型
- Prisma 自动将 Decimal 映射为 Float 存储

**解决方案**：
- 应用层进行金额计算
- 显示时格式化为两位小数

### 3. 为什么 API 响应结构不一致？

**现状**：
- Projects API 返回：`{ data: { data: [...], total: ... } }`
- Financial API 返回：`{ data: [...], pagination: {...} }`

**原因**：
- 项目服务返回分页元数据（total）
- 财务服务直接返回数组

**改进计划**：
- 统一为 `{ data: [...], pagination: {...} }` 格式
- 前端已做兼容处理

### 4. 为什么需要数据修复脚本？

**问题**：
- 通过 curl 终端创建的数据使用系统默认编码
- Windows 终端非 UTF-8 导致中文乱码

**解决方案**：
- 在 TypeScript 脚本中硬编码中文字符串
- Node.js 自动使用 UTF-8 编码
- 重新创建所有记录

### 5. 为什么创建者 ID 需要硬编码？

**原因**：
- 数据库外键约束要求 `creatorId` 必须引用有效用户
- 脚本运行时无认证上下文，无法动态获取当前用户

**当前方案**：
```typescript
const adminId = 'fd1bf517-c0e2-4755-9f2c-9d9b6fa32fcb' // 固定 admin ID
```

**改进方向**：
- 使用环境变量配置默认管理员 ID
- 或在首次运行时自动查找 admin 用户

---

## 数据流示例

### 创建财务记录流程

```
用户点击"新建"
  ↓
前端显示对话框，用户填写表单
  ↓
前端调用 createFinancialRecord(data)
  ↓
request.ts 添加 JWT Token
  ↓
POST /api/financial
  ↓
auth 中间件验证 Token，提取 req.user
  ↓
validation 中间件验证请求体
  ↓
financial.controller.ts 接收请求
  ↓
financial.service.ts 执行业务逻辑
  ├─ 自动设置 creatorId = req.user.id
  └─ 调用 prisma.financialRecord.create()
  ↓
Prisma 生成并执行 SQL
  ↓
数据库插入记录
  ↓
Service 返回新记录
  ↓
Controller 返回 JSON 响应
  ↓
前端接收响应，更新列表显示
```

---

## 关键技术栈版本

| 依赖 | 版本 | 用途 |
|------|------|------|
| Vue | 3.5.13 | 前端框架 |
| Vite | 6.0.5 | 构建工具 |
| Element Plus | 2.9.1 | UI 组件库 |
| Pinia | 2.3.0 | 状态管理 |
| Axios | 1.7.9 | HTTP 客户端 |
| Express | 4.21.2 | 后端框架 |
| Prisma | 5.22.0 | ORM |
| TypeScript | 5.7.3 | 类型系统 |
| Zod | 4.0.0 | 参数验证 |

---

*最后更新：2026-02-25*
