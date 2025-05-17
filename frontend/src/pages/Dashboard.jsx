import MeasurementSummary from "../components/dashboard/MeasurementSummary"
import MeasurementChart from "../components/dashboard/MeasurementChart"
import BodyTypeCard from "../components/dashboard/BodyTypeCard"
import Button from "../components/ui/Button"
import { Camera, History } from "lucide-react"
import { Link } from "react-router-dom"
import { useMeasurements } from "../context/MeasurementContext"

const Dashboard = () => {
  const { measurementHistory } = useMeasurements()

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <Button variant="outline" asChild>
            <Link to="/dashboard/history">
              <History className="mr-2 h-4 w-4" />
              View History
            </Link>
          </Button>
          <Button asChild>
            <Link to="/dashboard/capture">
              <Camera className="mr-2 h-4 w-4" />
              New Measurement
            </Link>
          </Button>
        </div>
      </div>

      <MeasurementSummary />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {measurementHistory.length > 0 ? (
            <MeasurementChart />
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center h-80">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">No Measurement Data Yet</h3>
              <p className="text-gray-500 text-center mb-4">
                Take your first measurement to see your progress charts here.
              </p>
              <Button asChild>
                <Link to="/capture">
                  <Camera className="mr-2 h-4 w-4" />
                  Take Measurement
                </Link>
              </Button>
            </div>
          )}
        </div>
        <div>
          <BodyTypeCard />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
