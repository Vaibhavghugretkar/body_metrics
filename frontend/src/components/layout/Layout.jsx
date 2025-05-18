import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import MobileMenu from "./MobileMenu";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="flex flex-col flex-1 ml-0 md:ml-64 overflow-hidden">
        {/* <Header setSidebarOpen={setSidebarOpen} /> */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
          <div className="w-full">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Menu */}
      <MobileMenu open={sidebarOpen} setOpen={setSidebarOpen} />
    </div>
  );
};

export default Layout;
