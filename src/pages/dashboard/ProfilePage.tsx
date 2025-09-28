import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiService } from "@/services/api";

const ProfilePage = () => {
  const { logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [user, setUser] = useState({ phone_number: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await apiService.user.getProfile();
        setUser(response.data);
      } catch (error) {
        console.error("获取用户信息失败:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="space-y-8 text-white max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold">{t('common.profile')}</h1>
        <p className="text-gray-400 mt-2">{t('profile.protectionMessage')}</p>
      </div>

      <Card className="bg-[#1C1C1C] border-zinc-800 p-6">
        <CardContent className="p-0 space-y-8">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">{t('profile.phoneNumber')}</span>
            {loading ? (
              <span className="font-mono">{t('common.loading')}</span>
            ) : (
              <span className="font-mono">{user.phone_number}</span>
            )}
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleLogout} variant="link" className="p-0 text-red-500 hover:text-red-400">{t('common.logout')}</Button>
    </div>
  );
};

export default ProfilePage;