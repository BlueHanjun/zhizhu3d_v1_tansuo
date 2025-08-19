import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import WechatPayIcon from "@/components/icons/WechatPayIcon";
import AlipayIcon from "@/components/icons/AlipayIcon";
import { useBilling } from "@/hooks/useBilling";
import { useState } from "react";
import { showError, showSuccess } from "@/utils/toast";

const BillingPage = () => {
  const { bills, loading, error } = useBilling();
  const [selectedAmount, setSelectedAmount] = useState("100");
  const [paymentMethod, setPaymentMethod] = useState("wechat");

  const handleRecharge = async () => {
    try {
      // 这里应该调用实际的支付接口
      showSuccess(`已选择${selectedAmount}元，支付方式：${paymentMethod === 'wechat' ? '微信支付' : '支付宝'}`);
    } catch (error) {
      showError("支付请求失败");
    }
  };

  if (loading) {
    return (
      <div className="space-y-8 text-white max-w-3xl">
        <div>
          <h1 className="text-3xl font-bold">充值&账单</h1>
          <p className="text-gray-400 mt-2">充值金额用于API服务和网页版Demo体验。</p>
        </div>
        <div className="flex justify-center items-center h-32">
          加载中...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8 text-white max-w-3xl">
        <div>
          <h1 className="text-3xl font-bold">充值&账单</h1>
          <p className="text-gray-400 mt-2">充值金额用于API服务和网页版Demo体验。</p>
        </div>
        <div className="flex justify-center items-center h-32 text-red-500">
          {error}
        </div>
      </div>
    );
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
            <ToggleGroup 
              type="single" 
              value={selectedAmount} 
              onValueChange={setSelectedAmount}
              variant="outline" 
              className="justify-start flex-wrap gap-3"
            >
              {['10', '20', '50', '100', '500', '1000'].map(amount => (
                <ToggleGroupItem 
                  key={amount} 
                  value={amount} 
                  className="bg-[#2C2C2C] border-zinc-700 data-[state=on]:bg-white data-[state=on]:text-black hover:bg-zinc-700 px-6 py-2 h-auto rounded-md"
                >
                  ¥{amount}
                </ToggleGroupItem>
              ))}
              <Button 
                variant="outline" 
                className="bg-[#2C2C2C] border-zinc-700 hover:bg-zinc-700 px-6 py-2 h-auto rounded-md"
              >
                自定义
              </Button>
            </ToggleGroup>
          </div>
          <div className="space-y-3">
            <Label>支付方式</Label>
            <RadioGroup 
              value={paymentMethod} 
              onValueChange={setPaymentMethod}
              className="space-y-3"
            >
              <Label htmlFor="wechat" className="flex items-center p-4 rounded-md border border-zinc-700 bg-[#2C2C2C] has-[:checked]:border-white cursor-pointer transition-colors">
                <RadioGroupItem value="wechat" id="wechat" className="mr-4" />
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
            <Button 
              size="lg" 
              className="w-full bg-white text-black hover:bg-gray-200 rounded-md"
              onClick={handleRecharge}
            >
              去支付
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
                <TableHead className="text-gray-400">创建时间</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bills.map((bill) => (
                <TableRow key={bill.id} className="border-0 hover:bg-zinc-900">
                  <TableCell className="font-mono py-4">{bill.id}</TableCell>
                  <TableCell className="py-4">¥{bill.amount.toFixed(2)}</TableCell>
                  <TableCell className="py-4">{new Date(bill.created_at).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default BillingPage;