import { useState, useEffect } from 'react';
import { apiService } from '@/services/api';

export interface ApiKey {
  id: string;
  name: string;
  key_prefix: string;
  created_at: string;
}

export const useApiKeys = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApiKeys = async () => {
    try {
      setLoading(true);
      const response = await apiService.apiKeys.list();
      setApiKeys(response.data);
    } catch (err) {
      setError('获取API密钥失败');
      console.error('Failed to fetch API keys:', err);
    } finally {
      setLoading(false);
    }
  };

  const createApiKey = async (name: string, token: string) => {
    try {
      const response = await apiService.apiKeys.create(name, token);
      // 重新获取API密钥列表
      await fetchApiKeys();
      return response.data;
    } catch (err) {
      setError('创建API密钥失败');
      console.error('Failed to create API key:', err);
      throw err;
    }
  };

  const deleteApiKey = async (id: string) => {
    try {
      await apiService.apiKeys.delete(id);
      // 重新获取API密钥列表
      await fetchApiKeys();
    } catch (err) {
      setError('删除API密钥失败');
      console.error('Failed to delete API key:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchApiKeys();
  }, []);

  return {
    apiKeys,
    loading,
    error,
    refetch: fetchApiKeys,
    createApiKey,
    deleteApiKey
  };
};