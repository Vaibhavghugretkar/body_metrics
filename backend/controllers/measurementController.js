import Measurement from "../models/measurementModel.js";

export const addMeasurement = async (req, res) => {
  try {
    const { measurements } = req.body;
    let record = await Measurement.findOne({ userId: req.user.id });
    if (!record) {
      record = await Measurement.create({ userId: req.user.id, measurements });
    } else {
      record.measurements.push(...measurements);
      record.updatedAt = new Date();
      await record.save();
    }
    res.status(201).json({ message: "Measurement added", record });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to add measurement", error: err.message });
  }
};

export const getMeasurements = async (req, res) => {
  try {
    const record = await Measurement.findOne({ userId: req.user.id });
    res.status(200).json({ measurements: record ? record.measurements : [] });
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
      weight: latest.weight,
      chest: latest.chest,
      timestamp: latest.timestamp,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch latest measurement",
      error: err.message,
    });
  }
};
