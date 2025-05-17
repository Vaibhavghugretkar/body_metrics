"use client";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import MeasurementCapture from "./pages/MeasurementCapture";
import History from "./pages/History";
import Recommendations from "./pages/Recommendations";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Landing from "./pages/Landing";
import BusinessDashboard from "./pages/BusinessDashboard";
import { useUser } from "./context/UserContext";
import { useEffect } from "react";
import axios from "axios";
import { Navigate, useLocation } from "react-router-dom";

const HOST = import.meta.env.VITE_BACKEND_URL;

function ProtectedRoute({ children, businessOnly = false, userOnly = false }) {
  const { user, login } = useUser();
  const location = useLocation();
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${HOST}/auth/profile`, {
          withCredentials: true,
        });
        if (res.data.user) login(res.data.user);
      } catch {}
      finally {
        setLoading(false);
      }
    };
    if (!user) checkAuth();
    else setLoading(false);
  }, []);

  if (loading) return null;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (businessOnly && user.userType !== "Business") return <Navigate to="/dashboard" replace />;
  if (userOnly && user.userType === "Business") return <Navigate to="/business-dashboard" replace />;
  return children;
}

function App() {
  const { user } = useUser();

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Landing />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute userOnly>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="capture" element={<MeasurementCapture />} />
          <Route path="history" element={<History />} />
          <Route path="recommendations" element={<Recommendations />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route
          path="/business-dashboard"
          element={
            <ProtectedRoute businessOnly>
              <BusinessDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
