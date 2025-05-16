"use client"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Layout from "./components/layout/Layout"
import Dashboard from "./pages/Dashboard"
import MeasurementCapture from "./pages/MeasurementCapture"
import History from "./pages/History"
import Recommendations from "./pages/Recommendations"
import Profile from "./pages/Profile"
import Settings from "./pages/Settings"
import Login from "./pages/Login"
import Register from "./pages/Register"
import { useUser } from "./context/UserContext"

function App() {
  const { user } = useUser()

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="capture" element={<MeasurementCapture />} />
          <Route path="history" element={<History />} />
          <Route path="recommendations" element={<Recommendations />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
