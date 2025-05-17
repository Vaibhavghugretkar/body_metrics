import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CameraCapture from "../components/camera/CameraCapture";
import PostureGuide from "../components/camera/PostureGuide";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import axios from "axios";
import { Upload, ArrowLeft } from "lucide-react";
import { useMeasurements } from "../context/MeasurementContext";

const MeasurementCapture = () => {
  const [capturedImage, setCapturedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { addMeasurement } = useMeasurements();

const handleImageUpload = async (imageFile) => {
  try {
    setIsProcessing(true);
    const formData = new FormData();
    formData.append("image", imageFile);

    // Make the prediction request
    const response = await axios.post("http://localhost:5001/predict", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("Prediction response data:", response.data);

    if (!response.data) {
      throw new Error("No data received from prediction");
    }

    // Helper function to convert string values to numbers (strip unit if present)
    const parseMeasurement = (value) => {
      if (typeof value === "string") {
        return parseFloat(value.replace(/[^\d.-]/g, "")) || 0;
      }
      return value;
    };

    // Extract and format measurements
    const measurements = [{
      ankle: parseMeasurement(response.data.ankle),
      arm_length: parseMeasurement(response.data.arm_length),
      belly: parseMeasurement(response.data.belly),
      chest: parseMeasurement(response.data.chest),
      height: parseMeasurement(response.data.height),
      hips: parseMeasurement(response.data.hips),
      neck: parseMeasurement(response.data.neck),
      shoulder: parseMeasurement(response.data.shoulder),
      thigh: parseMeasurement(response.data.thigh),
      waist: parseMeasurement(response.data.waist),
      wrist: parseMeasurement(response.data.wrist),
      bmi: parseMeasurement(response.data.bmi),
      bodyType: response.data.bodyType,
      units: response.data.units || { length: "cm", weight: "kg" },
      timestamp: new Date().toISOString(),
      images: [imageFile.name], // Save image file name
    }];

    console.log("Formatted measurements:", measurements);

    // Save the measurements to the database
    await axios.post(
      "http://localhost:5000/api/measurements",
      { measurements },
      { withCredentials: true }
    );

    addMeasurement(measurements);
    setIsProcessing(false);
    navigate("/dashboard");
  } catch (err) {
    console.error("Upload or prediction failed:", err.message);
    setError("Failed to upload image or retrieve measurements.");
    setIsProcessing(false);
  }
};




  const handleCapture = (imageData) => {
    setCapturedImage(imageData);
    handleImageUpload(imageData);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image file");
      return;
    }

    setCapturedImage(URL.createObjectURL(file));
    handleImageUpload(file);
  };

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
  );
};

export default MeasurementCapture;
