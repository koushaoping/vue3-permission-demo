import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import { env } from '@/utils/env'
import storage from '@/utils/storage'
import { usePermissionStore } from '@/stores/permission'
import { registerAsyncRoutesFromMenu } from '@/router'
import type { MenuItem } from '@/types'
import router from './router'

import App from './App.vue'
import { setupDirectives } from './directives/permission'

const app = createApp(App)

document.title = env.title

app.use(ElementPlus, {
  locale: zhCn
})

// 注册Pinia
app.use(createPinia())

// 注册路由
app.use(router)

// 注册Element Plus及图标
app.use(ElementPlus)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 注册自定义指令
setupDirectives(app)

// 从 localStorage 恢复权限与菜单并注册动态路由（若存在）
try {
  const perm = usePermissionStore()
  const savedMenus = storage.getItem<MenuItem[]>('userMenus', [])
  const savedPerms = storage.getItem<string[]>('userPermissions', [])
  const savedRole = storage.getItem<string>('userRole', '')
  if (savedPerms && savedPerms.length) {
    perm.setPermissions(savedPerms, savedRole || '')
    perm.setMenus(savedMenus || [])
    registerAsyncRoutesFromMenu(savedMenus || [], savedPerms || [])
    // 尝试重新导航当前地址，确保动态添加的路由能被解析（防止页面404）
    try {
      const current = router.currentRoute.value.fullPath
      if (current) router.replace(current).catch(() => {})
    } catch (err) {
      // ignore
    }
  }
} catch (e) {

}

app.mount('#app')
