import { MenuItem } from '@/types'

// 模拟后台返回的菜单数据（与 Sidebar 中一致）
const menuList: MenuItem[] = [
  {
    path: '/home',
    name: 'home',
    title: '首页',
    icon: 'Home',
    component: 'HomeView.vue',
    permission: ['page.home']
  },
  {
    path: '/admin',
    name: 'admin',
    title: '管理员管理',
    icon: 'User',
    component: 'AdminView.vue',
    permission: ['page.admin']
  },
  {
    path: '/system',
    name: 'system',
    title: '系统设置',
    icon: 'Setting',
    permission: ['page.system'],
    children: [
      {
        path: '/system/menu',
        name: 'menu',
        title: '菜单管理',
        component: 'system/MenuView.vue',
        permission: ['page.system.menu']
      },
      {
        path: '/system/role',
        name: 'role',
        title: '角色管理',
        component: 'system/RoleView.vue',
        permission: ['page.system.role']
      },
      {
        path: '/system/user',
        name: 'user',
        title: '用户管理',
        component: 'system/UserView.vue',
        permission: ['page.system.user']
      },
      {
        path: '/system/log',
        name: 'log',
        title: '日志管理',
        component: 'system/LogView.vue',
        permission: ['page.system.log']
      },
      {
        path: '/system/config',
        name: 'config',
        title: '参数配置',
        component: 'system/ConfigView.vue',
        permission: ['page.system.config']
      },
      {
        path: '/system/dict',
        name: 'dict',
        title: '字典管理',
        component: 'system/DictView.vue',
        permission: ['page.system.dict']
      }
    ]
  },
  {
    path: '/tools',
    name: 'tools',
    title: '工具管理',
    icon: 'Tools',
    component: 'ToolsView.vue',
    permission: ['page.tools']
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    title: '数据看板',
    icon: 'DataBoard',
    component: 'DashboardView.vue',
    permission: ['page.dashboard']
  }
]

// 根据角色返回菜单（简单模拟：admin 返回全部，user 返回部分）
export function fetchMenuByRole(role: string): Promise<MenuItem[]> {
  return new Promise(resolve => {
    setTimeout(() => {
      if (role === 'admin') {
        resolve(menuList)
      } else {
        // user 只返回部分菜单
        resolve(menuList.filter(m => ['/home', '/tools', '/dashboard'].includes(m.path) || m.path === '/system' && m.children?.some(c => c.path === '/system/user')))
      }
    }, 300)
  })
}

export default fetchMenuByRole
