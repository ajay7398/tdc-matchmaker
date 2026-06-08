// src/components/layout/Sidebar.jsx
// The left navigation sidebar shown on all dashboard pages.
import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, LogOut, Heart, Users } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import toast from "react-hot-toast";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  // Navigation items
  const navItems = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  ];

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-rose-100 flex flex-col shadow-sm">
      {/* Logo */}
      <div className="p-6 border-b border-rose-50">
        <div className="flex items-center gap-2">
          <Heart className="text-rose-500 fill-rose-500" size={24} />
          <div>
            <h1 className="font-serif text-lg font-bold text-gray-900 leading-tight">
              The Date Crew
            </h1>
            <p className="text-xs text-rose-400 font-sans">Matchmaker Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive
                  ? "bg-rose-50 text-rose-600 font-semibold"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User info + Logout at bottom */}
      <div className="p-4 border-t border-rose-50">
        <div className="flex items-center gap-3 mb-3 px-2">
          {/* Avatar */}
          <div className="w-9 h-9 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 font-bold text-sm font-sans">
            {user?.name?.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate">{user?.name}</p>
            <p className="text-xs text-gray-400 truncate">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-150"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
