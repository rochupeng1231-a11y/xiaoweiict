# CLAUDE.md

此文件为 Claude Code (claude.ai/code) 在此代码库中工作时提供指导。

---

# 重要提示：

## 开发前必读
- **写任何代码前必须完整阅读** [memory-bank/architecture.md](./memory-bank/architecture.md)（包含完整数据库结构）
- **写任何代码前必须完整阅读** [design-document.md](./design-document.md)（完整业务需求和设计）
- **每完成一个重大功能或里程碑后，必须更新** [memory-bank/architecture.md](./memory-bank/architecture.md)
- **每完成一个重大功能或里程碑后，必须更新** [memory-bank/changelog.md](./memory-bank/changelog.md)

---

## 项目概述

这是一个 **ICT 项目管理系统**，用于管理从电信公司分包的小型 ICT 项目。系统管理项目全生命周期、财务记录（收入/支出）、采购、物流跟踪、进度管理和交付文档。

### 业务背景
- **我们是谁**：承接电信公司 ICT 项目分包的公司
- **我们做什么**：为终端客户执行 ICT 项目（网络布线、安防监控、视频会议等）
- **业务关系**：电信公司 → 本公司 → 终端客户
- **项目生命周期**：需求调研 → 方案设计 → 设备采购 → 现场实施 → 测试验收 → 交付售后

### 重要设计约束
- **无预算管理** - 仅进行简单的收入/支出记录和利润计算
- **无库存管理** - 仅进行物流跟踪（物流单号、物流公司、收货状态）
- 项目状态流转：`待立项 → 需求调研 → 方案确认 → 采购中 → 实施中 → 待验收 → 已交付 → 已结算`

---

## 模块化设计原则

### 禁止单体巨文件
本项目严格遵循模块化设计，**禁止创建单体巨文件（monolith）**。

### 前端模块化规则

| 规则 | 说明 |
|------|------|
| **单文件行数限制** | 单个 `.vue` 或 `.ts` 文件不超过 300 行 |
| **组件拆分** | 可复用的 UI 片段必须抽取为独立组件 |
| **页面拆分** | 复杂页面必须拆分为多个子组件 |
| **API 模块化** | 每个业务领域一个 API 文件（如 `api/project.ts`） |
| **状态管理分离** | 按业务领域划分 Store（如 `stores/project.ts`） |

**禁止行为示例：**
```vue
<!-- ❌ 禁止：单个组件 500+ 行 -->
<template>
  <!-- 100+ 行模板 -->
</template>

<script setup lang="ts">
// 400+ 行脚本逻辑
</script>
```

```vue
<!-- ✅ 正确：拆分为多个子组件 -->
<template>
  <ProjectHeader :project="project" />
  <ProjectFinancial :records="records" />
  <ProjectTasks :tasks="tasks" />
  <ProjectProgress :logs="logs" />
</template>
```

### 后端模块化规则

| 规则 | 说明 |
|------|------|
| **单文件行数限制** | 单个 `.ts` 文件不超过 400 行 |
| **分层架构** | Route → Controller → Service → Prisma，职责分离 |
| **Controller 职责** | 仅处理 HTTP 请求/响应，不包含业务逻辑 |
| **Service 职责** | 包含业务逻辑，可被多个 Controller 复用 |
| **路由拆分** | 每个业务模块一个路由文件 |

**禁止行为示例：**
```typescript
// ❌ 禁止：所有路由写在一个文件
// routes/index.ts (1000+ 行)
router.get('/projects', ...);
router.post('/projects', ...);
router.get('/financial', ...);
router.post('/financial', ...);
// ... 100+ 个路由
```

```typescript
// ✅ 正确：按模块拆分路由
// routes/index.ts (仅聚合路由)
import projectRoutes from './projects';
import financeRoutes from './finance';

app.use('/api/projects', projectRoutes);
app.use('/api/financial', financeRoutes);
```

**禁止行为示例：**
```typescript
// ❌ 禁止：Controller 包含业务逻辑
async function getProjects(req, res) {
  // 业务逻辑混在一起
  const projects = await prisma.project.findMany({
    where: {
      status: req.query.status,
      managerId: req.user.id,
      // 复杂的查询逻辑...
    },
    include: {
      financialRecords: {
        where: { /* 更多业务逻辑 */ }
      }
    }
  });
  // 利润计算...
  // 数据转换...
  res.json(projects);
}
```

```typescript
// ✅ 正确：分层架构
// Controller: 处理请求
async function getProjects(req: Request, res: Response) {
  const projects = await projectService.getProjectsByUser(req.user.id);
  res.json({ success: true, data: projects });
}

// Service: 业务逻辑
async function getProjectsByUser(userId: string) {
  const projects = await prisma.project.findMany({
    where: { managerId: userId },
    include: { financialRecords: true }
  });
  return projects.map(calculateProfit);
}
```

---

## 技术栈

```
前端：Vue 3 + TypeScript + Vite + Element Plus + Pinia + Vue Router
后端：Node.js + Express + TypeScript + Prisma ORM
数据库：SQLite（开发）/ PostgreSQL（生产）
认证：JWT (jsonwebtoken)
```

### 选择此技术栈的原因
- **全栈 TypeScript** - 前后端使用统一语言
- **Prisma ORM** - 类型安全的数据库访问，自动生成类型定义
- **Element Plus** - 企业级 UI 组件，开箱即用
- **Vite** - 即时开发服务器启动，毫秒级 HMR

---

## 项目结构（规划中）

```
/
├── frontend/                    # Vue 3 前端
│   └── src/
│       ├── views/              # 页面组件（按业务模块拆分）
│       ├── components/         # 可复用组件
│       ├── stores/             # Pinia 状态管理（按业务拆分）
│       ├── api/                # API 客户端（按业务拆分）
│       ├── router/             # Vue Router 配置
│       └── types/              # TypeScript 类型定义
│
├── backend/                     # Express 后端
│   └── src/
│       ├── routes/             # API 路由（按业务模块拆分）
│       ├── controllers/        # 请求处理器
│       ├── services/           # 业务逻辑层
│       ├── middleware/         # 认证、验证、错误处理
│       ├── validators/         # 请求验证（Zod schemas）
│       └── config/             # 应用配置
│
├── prisma/
│   └── schema.prisma           # 数据库模型定义
│
└── memory-bank/                 # 项目知识库
    ├── architecture.md         # 架构文档（必须阅读）
    └── changelog.md            # 变更日志（必须更新）
```

---

## 开发命令

### 后端
```bash
cd backend

# 安装依赖
npm install

# 运行开发服务器
npm run dev

# 数据库操作
npx prisma generate     # 修改 schema 后生成 Prisma Client
npx prisma migrate dev  # 创建并应用迁移
npx prisma studio       # 打开数据库查看器

# 类型检查
npx tsc --noEmit
```

### 前端
```bash
cd frontend

# 安装依赖
npm install

# 运行开发服务器
npm run dev

# 生产构建
npm run build

# 类型检查
npx vue-tsc --noEmit
```

---

## 数据库结构（概览）

**完整数据库结构请阅读** [memory-bank/architecture.md](./memory-bank/architecture.md)

主要模型：
- **User** - 用户表
- **Project** - 项目表
- **Customer** - 客户表
- **FinancialRecord** - 收支记录表
- **Supplier** - 供应商表
- **PurchaseOrder** - 采购单表
- **PurchaseItem** - 采购明细表
- **Logistics** - 物流信息表
- **Task** - 任务表
- **ProgressLog** - 进度日志表
- **Deliverable** - 交付文档表
- **AfterSales** - 售后服务表

---

## API 架构

### 路由结构（按模块拆分）
- `/api/auth` - 认证（登录、登出）
- `/api/projects` - 项目 CRUD
- `/api/projects/:id/financial` - 项目收支记录
- `/api/projects/:id/tasks` - 任务管理
- `/api/projects/:id/progress` - 进度日志
- `/api/purchase-orders` - 采购订单管理
- `/api/purchase-orders/:id/logistics` - 物流跟踪
- `/api/suppliers` - 供应商管理
- `/api/projects/:id/deliverables` - 交付文档

### 认证机制
- 基于 JWT 的认证
- 受保护的路由使用 `authenticate` 中间件
- Token 通过 `Authorization: Bearer <token>` 请求头传递

### 响应格式
```typescript
// 成功响应
{
  success: true,
  data: { ... }
}

// 错误响应
{
  success: false,
  message: "错误描述",
  errors: []
}
```

---

## 核心业务逻辑

### 财务计算
- **项目利润** = 总收入 - 总支出
- **收入来源**：电信公司付款（首付款、进度款、验收款）
- **支出分类**：设备采购、工程施工、差旅费用、业务费用

### 项目状态流转
状态应遵循预定义的流转路径，某些转换需要验证。

### 物流跟踪
- 无库存管理 - 仅跟踪采购内容和货物位置
- 物流信息关联到采购订单

---

## 开发工作流程

1. **阅读架构文档**：完整阅读 [memory-bank/architecture.md](./memory-bank/architecture.md)
2. **阅读设计文档**：完整阅读 [design-document.md](./design-document.md)
3. **数据库变更**：编辑 `prisma/schema.prisma` → `npx prisma migrate dev`
4. **后端开发**：创建路由 → 控制器 → 服务层 → 测试
5. **前端开发**：创建 API 客户端 → Vue 组件 → 测试
6. **更新文档**：完成功能后更新架构文档和变更日志

---

## 常用代码模式

### 后端 Service 模式（推荐）
```typescript
// services/project.service.ts
import { prisma } from '@/config/database';

export async function getProjectSummary(projectId: string) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      financialRecords: true,
      purchaseOrders: { include: { logistics: true } }
    }
  });

  // 业务逻辑计算...
  return summary;
}
```

### 前端 API 模式（推荐）
```typescript
// api/project.ts
import request from './request';

export function getProjects(params?: ProjectQueryParams) {
  return request.get<Project[]>('/api/projects', { params });
}
```

### Vue 组件模式（推荐）
```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getProjects } from '@/api/project';

const projects = ref<Project[]>([]);

onMounted(async () => {
  projects.value = await getProjects();
});
</script>
```

---

## 部署说明

### 环境变量
```bash
# .env（后端）
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key"
PORT=3000
```

### 数据库切换（开发 → 生产）
在 `prisma/schema.prisma` 中修改 `provider`：

```prisma
datasource db {
  provider = "sqlite"  # 改为 "postgresql" 用于生产
  url      = env("DATABASE_URL")
}
```

---

## 参考文档

- [memory-bank/architecture.md](./memory-bank/architecture.md) - **架构文档（必读）**
- [memory-bank/changelog.md](./memory-bank/changelog.md) - **变更日志（必须更新）**
- [design-document.md](./design-document.md) - **设计文档（必读）**
- [tech-stack.md](./tech-stack.md) - 技术栈详细说明
