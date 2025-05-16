"use client"

import { useRef, useState, useEffect } from "react"
import { Camera, RefreshCw, Check, X } from "lucide-react"
import Button from "../ui/Button"

const CameraCapture = ({ onCapture, onError }) => {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [stream, setStream] = useState(null)
  const [isCapturing, setIsCapturing] = useState(false)
  const [capturedImage, setCapturedImage] = useState(null)
  const [poseFeedback, setPoseFeedback] = useState(null)

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [stream])

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
      })
      videoRef.current.srcObject = mediaStream
      setStream(mediaStream)
      setIsCapturing(true)

      // Simulate pose detection feedback
      const feedbacks = [
        "Stand straight with arms slightly away from body",
        "Face the camera directly",
        "Ensure your whole body is visible",
        "Good posture detected",
      ]

      let index = 0
      const interval = setInterval(() => {
        setPoseFeedback(feedbacks[index])
        index = (index + 1) % feedbacks.length
        if (index === 3) clearInterval(interval)
      }, 2000)
    } catch (err) {
      console.error("Error accessing camera:", err)
      onError && onError("Could not access camera. Please check permissions.")
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
    }
    setIsCapturing(false)
    setPoseFeedback(null)
  }

  const captureImage = () => {
    if (!videoRef.current) return

    const canvas = canvasRef.current
    const video = videoRef.current

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    const ctx = canvas.getContext("2d")
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    const imageDataUrl = canvas.toDataURL("image/png")
    setCapturedImage(imageDataUrl)
    stopCamera()

    // Simulate processing delay
    setTimeout(() => {
      onCapture && onCapture(imageDataUrl)
    }, 1500)
  }

  const retakeImage = () => {
    setCapturedImage(null)
    startCamera()
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full max-w-md overflow-hidden rounded-lg bg-gray-100 shadow-lg">
        {isCapturing ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-auto"
              onCanPlay={() => videoRef.current.play()}
            />
            {poseFeedback && (
              <div
                className={`absolute bottom-4 left-0 right-0 mx-auto w-5/6 p-2 rounded-md text-center text-white ${poseFeedback.includes("Good") ? "bg-green-500" : "bg-blue-500"}`}
              >
                {poseFeedback}
              </div>
            )}
          </>
        ) : capturedImage ? (
          <img src={capturedImage || "/placeholder.svg"} alt="Captured" className="w-full h-auto" />
        ) : (
          <div className="flex items-center justify-center h-80 bg-gray-200">
            <Camera className="h-16 w-16 text-gray-400" />
          </div>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />

      <div className="mt-4 flex space-x-4">
        {!isCapturing && !capturedImage && (
          <Button onClick={startCamera}>
            <Camera className="mr-2 h-4 w-4" />
            Start Camera
          </Button>
        )}

        {isCapturing && (
          <Button onClick={captureImage} variant="primary">
            <Camera className="mr-2 h-4 w-4" />
            Capture
          </Button>
        )}

        {capturedImage && (
          <>
            <Button onClick={retakeImage} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Retake
            </Button>
            <Button variant="primary">
              <Check className="mr-2 h-4 w-4" />
              Use This Image
            </Button>
          </>
        )}

        {isCapturing && (
          <Button onClick={stopCamera} variant="outline">
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
        )}
      </div>
    </div>
  )
}

export default CameraCapture
