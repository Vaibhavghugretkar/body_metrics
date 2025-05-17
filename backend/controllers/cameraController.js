import axios from "axios";
import fs from "fs";
import FormData from "form-data";
import Measurement from "../models/measurementModel.js"; 

export const uploadAndPredict = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file uploaded" });
    }

    const imagePath = req.file.path;

    // Prepare form data to send to the prediction API
    const formData = new FormData();
    formData.append("image", fs.createReadStream(imagePath));

    // Send a POST request to the prediction endpoint
    const response = await axios.post("http://localhost:5001/predict", formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    // Clean up the uploaded file
    fs.unlinkSync(imagePath);

    if (!response.data) {
      return res.status(500).json({ message: "Prediction failed, no data received" });
    }

    // Extract measurements from the response
    const { chest, waist, hips, thighs} = response.data;
    const measurements = [{ chest, waist, hips, thighs, date: new Date().toISOString() }];

    // Save the data to the database
    await axios.post("http://localhost:5001/api/measurements", { measurements });

    res.status(200).json({ message: "Prediction successful", data: response.data });
  } catch (err) {
    res.status(500).json({ message: "Prediction failed", error: err.message });
  }
};
