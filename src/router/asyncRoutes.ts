import { RouteRecordRaw } from 'vue-router'

const modules = import.meta.glob('../views/**/*.vue')

const guess = (file: string) => {
  // ../views/system/MenuView.vue -> ['system','MenuView']
  const parts = file.replace('../views/', '').replace('.vue', '').split('/')
  const last = parts[parts.length - 1]
  const baseName = (last.match(/(.+)View$/)?.[1] || last)
  // path 例如 'system/menu' 或 'home'
  const path = parts.map((p, i) => {
    return i === parts.length - 1 ? baseName.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '') : p
  }).join('/').replace(/-view$/, '')
  const name = parts.join('-').replace(/\.|\/| /g, '-')
  return { path, name }
}

export const asyncRoutes: RouteRecordRaw[] = Object.keys(modules).map(key => {
  const { path, name } = guess(key)
  return {
    path,
    name,
    component: modules[key],
    meta: { title: name }
  }
})

export default asyncRoutes
