import type {
  ResponseData,
  RequestOptions,
  UploadOptions,
  EnvConfig
} from '@/types/api';
import { showToast, showLoading, hideLoading, showModal } from '@/utils/ui';
import { useAuthStore } from '@/stores/auth';
import { useRequestStore } from '@/stores/requestLoading';

// 获取基础URL - 使用条件编译
const getBaseUrl = (): string => {

  // #ifdef H5
  console.log('添加H5页面配置');
  // #endif

  // #ifdef MP-WEIXIN
  console.log(8544);


  switch (process.env.NODE_ENV) {
    case 'development':
      // return 'https://www.shfspro.com'
      // return 'https://43vk7485hx48.vicp.fun'
      return 'http://192.168.0.113:7001'

    case 'test':
      return 'https://dev-api.example.com'
    case 'production':
      return 'https://www.shfspro.com'
    default:
      return 'https://www.shfspro.com'
  }
  // #endif
};

// 获取环境配置
export const getEnvConfig = (): EnvConfig => {
  const baseUrl = getBaseUrl();

  return {
    baseUrl,
    appId: 'wx1234567890abcdef',
    env: baseUrl.includes('dev') ? 'development' : 'production'
  };
};

// 请求队列，用于管理并发请求
const requestQueue = new Map<string, Promise<any>>();

class Request {
  private baseUrl: string;
  private requestInterceptors: Array<
    (options: RequestOptions) => RequestOptions
  > = [];
  private responseInterceptors: Array<(response: any) => any> = [];
  // 存储请求状态
  private requestStore: any;

  constructor() {
    this.baseUrl = getBaseUrl();

    //在构造函数中获取请求状态store
    try {
      this.requestStore = useRequestStore();
    } catch (error) {
      console.warn('Request store未初始化，请求状态管理将不可用:', error);
    }
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
    if (loading) {
      showLoading();
    }

    // 更新请求状态 - 使用URL作为key
    if (this.requestStore) {
      this.requestStore.startRequest(url);
    }

    const requestPromise = (async () => {
      try {
        // 处理URL参数
        let requestUrl = url.startsWith('http') ? url : this.baseUrl + url;

        // 添加查询参数
        if (Object.keys(params).length > 0) {
          // const queryString = new URLSearchParams(params).toString();
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

        // 发起请求
        const response = await uni.request({
          url: requestUrl,
          method: method as any,
          data,
          header: headers,
          timeout
        });

        // 隐藏加载中
        if (loading) {
          hideLoading();
        }
        let resultData: any;

        if (Array.isArray(response)) {
          // 如果是数组格式 [error, response]
          const [error, res] = response;
          if (error) {
            throw new Error(error.errMsg || `网络请求失败: ${error}`);
          }
          resultData = res.data;
        } else if (response && typeof response === 'object') {
          // 如果是对象格式 { data, statusCode, header, errMsg }
          if (response.statusCode !== 200) {
            throw new Error(response.errMsg || `请求失败，状态码: ${response.statusCode}`);
          }
          resultData = response.data;
        } else {
          throw new Error('未知的响应格式');
        }

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
            showToast(result.msg);
          }

          throw new Error(result.msg || `请求失败，错误码: ${result.code}`);
        }
      } catch (error: any) {
        // 隐藏加载中
        if (loading) {
          hideLoading();
        }

        // 显示错误信息
        if (showError) {
          const errorMessage = error.message || '网络异常，请稍后重试';
          showToast(errorMessage, 'error');
        }

        throw error;
      } finally {
        // 更新请求状态 - 完成
        if (this.requestStore) {
          this.requestStore.finishRequest(url);
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

  // 获取token
  private getToken(): string {
    try {
      const authStore = useAuthStore();
      const storedToken = uni.getStorageSync('token');
      return authStore.token ? authStore.token : storedToken ? storedToken : '';
    } catch (error) {
      console.warn('获取token失败:', error);
      return '';
    }
  }

  // token过期处理
  //   private async handleTokenExpired(): Promise<void> {
  //     try {
  //       // 清除token
  //       uni.removeStorageSync('token')
  //       uni.removeStorageSync('userInfo')

  //       // 提示用户
  //       const confirm = await showModal('提示', '登录已过期，请重新登录', true)

  //       if (confirm) {
  //         // 跳转到登录页
  //         uni.reLaunch({
  //           url: '/pages/login/index'
  //         })
  //       }
  //     } catch (error) {
  //       console.error('处理token过期失败:', error)
  //     }
  //   }

  // token过期处理
  private async handleTokenExpired(): Promise<void> {
    try {
      const authStore = useAuthStore();

      // 保存当前页面路径，用于登录后返回
      const pages = getCurrentPages();
      if (pages.length > 0) {
        const currentPage = pages[pages.length - 1];
        authStore.returnUrl = `/${currentPage.route}`;

        const options = (currentPage as any).options ?? {};

        // 添加查询参数
        if (Object.keys(options).length > 0) {
          // const queryString = new URLSearchParams(options).toString();
          const queryString = this.buildQueryString(options);
          authStore.returnUrl += `?${queryString}`;
        }
      }

      // 清除认证信息
      authStore.clearAuth();

      // 提示用户
      const confirm = await showModal('提示', '登录已过期，请重新登录', true);

      if (confirm) {
        // 跳转到登录页
        uni.reLaunch({
          url: '/pages/login/index'
        });
      }
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

  // 上传文件
  async upload<T>(options: UploadOptions): Promise<ResponseData<T>> {
    const {
      url,
      filePath,
      name = 'file',
      formData = {},
      header = {},
      loading = true,
      showError = true
    } = options;

    if (loading) {
      showLoading('上传中...');
    }

    // 更新请求状态 - 使用URL作为key
    if (this.requestStore) {
      this.requestStore.startRequest(url);
    }

    try {
      const fullUrl = url.startsWith('http') ? url : this.baseUrl + url;

      const response = await uni.uploadFile({
        url: fullUrl,
        filePath,
        name,
        formData,
        header: {
          token: this.getToken(),
          ...header
        }
      });

      if (loading) {
        hideLoading();
      }

      // 解析响应数据
      let responseData: any;
      try {
        responseData =
          typeof response.data === 'string'
            ? JSON.parse(response.data)
            : response.data;
      } catch (parseError) {
        throw new Error('解析响应数据失败');
      }

      if (responseData.code === 200) {
        return responseData;
      } else {
        if (showError && responseData.message) {
          showToast(responseData.message);
        }

        throw new Error(responseData.message || '上传失败');
      }
    } catch (error: any) {
      if (loading) {
        hideLoading();
      }

      if (showError) {
        showToast(error.message || '上传失败', 'error');
      }

      throw error;
    } finally {
      // 更新请求状态 - 完成
      if (this.requestStore) {
        this.requestStore.finishRequest(url);
      }
    }
  }

  // 下载文件
  async download(
    url: string,
    header: Record<string, string> = {}
  ): Promise<string> {
    // 更新请求状态 - 使用URL作为key
    if (this.requestStore) {
      this.requestStore.startRequest(url);
    }
    try {

      return new Promise((resolve, reject) => {
        uni.downloadFile({
          url: url.startsWith('http') ? url : this.baseUrl + url,
          header: {
            token: this.getToken(),
            ...header
          },
          success: (res) => {
            if (res.statusCode === 200) {



              resolve(res.tempFilePath);
            } else {


              reject(new Error(`下载失败，状态码: ${res.statusCode}`));
            }
          },
          fail: (error) => {
            reject(new Error(error.errMsg || '下载失败'));
          },
        });
      });
    } finally {
      // 更新请求状态 - 完成
      if (this.requestStore) {
        this.requestStore.finishRequest(url);
      }
    }
  }
}

// 创建请求实例
const http = new Request();

// 添加默认请求拦截器
http.useRequestInterceptor((options) => {
  // 举例，可添加公共参数，如时间戳
  // const timestamp = Date.now();

  if (options.method === 'GET' && options.params) {
    options.params = {
      ...options.params,
      // _t: timestamp
    };
  } else if (options.data && typeof options.data === 'object') {
    options.data = {
      ...options.data,
      // _t: timestamp
    };
  }

  return options;
});

// 添加默认响应拦截器
http.useResponseInterceptor((response) => {
  // 可以在这里统一处理响应数据格式
  console.log('请求响应:', response);
  return response;
});

export default http;
