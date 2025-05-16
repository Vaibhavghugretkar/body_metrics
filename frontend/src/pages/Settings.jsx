"use client"

import { useState } from "react"
import Card from "../components/ui/Card"
import Button from "../components/ui/Button"
import { ArrowLeft, Save } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useTheme } from "../context/ThemeContext"

const Settings = () => {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const [settings, setSettings] = useState({
    notifications: true,
    emailUpdates: false,
    measurementUnits: "metric",
    privacyMode: false,
    dataRetention: "1-year",
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Save settings logic would go here
    alert("Settings saved successfully!")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <Card.Header>
            <h2 className="text-lg font-medium text-gray-900">Application Settings</h2>
          </Card.Header>
          <form onSubmit={handleSubmit}>
            <Card.Body className="space-y-4">
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="notifications"
                    checked={settings.notifications}
                    onChange={handleChange}
                    className="rounded text-[#d888bb] focus:ring-[#d888bb]"
                  />
                  <span className="ml-2 text-gray-700">Enable notifications</span>
                </label>
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="emailUpdates"
                    checked={settings.emailUpdates}
                    onChange={handleChange}
                    className="rounded text-[#d888bb] focus:ring-[#d888bb]"
                  />
                  <span className="ml-2 text-gray-700">Receive email updates</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Measurement Units</label>
                <select
                  name="measurementUnits"
                  value={settings.measurementUnits}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#d888bb] focus:border-transparent"
                >
                  <option value="metric">Metric (cm, kg)</option>
                  <option value="imperial">Imperial (in, lb)</option>
                </select>
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="privacyMode"
                    checked={settings.privacyMode}
                    onChange={handleChange}
                    className="rounded text-[#d888bb] focus:ring-[#d888bb]"
                  />
                  <span className="ml-2 text-gray-700">Privacy mode (hide measurements from dashboard)</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data Retention</label>
                <select
                  name="dataRetention"
                  value={settings.dataRetention}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#d888bb] focus:border-transparent"
                >
                  <option value="1-month">1 Month</option>
                  <option value="6-months">6 Months</option>
                  <option value="1-year">1 Year</option>
                  <option value="forever">Forever</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Theme</label>
                <div className="flex items-center space-x-4">
                  <button
                    type="button"
                    onClick={toggleTheme}
                    className={`px-4 py-2 rounded-md ${
                      theme === "light" ? "bg-[#d888bb] text-white" : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    Light
                  </button>
                  <button
                    type="button"
                    onClick={toggleTheme}
                    className={`px-4 py-2 rounded-md ${
                      theme === "dark" ? "bg-[#d888bb] text-white" : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    Dark
                  </button>
                </div>
              </div>
            </Card.Body>
            <Card.Footer>
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" />
                Save Settings
              </Button>
            </Card.Footer>
          </form>
        </Card>

        <Card>
          <Card.Header>
            <h2 className="text-lg font-medium text-gray-900">Account Management</h2>
          </Card.Header>
          <Card.Body className="space-y-4">
            <div>
              <h3 className="text-md font-medium text-gray-900 mb-2">Export Your Data</h3>
              <p className="text-sm text-gray-600 mb-3">Download all your measurement data and account information.</p>
              <Button variant="outline" size="sm">
                Export All Data
              </Button>
            </div>

            <div className="pt-4 border-t">
              <h3 className="text-md font-medium text-gray-900 mb-2">Delete Account</h3>
              <p className="text-sm text-gray-600 mb-3">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
              <Button variant="danger" size="sm">
                Delete Account
              </Button>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  )
}

export default Settings
