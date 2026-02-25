# ICT项目管理系统 - 实施计划

## 计划概述

本文档为 AI 开发者提供详细的分步实施指令。每一步都包含具体任务和验证测试。

### 开发原则
- 每一步必须独立可验证
- 完成一步后再进行下一步
- 基础功能优先，高级功能后续添加
- 严格遵循模块化设计原则

### 参考文档
- 执行前必须阅读 [architecture.md](./architecture.md) - 完整数据库结构和架构
- 执行前必须阅读 [design-document.md](./design-document.md) - 业务需求
- 执行前必须阅读 [tech-stack.md](./tech-stack.md) - 技术栈说明

---

## 第一阶段：项目初始化

### 步骤 1.1：创建项目根目录结构

**任务：**
在 `xiaoweiICT` 目录下创建以下文件夹结构：

```
xiaoweiICT/
├── frontend/
├── backend/
├── docs/
└── .gitignore
```

**验证：**
- [ ] 所有文件夹已创建
- [ ] `.gitignore` 文件包含 `node_modules/`、`.env`、`*.db`

---

### 步骤 1.2：初始化后端项目

**任务：**
1. 在 `backend/` 目录下运行 `npm init -y`
2. 创建 `backend/src/` 文件夹
3. 创建以下子文件夹结构：
   ```
   backend/src/
   ├── config/
   ├── middleware/
   ├── routes/
   ├── controllers/
   ├── services/
   ├── validators/
   ├── types/
   └── utils/
   ```

**验证：**
- [ ] `backend/package.json` 文件存在
- [ ] 所有子文件夹已创建

---

### 步骤 1.3：安装后端核心依赖

**任务：**
在 `backend/` 目录下运行以下命令：

```bash
# 核心依赖
npm install express cors helmet compression
npm install jsonwebtoken bcrypt zod
npm install @prisma/client dotenv

# 开发依赖
npm install -D typescript @types/node @types/express @types/cors @types/bcrypt
npm install -D @types/jsonwebtoken
npm install -D prisma tsx nodemon
npm install -D eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser
```

**验证：**
- [ ] `backend/package.json` 包含所有依赖
- [ ] 运行 `npm list` 无缺失依赖错误

---

### 步骤 1.4：配置 TypeScript

**任务：**
1. 创建 `backend/tsconfig.json` 文件
2. 配置如下：
   - 目标 ES2022
   - 模块系统：commonjs
   - 严格模式开启
   - 输出目录：`dist`
   - 根目录：`src`
3. 添加 `npm scripts`：
   - `dev`: `nodemon --exec tsx src/app.ts`
   - `build`: `tsc`
   - `type-check`: `tsc --noEmit`

**验证：**
- [ ] 运行 `npm run type-check` 无错误
- [ ] `tsconfig.json` 配置正确

---

### 步骤 1.5：初始化 Prisma

**任务：**
1. 运行 `npx prisma init`
2. 这将创建 `backend/prisma/` 目录和 `.env` 文件
3. 配置 `.env` 文件：
   ```
   DATABASE_URL="file:./dev.db"
   JWT_SECRET="your-secret-key-change-in-production"
   PORT=3000
   ```

**验证：**
- [ ] `backend/prisma/schema.prisma` 文件存在
- [ ] `backend/.env` 文件存在并包含上述配置

---

### 步骤 1.6：定义数据库 Schema

**任务：**
1. 打开 `backend/prisma/schema.prisma`
2. 参考 `memory-bank/architecture.md` 中的完整数据库结构
3. 复制完整的 Prisma schema 到文件中
4. 确保包含所有模型：User, Project, Customer, FinancialRecord, Supplier, PurchaseOrder, PurchaseItem, Logistics, Task, ProgressLog, Deliverable, AfterSales

**验证：**
- [ ] Schema 包含所有 12 个模型
- [ ] 所有关系定义正确
- [ ] 运行 `npx prisma validate` 无错误

---

### 步骤 1.7：创建数据库迁移

**任务：**
1. 运行 `npx prisma migrate dev --name init`
2. 这将创建 `dev.db` 数据库和迁移文件
3. 运行 `npx prisma generate` 生成 Prisma Client

**验证：**
- [ ] `backend/prisma/dev.db` 文件存在
- [ ] `backend/prisma/migrations/` 文件夹包含迁移文件
- [ ] `backend/node_modules/.prisma/client/` 文件夹存在

---

### 步骤 1.8：创建数据库配置模块

**任务：**
1. 创建 `backend/src/config/database.ts`
2. 导出 Prisma Client 单例
3. 确保在开发环境使用日志查询

**验证：**
- [ ] 文件存在
- [ ] Prisma Client 正确导出
- [ ] 运行 `npm run type-check` 无错误

---

### 步骤 1.9：初始化前端项目

**任务：**
1. 在 `frontend/` 目录下运行：
   ```bash
   npm create vue@latest . -- --typescript --router --pinia --eslint
   ```
2. 确认所有提示选项

**验证：**
- [ ] `frontend/package.json` 文件存在
- [ ] `frontend/src/` 目录存在
- [ ] `frontend/vite.config.ts` 文件存在

---

### 步骤 1.10：安装前端依赖

**任务：**
在 `frontend/` 目录下运行：

```bash
# UI 组件库
npm install element-plus @element-plus/icons-vue

# HTTP 客户端和工具
npm install axios dayjs

# 开发依赖
npm install -D sass @types/node
```

**验证：**
- [ ] 所有依赖已安装
- [ ] 运行 `npm list` 无错误

---

### 步骤 1.11：配置 Element Plus

**任务：**
1. 修改 `frontend/src/main.ts`
2. 全局注册 Element Plus
3. 导入 Element Plus 样式
4. 导入图标库

**验证：**
- [ ] 运行 `npm run dev` 前端启动成功
- [ ] 浏览器访问 `http://localhost:5173` 无错误
- [ ] 控制台无 Element Plus 相关错误

---

### 步骤 1.12：配置前端 API 客户端基础

**任务：**
1. 创建 `frontend/src/api/` 文件夹
2. 创建 `frontend/src/api/request.ts`
3. 配置 axios 实例：
   - 基础 URL：`http://localhost:3000/api`
   - 请求超时：10000ms
   - 添加请求拦截器（添加 token）
   - 添加响应拦截器（处理错误）

**验证：**
- [ ] `request.ts` 文件存在
- [ ] axios 配置正确
- [ ] 拦截器函数存在

---

### 步骤 1.13：配置前端路由基础

**任务：**
1. 修改 `frontend/src/router/index.ts`
2. 添加基础路由结构：
   - 登录页 (`/login`)
   - 主布局 (`/`) 包含子路由：
     - 仪表盘 (`/dashboard`)
     - 项目管理 (`/projects`)
     - 其他占位路由

**验证：**
- [ ] 路由文件包含所有基础路由
- [ ] 运行 `npm run type-check` 无错误
- [ ] 浏览器访问不同路径显示正确页面

---

### 步骤 1.14：创建前端状态管理基础

**任务：**
1. 创建 `frontend/src/stores/user.ts`
2. 定义用户状态：
   - `user`: 用户信息对象或 null
   - `token`: JWT token
   - `isAuthenticated`: 计算属性
3. 定义 actions：
   - `setUser`: 设置用户信息
   - `setToken`: 设置 token
   - `logout`: 清除用户信息和 token

**验证：**
- [ ] `user.ts` store 文件存在
- [ ] 包含所有定义的状态和 actions
- [ ] 运行 `npm run type-check` 无错误

---

## 第二阶段：后端基础功能

### 步骤 2.1：创建错误处理中间件

**任务：**
1. 创建 `backend/src/middleware/error.ts`
2. 定义错误处理函数：
   - 捕获所有错误
   - 记录错误日志
   - 返回统一格式的错误响应
3. 创建 `backend/src/utils/errors.ts` 定义自定义错误类

**验证：**
- [ ] 错误中间件文件存在
- [ ] 自定义错误类存在
- [ ] 错误响应格式统一

---

### 步骤 2.2：创建日志工具

**任务：**
1. 创建 `backend/src/utils/logger.ts`
2. 实现日志功能：
   - info 级别
   - warn 级别
   - error 级别
3. 输出格式包含时间戳和级别

**验证：**
- [ ] `logger.ts` 文件存在
- [ ] 包含所有日志级别函数
- [ ] 日志格式包含时间戳

---

### 步骤 2.3：创建验证工具（Zod schemas）

**任务：**
1. 创建 `backend/src/validators/auth.validator.ts`
2. 定义登录验证 schema：
   - username: 必填，字符串，最少 3 字符
   - password: 必填，字符串，最少 6 字符
3. 创建验证中间件函数

**验证：**
- [ ] 验证文件存在
- [ ] schema 定义正确
- [ ] 验证中间件函数存在

---

### 步骤 2.4：创建 JWT 工具

**任务：**
1. 创建 `backend/src/utils/jwt.ts`
2. 实现以下函数：
   - `generateToken(payload)`: 生成 JWT token
   - `verifyToken(token)`: 验证 JWT token
3. 使用 `.env` 中的 `JWT_SECRET`

**验证：**
- [ ] `jwt.ts` 文件存在
- [ ] 包含生成和验证函数
- [ ] 函数使用环境变量中的密钥

---

### 步骤 2.5：创建认证中间件

**任务：**
1. 创建 `backend/src/middleware/auth.ts`
2. 实现认证逻辑：
   - 从请求头获取 token
   - 验证 token 有效性
   - 解析用户信息并附加到 `req.user`
   - 未认证返回 401 错误

**验证：**
- [ ] `auth.ts` 文件存在
- [ ] 认证逻辑正确实现
- [ ] 错误处理正确

---

### 步骤 2.6：创建用户模块 Service

**任务：**
1. 创建 `backend/src/services/user.service.ts`
2. 实现以下函数：
   - `findUserByUsername(username)`: 根据用户名查找用户
   - `validatePassword(password, hash)`: 验证密码
   - `createUser(data)`: 创建新用户
3. 使用 Prisma Client 操作数据库

**验证：**
- [ ] `user.service.ts` 文件存在
- [ ] 包含所有定义的函数
- [ ] 运行 `npm run type-check` 无错误

---

### 步骤 2.7：创建认证模块 Controller

**任务：**
1. 创建 `backend/src/controllers/auth.controller.ts`
2. 实现以下控制器函数：
   - `login`: 处理登录请求
     - 验证请求数据
     - 查找用户
     - 验证密码
     - 生成 JWT token
     - 返回用户信息和 token
   - `me`: 获取当前用户信息

**验证：**
- [ ] `auth.controller.ts` 文件存在
- [ ] 包含登录和获取用户函数
- [ ] 运行 `npm run type-check` 无错误

---

### 步骤 2.8：创建认证路由

**任务：**
1. 创建 `backend/src/routes/auth.ts`
2. 定义以下路由：
   - `POST /login` - 用户登录（公开）
   - `GET /me` - 获取当前用户（需认证）
3. 使用验证中间件和认证中间件

**验证：**
- [ ] `auth.ts` 路由文件存在
- [ ] 包含所有定义的路由
- [ ] 中间件正确应用

---

### 步骤 2.9：创建应用入口文件

**任务：**
1. 创建 `backend/src/app.ts`
2. 实现以下功能：
   - 创建 Express 应用
   - 应用全局中间件（cors, helmet, compression, json）
   - 注册路由
   - 应用错误处理中间件
   - 启动服务器

**验证：**
- [ ] `app.ts` 文件存在
- [ ] 所有中间件已应用
- [ ] 路由已注册
- [ ] 服务器启动配置正确

---

### 步骤 2.10：测试后端启动

**任务：**
1. 运行 `npm run dev`
2. 服务器应在 3000 端口启动
3. 测试健康检查端点

**验证：**
- [ ] 服务器成功启动
- [ ] 控制台显示监听端口 3000
- [ ] 访问 `http://localhost:3000` 返回响应

---

### 步骤 2.11：测试注册用户 API

**任务：**
使用 Prisma Studio 或 API 创建测试用户：
1. 运行 `npx prisma studio`
2. 手动创建一个测试用户（密码需要 bcrypt hash）
3. 或创建临时注册 API

**验证：**
- [ ] Prisma Studio 可以打开
- [ ] 测试用户创建成功
- [ ] 密码已正确加密

---

### 步骤 2.12：测试登录 API

**任务：**
使用 Thunder Client 或 Postman 测试：
1. 发送 POST 请求到 `http://localhost:3000/api/auth/login`
2. 请求体：
   ```json
   {
     "username": "测试用户名",
     "password": "测试密码"
   }
   ```

**验证：**
- [ ] 登录成功返回 token
- [ ] 响应包含用户信息
- [ ] 错误的用户名返回 401
- [ ] 错误的密码返回 401

---

### 步骤 2.13：测试认证中间件

**任务：**
1. 使用登录获取的 token
2. 发送 GET 请求到 `http://localhost:3000/api/auth/me`
3. 请求头添加：`Authorization: Bearer <token>`

**验证：**
- [ ] 正确的 token 返回用户信息
- [ ] 无 token 返回 401
- [ ] 无效的 token 返回 401

---

## 第三阶段：项目 CRUD 功能

### 步骤 3.1：创建项目验证 Schema

**任务：**
1. 创建 `backend/src/validators/project.validator.ts`
2. 定义创建项目验证 schema：
   - projectCode: 必填，唯一
   - telecomCode: 必填
   - projectName: 必填
   - customerName: 必填
   - projectType: 必填
   - contractAmount: 必填，正数
   - managerId: 必填，有效的 UUID
   - startDate: 必填，日期
   - endDate: 必填，日期
   - status: 默认 "pending"
   - description: 可选

**验证：**
- [ ] 验证文件存在
- [ ] 所有字段正确定义
- [ ] 运行 `npm run type-check` 无错误

---

### 步骤 3.2：创建项目 Service - 查询功能

**任务：**
1. 创建 `backend/src/services/project.service.ts`
2. 实现查询函数：
   - `getProjects(filters)`: 获取项目列表，支持筛选
   - `getProjectById(id)`: 根据 ID 获取项目详情
3. 支持的筛选：状态、项目经理、日期范围

**验证：**
- [ ] Service 文件存在
- [ ] 包含查询函数
- [ ] 运行 `npm run type-check` 无错误

---

### 步骤 3.3：创建项目 Service - 创建功能

**任务：**
在 `project.service.ts` 中添加：
1. `createProject(data)`: 创建新项目
   - 生成唯一的项目编号
   - 验证用户存在
   - 设置默认状态

**验证：**
- [ ] 创建函数存在
- [ ] 包含业务逻辑验证
- [ ] 运行 `npm run type-check` 无错误

---

### 步骤 3.4：创建项目 Service - 更新和删除

**任务：**
在 `project.service.ts` 中添加：
1. `updateProject(id, data)`: 更新项目
   - 验证项目存在
   - 状态流转验证
2. `deleteProject(id)`: 删除项目
   - 软删除或硬删除

**验证：**
- [ ] 更新函数存在
- [ ] 删除函数存在
- [ ] 运行 `npm run type-check` 无错误

---

### 步骤 3.5：创建项目 Controller

**任务：**
1. 创建 `backend/src/controllers/project.controller.ts`
2. 实现以下函数：
   - `getProjects`: 获取项目列表
   - `getProject`: 获取单个项目
   - `createProject`: 创建项目
   - `updateProject`: 更新项目
   - `deleteProject`: 删除项目
3. 所有函数使用 try-catch 处理错误

**验证：**
- [ ] Controller 文件存在
- [ ] 包含所有 CRUD 函数
- [ ] 运行 `npm run type-check` 无错误

---

### 步骤 3.6：创建项目路由

**任务：**
1. 创建 `backend/src/routes/projects.ts`
2. 定义以下路由：
   - `GET /` - 获取项目列表（需认证）
   - `GET /:id` - 获取项目详情（需认证）
   - `POST /` - 创建项目（需认证）
   - `PUT /:id` - 更新项目（需认证）
   - `DELETE /:id` - 删除项目（需认证）
3. 应用验证和认证中间件

**验证：**
- [ ] 路由文件存在
- [ ] 所有路由已定义
- [ ] 中间件正确应用

---

### 步骤 3.7：注册项目路由到主应用

**任务：**
1. 修改 `backend/src/routes/index.ts`（如不存在则创建）
2. 导入项目路由
3. 挂载到 `/api/projects`

**验证：**
- [ ] 路由已导入
- [ ] 路由已挂载到正确路径
- [ ] 运行 `npm run dev` 无错误

---

### 步骤 3.8：测试创建项目 API

**任务：**
使用 Thunder Client 测试：
1. POST 请求到 `http://localhost:3000/api/projects`
2. 请求头包含有效 token
3. 请求体包含有效项目数据

**验证：**
- [ ] 成功创建返回项目数据
- [ ] 无 token 返回 401
- [ ] 无效数据返回 400
- [ ] 重复项目编号返回错误

---

### 步骤 3.9：测试获取项目列表 API

**任务：**
1. GET 请求到 `http://localhost:3000/api/projects`
2. 请求头包含有效 token
3. 测试查询参数：status, managerId

**验证：**
- [ ] 返回项目列表
- [ ] 状态筛选正确工作
- [ ] 分页正确工作（如已实现）

---

### 步骤 3.10：测试项目详情 API

**任务：**
1. GET 请求到 `http://localhost:3000/api/projects/:id`
2. 使用步骤 3.8 创建的项目 ID
3. 测试无效 ID

**验证：**
- [ ] 有效 ID 返回项目详情
- [ ] 无效 ID 返回 404
- [ ] 响应包含所有字段

---

### 步骤 3.11：测试更新项目 API

**任务：**
1. PUT 请求到 `http://localhost:3000/api/projects/:id`
2. 更新部分字段（如 status, description）
3. 测试状态流转验证

**验证：**
- [ ] 更新成功返回新数据
- [ ] 无效状态转换返回错误
- [ ] 无效 ID 返回 404

---

### 步骤 3.12：测试删除项目 API

**任务：**
1. DELETE 请求到 `http://localhost:3000/api/projects/:id`
2. 验证项目已删除
3. 尝试获取已删除的项目

**验证：**
- [ ] 删除成功
- [ ] 获取已删除项目返回 404

---

## 第四阶段：前端基础功能

### 步骤 4.1：创建前端 API 模块 - 认证

**任务：**
1. 创建 `frontend/src/api/auth.ts`
2. 实现以下函数：
   - `login(username, password)`: 登录
   - `logout()`: 登出
   - `getCurrentUser()`: 获取当前用户
3. 使用配置的 axios 实例

**验证：**
- [ ] `auth.ts` 文件存在
- [ ] 包含所有函数
- [ ] 运行 `npm run type-check` 无错误

---

### 步骤 4.2：创建登录页面

**任务：**
1. 创建 `frontend/src/views/LoginView.vue`
2. 使用 Element Plus 表单组件
3. 表单包含：
   - 用户名输入框
   - 密码输入框
   - 登录按钮
4. 实现表单验证

**验证：**
- [ ] 登录页面组件存在
- [ ] 表单正确渲染
- [ ] 访问 `/login` 显示登录页面

---

### 步骤 4.3：实现登录功能

**任务：**
1. 在登录页面调用登录 API
2. 成功后：
   - 保存 token 到 user store
   - 保存用户信息
   - 跳转到仪表盘
3. 失败显示错误消息

**验证：**
- [ ] 登录成功跳转到仪表盘
- [ ] 登录失败显示错误
- [ ] token 正确保存到 store

---

### 步骤 4.4：创建路由守卫

**任务：**
1. 修改 `frontend/src/router/index.ts`
2. 添加全局前置守卫：
   - 未登录访问受保护路由重定向到登录
   - 已登录访问登录页重定向到仪表盘
3. 从 user store 读取认证状态

**验证：**
- [ ] 未登录访问 `/dashboard` 重定向到登录
- [ ] 已登录访问 `/login` 重定向到仪表盘
- [ ] 登录后可访问受保护页面

---

### 步骤 4.5：创建主布局组件

**任务：**
1. 创建 `frontend/src/components/Layout/MainLayout.vue`
2. 实现以下结构：
   - 顶部导航栏（Logo、用户信息、退出按钮）
   - 侧边栏菜单
   - 主内容区
3. 使用 Element Plus 组件

**验证：**
- [ ] 布局组件存在
- [ ] 导航栏正确显示
- [ ] 侧边栏菜单正确显示
- [ ] 用户信息正确显示

---

### 步骤 4.6：更新路由使用主布局

**任务：**
1. 修改 `frontend/src/router/index.ts`
2. 所有受保护路由使用 MainLayout
3. 设置默认路由为仪表盘

**验证：**
- [ ] 仪表盘使用主布局
- [ ] 所有页面使用主布局
- [ ] 菜单高亮当前页面

---

### 步骤 4.7：创建前端 API 模块 - 项目

**任务：**
1. 创建 `frontend/src/api/project.ts`
2. 实现以下函数：
   - `getProjects(params)`: 获取项目列表
   - `getProject(id)`: 获取项目详情
   - `createProject(data)`: 创建项目
   - `updateProject(id, data)`: 更新项目
   - `deleteProject(id)`: 删除项目

**验证：**
- [ ] `project.ts` 文件存在
- [ ] 包含所有 CRUD 函数
- [ ] 运行 `npm run type-check` 无错误

---

### 步骤 4.8：创建项目类型定义

**任务：**
1. 创建 `frontend/src/types/project.d.ts`
2. 定义 Project 接口：
   - id
   - projectCode
   - telecomCode
   - projectName
   - customerName
   - projectType
   - contractAmount
   - managerId
   - startDate
   - endDate
   - status
   - description

**验证：**
- [ ] 类型文件存在
- [ ] Project 接口包含所有字段
- [ ] 运行 `npm run type-check` 无错误

---

### 步骤 4.9：创建项目列表页面

**任务：**
1. 创建 `frontend/src/views/Project/ListView.vue`
2. 使用 Element Plus Table 显示项目列表
3. 实现功能：
   - 显示项目基本信息
   - 状态标签显示
   - 操作按钮（查看、编辑、删除）
   - 搜索/筛选功能

**验证：**
- [ ] 列表页面正确显示
- [ ] 表格显示项目数据
- [ ] 状态标签正确着色
- [ ] 操作按钮存在

---

### 步骤 4.10：实现项目列表数据加载

**任务：**
1. 在 `ListView.vue` 中调用 `getProjects` API
2. 在组件挂载时加载数据
3. 添加加载状态
4. 处理错误情况

**验证：**
- [ ] 页面加载时显示项目列表
- [ ] 加载中显示加载动画
- [ ] 错误时显示错误消息
- [ ] 空列表显示空状态

---

### 步骤 4.11：创建新建项目表单

**任务：**
1. 创建 `frontend/src/views/Project/FormView.vue`
2. 使用 Element Plus 表单
3. 表单包含所有必填字段
4. 实现表单验证规则

**验证：**
- [ ] 表单页面正确显示
- [ ] 所有输入字段存在
- [ ] 表单验证规则生效
- [ ] 必填字段标记正确

---

### 步骤 4.12：实现创建项目功能

**任务：**
1. 在表单页面实现提交逻辑
2. 调用 `createProject` API
3. 成功后跳转到列表页
4. 失败显示错误消息

**验证：**
- [ ] 提交成功创建项目
- [ ] 成功后跳转到列表
- [ ] 验证失败显示错误
- [ ] API 失败显示错误

---

### 步骤 4.13：创建项目详情页面

**任务：**
1. 创建 `frontend/src/views/Project/DetailView.vue`
2. 使用 Element Plus Card/Descriptions 显示详情
3. 显示项目所有信息
4. 添加编辑和返回按钮

**验证：**
- [ ] 详情页面正确显示
- [ ] 所有字段正确显示
- [ ] 金额格式化显示
- [ ] 日期格式化显示

---

### 步骤 4.14：实现项目详情数据加载

**任务：**
1. 从路由参数获取项目 ID
2. 调用 `getProject` API
3. 加载状态处理
4. 项目不存在显示 404

**验证：**
- [ ] 正确加载项目详情
- [ ] 加载中显示加载动画
- [ ] 无效 ID 显示 404
- [ ] 返回按钮正确工作

---

### 步骤 4.15：实现项目编辑功能

**任务：**
1. 复用表单组件或创建编辑页面
2. 预填充现有数据
3. 提交时调用 `updateProject` API
4. 成功后返回详情页

**验证：**
- [ ] 编辑页面显示现有数据
- [ ] 提交成功更新项目
- [ ] 更新后显示新数据
- [ ] 验证规则生效

---

### 步骤 4.16：实现项目删除功能

**任务：**
1. 在列表页添加删除确认
2. 使用 Element Plus MessageBox
3. 确认后调用 `deleteProject` API
4. 成功后刷新列表

**验证：**
- [ ] 点击删除显示确认对话框
- [ ] 取消不执行删除
- [ ] 确认后删除成功
- [ ] 删除后列表更新

---

### 步骤 4.17：创建仪表盘页面

**任务：**
1. 创建 `frontend/src/views/DashboardView.vue`
2. 使用 Element Plus 统计卡片
3. 显示：
   - 项目总数
   - 进行中项目数
   - 已完成项目数
4. 简单图表（可选）

**验证：**
- [ ] 仪表盘页面正确显示
- [ ] 统计卡片显示正确数据
- [ ] 数据正确计算

---

### 步骤 4.18：实现仪表盘数据加载

**任务：**
1. 调用 API 获取项目统计数据
2. 可以使用现有的 `getProjects` API
3. 在前端计算统计数据
4. 实时更新

**验证：**
- [ ] 仪表盘显示正确统计
- [ ] 数据实时更新
- [ ] 加载状态正确显示

---

## 第五阶段：财务管理功能

### 步骤 5.1：创建收支记录验证 Schema

**任务：**
1. 创建 `backend/src/validators/financial.validator.ts`
2. 定义收支记录验证 schema：
   - projectId: 必填，有效的 UUID
   - recordType: 必填，"income" 或 "expense"
   - costCategory: 支出时必填
   - amount: 必填，正数
   - description: 必填
   - invoiceNo: 可选
   - payee: 可选
   - transactionDate: 必填，日期
   - status: 默认 "pending"

**验证：**
- [ ] 验证文件存在
- [ ] schema 定义正确
- [ ] 运行 `npm run type-check` 无错误

---

### 步骤 5.2：创建财务 Service

**任务：**
1. 创建 `backend/src/services/financial.service.ts`
2. 实现以下函数：
   - `getFinancialRecords(projectId)`: 获取项目的收支记录
   - `createFinancialRecord(data)`: 创建收支记录
   - `updateFinancialRecord(id, data)`: 更新记录
   - `deleteFinancialRecord(id)`: 删除记录
   - `calculateProfit(projectId)`: 计算项目利润

**验证：**
- [ ] Service 文件存在
- [ ] 包含所有函数
- [ ] 利润计算逻辑正确

---

### 步骤 5.3：创建财务 Controller

**任务：**
1. 创建 `backend/src/controllers/financial.controller.ts`
2. 实现以下函数：
   - `getFinancialRecords`: 获取收支列表
   - `createFinancialRecord`: 创建记录
   - `updateFinancialRecord`: 更新记录
   - `deleteFinancialRecord`: 删除记录
   - `getProjectProfit`: 获取利润分析

**验证：**
- [ ] Controller 文件存在
- [ ] 包含所有函数
- [ ] 运行 `npm run type-check` 无错误

---

### 步骤 5.4：创建财务路由

**任务：**
1. 创建 `backend/src/routes/financial.ts`
2. 定义以下路由：
   - `GET /projects/:id/financial` - 获取收支记录
   - `POST /projects/:id/financial` - 创建记录
   - `PUT /financial/:id` - 更新记录
   - `DELETE /financial/:id` - 删除记录
   - `GET /projects/:id/profit` - 获取利润

**验证：**
- [ ] 路由文件存在
- [ ] 所有路由已定义
- [ ] 中间件正确应用

---

### 步骤 5.5：注册财务路由

**任务：**
1. 修改 `backend/src/routes/index.ts`
2. 导入财务路由
3. 挂载到正确路径

**验证：**
- [ ] 路由已注册
- [ ] 运行 `npm run dev` 无错误

---

### 步骤 5.6：测试收支记录 API

**任务：**
使用 Thunder Client 测试：
1. POST 创建收支记录
2. GET 获取收支列表
3. GET 获取利润分析

**验证：**
- [ ] 创建记录成功
- [ ] 获取列表成功
- [ ] 利润计算正确
- [ ] 收入支出分类正确

---

### 步骤 5.7：创建前端财务 API

**任务：**
1. 创建 `frontend/src/api/financial.ts`
2. 实现以下函数：
   - `getFinancialRecords(projectId)`
   - `createFinancialRecord(projectId, data)`
   - `updateFinancialRecord(id, data)`
   - `deleteFinancialRecord(id)`
   - `getProjectProfit(projectId)`

**验证：**
- [ ] API 文件存在
- [ ] 包含所有函数
- [ ] 运行 `npm run type-check` 无错误

---

### 步骤 5.8：创建财务类型定义

**任务：**
1. 创建 `frontend/src/types/financial.d.ts`
2. 定义 FinancialRecord 接口

**验证：**
- [ ] 类型文件存在
- [ ] 接口定义完整

---

### 步骤 5.9：在项目详情页添加财务信息

**任务：**
1. 修改 `frontend/src/views/Project/DetailView.vue`
2. 添加财务概况卡片：
   - 收入总额
   - 支出总额
   - 预计利润
   - 利润率

**验证：**
- [ ] 财务卡片显示
- [ ] 数据正确加载
- [ ] 金额格式化显示

---

### 步骤 5.10：创建收支记录列表

**任务：**
1. 在项目详情页添加收支记录标签页
2. 使用 Element Plus Table 显示记录
3. 区分收入和支出的显示样式
4. 添加新增记录按钮

**验证：**
- [ ] 标签页存在
- [ ] 记录列表正确显示
- [ ] 收入支出样式区分
- [ ] 新增按钮存在

---

### 步骤 5.11：创建收支记录表单

**任务：**
1. 创建收支记录对话框或独立页面
2. 表单包含所有字段
3. 根据记录类型显示不同字段

**验证：**
- [ ] 表单正确显示
- [ ] 收入/支出表单动态切换
- [ ] 表单验证生效

---

### 步骤 5.12：实现收支记录 CRUD

**任务：**
1. 实现创建记录功能
2. 实现编辑记录功能
3. 实现删除记录功能
4. 操作后刷新财务数据

**验证：**
- [ ] 创建记录成功
- [ ] 编辑记录成功
- [ ] 删除记录成功
- [ ] 财务数据实时更新

---

## 第六阶段：采购和物流功能

### 步骤 6.1：创建供应商验证和 Service

**任务：**
1. 创建 `backend/src/validators/supplier.validator.ts`
2. 创建 `backend/src/services/supplier.service.ts`
3. 实现供应商 CRUD 函数

**验证：**
- [ ] 验证文件存在
- [ ] Service 文件存在
- [ ] 包含 CRUD 函数

---

### 步骤 6.2：创建供应商 API

**任务：**
1. 创建供应商 Controller
2. 创建供应商路由
3. 注册路由

**验证：**
- [ ] Controller 存在
- [ ] 路由存在
- [ ] API 可访问

---

### 步骤 6.3：创建采购单验证和 Service

**任务：**
1. 创建 `backend/src/validators/purchase.validator.ts`
2. 创建 `backend/src/services/purchase.service.ts`
3. 实现采购单 CRUD 函数
4. 支持采购明细

**验证：**
- [ ] 验证文件存在
- [ ] Service 存在
- [ ] 支持明细处理

---

### 步骤 6.4：创建采购单 API

**任务：**
1. 创建采购单 Controller
2. 创建采购单路由
3. 注册路由

**验证：**
- [ ] API 端点可访问
- [ ] 创建采购单成功
- [ ] 获取采购单列表成功

---

### 步骤 6.5：创建物流验证和 Service

**任务：**
1. 创建 `backend/src/services/logistics.service.ts`
2. 实现以下函数：
   - `createLogistics(data)`: 创建物流信息
   - `getLogistics(purchaseOrderId)`: 获取物流信息
   - `updateLogistics(id, data)`: 更新物流
   - `confirmReceipt(id)`: 确认收货

**验证：**
- [ ] Service 文件存在
- [ ] 包含所有函数
- [ ] 收货确认逻辑正确

---

### 步骤 6.6：创建物流 API

**任务：**
1. 创建物流 Controller
2. 创建物流路由
3. 注册路由

**验证：**
- [ ] API 可访问
- [ ] 物流信息创建成功
- [ ] 收货确认成功

---

### 步骤 6.7：创建前端采购 API

**任务：**
1. 创建 `frontend/src/api/purchase.ts`
2. 实现采购单和供应商 API 调用

**验证：**
- [ ] API 文件存在
- [ ] 函数完整

---

### 步骤 6.8：创建采购管理页面

**任务：**
1. 创建采购单列表页面
2. 创建采购单详情页面
3. 创建采购单表单

**验证：**
- [ ] 列表页面显示
- [ ] 详情页面显示
- [ ] 表单页面工作

---

### 步骤 6.9：实现物流跟踪功能

**任务：**
1. 在项目详情页添加物流标签页
2. 显示采购单和物流信息
3. 实现收货确认功能

**验证：**
- [ ] 物流信息显示
- [ ] 收货确认工作
- [ ] 状态更新正确

---

## 第七阶段：任务和进度管理

### 步骤 7.1：创建任务验证和 Service

**任务：**
1. 创建 `backend/src/validators/task.validator.ts`
2. 创建 `backend/src/services/task.service.ts`
3. 实现任务 CRUD 函数
4. 支持任务状态和进度更新

**验证：**
- [ ] 验证文件存在
- [ ] Service 存在
- [ ] 进度更新逻辑正确

---

### 步骤 7.2：创建任务 API

**任务：**
1. 创建任务 Controller
2. 创建任务路由
3. 注册路由

**验证：**
- [ ] API 可访问
- [ ] 任务 CRUD 成功

---

### 步骤 7.3：创建进度日志 Service

**任务：**
1. 创建 `backend/src/services/progress.service.ts`
2. 实现进度日志 CRUD 函数
3. 支持照片上传（文件路径）

**验证：**
- [ ] Service 存在
- [ ] 函数完整

---

### 步骤 7.4：创建进度日志 API

**任务：**
1. 创建进度日志 Controller
2. 创建进度日志路由
3. 注册路由

**验证：**
- [ ] API 可访问
- [ ] 日志记录成功

---

### 步骤 7.5：创建前端任务 API

**任务：**
1. 创建 `frontend/src/api/task.ts`
2. 实现任务和进度日志 API

**验证：**
- [ ] API 文件存在
- [ ] 函数完整

---

### 步骤 7.6：创建任务管理页面

**任务：**
1. 创建任务列表页面
2. 使用看板或列表视图
3. 支持拖拽（可选）

**验证：**
- [ ] 任务列表显示
- [ ] 任务状态更新
- [ ] 任务创建和编辑

---

### 步骤 7.7：创建进度日志页面

**任务：**
1. 创建进度日志列表页面
2. 创建提交日志表单
3. 支持照片上传

**验证：**
- [ ] 日志列表显示
- [ ] 日志提交成功
- [ ] 照片上传工作

---

## 第八阶段：交付和售后功能

### 步骤 8.1：创建交付文档 Service

**任务：**
1. 创建 `backend/src/services/deliverable.service.ts`
2. 实现文档上传和记录函数
3. 文件存储到本地或云存储

**验证：**
- [ ] Service 存在
- [ ] 文件上传功能工作

---

### 步骤 8.2：创建交付文档 API

**任务：**
1. 创建交付文档 Controller
2. 创建交付文档路由
3. 注册路由

**验证：**
- [ ] API 可访问
- [ ] 文档上传成功

---

### 步骤 8.3：创建售后服务 Service

**任务：**
1. 创建 `backend/src/services/afterSales.service.ts`
2. 实现售后记录 CRUD 函数
3. 质保期计算

**验证：**
- [ ] Service 存在
- [ ] 函数完整

---

### 步骤 8.4：创建售后服务 API

**任务：**
1. 创建售后服务 Controller
2. 创建售后服务路由
3. 注册路由

**验证：**
- [ ] API 可访问
- [ ] 售后记录成功

---

### 步骤 8.5：创建前端交付管理页面

**任务：**
1. 创建交付文档列表页面
2. 创建文档上传功能
3. 文档下载功能

**验证：**
- [ ] 文档列表显示
- [ ] 上传功能工作
- [ ] 下载功能工作

---

### 步骤 8.6：创建前端售后管理页面

**任务：**
1. 创建售后记录列表页面
2. 创建售后记录表单
3. 质保到期提醒

**验证：**
- [ ] 列表页面显示
- [ ] 表单工作
- [ ] 提醒功能显示

---

## 第九阶段：完善和优化

### 步骤 9.1：添加数据导出功能

**任务：**
1. 后端实现导出 API
2. 前端实现导出按钮
3. 支持 Excel/CSV 格式

**验证：**
- [ ] 导出功能工作
- [ ] 文件格式正确

---

### 步骤 9.2：添加数据导入功能

**任务：**
1. 后端实现导入 API
2. 前端实现文件上传
3. 数据验证和错误处理

**验证：**
- [ ] 导入功能工作
- [ ] 错误处理正确

---

### 步骤 9.3：优化错误处理

**任务：**
1. 统一后端错误响应格式
2. 前端统一错误提示
3. 添加用户友好的错误消息

**验证：**
- [ ] 错误消息友好
- [ ] 错误处理一致

---

### 步骤 9.4：添加加载状态

**任务：**
1. 所有 API 调用添加加载状态
2. 使用 Element Plus Loading 组件
3. 优化用户体验

**验证：**
- [ ] 加载状态显示
- [ ] 用户体验流畅

---

### 步骤 9.5：添加响应式设计

**任务：**
1. 确保页面适配不同屏幕
2. 使用 Element Plus Grid
3. 移动端适配

**验证：**
- [ ] 桌面显示正常
- [ ] 平板显示正常
- [ ] 手机显示正常

---

### 步骤 9.6：性能优化

**任务：**
1. 前端路由懒加载
2. 列表分页
3. 图片优化

**验证：**
- [ ] 页面加载速度
- [ ] 列表滚动流畅

---

### 步骤 9.7：编写文档

**任务：**
1. 更新 README.md
2. 编写部署说明
3. 编写用户手册

**验证：**
- [ ] 文档完整
- [ ] 说明清晰

---

### 步骤 9.8：最终测试

**任务：**
1. 完整功能测试
2. 边界情况测试
3. 性能测试
4. 安全测试

**验证：**
- [ ] 所有功能正常
- [ ] 无重大 bug
- [ ] 性能满足要求

---

## 完成标准

每个阶段完成后，更新 [memory-bank/changelog.md](./changelog.md) 记录进度。

基础功能完成后应包含：
- [ ] 用户认证和授权
- [ ] 项目 CRUD
- [ ] 收支记录
- [ ] 利润计算
- [ ] 采购订单管理
- [ ] 物流跟踪
- [ ] 任务管理
- [ ] 进度日志
- [ ] 交付文档
- [ ] 售后服务

---

*计划版本: 1.0*
*创建日期: 2026-02-25*
