"use client"

import { createContext, useContext, useState, useEffect } from "react"

const UserContext = createContext()

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Check if user is stored in localStorage
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const login = (userData) => {
    setUser(userData)
    localStorage.setItem("user", JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  const updateUser = (userData) => {
    setUser((prevUser) => {
      const updatedUser = { ...prevUser, ...userData }
      localStorage.setItem("user", JSON.stringify(updatedUser))
      return updatedUser
    })
  }

  return <UserContext.Provider value={{ user, login, logout, updateUser }}>{children}</UserContext.Provider>
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
