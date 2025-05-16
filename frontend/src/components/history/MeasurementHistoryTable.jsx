"use client"

import React from "react"
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react"
import Card from "../ui/Card"
import { useMeasurements } from "../../context/MeasurementContext"

const MeasurementHistoryTable = () => {
  const { measurementHistory, deleteMeasurement } = useMeasurements()
  const [sortField, setSortField] = React.useState("date")
  const [sortDirection, setSortDirection] = React.useState("desc")

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

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
              <th className="px-6 py-3 cursor-pointer" onClick={() => handleSort("thighs")}>
                <div className="flex items-center space-x-1">
                  <span>Thighs (cm)</span>
                  <SortIcon field="thighs" />
                </div>
              </th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedData.map((measurement) => (
              <tr key={measurement.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{formatDate(measurement.date)}</td>
                <td className="px-6 py-4 whitespace-nowrap">{measurement.chest.toFixed(1)}</td>
                <td className="px-6 py-4 whitespace-nowrap">{measurement.waist.toFixed(1)}</td>
                <td className="px-6 py-4 whitespace-nowrap">{measurement.hips.toFixed(1)}</td>
                <td className="px-6 py-4 whitespace-nowrap">{measurement.thighs.toFixed(1)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button onClick={() => deleteMeasurement(measurement.id)} className="text-red-600 hover:text-red-900">
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
