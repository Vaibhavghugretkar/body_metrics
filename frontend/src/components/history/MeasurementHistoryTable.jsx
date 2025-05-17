"use client"

import React, { useState, useEffect } from "react"
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react"
import Card from "../ui/Card"
import axios from "axios"

const MeasurementHistoryTable = () => {
  const [measurementHistory, setMeasurementHistory] = useState([])
  const [sortField, setSortField] = useState("date")
  const [sortDirection, setSortDirection] = useState("desc")

  // Fetch measurements from the API
  const fetchMeasurements = async () => {
    try {
      console.log("Fetching measurements...")
      const response = await axios.get("http://localhost:5000/api/measurements", { withCredentials: true })
      console.log("Measurements fetched:", response.data)
      setMeasurementHistory(response.data.measurements || [])
    } catch (error) {
      console.error("Failed to fetch measurements:", error)
    }
  }

  useEffect(() => {
    fetchMeasurements()
  }, [])

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const deleteMeasurement = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/measurements/${id}`, { withCredentials: true })
      setMeasurementHistory((prev) => prev.filter((m) => m._id !== id))
    } catch (error) {
      console.error("Error deleting measurement:", error)
    }
  }

  // Sorting logic
  const sortedData = [...measurementHistory].sort((a, b) => {
    let aValue = a[sortField]
    let bValue = b[sortField]

    if (sortField === "date") {
      aValue = new Date(aValue).getTime()
      bValue = new Date(bValue).getTime()
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
    return 0
  })

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
  }

  const SortIcon = ({ field }) => {
    if (sortField !== field) return null
    return sortDirection === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
  }

  return (
    <Card>
      <Card.Header>
        <h3 className="text-lg font-medium text-gray-900">Measurement History</h3>
      </Card.Header>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <th className="px-6 py-3 cursor-pointer" onClick={() => handleSort("date")}>
                <div className="flex items-center space-x-1">
                  <span>Date</span>
                  <SortIcon field="date" />
                </div>
              </th>
              <th className="px-6 py-3 cursor-pointer" onClick={() => handleSort("chest")}>
                <div className="flex items-center space-x-1">
                  <span>Chest (cm)</span>
                  <SortIcon field="chest" />
                </div>
              </th>
              <th className="px-6 py-3 cursor-pointer" onClick={() => handleSort("waist")}>
                <div className="flex items-center space-x-1">
                  <span>Waist (cm)</span>
                  <SortIcon field="waist" />
                </div>
              </th>
              <th className="px-6 py-3 cursor-pointer" onClick={() => handleSort("hips")}>
                <div className="flex items-center space-x-1">
                  <span>Hips (cm)</span>
                  <SortIcon field="hips" />
                </div>
              </th>
              <th className="px-6 py-3 cursor-pointer" onClick={() => handleSort("thigh")}>
                <div className="flex items-center space-x-1">
                  <span>Thighs (cm)</span>
                  <SortIcon field="thigh" />
                </div>
              </th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedData.map((measurement, index) => (
              <tr key={measurement._id || index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{formatDate(measurement.timestamp)}</td>
                <td className="px-6 py-4 whitespace-nowrap">{measurement.chest || "-"}</td>
                <td className="px-6 py-4 whitespace-nowrap">{measurement.waist || "-"}</td>
                <td className="px-6 py-4 whitespace-nowrap">{measurement.hips || "-"}</td>
                <td className="px-6 py-4 whitespace-nowrap">{measurement.thigh || "-"}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button onClick={() => deleteMeasurement(measurement._id)} className="text-red-600 hover:text-red-900">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
            {sortedData.length === 0 && (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  No measurement data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

export default MeasurementHistoryTable
