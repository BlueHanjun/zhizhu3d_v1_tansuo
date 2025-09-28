import { Link, NavLink } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Header = () => {
  const { language, setLanguage, t } = useLanguage();
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `hover:text-white transition-colors ${isActive ? "text-white" : "text-gray-400"}`;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-transparent">
      <div className="mx-auto flex h-16 items-center justify-between px-4 md:px-6" style={{ marginLeft: 43, marginRight: 43, padding: 0 }}>
        <Link to="/" className="flex items-center gap-2 text-lg font-semibold text-white">
          <img src="/zuoshangjiaologo.png" alt="ZHIZHU3D Logo" className="h-6 w-auto" />
        </Link>
        <div className="flex items-center gap-6 justify-end mr-8">
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium justify-end">
            <NavLink to="/" className={navLinkClass} end>{t('common.home')}</NavLink>
            <NavLink to="/dashboard" className={navLinkClass}>{t('common.apiPlatform')}</NavLink>
            <NavLink to="/docs" className={navLinkClass}>{t('common.documentation')}</NavLink>
            <NavLink to="/contact" className={navLinkClass}>{t('common.contact')}</NavLink>
          </nav>
          
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-[120px] bg-transparent border-0 text-white">
              <SelectValue placeholder={t('header.language')} />
            </SelectTrigger>
            <SelectContent className="bg-[#1C1C1C] border-zinc-700 text-white">
              <SelectItem value="zh-CN">简体中文</SelectItem>
              <SelectItem value="en-US">English</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </header>
  );
};

export default Header;