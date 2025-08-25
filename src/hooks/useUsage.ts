import { useState, useEffect } from 'react';
import { apiService } from '@/services/api';

export interface UsageData {
  name: string;
  uv: number;
}

export interface UsageSummary {
  period: string;
  date: string;
  records: Array<{
    date: string;
    service_name: string;
    count: number;
    total_cost: number;
  }>;
}

export interface Balance {
  amount: number;
}

export interface BillingBalance {
  balance: number;
}

export const useUsage = (initialPeriod: string = 'monthly', initialDate: string = '2025-08') => {
  const [usageData, setUsageData] = useState<UsageData[]>([]);
  const [balance, setBalance] = useState<Balance>({ amount: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPeriod, setCurrentPeriod] = useState(initialPeriod);
  const [currentDate, setCurrentDate] = useState(initialDate);

  const fetchUsageData = async (periodParam?: string, dateParam?: string) => {
    try {
      setLoading(true);
      const periodToUse = periodParam || currentPeriod;
      const dateToUse = dateParam || currentDate;
      
      // 更新当前参数
      if (periodParam) setCurrentPeriod(periodParam);
      if (dateParam) setCurrentDate(dateParam);
      
      // 获取用量历史数据
      const usageResponse = await apiService.usage.getUsageHistory({
          period: periodToUse,
          date: dateToUse,
      });
      // 将API返回的数据转换为图表组件所需的格式
      const formattedData: UsageData[] = usageResponse.data.records.map((record: UsageSummary['records'][0]) => ({
        name: record.date,
        uv: record.total_cost
      }));
      setUsageData(formattedData);
      
      // 获取余额
      const balanceResponse = await apiService.billing.getBalance();
      setBalance({ amount: balanceResponse.data.balance });
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