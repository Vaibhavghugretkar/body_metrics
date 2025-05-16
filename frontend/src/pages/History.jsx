"use client"
import MeasurementHistoryTable from "../components/history/MeasurementHistoryTable"
import Button from "../components/ui/Button"
import { Download, ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useMeasurements } from "../context/MeasurementContext"

const History = () => {
  const navigate = useNavigate()
  const { measurementHistory } = useMeasurements()

  const exportData = () => {
    const jsonString = JSON.stringify(measurementHistory, null, 2)
    const blob = new Blob([jsonString], { type: "application/json" })
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = `body-measurements-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Measurement History</h1>
        </div>

        <Button
          variant="outline"
          onClick={exportData}
          disabled={measurementHistory.length === 0}
          className="mt-4 sm:mt-0"
        >
          <Download className="mr-2 h-4 w-4" />
          Export Data
        </Button>
      </div>

      <MeasurementHistoryTable />
    </div>
  )
}

export default History
