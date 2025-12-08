import { ElLoading, ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import { env } from '@/utils/env'
import LocalStorage from '@/utils/storage'

// 定义请求选项类型
interface RequestOptions {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  data?: any
  params?: any
  header?: any
  loading?: boolean
  showError?: boolean
  timeout?: number
}

// 定义响应数据类型
interface ResponseData<T = any> {
  code: number
  msg: string
  data: T
}

// 请求队列，用于防止重复请求
const requestQueue = new Map<string, Promise<any>>()

class Request {
  private baseUrl: string;
  private requestInterceptors: Array<
    (options: RequestOptions) => RequestOptions
  > = [];
  private responseInterceptors: Array<(response: any) => any> = [];

  constructor() {
    // 使用环境变量中的基础地址
    this.baseUrl = env.apiBaseUrl;
  }

  // 添加请求拦截器
  useRequestInterceptor(
    interceptor: (options: RequestOptions) => RequestOptions
  ): void {
    this.requestInterceptors.push(interceptor);
  }

  // 添加响应拦截器
  useResponseInterceptor(interceptor: (response: any) => any): void {
    this.responseInterceptors.push(interceptor);
  }

  // 执行请求拦截器
  private runRequestInterceptors(options: RequestOptions): RequestOptions {
    return this.requestInterceptors.reduce((config, interceptor) => {
      return interceptor(config);
    }, options);
  }

  // 执行响应拦截器
  private runResponseInterceptors(response: any): any {
    return this.responseInterceptors.reduce((res, interceptor) => {
      return interceptor(res);
    }, response);
  }

  // 手动拼接查询参数
  private buildQueryString(params: Record<string, any>): string {
    return Object.entries(params)
      .map(([key, value]) => {
        // 处理数组和对象类型的参数值
        const encodedValue = typeof value === 'object'
          ? JSON.stringify(value)
          : String(value);
        return `${encodeURIComponent(key)}=${encodeURIComponent(encodedValue)}`;
      })
      .join('&');
  }

  // 基础请求方法
  async request<T>(options: RequestOptions): Promise<ResponseData<T>> {
    const {
      url,
      method = 'GET',
      data = {},
      params = {},
      header = {},
      loading = true,
      showError = true,
      timeout = 10000
    } = this.runRequestInterceptors(options);

    // 生成请求唯一标识，用于防止重复请求
    const requestId = this.generateRequestId(url, method, data, params);

    // 检查是否有相同的请求正在进行
    if (requestQueue.has(requestId)) {
      return requestQueue.get(requestId)!;
    }

    // 显示加载中
    let loadingInstance: any = null;
    if (loading) {
      loadingInstance = ElLoading.service({
        lock: true,
        text: '加载中...',
        background: 'rgba(0, 0, 0, 0.7)'
      });
    }

    const requestPromise = (async () => {
      try {
        // 处理URL参数
        let requestUrl = url.startsWith('http') ? url : this.baseUrl + url;

        // 添加查询参数
        if (Object.keys(params).length > 0) {
          const queryString = this.buildQueryString(params);
          requestUrl += requestUrl.includes('?')
            ? `&${queryString}`
            : `?${queryString}`;
        }

        // 合并请求头
        const headers = {
          'Content-Type': 'application/json',
          token: this.getToken(),
          'X-Request-Id': requestId,
          ...header
        };

        // 发起请求（使用fetch代替uni.request）
        const response = await fetch(requestUrl, {
          method,
          headers,
          body: method !== 'GET' ? JSON.stringify(data) : undefined,
          signal: AbortSignal.timeout(timeout)
        });

        // 处理HTTP错误状态码
        if (!response.ok) {
          throw new Error(`请求失败，状态码: ${response.status}`);
        }

        // 解析响应数据
        const resultData = await response.json();

        // 执行响应拦截器
        const interceptedResponse = this.runResponseInterceptors(resultData);

        const result: ResponseData<T> = interceptedResponse;

        // 根据业务代码处理不同情况
        if (result.code === 0 || result.code === 200) {
          return result;
        } else if (result.code === 401) {
          // token过期处理
          await this.handleTokenExpired();
          throw new Error('登录已过期，请重新登录');
        } else if (result.code === 403) {
          throw new Error('权限不足');
        } else {
          // 其他错误代码
          if (showError && result.msg) {
            ElMessage.error(result.msg);
          }
          throw new Error(result.msg || `请求失败，错误码: ${result.code}`);
        }
      } catch (error: any) {
        // 显示错误信息
        if (showError) {
          const errorMessage = error.message || '网络异常，请稍后重试';
          ElMessage.error(errorMessage);
        }
        throw error;
      } finally {
        // 隐藏加载中
        if (loadingInstance) {
          loadingInstance.close();
        }
        // 从请求队列中移除
        requestQueue.delete(requestId);
      }
    })();

    // 将请求加入队列
    requestQueue.set(requestId, requestPromise);

    return requestPromise;
  }

  // 生成请求唯一标识
  private generateRequestId(
    url: string,
    method: string,
    data: any,
    params: any
  ): string {
    const dataStr = encodeURIComponent(JSON.stringify(data));
    const paramsStr = encodeURIComponent(JSON.stringify(params));
    return `${method}_${url}_${dataStr}_${paramsStr}`;
  }

  // 获取token（从localStorage直接获取）
  private getToken(): string {
    try {
      return localStorage.getItem('token') || '';
    } catch (error) {
      console.warn('获取token失败:', error);
      return '';
    }
  }

  // token过期处理
  private async handleTokenExpired(): Promise<void> {
    try {
      // 清除本地存储的认证信息
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');

      // 提示用户并跳转登录
      await ElMessageBox.confirm(
        '登录已过期，请重新登录',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      );

      // 跳转到登录页
      const router = useRouter();
      router.push('/login');
    } catch (error) {
      console.error('处理token过期失败:', error);
    }
  }

  // GET请求
  get<T>(url: string, params?: any, options?: Partial<RequestOptions>) {
    return this.request<T>({
      url,
      method: 'GET',
      params,
      ...options
    });
  }

  // POST请求
  post<T>(url: string, data?: any, options?: Partial<RequestOptions>) {
    return this.request<T>({
      url,
      method: 'POST',
      data,
      ...options
    });
  }

  // PUT请求
  put<T>(url: string, data?: any, options?: Partial<RequestOptions>) {
    return this.request<T>({
      url,
      method: 'PUT',
      data,
      ...options
    });
  }

  // PATCH请求
  patch<T>(url: string, data?: any, options?: Partial<RequestOptions>) {
    return this.request<T>({
      url,
      method: 'PATCH',
      data,
      ...options
    });
  }

  // DELETE请求
  delete<T>(url: string, data?: any, options?: Partial<RequestOptions>) {
    return this.request<T>({
      url,
      method: 'DELETE',
      data,
      ...options
    });
  }
}

export const request = new Request();
