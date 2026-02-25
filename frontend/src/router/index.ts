import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/stores/user'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    name: 'Layout',
    component: () => import('@/components/Layout/MainLayout.vue'),
    redirect: '/dashboard',
    meta: { requiresAuth: true },
    children: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('@/views/DashboardView.vue'),
        meta: { title: '仪表盘' }
      },
      {
        path: '/projects',
        name: 'Projects',
        component: () => import('@/views/Project/ListView.vue'),
        meta: { title: '项目管理' }
      },
      {
        path: '/projects/create',
        name: 'ProjectCreate',
        component: () => import('@/views/Project/FormView.vue'),
        meta: { title: '创建项目' }
      },
      {
        path: '/projects/:id',
        name: 'ProjectDetail',
        component: () => import('@/views/Project/DetailView.vue'),
        meta: { title: '项目详情' }
      },
      {
        path: '/financial',
        name: 'Financial',
        component: () => import('@/views/Financial/ListView.vue'),
        meta: { title: '财务管理' }
      },
      {
        path: '/suppliers',
        name: 'Suppliers',
        component: () => import('@/views/Supplier/ListView.vue'),
        meta: { title: '供应商管理' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, _from, next) => {
  const userStore = useUserStore()
  const isAuthenticated = userStore.isAuthenticated

  // 如果路由需要认证
  if (to.meta.requiresAuth !== false && !isAuthenticated) {
    next('/login')
    return
  }

  // 如果已登录且访问登录页
  if (to.path === '/login' && isAuthenticated) {
    next('/dashboard')
    return
  }

  next()
})

export default router
