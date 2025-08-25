import { Link, NavLink } from "react-router-dom";

const Header = () => {
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `hover:text-white transition-colors ${isActive ? "text-white" : "text-gray-400"}`;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-transparent">
      <div className="mx-auto flex h-16 items-center justify-between px-4 md:px-6" style={{ marginLeft: 43, marginRight: 43, padding: 0 }}>
        <Link to="/" className="flex items-center gap-2 text-lg font-semibold text-white">
          <img src="/zuoshangjiaologo.png" alt="ZHIZHU3D Logo" className="h-6 w-auto" />
        </Link>
        <div className="flex items-center gap-6 justify-end">
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium justify-end">
            <NavLink to="/" className={navLinkClass} end>首页</NavLink>
            <NavLink to="/dashboard" className={navLinkClass}>API开放平台</NavLink>
            <NavLink to="/docs" className={navLinkClass}>文档中心</NavLink>
            <NavLink to="/contact" className={navLinkClass}>联系我们</NavLink>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;