import Card from "../ui/Card"
import { useMeasurements } from "../../context/MeasurementContext"

const FitnessRecommendations = () => {
  const { bodyType } = useMeasurements()

  const getWorkoutRecommendations = () => {
    switch (bodyType) {
      case "ectomorph":
        return {
          title: "Muscle Building Focus",
          description: "As an ectomorph, focus on building muscle mass with compound exercises and adequate recovery.",
          workouts: [
            {
              name: "Compound Lifts",
              description: "Focus on squats, deadlifts, bench press, and rows with heavy weights",
              frequency: "3-4 times per week",
            },
            {
              name: "Limited Cardio",
              description: "Keep cardio sessions short (20-30 min) to preserve energy for muscle building",
              frequency: "1-2 times per week",
            },
            {
              name: "Rest Periods",
              description: "Take longer rest periods (2-3 min) between sets to maximize strength",
              frequency: "During strength training",
            },
          ],
          nutrition: [
            "Caloric surplus of 300-500 calories above maintenance",
            "High protein intake (1.6-2g per kg of body weight)",
            "Frequent meals (5-6 per day) to support muscle growth",
            "Carbohydrates to fuel workouts and support recovery",
          ],
        }
      case "mesomorph":
        return {
          title: "Balanced Training Approach",
          description: "As a mesomorph, you respond well to various training styles. Focus on a balanced approach.",
          workouts: [
            {
              name: "Mixed Training",
              description: "Combine strength training, HIIT, and moderate cardio for best results",
              frequency: "4-5 times per week",
            },
            {
              name: "Circuit Training",
              description: "Incorporate circuit training to maintain muscle while improving conditioning",
              frequency: "2 times per week",
            },
            {
              name: "Sports Activities",
              description: "Include athletic activities that challenge your natural abilities",
              frequency: "1-2 times per week",
            },
          ],
          nutrition: [
            "Balanced macronutrient intake (40% carbs, 30% protein, 30% fat)",
            "Moderate protein intake (1.4-1.6g per kg of body weight)",
            "Adjust calories based on specific goals (maintenance, cutting, bulking)",
            "Timing nutrition around workouts for optimal performance",
          ],
        }
      case "endomorph":
        return {
          title: "Fat Loss & Muscle Tone",
          description: "As an endomorph, focus on metabolic conditioning while preserving muscle mass.",
          workouts: [
            {
              name: "HIIT Training",
              description: "High-intensity interval training to maximize calorie burn and metabolic rate",
              frequency: "3 times per week",
            },
            {
              name: "Strength Training",
              description: "Maintain muscle mass with moderate weights and higher reps (10-15)",
              frequency: "3-4 times per week",
            },
            {
              name: "Steady-State Cardio",
              description: "Include longer cardio sessions (30-45 min) for additional calorie burn",
              frequency: "2-3 times per week",
            },
          ],
          nutrition: [
            "Moderate caloric deficit (300-500 calories below maintenance)",
            "Higher protein intake (1.6-1.8g per kg of body weight)",
            "Lower carbohydrate approach, focusing on fiber-rich sources",
            "Meal timing to fuel workouts and recovery appropriately",
          ],
        }
      default:
        return {
          title: "Personalized Fitness Plan",
          description: "Focus on a balanced approach to fitness that aligns with your goals.",
          workouts: [
            {
              name: "Strength Training",
              description: "Build and maintain muscle with compound and isolation exercises",
              frequency: "2-3 times per week",
            },
            {
              name: "Cardiovascular Exercise",
              description: "Improve heart health and endurance with varied cardio activities",
              frequency: "2-3 times per week",
            },
            {
              name: "Flexibility & Mobility",
              description: "Maintain joint health and prevent injuries with stretching and mobility work",
              frequency: "2-3 times per week",
            },
          ],
          nutrition: [
            "Balanced diet with adequate protein, complex carbs, and healthy fats",
            "Portion control based on activity level and goals",
            "Hydration with at least 2-3 liters of water daily",
            "Minimizing processed foods and added sugars",
          ],
        }
    }
  }

  const recommendations = getWorkoutRecommendations()

  return (
    <Card>
      <Card.Header>
        <h3 className="text-lg font-medium text-gray-900">Fitness Recommendations</h3>
      </Card.Header>
      <Card.Body className="space-y-6">
        <div>
          <h4 className="text-md font-medium">{recommendations.title}</h4>
          <p className="text-gray-600 mt-1">{recommendations.description}</p>
        </div>

        <div>
          <h4 className="text-md font-medium mb-3">Recommended Workouts</h4>
          <div className="space-y-3">
            {recommendations.workouts.map((workout, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded-md">
                <div className="flex justify-between">
                  <h5 className="font-medium">{workout.name}</h5>
                  <span className="text-sm text-gray-500">{workout.frequency}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{workout.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-md font-medium mb-3">Nutrition Guidelines</h4>
          <ul className="space-y-2">
            {recommendations.nutrition.map((item, index) => (
              <li key={index} className="flex items-start">
                <div className="h-2 w-2 rounded-full bg-[#fed2a5] mt-1.5 mr-2"></div>
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </Card.Body>
    </Card>
  )
}

export default FitnessRecommendations
