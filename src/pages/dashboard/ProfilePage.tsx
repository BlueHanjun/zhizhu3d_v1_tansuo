import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "../../contexts/AuthContext";

const ProfilePage = () => {
  const { logout } = useAuth();

  return (
    <div className="space-y-8 text-white max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold">个人信息</h1>
        <p className="text-gray-400 mt-2">您的个人信息会被认真保护。</p>
      </div>

      <Card className="bg-[#1C1C1C] border-zinc-800 p-6">
        <CardContent className="p-0 space-y-8">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">手机号码</span>
            <span className="font-mono">186****8637</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">实名认证</span>
            <div className="text-right">
              <p>*想</p>
              <p className="font-mono text-gray-400">330424********2415</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button onClick={logout} variant="link" className="p-0 text-red-500 hover:text-red-400">退出登录</Button>
    </div>
  );
};

export default ProfilePage;