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

  // Start the camera when capturing state changes
  useEffect(() => {
    if (isCapturing) {
      startCamera()
    } else {
      stopCamera()
    }
    return () => stopCamera()
  }, [isCapturing])

  const startCamera = async () => {
    try {
      console.log("Starting Camera...")

      // Request access to the camera
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
      })

      // Check if the video element exists
      if (!videoRef.current) {
        console.warn("Video element is not ready!")
        return
      }

      videoRef.current.srcObject = mediaStream
      videoRef.current.onloadedmetadata = () => {
        console.log("Metadata loaded, playing video...")
        videoRef.current.play()
      }

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
      if (err.name === "NotAllowedError") {
        onError && onError("Camera access was denied. Please enable permissions.")
      } else if (err.name === "NotFoundError") {
        onError && onError("No camera found. Please connect a camera.")
      } else if (err.name === "OverconstrainedError") {
        onError && onError("Camera resolution not supported. Try lowering the resolution.")
      } else {
        onError && onError("Could not access camera. Please check permissions.")
      }
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
    }
    setStream(null)
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
    setIsCapturing(false)

    // Simulate processing delay
    setTimeout(() => {
      onCapture && onCapture(imageDataUrl)
    }, 1500)
  }

  const retakeImage = () => {
    setCapturedImage(null)
    setIsCapturing(true)
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
              onLoadedMetadata={() => videoRef.current && videoRef.current.play()}
            />
            {poseFeedback && (
              <div
                className={`absolute bottom-4 left-0 right-0 mx-auto w-5/6 p-2 rounded-md text-center text-white ${
                  poseFeedback.includes("Good") ? "bg-green-500" : "bg-blue-500"
                }`}
              >
                {poseFeedback}
              </div>
            )}
          </>
        ) : capturedImage ? (
          <img src={capturedImage} alt="Captured" className="w-full h-auto" />
        ) : (
          <div className="flex items-center justify-center h-80 bg-gray-200">
            <Camera className="h-16 w-16 text-gray-400" />
          </div>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />

      <div className="mt-4 flex space-x-4">
        {!isCapturing && !capturedImage && (
          <Button onClick={() => setIsCapturing(true)}>
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
          <Button onClick={() => setIsCapturing(false)} variant="outline">
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
        )}
      </div>
    </div>
  )
}

export default CameraCapture
