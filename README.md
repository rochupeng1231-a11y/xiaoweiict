# ICT 项目管理系统

## 项目简介

这是一个轻量级 ICT 项目管理系统，用于管理从电信公司分包的小型 ICT 项目。

## 技术栈

### 前端
- Vue 3 + TypeScript
- Vite
- Element Plus
- Pinia
- Vue Router
- Axios

### 后端
- Node.js + Express
- TypeScript
- Prisma ORM
- JWT 认证
- Zod 验证

### 数据库
- 开发：SQLite
- 生产：PostgreSQL

## 项目结构

```
xiaoweiICT/
├── frontend/          # Vue 3 前端应用
├── backend/           # Express 后端应用
├── docs/              # 项目文档
├── memory-bank/       # 项目知识库
├── .gitignore
└── README.md
```

## 开发指南

请查看 `memory-bank/CLAUDE.md` 获取详细的开发说明。

### 初始化项目

后端：
```bash
cd backend
npm install
npx prisma migrate dev
npm run dev
```

前端：
```bash
cd frontend
npm install
npm run dev
```

## 功能特性

- 用户认证和授权
- 项目全生命周期管理
- 财务收支记录与利润核算
- 采购订单管理
- 物流跟踪
- 任务和进度管理
- 交付文档管理
- 售后服务

## 开发进度

详见 `memory-bank/progress.md`

---

*项目创建日期：2026-02-25*
