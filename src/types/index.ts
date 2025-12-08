// 菜单类型
export interface MenuItem {
  path: string
  name: string
  title: string
  icon?: string
  permission?: string[]
  children?: MenuItem[]
}

// 用户信息类型
export interface UserInfo {
  id: number
  username: string
  avatar?: string
  role: string
}
