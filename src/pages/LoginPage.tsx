import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { showSuccess, showError, showLoading, dismissToast } from "@/utils/toast";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [code, setCode] = useState("");
  const [isSendingCode, setIsSendingCode] = useState(false);

  const handleSendCode = async () => {
    if (!/^\d{11}$/.test(phoneNumber)) {
      showError("请输入有效的11位手机号码。");
      return;
    }
    setIsSendingCode(true);
    const toastId = showLoading("正在发送验证码...");
    try {
      await api.post('/api/auth/send-code', { phoneNumber });
      dismissToast(toastId);
      showSuccess("验证码已发送，请注意查收。");
    } catch (error) {
      dismissToast(toastId);
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || !code) {
      showError("手机号和验证码不能为空。");
      return;
    }
    const toastId = showLoading("正在登录...");
    try {
      const response = await api.post<{ token: string }, { phoneNumber: string, code: string }>('/api/auth/login', { phoneNumber, code });
      dismissToast(toastId);
      showSuccess("登录成功！");
      login(response.token);
      navigate("/dashboard", { replace: true });
    } catch (error) {
      dismissToast(toastId);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <Card className="w-full max-w-sm bg-[#1C1C1C] border-zinc-800 text-white">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">登录</CardTitle>
          <CardDescription>进入ZHIZHU3D开放平台</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="phone">手机号</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="请输入您的手机号"
                  required
                  className="bg-[#2C2C2C] border-zinc-700"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="code">验证码</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="code"
                    type="text"
                    placeholder="请输入验证码"
                    required
                    className="bg-[#2C2C2C] border-zinc-700"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                  />
                  <Button type="button" variant="outline" className="bg-[#2C2C2C] border-zinc-700 hover:bg-zinc-700 whitespace-nowrap" onClick={handleSendCode} disabled={isSendingCode}>
                    {isSendingCode ? "发送中..." : "获取验证码"}
                  </Button>
                </div>
              </div>
              <Button type="submit" className="w-full bg-white text-black hover:bg-gray-200">
                登录
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;