"use client"

import { createContext, useContext, useState, useEffect } from "react"

const MeasurementContext = createContext()

export const MeasurementProvider = ({ children }) => {
  const [measurementHistory, setMeasurementHistory] = useState([])

  useEffect(() => {
    // Load measurements from localStorage
    const savedMeasurements = localStorage.getItem("measurements")
    if (savedMeasurements) {
      setMeasurementHistory(JSON.parse(savedMeasurements))
    } else {
      // Generate sample data for demo purposes
      const sampleData = generateSampleData()
      setMeasurementHistory(sampleData)
      localStorage.setItem("measurements", JSON.stringify(sampleData))
    }
  }, [])

  const generateSampleData = () => {
    const today = new Date()
    const data = []

    // Generate data for the last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date(today)
      date.setMonth(today.getMonth() - i)

      // Base measurements with slight variations
      const baseChest = 95 + (Math.random() * 2 - 1)
      const baseWaist = 80 + (Math.random() * 4 - 2)
      const baseHips = 100 + (Math.random() * 2 - 1)
      const baseThighs = 55 + (Math.random() * 1 - 0.5)

      data.push({
        id: date.getTime().toString(),
        date: date.toISOString(),
        chest: baseChest,
        waist: baseWaist,
        hips: baseHips,
        thighs: baseThighs,
        bodyType: "mesomorph",
      })
    }

    return data
  }

  const addMeasurement = (measurement) => {
    setMeasurementHistory((prev) => {
      const updated = [measurement, ...prev]
      localStorage.setItem("measurements", JSON.stringify(updated))
      return updated
    })
  }

  const deleteMeasurement = (id) => {
    setMeasurementHistory((prev) => {
      const updated = prev.filter((m) => m.id !== id)
      localStorage.setItem("measurements", JSON.stringify(updated))
      return updated
    })
  }

  // Get the latest and previous measurements
  const latestMeasurements = measurementHistory.length > 0 ? measurementHistory[0] : null

  const previousMeasurements = measurementHistory.length > 1 ? measurementHistory[1] : null

  // Get the body type from the latest measurement
  const bodyType = latestMeasurements?.bodyType || null

  return (
    <MeasurementContext.Provider
      value={{
        measurementHistory,
        addMeasurement,
        deleteMeasurement,
        latestMeasurements,
        previousMeasurements,
        bodyType,
      }}
    >
      {children}
    </MeasurementContext.Provider>
  )
}

export const useMeasurements = () => {
  const context = useContext(MeasurementContext)
  if (context === undefined) {
    throw new Error("useMeasurements must be used within a MeasurementProvider")
  }
  return context
}
