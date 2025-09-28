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
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { showError, showSuccess } from "@/utils/toast";
import { apiService } from "@/services/api";

const LoginPage = () => {
  const { login, loading } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [countdown, setCountdown] = useState(0);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !code) {
      showError("请输入手机号和验证码");
      return;
    }
    
    try {
      await login(phone, code);
      showSuccess("登录成功");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      showError("登录失败，请检查手机号和验证码");
      console.error("Login error:", error);
    }
  };

  const handleGetCode = async () => {
    if (!phone) {
      showError("请输入手机号");
      return;
    }
    
    if (countdown > 0) return;
    
    try {
      await apiService.auth.sendCode(phone);
      showSuccess("验证码已发送，请注意查收");
      
      // 开始倒计时
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      showError("发送验证码失败，请稍后重试");
      console.error("Send code error:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <Card className="w-full max-w-sm bg-[#1C1C1C] border-zinc-800 text-white">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{t('login.title')}</CardTitle>
          <CardDescription>{t('login.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="phone">{t('login.phoneNumber')}</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder={t('login.phonePlaceholder')}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="bg-[#2C2C2C] border-zinc-700"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="code">{t('login.verificationCode')}</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="code"
                    type="text"
                    placeholder={t('login.codePlaceholder')}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                    className="bg-[#2C2C2C] border-zinc-700"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleGetCode}
                    className="bg-[#2C2C2C] border-zinc-700 hover:bg-zinc-700 whitespace-nowrap"
                    disabled={countdown > 0}
                  >
                    {countdown > 0 ? t('login.countdown', { countdown }) : t('login.getCode')}
                  </Button>
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full bg-white text-black hover:bg-gray-200"
                disabled={loading}
              >
                {loading ? t('login.loggingIn') : t('login.loginButton')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;