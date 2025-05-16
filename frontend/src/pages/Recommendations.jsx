"use client"
import ClothingRecommendations from "../components/recommendations/ClothingRecommendations"
import FitnessRecommendations from "../components/recommendations/FitnessRecommendations"
import Button from "../components/ui/Button"
import { ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"

const Recommendations = () => {
  const navigate = useNavigate()

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">Personalized Recommendations</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ClothingRecommendations />
        <FitnessRecommendations />
      </div>
    </div>
  )
}

export default Recommendations
