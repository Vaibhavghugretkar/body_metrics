import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PostureGuide from "../components/camera/PostureGuide";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import axios from "axios";
import { Upload, ArrowLeft } from "lucide-react";
import { useMeasurements } from "../context/MeasurementContext";

const MeasurementCapture = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();
  const { addMeasurement } = useMeasurements();

  const handleImageUpload = async (imageFile) => {
    try {
      setIsProcessing(true);
      const formData = new FormData();
      formData.append("image", imageFile);

      // Make the prediction request
      const response = await axios.post(
        "http://localhost:5001/predict",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

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
      const measurements = [
        {
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
          images: [imageFile.name],
        },
      ];

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

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image file");
      return;
    }

    setSelectedImage(URL.createObjectURL(file));
    handleImageUpload(file);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">
          Upload Measurements
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div>
          <Card>
            <Card.Header>
              <h2 className="text-lg font-medium text-gray-900">
                Image Upload
              </h2>
            </Card.Header>
            <Card.Body>
              {isProcessing ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="w-16 h-16 border-4 border-[#d888bb] border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-gray-700">Processing your image...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8">
                  {selectedImage ? (
                    <div className="relative w-full max-w-md">
                      <img
                        src={selectedImage}
                        alt="Selected"
                        className="w-full h-auto rounded-lg shadow-md"
                      />
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <Upload className="h-12 w-12 text-gray-400" />
                      </div>
                      <p className="text-gray-600 mb-4">
                        Upload a full-body photo to get your measurements
                      </p>
                      <label className="inline-flex items-center px-4 py-2 bg-[#d888bb] text-white rounded-md hover:bg-[#ffa8b8] transition-colors cursor-pointer">
                        <Upload className="h-4 w-4 mr-2" />
                        Choose Image
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileUpload}
                        />
                      </label>
                    </div>
                  )}
                </div>
              )}

              {error && (
                <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
                  {error}
                </div>
              )}
            </Card.Body>
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
