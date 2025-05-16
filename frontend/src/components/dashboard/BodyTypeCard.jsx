import Card from "../ui/Card"
import { useMeasurements } from "../../context/MeasurementContext"

const BodyTypeCard = () => {
  const { bodyType } = useMeasurements()

  const bodyTypes = {
    ectomorph: {
      title: "Ectomorph",
      description: "Naturally lean and thin with difficulty building muscle.",
      color: "from-blue-400 to-blue-600",
      characteristics: ["Narrow shoulders and hips", "Small joints", "Long limbs", "Fast metabolism"],
    },
    mesomorph: {
      title: "Mesomorph",
      description: "Naturally muscular with moderate metabolism.",
      color: "from-green-400 to-green-600",
      characteristics: ["Athletic build", "Broad shoulders", "Gains muscle easily", "Responsive to exercise"],
    },
    endomorph: {
      title: "Endomorph",
      description: "Naturally higher body fat with slower metabolism.",
      color: "from-red-400 to-red-600",
      characteristics: [
        "Soft, round body",
        "Gains muscle and fat easily",
        "Slower metabolism",
        "Difficulty losing weight",
      ],
    },
  }

  const currentType = bodyTypes[bodyType || "mesomorph"]

  return (
    <Card>
      <Card.Header>
        <h3 className="text-lg font-medium text-gray-900">Body Type Analysis</h3>
      </Card.Header>
      <Card.Body>
        <div className="flex flex-col items-center">
          <div
            className={`w-24 h-24 rounded-full bg-gradient-to-r ${currentType.color} flex items-center justify-center mb-4`}
          >
            <span className="text-white font-bold text-lg">{currentType.title.charAt(0)}</span>
          </div>
          <h4 className="text-xl font-semibold mb-2">{currentType.title}</h4>
          <p className="text-gray-600 text-center mb-4">{currentType.description}</p>
          <div className="w-full">
            <h5 className="font-medium mb-2">Key Characteristics:</h5>
            <ul className="list-disc pl-5 text-gray-700">
              {currentType.characteristics.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </Card.Body>
    </Card>
  )
}

export default BodyTypeCard
