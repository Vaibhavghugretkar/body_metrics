import { ArrowUp, ArrowDown } from "lucide-react"
import Card from "../ui/Card"
import { useMeasurements } from "../../context/MeasurementContext"

const MeasurementSummary = () => {
  const { latestMeasurements, previousMeasurements } = useMeasurements()

  const measurementTypes = [
    { name: "Shirt Size", key: "shirtSize" },
    { name: "Pant Size", key: "pantSize" },
    { name: "Shoe Size", key: "shoeSize" },
  ]

  const getChange = (current, previous, key) => {
    if (!current || !previous) return { value: 0, isPositive: false }
    const currentValue = current[key] || 0
    const previousValue = previous[key] || 0
    const diff = currentValue - previousValue
    return {
      value: Math.abs(diff).toFixed(1),
      isPositive: diff > 0,
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {measurementTypes.map((type) => {
        const change = getChange(latestMeasurements, previousMeasurements, type.key)
        return (
          <Card key={type.key}>
            <Card.Body>
              <h3 className="text-lg font-medium text-gray-900">{type.name}</h3>
              <div className="mt-1 flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">
                  {latestMeasurements?.[type.key] || "–"}
                </p>
                {latestMeasurements && previousMeasurements && (
                  <p
                    className={`ml-2 flex items-center text-sm ${
                      change.isPositive ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {change.isPositive ? (
                      <ArrowUp className="self-center flex-shrink-0 h-4 w-4 text-red-500" />
                    ) : (
                      <ArrowDown className="self-center flex-shrink-0 h-4 w-4 text-green-500" />
                    )}
                    <span className="sr-only">
                      {change.isPositive ? "Increased" : "Decreased"} by
                    </span>
                    {change.value}
                  </p>
                )}
              </div>
            </Card.Body>
          </Card>
        )
      })}
    </div>
  )
}

export default MeasurementSummary
