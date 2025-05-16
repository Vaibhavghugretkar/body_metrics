"use client"

import { useState } from "react"
import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar"
import Header from "./Header"
import MobileMenu from "./MobileMenu"

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-y-auto p-4 bg-gray-50">
          <div className="container mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
      <MobileMenu open={sidebarOpen} setOpen={setSidebarOpen} />
    </div>
  )
}

export default Layout
