/**
 * localStorage工具类，封装常用操作并支持跨标签页通信
 */
class LocalStorage {
  // 存储事件名称前缀
  private static eventPrefix = 'ls_event_'

  /**
   * 设置存储项
   * @param key 键名
   * @param value 值（自动JSON序列化）
   * @param triggerEvent 是否触发自定义事件（默认true）
   */
  static setItem<T>(key: string, value: T, triggerEvent = true): void {
    try {
      const stringValue = JSON.stringify(value)
      localStorage.setItem(key, stringValue)

      // 触发自定义事件，支持跨标签页通信
      if (triggerEvent) {
        this.dispatchEvent(key, value)
      }
    } catch (error) {
      console.error(`设置localStorage项 ${key} 失败:`, error)
    }
  }

  /**
   * 获取存储项
   * @param key 键名
   * @param defaultValue 默认值
   * @returns 解析后的值或默认值
   */
  static getItem<T>(key: string, defaultValue?: T): T | undefined {
    try {
      const value = localStorage.getItem(key)
      if (value === null) return defaultValue
      return JSON.parse(value) as T
    } catch (error) {
      console.error(`获取localStorage项 ${key} 失败:`, error)
      return defaultValue
    }
  }

  /**
   * 移除存储项
   * @param key 键名
   * @param triggerEvent 是否触发自定义事件（默认true）
   */
  static removeItem(key: string, triggerEvent = true): void {
    try {
      localStorage.removeItem(key)
      if (triggerEvent) {
        this.dispatchEvent(key, null)
      }
    } catch (error) {
      console.error(`移除localStorage项 ${key} 失败:`, error)
    }
  }

  /**
   * 清空所有存储项
   */
  static clear(): void {
    try {
      const keys = Object.keys(localStorage)
      localStorage.clear()
      // 触发所有键的删除事件
      keys.forEach(key => this.dispatchEvent(key, null))
    } catch (error) {
      console.error('清空localStorage失败:', error)
    }
  }

  /**
   * 监听存储项变化
   * @param key 键名
   * @param callback 回调函数
   * @returns 取消监听的函数
   */
  static on<T>(key: string, callback: (value: T | null) => void): () => void {
    const eventName = this.getEventName(key)

    const handler = (event: Event) => {
      const customEvent = event as CustomEvent<T | null>
      callback(customEvent.detail)
    }

    window.addEventListener(eventName, handler)

    // 返回取消监听函数
    return () => {
      window.removeEventListener(eventName, handler)
    }
  }

  /**
   * 触发一次存储项变化监听
   * @param key 键名
   * @param callback 回调函数
   */
  static once<T>(key: string, callback: (value: T | null) => void): void {
    const off = this.on(key, (value) => {
      off()
      callback(value)
    })
  }

  /**
   * 派发自定义事件
   * @param key 键名
   * @param value 值
   */
  private static dispatchEvent<T>(key: string, value: T | null): void {
    const eventName = this.getEventName(key)
    window.dispatchEvent(new CustomEvent(eventName, {
      detail: value
    }))
  }

  /**
   * 获取带前缀的事件名
   * @param key 键名
   * @returns 事件名
   */
  private static getEventName(key: string): string {
    return `${this.eventPrefix}${key}`
  }
}

export default LocalStorage
