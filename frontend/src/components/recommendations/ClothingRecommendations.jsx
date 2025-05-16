import Card from "../ui/Card"
import { useMeasurements } from "../../context/MeasurementContext"

const ClothingRecommendations = () => {
  const { latestMeasurements, bodyType } = useMeasurements()

  const getSizeRecommendation = (measurement, type) => {
    // This is a simplified example - in a real app, you'd have more sophisticated logic
    if (!measurement) return "N/A"

    const sizeCharts = {
      chest: { xs: 88, s: 94, m: 100, l: 106, xl: 112, xxl: 118 },
      waist: { xs: 74, s: 80, m: 86, l: 92, xl: 98, xxl: 104 },
      hips: { xs: 90, s: 96, m: 102, l: 108, xl: 114, xxl: 120 },
    }

    const chart = sizeCharts[type]
    if (!chart) return "N/A"

    if (measurement < chart.xs) return "XS"
    if (measurement < chart.s) return "XS-S"
    if (measurement < chart.m) return "S"
    if (measurement < chart.l) return "M"
    if (measurement < chart.xl) return "L"
    if (measurement < chart.xxl) return "XL"
    return "XXL"
  }

  const getStyleRecommendations = () => {
    switch (bodyType) {
      case "ectomorph":
        return [
          "Layered clothing to add visual volume",
          "Horizontal stripes to widen frame",
          "Structured jackets with shoulder padding",
          "Slim-fit pants with tapered legs",
        ]
      case "mesomorph":
        return [
          "Well-fitted clothing that showcases natural shape",
          "V-neck tops to highlight shoulders",
          "Straight-leg pants and jeans",
          "Tailored shirts and jackets",
        ]
      case "endomorph":
        return [
          "Vertical stripes to create a lengthening effect",
          "A-line skirts and dresses",
          "Dark, solid colors for a slimming effect",
          "Structured tops with defined waistlines",
        ]
      default:
        return [
          "Well-fitted clothing that complements your body shape",
          "Quality fabrics that drape well",
          "Balanced proportions between top and bottom",
          "Clothes that make you feel confident",
        ]
    }
  }

  return (
    <Card>
      <Card.Header>
        <h3 className="text-lg font-medium text-gray-900">Clothing Recommendations</h3>
      </Card.Header>
      <Card.Body>
        <div className="space-y-6">
          <div>
            <h4 className="text-md font-medium mb-3">Recommended Sizes</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-[#ffffc1] bg-opacity-30 p-3 rounded-md">
                <p className="text-sm text-gray-500">Tops</p>
                <p className="text-xl font-semibold">{getSizeRecommendation(latestMeasurements?.chest, "chest")}</p>
              </div>
              <div className="bg-[#fed2a5] bg-opacity-30 p-3 rounded-md">
                <p className="text-sm text-gray-500">Bottoms</p>
                <p className="text-xl font-semibold">{getSizeRecommendation(latestMeasurements?.waist, "waist")}</p>
              </div>
              <div className="bg-[#ffa8b8] bg-opacity-30 p-3 rounded-md">
                <p className="text-sm text-gray-500">Dresses</p>
                <p className="text-xl font-semibold">{getSizeRecommendation(latestMeasurements?.hips, "hips")}</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-md font-medium mb-3">Style Recommendations</h4>
            <ul className="space-y-2">
              {getStyleRecommendations().map((style, index) => (
                <li key={index} className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-[#d888bb] mr-2"></div>
                  <span>{style}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card.Body>
    </Card>
  )
}

export default ClothingRecommendations
