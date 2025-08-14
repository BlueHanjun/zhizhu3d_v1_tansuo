import axios from 'axios';

// 创建axios实例
const apiClient = axios.create({
  baseURL: 'https://api.zhizhu3d.com/v1', // 假设的API基础URL
  timeout: 10000,
});

// 请求拦截器 - 添加认证头
apiClient.interceptors.request.use(
  (config) => {
    const apiKey = localStorage.getItem('api_key');
    if (apiKey) {
      config.headers.Authorization = `Bearer ${apiKey}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器 - 处理通用错误
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 认证失败，清除本地存储的认证信息
      localStorage.removeItem('api_key');
      localStorage.removeItem('isAuthenticated');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API服务对象
export const apiService = {
  // 用户认证
  auth: {
    login: (phone: string, code: string) => 
      apiClient.post('/auth/login', { phone, code }),
    logout: () => 
      apiClient.post('/auth/logout'),
  },

  // 用户信息
  user: {
    getProfile: () => 
      apiClient.get('/user/profile'),
    updateProfile: (data: any) => 
      apiClient.put('/user/profile', data),
  },

  // API密钥管理
  apiKeys: {
    list: () => 
      apiClient.get('/api-keys'),
    create: (name: string) => 
      apiClient.post('/api-keys', { name }),
    delete: (id: string) => 
      apiClient.delete(`/api-keys/${id}`),
  },

  // 用量信息
  usage: {
    getBalance: () => 
      apiClient.get('/usage/balance'),
    getUsageHistory: (params?: { 
      start_date?: string; 
      end_date?: string; 
      page?: number; 
      limit?: number 
    }) => 
      apiClient.get('/usage/history', { params }),
  },

  // 账单管理
  billing: {
    getBills: (params?: { 
      start_date?: string; 
      end_date?: string; 
      page?: number; 
      limit?: number 
    }) => 
      apiClient.get('/billing/bills', { params }),
    createRecharge: (amount: number, payment_method: string) => 
      apiClient.post('/billing/recharge', { amount, payment_method }),
  },
};

export default apiClient;