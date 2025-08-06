import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Header = () => {
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `hover:text-white transition-colors ${isActive ? "text-white" : "text-gray-400"}`;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2 text-lg font-semibold text-white -ml-2">
          <img src="/logo.png" alt="ZHIZHU3D Logo" className="h-8 w-8" />
          <span>ZHIZHU3D</span>
        </Link>
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <NavLink to="/" className={navLinkClass} end>首页</NavLink>
            <NavLink to="/dashboard" className={navLinkClass}>开放平台</NavLink>
            <NavLink to="/docs" className={navLinkClass}>文档中心</NavLink>
            <NavLink to="/contact" className={navLinkClass}>联系我们</NavLink>
          </nav>
          <div className="flex items-center gap-4">
            <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-black rounded-full px-6">登录</Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;