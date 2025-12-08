import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import { env } from '@/utils/env'

import App from './App.vue'
import router from './router'
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

app.mount('#app')
