import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import WechatPayIcon from "@/components/icons/WechatPayIcon";
import AlipayIcon from "@/components/icons/AlipayIcon";
import { api } from "@/lib/api";
import { showLoading, dismissToast, showError } from "@/utils/toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";

interface Bill {
  id: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  payment_method: 'wechat_pay' | 'alipay';
  created_at: string;
}

const fetchBillingHistory = async (): Promise<Bill[]> => {
  return api.get<Bill[]>('/api/billing/history');
};

const BillingPage = () => {
  const [amount, setAmount] = useState('100');
  const [customAmount, setCustomAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('wechat_pay');
  const [isCustom, setIsCustom] = useState(false);

  const { data: bills, isLoading } = useQuery({
    queryKey: ['billingHistory'],
    queryFn: fetchBillingHistory,
  });

  const rechargeMutation = useMutation({
    mutationFn: (rechargeDetails: { amount: number; paymentMethod: string }) => 
      api.post<{ payment_url: string }, { amount: number; paymentMethod: string }>('/api/billing/recharge', rechargeDetails),
    onSuccess: (data) => {
      window.location.href = data.payment_url;
    },
  });

  const handlePayment = () => {
    const finalAmount = isCustom ? parseFloat(customAmount) : parseFloat(amount);
    if (isNaN(finalAmount) || finalAmount <= 0) {
      showError("请输入有效的充值金额。");
      return;
    }
    const toastId = showLoading("正在创建支付订单...");
    rechargeMutation.mutate(
      { amount: finalAmount, paymentMethod },
      {
        onSettled: () => dismissToast(toastId),
      }
    );
  };

  const handleAmountSelect = (value: string) => {
    if (value) {
      setAmount(value);
      setIsCustom(false);
      setCustomAmount('');
    }
  };
  
  const handleCustomClick = () => {
    setIsCustom(true);
    setAmount('');
  }

  return (
    <div className="space-y-8 text-white max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold">充值&账单</h1>
        <p className="text-gray-400 mt-2">充值金额用于API服务和网页版Demo体验。</p>
      </div>

      <Tabs defaultValue="online" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-[200px] bg-[#111] p-1 h-auto rounded-md">
          <TabsTrigger value="online" className="rounded-sm">在线充值</TabsTrigger>
          <TabsTrigger value="corporate" className="rounded-sm">对公汇款</TabsTrigger>
        </TabsList>
        <TabsContent value="online" className="mt-6 space-y-6 border-t border-zinc-800 pt-6">
          <div className="space-y-3">
            <Label>支付金额</Label>
            <ToggleGroup type="single" value={amount} onValueChange={handleAmountSelect} variant="outline" className="justify-start flex-wrap gap-3">
              {['10', '20', '50', '100', '500', '1000'].map(val => (
                <ToggleGroupItem key={val} value={val} className="bg-[#2C2C2C] border-zinc-700 data-[state=on]:bg-white data-[state=on]:text-black hover:bg-zinc-700 px-6 py-2 h-auto rounded-md">
                  ¥{val}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
            <div className="flex items-center gap-2 pt-2">
                <Button variant="outline" onClick={handleCustomClick} className={`bg-[#2C2C2C] border-zinc-700 hover:bg-zinc-700 px-6 py-2 h-auto rounded-md ${isCustom ? 'bg-white text-black' : ''}`}>自定义</Button>
                {isCustom && (
                    <Input type="number" placeholder="输入金额" value={customAmount} onChange={e => setCustomAmount(e.target.value)} className="bg-[#2C2C2C] border-zinc-700 w-32" />
                )}
            </div>
          </div>
          <div className="space-y-3">
            <Label>支付方式</Label>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
              <Label htmlFor="wechat" className="flex items-center p-4 rounded-md border border-zinc-700 bg-[#2C2C2C] has-[:checked]:border-white cursor-pointer transition-colors">
                <RadioGroupItem value="wechat_pay" id="wechat" className="mr-4" />
                <WechatPayIcon className="h-6 w-6 mr-3" />
                微信支付
              </Label>
              <Label htmlFor="alipay" className="flex items-center p-4 rounded-md border border-zinc-700 bg-[#2C2C2C] has-[:checked]:border-white cursor-pointer transition-colors">
                <RadioGroupItem value="alipay" id="alipay" className="mr-4" />
                <AlipayIcon className="h-6 w-6 mr-3" />
                支付宝
              </Label>
            </RadioGroup>
          </div>
          <div className="space-y-2">
            <Button onClick={handlePayment} disabled={rechargeMutation.isPending} size="lg" className="w-full bg-white text-black hover:bg-gray-200 rounded-md">
              {rechargeMutation.isPending ? "处理中..." : "去支付"}
            </Button>
            <div className="text-center">
              <Button variant="link" className="text-gray-400 text-sm">查看价格</Button>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="corporate" className="mt-6 border-t border-zinc-800 pt-6">
          <p>请将款项汇至以下账户...</p>
        </TabsContent>
      </Tabs>

      <div className="space-y-4 border-t border-zinc-800 pt-6">
        <h2 className="text-lg font-semibold">账单</h2>
        <div className="rounded-lg border border-zinc-800 bg-[#1C1C1C]">
          <Table>
            <TableHeader>
              <TableRow className="border-b-zinc-800 hover:bg-transparent">
                <TableHead className="text-gray-400">订单编号</TableHead>
                <TableHead className="text-gray-400">金额</TableHead>
                <TableHead className="text-gray-400">状态</TableHead>
                <TableHead className="text-gray-400">创建时间</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 1 }).map((_, i) => (
                  <TableRow key={i} className="border-0">
                    <TableCell className="py-4"><Skeleton className="h-5 w-48" /></TableCell>
                    <TableCell className="py-4"><Skeleton className="h-5 w-16" /></TableCell>
                    <TableCell className="py-4"><Skeleton className="h-5 w-16" /></TableCell>
                    <TableCell className="py-4"><Skeleton className="h-5 w-32" /></TableCell>
                  </TableRow>
                ))
              ) : bills && bills.length > 0 ? (
                bills.map((bill) => (
                  <TableRow key={bill.id} className="border-0 hover:bg-zinc-900">
                    <TableCell className="font-mono py-4">{bill.id.substring(0, 20)}...</TableCell>
                    <TableCell className="py-4">¥{bill.amount.toFixed(2)}</TableCell>
                    <TableCell className="py-4">
                      <span className={`${bill.status === 'completed' ? 'text-green-400' : bill.status === 'failed' ? 'text-red-400' : 'text-yellow-400'}`}>
                        {bill.status === 'completed' ? '已完成' : bill.status === 'failed' ? '失败' : '待支付'}
                      </span>
                    </TableCell>
                    <TableCell className="py-4">{new Date(bill.created_at).toLocaleString()}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-gray-400">
                    暂无账单记录。
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default BillingPage;