import Measurement from "../models/measurementModel.js";

export const addMeasurement = async (req, res) => {
  try {
    const { measurements } = req.body;
    console.log("Received measurements:", measurements);

    // Ensure the user ID is correctly retrieved
    const userId = req.user?.id || req.user?.userId;
    if (!userId) {
      return res.status(400).json({ message: "User ID not found" });
    }

    // Find the existing measurement record or create a new one
    let record = await Measurement.findOne({ userId });

    if (!record) {
      // Create a new record if none exists
      record = await Measurement.create({ userId, measurements });
    } else {
      // Append new measurements to the existing array
      record.measurements = [...record.measurements, ...measurements];
      record.updatedAt = new Date();
      await record.save();
    }

    res.status(201).json({ message: "Measurement added", record });
  } catch (err) {
    console.error("Error adding measurement:", err.message);
    res.status(500).json({ message: "Failed to add measurement", error: err.message });
  }
};



export const getMeasurements = async (req, res) => {
  try {
    // Check and log the user ID
    const userId = req.user.id;

    console.log("Fetching measurements for user ID:", userId);

    // Fetch the measurements from the database
    const record = await Measurement.findOne({ userId });

    if (!record) {
      return res.status(404).json({ message: "No measurements found for this user" });
    }

    res.status(200).json({ measurements: record.measurements });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch measurements", error: err.message });
  }
};


export const getLatestMeasurement = async (req, res) => {
  try {
    const record = await Measurement.findOne({ userId: req.user.id });
    if (!record || !record.measurements.length) {
      return res.status(404).json({ message: "No measurements found" });
    }

    // Find the measurement entry with the latest timestamp
    const latest = record.measurements.reduce((latestEntry, currentEntry) => {
      if (!latestEntry || currentEntry.timestamp > latestEntry.timestamp) {
        return currentEntry;
      }
      return latestEntry;
    }, null);

    if (!latest) {
      return res.status(404).json({ message: "No valid measurement entries found" });
    }

    res.status(200).json({
      height: latest.height,
      hips:latest.hips,
      chest: latest.chest,
      waist:latest.waist,
      timestamp: latest.timestamp,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch latest measurement",
      error: err.message,
    });
  }
};
