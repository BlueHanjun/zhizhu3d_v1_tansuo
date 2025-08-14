import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

const ProfilePage = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const formatPhoneNumber = (phone: string) => {
    if (!phone) return "";
    return `${phone.substring(0, 3)}****${phone.substring(7)}`;
  };

  const formatIdNumber = (id: string) => {
    if (!id) return "";
    return `${id.substring(0, 6)}********${id.substring(14)}`;
  };

  if (!user) {
    return (
      <div className="space-y-8 text-white max-w-3xl">
        <div>
          <h1 className="text-3xl font-bold">个人信息</h1>
          <p className="text-gray-400 mt-2">您的个人信息会被认真保护。</p>
        </div>
        <Card className="bg-[#1C1C1C] border-zinc-800 p-6">
          <CardContent className="p-0 space-y-8">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

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
            <span className="font-mono">{formatPhoneNumber(user.phone_number)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">实名认证</span>
            {user.real_name && user.id_number ? (
              <div className="text-right">
                <p>*{user.real_name.substring(1)}</p>
                <p className="font-mono text-gray-400">{formatIdNumber(user.id_number)}</p>
              </div>
            ) : (
              <span className="text-gray-500">未认证</span>
            )}
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleLogout} variant="link" className="p-0 text-red-500 hover:text-red-400">退出登录</Button>
    </div>
  );
};

export default ProfilePage;