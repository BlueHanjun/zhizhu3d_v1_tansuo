import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import WechatPayIcon from "@/components/icons/WechatPayIcon";
import AlipayIcon from "@/components/icons/AlipayIcon";
import { useBilling } from "@/hooks/useBilling";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useRef } from "react";
import { showError, showSuccess } from "@/utils/toast";
import { apiService } from '@/services/api';
import { QRCodeSVG } from "qrcode.react";

const BillingPage = () => {
  const { t } = useLanguage();
  const { bills, loading, error } = useBilling();
  const [selectedAmount, setSelectedAmount] = useState("100");
  const [customAmount, setCustomAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("wechat");
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const customInputRef = useRef<HTMLInputElement>(null);

  const handleRecharge = async () => {
    try {
      // 调用实际的支付接口
      const paymentMethodMap = {
        'wechat': 'wechat_pay',
        'alipay': 'alipay'
      };
      
      const response = await apiService.billing.createRecharge(
        parseFloat(selectedAmount), 
        paymentMethodMap[paymentMethod as keyof typeof paymentMethodMap]
      );
      
      // 处理API返回的支付链接
      const { payment_url } = response.data;
      showSuccess(t('billing.paymentSuccess', { 
        amount: selectedAmount, 
        method: paymentMethod === 'wechat' ? t('billing.wechatPay') : t('billing.alipay') 
      }));
      
      // 设置支付链接以显示二维码
      if (payment_url) {
        setPaymentUrl(payment_url);
      }
    } catch (error: any) {
      console.error("支付请求失败:", error);
      showError("支付请求失败: " + (error.response?.data?.message || error.message));
    }
  };

  if (loading) {
    return (
      <div className="space-y-8 text-white max-w-3xl">
        <div>
          <h1 className="text-3xl font-bold">{t('billing.title')}</h1>
          <p className="text-gray-400 mt-2">{t('billing.description')}</p>
        </div>
        <div className="flex justify-center items-center h-32">
          {t('common.loading')}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8 text-white max-w-3xl">
        <div>
          <h1 className="text-3xl font-bold">{t('billing.title')}</h1>
          <p className="text-gray-400 mt-2">{t('billing.description')}</p>
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
        <h1 className="text-3xl font-bold">{t('billing.title')}</h1>
        <p className="text-gray-400 mt-2">{t('billing.description')}</p>
      </div>

      <Tabs defaultValue="online" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-[200px] bg-[#111] p-1 h-auto rounded-md">
          <TabsTrigger value="online" className="rounded-sm">{t('billing.onlineRecharge')}</TabsTrigger>
          <TabsTrigger value="corporate" className="rounded-sm">{t('billing.corporateTransfer')}</TabsTrigger>
        </TabsList>
        <TabsContent value="online" className="mt-6 space-y-6 border-t border-zinc-800 pt-6">
          <div className="space-y-3">
            <Label>{t('billing.paymentAmount')}</Label>
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
                  onClick={() => {
                    setCustomAmount("");
                  }}
                >
                  ¥{amount}
                </ToggleGroupItem>
              ))}
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">¥</span>
                <input
                  ref={customInputRef}
                  type="number"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    if (e.target.value) {
                      setSelectedAmount(e.target.value);
                    }
                  }}
                  placeholder={t('billing.customAmount')}
                  className="bg-[#2C2C2C] border border-zinc-700 hover:bg-zinc-700 px-6 py-2 h-auto rounded-md pl-8 w-[120px] focus:outline-none focus:ring-2 focus:ring-white text-sm"
                />
              </div>
            </ToggleGroup>
          </div>
          <div className="space-y-3">
            <Label>{t('billing.paymentMethod')}</Label>
            <RadioGroup 
              value={paymentMethod} 
              onValueChange={setPaymentMethod}
              className="space-y-3"
            >
              <Label htmlFor="wechat" className="flex items-center p-4 rounded-md border border-zinc-700 bg-[#2C2C2C] has-[:checked]:border-white cursor-pointer transition-colors">
                <RadioGroupItem value="wechat" id="wechat" className="mr-4" />
                <img src="/weixin.svg" alt={t('billing.wechatPay')} className="h-6 w-6 mr-3" />
                {t('billing.wechatPay')}
              </Label>
              <Label htmlFor="alipay" className="flex items-center p-4 rounded-md border border-zinc-700 bg-[#2C2C2C] has-[:checked]:border-white opacity-50 cursor-not-allowed">
                <RadioGroupItem value="alipay" id="alipay" className="mr-4" disabled />
                <img src="/zhifubao.svg" alt={t('billing.alipay')} className="h-6 w-6 mr-3" />
                {t('billing.alipay')}（{t('billing.comingSoon')}）
              </Label>
            </RadioGroup>
          </div>
          <div className="space-y-2">
            <Button 
              size="lg" 
              className="w-full bg-white text-black hover:bg-gray-200 rounded-md"
              onClick={handleRecharge}
            >
              {t('billing.payButton')}
            </Button>
            {paymentUrl && (
              <div className="flex flex-col items-center space-y-4 p-4 bg-[#2C2C2C] rounded-md mt-4">
                <h3 className="text-lg font-medium">{t('billing.scanQR')}</h3>
                <QRCodeSVG value={paymentUrl} size={200} />
                <p className="text-sm text-gray-400">{t('billing.paymentAmount')}: ¥{selectedAmount}</p>
                <Button 
                  variant="outline" 
                  className="mt-2"
                  onClick={() => setPaymentUrl(null)}
                >
                  {t('billing.closeQR')}
                </Button>
              </div>
            )}
            <div className="text-center">
              <Button variant="link" className="text-gray-400 text-sm">{t('billing.viewPrices')}</Button>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="corporate" className="mt-6 border-t border-zinc-800 pt-6">
          <p>{t('billing.corporateInstructions')}</p>
        </TabsContent>
      </Tabs>

      <div className="space-y-4 border-t border-zinc-800 pt-6">
        <h2 className="text-lg font-semibold">{t('billing.bills')}</h2>
        <div className="rounded-lg border border-zinc-800 bg-[#1C1C1C]">
          <Table>
            <TableHeader>
            <TableRow className="border-b-zinc-800 hover:bg-transparent">
              <TableHead className="text-gray-400">{t('billing.orderId')}</TableHead>
              <TableHead className="text-gray-400">{t('billing.amount')}</TableHead>
              <TableHead className="text-gray-400">{t('billing.createdTime')}</TableHead>
              <TableHead className="text-gray-400">{t('billing.status')}</TableHead>
            </TableRow>
          </TableHeader>
            <TableBody>
              {bills.map((bill) => (
                <TableRow key={bill.id} className="border-0 hover:bg-zinc-900">
                  <TableCell className="font-mono py-4">{bill.id}</TableCell>
                  <TableCell className="py-4">¥{bill.amount.toFixed(2)}</TableCell>
                  <TableCell className="py-4">{new Date(bill.created_at).toLocaleString()}</TableCell>
                  <TableCell className="py-4">{bill.status}</TableCell>
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