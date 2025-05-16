"use client"
import { Menu, Bell, Sun, Moon } from "lucide-react"
import { useTheme } from "../../context/ThemeContext"
import { useUser } from "../../context/UserContext"

const Header = ({ setSidebarOpen }) => {
  const { theme, toggleTheme } = useTheme()
  const { user } = useUser()

  return (
    <header className="sticky top-0 z-10 bg-white shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#d888bb]"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="ml-2 md:ml-0 text-xl font-bold text-gray-900">BodyMetrics</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-1 rounded-full text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#d888bb]"
            >
              {theme === "dark" ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
            </button>
            <button className="p-1 rounded-full text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#d888bb]">
              <span className="sr-only">View notifications</span>
              <Bell className="h-6 w-6" />
            </button>
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-[#ffa8b8] flex items-center justify-center text-white font-medium">
                {user?.name?.charAt(0) || "U"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
