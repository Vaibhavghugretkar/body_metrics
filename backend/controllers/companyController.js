import Company from "../models/companyModel.js";
import Measurement from "../models/measurementModel.js";
import axios from "axios";
import FormData from "form-data";
import fs from "fs";

// Create or update company profile for business user
export const upsertCompanyProfile = async (req, res) => {
  try {
    const { name, products } = req.body;
    const userId = req.user.id;
    // Find or create company by userId
    let company = await Company.findOne({ user: userId });
    if (!company) {
      company = new Company({ name, products, user: userId });
    } else {
      company.name = name;
      company.products = products;
    }
    await company.save();
    res.status(200).json({ company });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to save company profile", error: err.message });
  }
};

// Get company profile for business user
export const getCompanyProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const company = await Company.findOne({ user: userId });
    if (!company)
      return res.status(404).json({ message: "No company profile found" });
    res.status(200).json({ company });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch company profile", error: err.message });
  }
};

// Generate and save API key for business user
export const generateApiKey = async (req, res) => {
  try {
    const userId = req.user.id;
    const company = await Company.findOne({ user: userId });
    if (!company)
      return res.status(404).json({ message: "No company profile found" });
    const apiKey = await company.generateApiKey();
    await company.save();
    res.status(200).json({ apiKey });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to generate API key", error: err.message });
  }
};

// Proxy image to ML service and return prediction
export const predictMeasurementByApiKey = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }
    // Prepare form-data for forwarding
    const formData = new FormData();
    formData.append(
      "image",
      fs.createReadStream(req.file.path),
      req.file.originalname
    );

    // Forward to ML service
    const response = await axios.post(
      "http://localhost:5001/predict",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
        },
      }
    );

    // Optionally, delete the temp file after use
    fs.unlink(req.file.path, () => {});

    res.status(200).json(response.data);
  } catch (err) {
    res.status(500).json({ message: "Prediction failed", error: err.message });
  }
};
