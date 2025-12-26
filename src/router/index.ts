import { createRouter, createWebHistory } from 'vue-router'
import { usePermissionStore } from '@/stores/permission'
import { env } from '@/utils/env'
import { asyncRoutes } from './asyncRoutes'
import { MenuItem } from '@/types'


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
    // 带布局的路由（动态子路由将注册到 name: 'layout' 下）
    {
      path: '/',
      name: 'layout',
      component: Layout,
      meta: { requiresAuth: true }
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

// 按权限筛选并注册异步路由到 layout 下
// 从后端菜单生成路由并注册
export function registerAsyncRoutesFromMenu(menus: MenuItem[] = [], permissions: string[] = []) {
  const hasPermission = (meta?: any) => {
    if (!meta || !meta.permission) return true
    const perms = meta.permission
    if (Array.isArray(perms)) return perms.some((p: string) => permissions.includes(p))
    return permissions.includes(perms)
  }


  const modules = import.meta.glob('../views/**/*.vue')

  const getComponentByName = (comp?: string) => {
    if (!comp) return null
    const key = Object.keys(modules).find(k => k.endsWith(comp))
    return key ? modules[key] : null
  }

  const routes: any[] = []

  const traverse = (items: MenuItem[]) => {
    items.forEach(item => {
      if (item.children && item.children.length) {
        traverse(item.children)
      } else {
        if (!hasPermission(item.permission)) return
        // 先尝试通过 menu.component 字段解析组件
        let comp: any = null
        if (item.component) comp = getComponentByName(item.component)
        // 回退：尝试按约定从 views 中查找对应文件名
        if (!comp) {
          // 构造可能的文件名，例如 '/home' -> 'HomeView.vue'
          const parts = item.path.split('/').filter(Boolean)
          const guess = parts.length ? `${parts[parts.length - 1].replace(/-([a-z])/g, (_, c) => c.toUpperCase())}View.vue` : ''
          comp = getComponentByName(guess)
        }
        if (!comp) return // 未找到组件则跳过注册

        const route = {
          path: item.path.replace(/^\//, ''),
          name: item.name,
          component: comp,
          meta: { title: item.title, permission: item.permission }
        }
        routes.push(route)
      }
    })
  }

  traverse(menus)

  routes.forEach(r => {
    try {
      router.addRoute('layout', r)
    } catch (e) {
      // 忽略重复添加
    }
  })
}

export { asyncRoutes }

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
