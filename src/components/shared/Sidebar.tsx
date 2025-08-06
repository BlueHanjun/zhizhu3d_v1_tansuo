import { NavLink } from "react-router-dom";
import { BarChart2, KeyRound, CreditCard, User } from "lucide-react";

const Sidebar = () => {
  const navItems = [
    { name: "用量信息", href: "/dashboard/usage", icon: BarChart2 },
    { name: "API keys", href: "/dashboard/api-keys", icon: KeyRound },
    { name: "充值&账单", href: "/dashboard/billing", icon: CreditCard },
  ];

  const activeClassName = "bg-zinc-800 text-white";
  const inactiveClassName = "text-gray-400 hover:bg-zinc-800 hover:text-white";

  const getNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
      isActive ? activeClassName : inactiveClassName
    }`;

  return (
    <aside className="w-60 flex-shrink-0 bg-[#111111] p-4 flex flex-col justify-between">
      <div>
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={getNavLinkClass}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
      <div>
        <NavLink
          to="/dashboard/profile"
          className={getNavLinkClass}
        >
          <User className="h-4 w-4" />
          个人信息
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;