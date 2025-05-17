"use client";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Camera,
  History,
  Lightbulb,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { useUser } from "../../context/UserContext";
import Logo from "../ui/Logo";
import axios from "axios";

const HOST = import.meta.env.VITE_BACKEND_URL;

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const { user, logout } = useUser();

  const navItems = [
    { name: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
    { name: "Capture", to: "/dashboard/capture", icon: Camera },
    { name: "History", to: "/dashboard/history", icon: History },
    { name: "Recommendations", to: "/dashboard/recommendations", icon: Lightbulb },
    { name: "Profile", to: "/dashboard/profile", icon: User },
    { name: "Settings", to: "/dashboard/settings", icon: Settings },
  ];

  const handleLogout = async () => {
    try {
      await axios.post(`${HOST}/auth/logout`, {}, { withCredentials: true });
      logout();
    } catch (err) {
      logout();
    }
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 transition-transform duration-300 ease-in-out`}
    >
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-center h-16 border-b">
          <Logo />
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="px-2 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? "bg-gradient-to-r from-[#ffa8b8] to-[#d888bb] text-white"
                      : "text-gray-700 hover:bg-[#ffffc1] hover:text-gray-900"
                  }`
                }
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-red-100 hover:text-red-700"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Log out
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
