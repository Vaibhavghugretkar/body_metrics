"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Button from "../components/ui/Button"
import Logo from "../components/ui/Logo"
import { useUser } from "../context/UserContext"
import axios from "axios"
import { Eye, EyeOff } from "lucide-react"

const HOST = import.meta.env.VITE_BACKEND_URL

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
    userType: "Standard",
  })
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const { login } = useUser()

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    // Simple validation
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields")
      return
    }

    try {
      const res = await axios.post(
        `${HOST}/auth/login`,
        {
          email: formData.email,
          password: formData.password,
          userType: formData.userType,
        },
        { withCredentials: true },
      )
      login(res.data.user)
      // Always use the userType from the backend response for redirect
      if (res.data.user && res.data.user.userType === "Business") {
        navigate("/business-dashboard")
      } else {
        navigate("/dashboard")
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Login failed")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 flex items-center justify-center bg-yellow-50 rounded-full mb-2">
            <Logo className="text-yellow-500" />
          </div>
          <h2 className="mt-4 text-center text-3xl font-extrabold text-gray-900">Welcome Back</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <Link
              to="/register"
              className="font-medium text-yellow-600 hover:text-yellow-500 transition-colors duration-200"
            >
              create a new account
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md text-sm animate-pulse">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors duration-200 sm:text-sm"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors duration-200 sm:text-sm pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700 transition-colors duration-200 focus:outline-none"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end">
            {/* <div className="flex items-center">
              <input
                id="remember-me"
                name="rememberMe"
                type="checkbox"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="h-4 w-4 text-yellow-500 focus:ring-yellow-500 border-gray-300 rounded transition-colors duration-200"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div> */}

            <div className="text-sm">
              <a href="#" className="font-medium text-yellow-600 hover:text-yellow-500 transition-colors duration-200">
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg"
            >
              Sign in
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login
