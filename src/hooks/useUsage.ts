import { useState, useEffect } from 'react';
import { apiService } from '@/services/api';

export interface UsageData {
  name: string;
  uv: number;
}

export interface Balance {
  amount: number;
}

export const useUsage = () => {
  const [usageData, setUsageData] = useState<UsageData[]>([]);
  const [balance, setBalance] = useState<Balance>({ amount: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsageData = async () => {
    try {
      setLoading(true);
      // 获取用量历史数据
      const usageResponse = await apiService.usage.getUsageHistory();
      setUsageData(usageResponse.data);
      
      // 获取余额
      const balanceResponse = await apiService.usage.getBalance();
      setBalance(balanceResponse.data);
    } catch (err) {
      setError('获取用量信息失败');
      console.error('Failed to fetch usage data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsageData();
  }, []);

  return {
    usageData,
    balance,
    loading,
    error,
    refetch: fetchUsageData
  };
};