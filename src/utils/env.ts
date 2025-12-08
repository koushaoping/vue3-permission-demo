/**
 * 环境变量工具类
 */
export const env = {
  // 应用标题
  title: import.meta.env.VITE_APP_TITLE,

  // API基础地址
  apiBaseUrl: import.meta.env.VITE_APP_API_BASE_URL,

  // 请求超时时间
  timeout: import.meta.env.VITE_APP_TIMEOUT,

  // Token存储Key
  tokenKey: import.meta.env.VITE_APP_TOKEN_KEY,

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
