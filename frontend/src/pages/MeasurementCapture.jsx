"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import CameraCapture from "../components/camera/CameraCapture"
import PostureGuide from "../components/camera/PostureGuide"
import Card from "../components/ui/Card"
import Button from "../components/ui/Button"
import { Upload, ArrowLeft } from "lucide-react"
import { useMeasurements } from "../context/MeasurementContext"

const MeasurementCapture = () => {
  const [capturedImage, setCapturedImage] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const { addMeasurement } = useMeasurements()

  const handleCapture = (imageData) => {
    setCapturedImage(imageData)
    setIsProcessing(true)

    // Simulate processing delay and measurement extraction
    setTimeout(() => {
      // In a real app, this would be where you'd send the image to a CV API
      // and get back the measurements
      const mockMeasurements = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        chest: 95 + Math.random() * 5,
        waist: 80 + Math.random() * 5,
        hips: 100 + Math.random() * 5,
        thighs: 55 + Math.random() * 3,
        bodyType: ["ectomorph", "mesomorph", "endomorph"][Math.floor(Math.random() * 3)],
      }

      addMeasurement(mockMeasurements)
      setIsProcessing(false)
      navigate("/dashboard")
    }, 3000)
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file")
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setCapturedImage(reader.result)
      handleCapture(reader.result)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">Capture Measurements</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Card>
            <Card.Header>
              <h2 className="text-lg font-medium text-gray-900">Camera Capture</h2>
            </Card.Header>
            <Card.Body>
              {isProcessing ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="w-16 h-16 border-4 border-[#d888bb] border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-gray-700">Processing your image...</p>
                  <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
                </div>
              ) : (
                <CameraCapture onCapture={handleCapture} onError={setError} />
              )}

              {error && <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}
            </Card.Body>
            <Card.Footer>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">Or upload an existing photo</p>
                <label className="cursor-pointer">
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                  <div className="flex items-center text-[#d888bb] hover:text-[#ffa8b8]">
                    <Upload className="h-4 w-4 mr-1" />
                    <span>Upload</span>
                  </div>
                </label>
              </div>
            </Card.Footer>
          </Card>
        </div>

        <div>
          <PostureGuide />
        </div>
      </div>
    </div>
  )
}

export default MeasurementCapture
