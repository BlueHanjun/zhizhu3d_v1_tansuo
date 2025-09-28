import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { useUsage } from "@/hooks/useUsage";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useEffect } from "react";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black/50 p-2 border border-zinc-700 rounded-md">
        <p className="text-white">{`${payload[0].value} CNY`}</p>
      </div>
    );
  }
  return null;
};

const UsagePage = () => {
  const { t } = useLanguage();
  const [selectedYear, setSelectedYear] = useState(2025);
  const [selectedMonth, setSelectedMonth] = useState(8);
  const { usageData, balance, loading, error, refetch } = useUsage();
  const navigate = useNavigate();
  
  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    refetch('monthly', `${year}-${selectedMonth.toString().padStart(2, '0')}`);
  };
  
  const handleMonthChange = (month: number) => {
    setSelectedMonth(month);
    refetch('monthly', `${selectedYear}-${month.toString().padStart(2, '0')}`);
  };
  
  // 初始化时获取数据
  useEffect(() => {
    refetch('monthly', `${selectedYear}-${selectedMonth.toString().padStart(2, '0')}`);
  }, []);
  
  if (loading) {
    return (
      <div className="space-y-8 text-white">
        <div>
          <h1 className="text-3xl font-bold">{t('usage.title')}</h1>
          <p className="text-gray-400 mt-2">{t('usage.description')}</p>
        </div>
        <div className="flex justify-center items-center h-32">
          {t('common.loading')}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8 text-white">
        <div>
          <h1 className="text-3xl font-bold">{t('usage.title')}</h1>
          <p className="text-gray-400 mt-2">{t('usage.description')}</p>
        </div>
        <div className="flex justify-center items-center h-32 text-red-500">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 text-white">
      <div>
        <h1 className="text-3xl font-bold">{t('usage.title')}</h1>
        <p className="text-gray-400 mt-2">{t('usage.description')}</p>
      </div>

      <Card className="bg-[#1C1C1C] border-zinc-800">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-300">{t('usage.balance')}</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div className="text-3xl font-bold">¥ {balance?.amount?.toFixed(2) || '0.00'}</div>
          <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-black rounded-md" onClick={() => navigate('/dashboard/billing')}>{t('usage.rechargeButton')}</Button>
        </CardContent>
      </Card>

      <Card className="bg-[#1C1C1C] border-zinc-800">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">{t('usage.details')}</CardTitle>
            <div className="flex gap-2">
              <select 
                value={selectedYear}
                onChange={(e) => handleYearChange(parseInt(e.target.value))}
                className="bg-zinc-800 border-zinc-700 text-white rounded-md px-2 py-1"
              >
                {[2023, 2024, 2025, 2026, 2027].map(year => (
                  <option key={year} value={year}>{year}{t('usage.year')}</option>
                ))}
              </select>
              <select 
                value={selectedMonth}
                onChange={(e) => handleMonthChange(parseInt(e.target.value))}
                className="bg-zinc-800 border-zinc-700 text-white rounded-md px-2 py-1"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                  <option key={month} value={month}>{month}{t('usage.month')}</option>
                ))}
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="h-[350px] pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={usageData} barGap={-10}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" vertical={false} />
              <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} hide />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(136, 132, 216, 0.1)' }} />
              <Bar dataKey="uv" fill="#E2E8F0" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsagePage;