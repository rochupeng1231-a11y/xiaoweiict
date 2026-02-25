# ICT项目管理系统 - 技术栈推荐

## 推荐技术栈

基于**最简单但最健壮**的原则，推荐以下技术栈组合：

```
┌─────────────────────────────────────────────────────────┐
│                    前端展示层                            │
│  Vue 3 + TypeScript + Element Plus + Vite               │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                    后端服务层                            │
│  Node.js + Express + TypeScript + Prisma                │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                    数据存储层                            │
│  SQLite (开发) / PostgreSQL (生产)                       │
└─────────────────────────────────────────────────────────┘
```

---

## 1. 为什么选择这个技术栈？

### 1.1 核心原则

| 原则 | 说明 |
|------|------|
| **最简单** | 开发效率高，学习曲线平缓，代码量少 |
| **最健壮** | 成熟稳定，生态完善，长期维护有保障 |
| **可扩展** | 后期可以平滑升级和功能扩展 |
| **易部署** | 部署简单，运维成本低 |

### 1.2 为什么不选其他方案？

| 方案 | 优点 | 缺点 | 不选择原因 |
|------|------|------|-----------|
| React + TypeScript | 生态最强 | 学习曲线陡，配置复杂 | 对于小项目过度工程化 |
| Vue 2 + JavaScript | 上手最快 | 即将停止维护 | 技术债务风险 |
| Python + FastAPI | 代码简洁 | 异步生态不如Node | 团队可能不熟悉 |
| Go + Gin | 性能最佳 | 开发效率较低 | 对小项目来说过重 |
| MongoDB | 灵活 | 缺乏事务约束 | 关系数据更适合关系型数据库 |

---

## 2. 技术栈详细说明

### 2.1 前端技术栈

#### Vue 3 + TypeScript
```json
{
  "框架": "Vue 3.4+",
  "语言": "TypeScript 5.3+",
  "构建工具": "Vite 5.0+",
  "UI组件库": "Element Plus 2.5+",
  "状态管理": "Pinia 2.1+",
  "路由": "Vue Router 4.2+",
  "HTTP客户端": "Axios 1.6+",
  "代码规范": "ESLint + Prettier"
}
```

**选择理由：**

| 技术 | 理由 |
|------|------|
| Vue 3 | 渐进式框架，学习成本低，性能优秀 |
| TypeScript | 类型安全，减少bug，IDE支持好 |
| Vite | 极速开发体验，HMR秒级响应 |
| Element Plus | 组件丰富，企业级UI，开箱即用 |
| Pinia | Vue官方推荐，API简洁，TypeScript友好 |

**依赖安装：**
```bash
npm create vue@latest ict-project-manager
cd ict-project-manager
npm install element-plus @element-plus/icons-vue
npm install axios pinia
npm install -D @types/node sass
```

#### 推荐项目结构
```
src/
├── assets/          # 静态资源
├── components/      # 公共组件
│   ├── Layout/
│   ├── ProjectCard/
│   └── FinancialChart/
├── views/           # 页面组件
│   ├── Dashboard/
│   ├── Project/
│   ├── Purchase/
│   ├── Finance/
│   ├── Progress/
│   └── Deliverable/
├── router/          # 路由配置
├── stores/          # Pinia状态管理
│   ├── user.ts
│   └── project.ts
├── api/             # API接口
│   ├── request.ts   # axios封装
│   ├── project.ts
│   ├── finance.ts
│   └── ...
├── types/           # TypeScript类型定义
│   └── index.d.ts
├── utils/           # 工具函数
└── App.vue
```

---

### 2.2 后端技术栈

#### Node.js + Express + TypeScript
```json
{
  "运行时": "Node.js 20 LTS",
  "框架": "Express 4.18+",
  "语言": "TypeScript 5.3+",
  "ORM": "Prisma 5.8+",
  "身份验证": "JWT (jsonwebtoken)",
  "密码加密": "bcrypt",
  "参数验证": "Zod",
  "日志": "Winston / Pino",
  "API文档": "Swagger/OpenAPI"
}
```

**选择理由：**

| 技术 | 理由 |
|------|------|
| Node.js | JavaScript全栈，技术栈统一 |
| Express | 最成熟的Node框架，生态最大 |
| TypeScript | 类型安全，减少运行时错误 |
| Prisma | 现代ORM，类型安全，开发体验极佳 |
| JWT | 无状态认证，简单可靠 |
| Zod | 运行时类型验证，与TS完美配合 |

**依赖安装：**
```bash
npm init -y
npm install express cors helmet compression
npm install jsonwebtoken bcrypt zod
npm install @prisma/client
npm install -D typescript @types/node @types/express @types/cors @types/bcrypt
npm install -D prisma tsx nodemon
npm install -D eslint @typescript-eslint/eslint-plugin
```

#### 推荐项目结构
```
src/
├── config/          # 配置文件
│   ├── database.ts
│   └── index.ts
├── middleware/      # 中间件
│   ├── auth.ts
│   ├── error.ts
│   └── validation.ts
├── routes/          # 路由
│   ├── index.ts
│   ├── auth.ts
│   ├── projects.ts
│   ├── finance.ts
│   ├── purchase.ts
│   └── ...
├── controllers/     # 控制器
│   ├── project.controller.ts
│   ├── finance.controller.ts
│   └── ...
├── services/        # 业务逻辑
│   ├── project.service.ts
│   ├── finance.service.ts
│   └── ...
├── models/          # Prisma自动生成
├── types/           # TypeScript类型
│   └── index.ts
├── utils/           # 工具函数
│   ├── logger.ts
│   └── helpers.ts
└── app.ts           # 应用入口

prisma/
└── schema.prisma    # 数据库模型定义
```

---

### 2.3 数据库选择

#### 开发环境：SQLite
```prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}
```

**优势：**
- 无需安装数据库服务
- 零配置，开箱即用
- 文件存储，便于备份
- 适合单用户和小团队

#### 生产环境：PostgreSQL
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

**优势：**
- 最强大的开源关系型数据库
- 完整的ACID事务支持
- 丰富的数据类型
- 高性能和可扩展性

**切换方式：** 修改 `schema.prisma` 中的 provider，重新生成即可

---

## 3. 开发工具推荐

### 3.1 代码编辑器
- **VS Code** + 官方推荐插件

```
推荐插件:
- Vue - Official (Vue语言支持)
- TypeScript Vue Plugin (Volar)
- Prisma (Prisma语法高亮)
- ESLint (代码检查)
- Prettier (代码格式化)
- GitLens (Git增强)
- Thunder Client (API测试，替代Postman)
```

### 3.2 版本管理
- **Git** + **GitHub** / **Gitee**

### 3.3 API测试
- **Thunder Client** (VS Code插件) 或 **Postman**

### 3.4 数据库管理
- **Prisma Studio** (自带)
- **DBeaver** (通用数据库工具)

---

## 4. 完整技术栈清单

### 4.1 前端依赖

```json
{
  "dependencies": {
    "vue": "^3.4.0",
    "vue-router": "^4.2.0",
    "pinia": "^2.1.0",
    "axios": "^1.6.0",
    "element-plus": "^2.5.0",
    "@element-plus/icons-vue": "^2.3.0",
    "dayjs": "^1.11.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.0.0",
    "vite": "^5.0.0",
    "typescript": "^5.3.0",
    "sass": "^1.70.0",
    "eslint": "^8.56.0",
    "prettier": "^3.1.0"
  }
}
```

### 4.2 后端依赖

```json
{
  "dependencies": {
    "express": "^4.18.0",
    "@prisma/client": "^5.8.0",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "compression": "^1.7.4",
    "jsonwebtoken": "^9.0.2",
    "bcrypt": "^5.1.1",
    "zod": "^3.22.0",
    "winston": "^3.11.0",
    "dotenv": "^16.3.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "prisma": "^5.8.0",
    "tsx": "^4.7.0",
    "nodemon": "^3.0.0",
    "@types/node": "^20.10.0",
    "@types/express": "^4.17.0",
    "@types/cors": "^2.8.0",
    "@types/bcrypt": "^5.0.0",
    "@types/jsonwebtoken": "^9.0.0"
  }
}
```

---

## 5. 部署方案

### 5.1 开发环境

```bash
# 前端
cd frontend && npm run dev

# 后端
cd backend && npm run dev

# 数据库自动初始化
```

### 5.2 生产环境

#### 方案A：Docker部署 (推荐)

```yaml
# docker-compose.yml
version: '3.8'
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: ict_project
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./backend
    depends_on:
      - postgres
    environment:
      DATABASE_URL: postgresql://admin:password@postgres:5432/ict_project

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  postgres_data:
```

#### 方案B：Vercel + Railway (最简单)

| 服务 | 平台 | 说明 |
|------|------|------|
| 前端 | Vercel | 自动部署，免费额度充足 |
| 后端 | Railway / Render | 支持Node.js和PostgreSQL |
| 数据库 | Railway PostgreSQL | 托管数据库 |

**优势：**
- 无需服务器
- 自动HTTPS
- CI/CD自动化
- 适合小团队

---

## 6. 核心代码示例

### 6.1 Prisma数据模型示例

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite" // 开发用sqlite，生产改为postgresql
  url      = env("DATABASE_URL")
}

model Project {
  id             String   @id @default(uuid())
  projectCode    String   @unique
  telecomCode    String
  projectName    String
  customerName   String
  projectType    String
  projectAddress String
  contractAmount Decimal
  managerId      String
  startDate      DateTime
  endDate        DateTime
  status         String   @default("pending")
  description    String?
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  financialRecords FinancialRecord[]
  purchaseOrders   PurchaseOrder[]
  tasks            Task[]
  progressLogs     ProgressLog[]
}

model FinancialRecord {
  id            String   @id @default(uuid())
  projectId     String
  project       Project  @relation(fields: [projectId], references: [id])
  recordType    String   // income/expense
  costCategory  String?  // 设备/施工/差旅/业务
  amount        Decimal
  description   String
  invoiceNo     String?
  payee         String?  // 收款人/付款人
  transactionDate DateTime
  status        String   @default("pending")
  createdAt     DateTime @default(now())

  @@index([projectId])
}
```

### 6.2 API路由示例

```typescript
// src/routes/projects.ts
import { Router } from 'express';
import { getProjects, createProject, getProjectById } from '../controllers/project.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getProjects);
router.post('/', authenticate, createProject);
router.get('/:id', authenticate, getProjectById);

export default router;
```

### 6.3 前端Vue组件示例

```vue
<template>
  <el-card class="project-card">
    <template #header>
      <div class="card-header">
        <span>{{ project.projectName }}</span>
        <el-tag :type="statusType">{{ project.status }}</el-tag>
      </div>
    </template>
    <div class="project-info">
      <p>客户: {{ project.customerName }}</p>
      <p>合同金额: ¥{{ formatAmount(project.contractAmount) }}</p>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Project } from '@/types';

const props = defineProps<{
  project: Project;
}>();

const statusType = computed(() => {
  const map: Record<string, string> = {
    '进行中': 'success',
    '已完成': 'info',
    '待开始': 'warning'
  };
  return map[props.project.status] || '';
});

const formatAmount = (amount: number) => {
  return amount.toLocaleString();
};
</script>
```

---

## 7. 为什么这个技术栈最合适？

### 7.1 对小团队/个人开发友好

| 特性 | 好处 |
|------|------|
| 全栈TypeScript | 一套语言，降低心智负担 |
| Prisma ORM | 类型安全，自动生成类型，减少bug |
| Element Plus | 组件丰富，不用从零写UI |
| Vite | 开发体验极佳，启动秒级 |
| SQLite开发 | 无需安装数据库，开箱即用 |

### 7.2 长期维护有保障

| 技术 | GitHub Stars | 维护状态 |
|------|--------------|----------|
| Vue 3 | 42k+ | 活跃维护 |
| Express | 63k+ | 稳定成熟 |
| Prisma | 35k+ | 快速迭代 |
| PostgreSQL | - | 企业级标准 |

### 7.3 扩展性强

当项目需要扩展时：
- 前端可以轻松集成图表库(ECharts)、文档生成等
- 后端可以添加缓存(Redis)、队列(BullMQ)
- 数据库可以无缝从SQLite切换到PostgreSQL
- 支持微服务拆分

---

## 8. 学习资源

### 8.1 官方文档
- [Vue 3 文档](https://cn.vuejs.org/)
- [TypeScript 文档](https://www.typescriptlang.org/zh/docs/)
- [Express 文档](https://expressjs.com/)
- [Prisma 文档](https://www.prisma.io/docs)
- [Element Plus 文档](https://element-plus.org/zh-CN/)

### 8.2 推荐教程
- Vue 3 + TypeScript 实战
- NestJS / Express + Prisma 全栈开发
- Prisma 数据建模最佳实践

---

## 9. 总结

### 推荐技术栈核心优势

```
┌─────────────────────────────────────────────────┐
│  最简单                                         │
│  ├─ TypeScript全栈，技术栈统一                   │
│  ├─ Prisma自动生成类型，减少手写代码             │
│  ├─ Element Plus组件开箱即用                     │
│  └─ Vite极速开发体验                             │
├─────────────────────────────────────────────────┤
│  最健壮                                         │
│  ├─ 成熟稳定的技术生态                           │
│  ├─ TypeScript类型安全                          │
│  ├─ PostgreSQL企业级数据库                       │
│  └─ JWT标准认证方案                              │
├─────────────────────────────────────────────────┤
│  可扩展                                         │
│  ├─ 前后端分离架构                              │
│  ├─ ORM易于切换数据库                            │
│  ├─ 模块化设计便于功能扩展                       │
│  └─ Docker容器化部署                             │
└─────────────────────────────────────────────────┘
```

**一句话总结：**
> Vue 3 + TypeScript + Express + Prisma + PostgreSQL 是当前最适合中小项目的全栈技术栈，兼顾开发效率和系统稳定性。

---

*文档版本: 1.0*
*更新日期: 2026-02-25*
