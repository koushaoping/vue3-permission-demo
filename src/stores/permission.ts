import { defineStore } from 'pinia'

// 权限类型定义
export type PermissionCode = string
export type PermissionList = PermissionCode[]

interface PermissionState {
  userPermissions: PermissionList // 用户拥有的权限码列表
  userRole: string // 用户角色
}

export const usePermissionStore = defineStore('permission', {
  state: (): PermissionState => ({
    userPermissions: [],
    userRole: ''
  }),
  actions: {
    // 设置用户权限
    setPermissions(permissions: PermissionList, role: string) {
      this.userPermissions = permissions
      this.userRole = role
    },
    // 清空权限（退出登录）
    clearPermissions() {
      this.userPermissions = []
      this.userRole = ''
    },
    // 检查是否拥有权限
    hasPermission(code: PermissionCode): boolean {
      return this.userPermissions.includes(code)
    },
    // 检查是否拥有任一权限
    hasAnyPermission(codes: PermissionList): boolean {
      return codes.some(code => this.hasPermission(code))
    }
  }
})
