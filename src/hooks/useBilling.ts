import { useState, useEffect } from 'react';
import { apiService } from '@/services/api';

export interface Bill {
  id: string;
  amount: number;
  date: string;
  status: string;
}

export const useBilling = () => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBills = async () => {
    try {
      setLoading(true);
      const response = await apiService.billing.getBills();
      setBills(response.data);
    } catch (err) {
      setError('获取账单失败');
      console.error('Failed to fetch bills:', err);
    } finally {
      setLoading(false);
    }
  };

  const createRecharge = async (amount: number, paymentMethod: string) => {
    try {
      const response = await apiService.billing.createRecharge(amount, paymentMethod);
      // 重新获取账单列表
      await fetchBills();
      return response.data;
    } catch (err) {
      setError('充值请求失败');
      console.error('Failed to create recharge:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  return {
    bills,
    loading,
    error,
    refetch: fetchBills,
    createRecharge
  };
};