import { ArrowUp, ArrowDown } from "lucide-react";
import Card from "../ui/Card";
import { calculateSize } from "../../utils/sizeCalculator";
import { useState, useEffect } from "react";
import axios from "axios";

const pantsSizeRanges = {
  S: "71-78 waist",
  M: "79-86 waist",
  L: "87-94 waist",
  XL: "95-102 waist",
  XXL: "103-110 waist",
  XXXL: "111+ waist",
  Unknown: "",
};

const MeasurementSummary = () => {
  const [latestMeasurements, setLatestMeasurements] = useState(null);
  const [previousMeasurements, setPreviousMeasurements] = useState(null);

  useEffect(() => {
    const fetchMeasurements = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/measurements/latest", { withCredentials: true });
        const latest = response.data;
        const { shirtSize, pantsSize, shoeSize } = calculateSize(latest);
        setLatestMeasurements({ ...latest, shirtSize, pantsSize, shoeSize });
      } catch (error) {
        console.error("Error fetching latest measurements:", error);
      }
    };
    fetchMeasurements();
  }, []);

  const measurementTypes = [
    { name: "Shirt Size", key: "shirtSize" },
    { name: "Pant Size", key: "pantsSize" },
    { name: "Shoe Size", key: "shoeSize" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {measurementTypes.map((type) => (
        <Card key={type.key}>
          <Card.Body>
            <h3 className="text-lg font-medium text-gray-900">{type.name}</h3>
            <div className="mt-1 flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">
                {latestMeasurements?.[type.key] || "–"}
                {/* Show range only for Pant Size */}
                {type.key === "pantsSize" && latestMeasurements?.pantsSize && (
                  <span className="ml-2 text-sm font-normal text-gray-600">
                    ({pantsSizeRanges[latestMeasurements.pantsSize] || ""})
                  </span>
                )}
              </p>
            </div>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

export default MeasurementSummary;
