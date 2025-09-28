import axios from 'axios';

// 创建axios实例
const apiClient = axios.create({
//baseURL: 'http://localhost:8001/api', // 本地API基础URL
baseURL: '/api', // 服务器API基础URL
  timeout: 10000,
});

// 修改请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('api_key');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
  // 在auth对象中添加sendCode方法
  auth: {
    sendCode: (phone: string) => 
      apiClient.post('/auth/send-code', { phone_number: phone }),
    // 修改login方法的参数
    login: (phone: string, code: string) => 
      apiClient.post('/auth/login', { phone_number: phone, code }),
    logout: () => 
      apiClient.post('/auth/logout'),
  },

  // 用户信息
  // 修改user对象中的方法
  user: {
    getProfile: () => 
      apiClient.get('/user/me'),
    updateProfile: (data: any) => 
      apiClient.put('/user/me', data),
  },

  // API密钥管理
  // 修改apiKeys对象中的方法
  apiKeys: {
    list: () => 
      apiClient.get('/keys/'),
    create: (name: string, token: string) => 
      apiClient.post('/keys/', { name }, { headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }}),
    delete: (id: string) => 
      apiClient.delete(`/keys/${id}`),  
  },

  // 用量信息
  // 修改usage对象中的方法
  usage: {
    getBalance: () => 
      apiClient.get('/usage/summary'),
    getUsageHistory: (
      params?: { 
        period?: string;
        date?: string;
      }) => apiClient.get('/usage/summary', { params })
  },

  // 账单管理
  // 修改billing对象中的方法
  billing: {
    getBills: (params?: { 
      start_date?: string; 
      end_date?: string; 
      page?: number; 
      limit?: number 
    }) => 
      apiClient.get('/billing/history', { params }),
    createRecharge: (amount: number, payment_method: string) => 
      apiClient.post('/billing/recharge', { amount, payment_method }),
    getBalance: () => 
      apiClient.get('/billing/balance'),
  },
};

export default apiClient;