/**
 * 环境变量工具类
 */
export const env = {
  // 应用标题
  title: '权限管理系统',

  // API基础地址 - 使用当前域名作为根目录地址
  apiBaseUrl: '', // 空字符串表示相对当前域名请求

  // 请求超时时间
  timeout: 10000,

  // Token存储Key
  tokenKey: 'auth_token',

  // 当前环境
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
  isTest: import.meta.env.NODE_ENV === 'test',

  // 获取环境名称
  getEnvName(): string {
    if (this.isDev) return 'development'
    if (this.isTest) return 'test'
    return 'production'
  }
}
