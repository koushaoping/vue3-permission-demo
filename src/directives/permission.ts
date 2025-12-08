import type { Directive, DirectiveBinding } from 'vue'
import { usePermissionStore } from '@/stores/permission'

/**
 * 权限指令：v-permission="['btn.add']" 或 v-permission="'btn.add'"
 */
export const permission: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const permissionStore = usePermissionStore()
    const { value } = binding

    // 无权限时隐藏元素
    const hideElement = () => {
      // el.style.display = 'none'
      // 更彻底的移除：
      el.parentNode?.removeChild(el)
    }

    if (!value) return hideElement()

    // 处理字符串类型权限
    if (typeof value === 'string') {
      if (!permissionStore.hasPermission(value)) {
        hideElement()
      }
    }

    // 处理数组类型权限（满足任一即可）
    if (Array.isArray(value)) {
      if (!permissionStore.hasAnyPermission(value)) {
        hideElement()
      }
    }
  }
}

// 注册所有指令
export const setupDirectives = (app: any) => {
  app.directive('permission', permission)
}
