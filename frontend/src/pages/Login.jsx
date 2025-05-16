"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Button from "../components/ui/Button"
import Logo from "../components/ui/Logo"
import { useUser } from "../context/UserContext"

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const { login } = useUser()

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError("")

    // Simple validation
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields")
      return
    }

    // In a real app, you would validate credentials against a backend
    // For this demo, we'll just simulate a successful login
    login({
      id: "1",
      name: "Demo User",
      email: formData.email,
      gender: "prefer-not-to-say",
      age: 30,
      height: 175,
      weight: 70,
      fitnessGoal: "general-fitness",
    })

    navigate("/")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="flex flex-col items-center">
          <Logo />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <Link to="/register" className="font-medium text-[#d888bb] hover:text-[#ffa8b8]">
              create a new account
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">{error}</div>}

          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
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
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-[#d888bb] focus:border-[#d888bb] focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-[#d888bb] focus:border-[#d888bb] focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="rememberMe"
                type="checkbox"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="h-4 w-4 text-[#d888bb] focus:ring-[#d888bb] border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-[#d888bb] hover:text-[#ffa8b8]">
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <Button type="submit" className="w-full" size="lg">
              Sign in
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login
