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

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // 在实际应用中，这里会验证手机号和验证码
    login();
    navigate("/dashboard", { replace: true });
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
                  />
                  <Button type="button" variant="outline" className="bg-[#2C2C2C] border-zinc-700 hover:bg-zinc-700 whitespace-nowrap">
                    获取验证码
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