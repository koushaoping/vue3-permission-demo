// 菜单类型
export interface MenuItem {
  path: string
  name: string
  title: string
  icon?: string
  component?: string // 用于动态加载组件的文件名或相对路径
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
