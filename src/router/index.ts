import { createRouter, createWebHistory } from 'vue-router'
import { usePermissionStore } from '@/stores/permission'
import { env } from '@/utils/env'


// 导入布局组件
const Layout = () => import('@/layout/index.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { requiresAuth: false }
    },
    // 带布局的路由
    {
      path: '/',
      component: Layout,
      meta: { requiresAuth: true },
      children: [
        {
          path: 'home',
          name: 'home',
          component: () => import('../views/HomeView.vue'),
          meta: { title: '首页', permission: ['page.home'] }
        },
        {
          path: 'admin',
          name: 'admin',
          component: () => import('../views/AdminView.vue'),
          meta: { title: '管理员管理', permission: ['page.admin'] }
        },
        {
          path: 'system/menu',
          name: 'menu',
          component: () => import('../views/system/MenuView.vue'),
          meta: { title: '菜单管理', permission: ['page.system.menu'] }
        },
        {
          path: 'system/role',
          name: 'role',
          component: () => import('../views/system/RoleView.vue'),
          meta: { title: '角色管理', permission: ['page.system.role'] }
        },
        {
          path: 'system/user',
          name: 'user',
          component: () => import('../views/system/UserView.vue'),
          meta: { title: '用户管理', permission: ['page.system.user'] }
        },
        {
          path: 'system/log',
          name: 'log',
          component: () => import('../views/system/LogView.vue'),
          meta: { title: '日志管理', permission: ['page.system.log'] }
        },
        // {
        //   path: 'system/config',
        //   name: 'config',
        //   component: () => import('../views/system/ConfigView.vue'),
        //   meta: { title: '参数配置', permission: ['page.system.config'] }
        // },
        // {
        //   path: 'system/dict',
        //   name: 'dict',
        //   component: () => import('../views/system/DictView.vue'),
        //   meta: { title: '字典管理', permission: ['page.system.dict'] }
        // },
        {
          path: 'tools',
          name: 'tools',
          component: () => import('../views/ToolsView.vue'),
          meta: { title: '工具管理', permission: ['page.tools'] }
        },
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('../views/DashboardView.vue'),
          meta: { title: '数据看板', permission: ['page.dashboard'] }
        },
        {
          path: '/user',
          name: 'userManage',
          component: () => import('../views/UserManageView.vue'),
          meta: { title: '用户中心', permission: ['page.user'] }
        }
      ]
    },
    {
      path: '/403',
      name: 'forbidden',
      component: () => import('../views/ForbiddenView.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'notFound',
      component: () => import('../views/NotFoundView.vue')
    }
  ]
})

// 路由守卫（保持原有逻辑）
router.beforeEach((to, from, next) => {
  const permissionStore = usePermissionStore()
  const isLogin = !!permissionStore.userRole
  if (to.meta.title) {
    document.title = `${to.meta.title} | ${env.title}`
  }
  if (to.meta.requiresAuth && !isLogin) {
    next({ name: 'login', query: { redirect: to.fullPath } })
    return
  }

  if (to.name === 'login' && isLogin) {
    next({ name: 'home' })
    return
  }

  if (to.meta.permission && Array.isArray(to.meta.permission)) {
    const hasPermission = permissionStore.hasAnyPermission(to.meta.permission)
    if (!hasPermission) {
      next({ name: 'forbidden' })
      return
    }
  }

  // 设置页面标题
  if (to.meta.title) {
    document.title = `${to.meta.title} | 权限管理系统`
  }

  next()
})

export default router
