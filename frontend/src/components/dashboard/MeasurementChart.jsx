"use client"

import { useEffect, useRef, useState } from "react"
import Chart from "chart.js/auto"
import axios from "axios"
import Card from "../ui/Card"

const MeasurementChart = () => {
  const chartRef = useRef(null)
  const chartInstance = useRef(null)
  const [measurementHistory, setMeasurementHistory] = useState([])

  // Fetch measurement data from the API
  useEffect(() => {
    const fetchMeasurements = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/measurements/", {
          withCredentials: true,
        })
        
        // Check if response contains measurements and is an array
        const data = Array.isArray(response.data.measurements) ? response.data.measurements : []
        setMeasurementHistory(data)
        console.log("Fetched measurement data:", data)
      } catch (error) {
        console.error("Error fetching measurement data:", error)
      }
    }

    fetchMeasurements()
  }, [])

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    const ctx = chartRef.current.getContext("2d")

    // Generate dates from the measurement timestamps
    const dates = measurementHistory.map((m) =>
      new Date(m.timestamp).toLocaleDateString()
    )

    // Extract body metrics and ensure valid data
    const chestData = measurementHistory.map((m) => m.chest || 0)
    const waistData = measurementHistory.map((m) => m.waist || 0)
    const hipsData = measurementHistory.map((m) => m.hips || 0)

    // Calculate min and max for the Y-axis
    const allValues = [...chestData, ...waistData, ...hipsData].filter((v) => v > 0)
    const yMin = allValues.length ? Math.min(...allValues) * 0.9 : 70
    const yMax = allValues.length ? Math.max(...allValues) * 1.1 : 100

    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: dates,
        datasets: [
          {
            label: "Chest",
            data: chestData,
            borderColor: "#ffa8b8",
            backgroundColor: "rgba(255, 168, 184, 0.1)",
            tension: 0.4,
            pointStyle: "circle",
            pointRadius: 4,
            pointBackgroundColor: "#ffa8b8",
          },
          {
            label: "Waist",
            data: waistData,
            borderColor: "#fed2a5",
            backgroundColor: "rgba(254, 210, 165, 0.1)",
            tension: 0.4,
            pointStyle: "circle",
            pointRadius: 4,
            pointBackgroundColor: "#fed2a5",
          },
          {
            label: "Hips",
            data: hipsData,
            borderColor: "#d888bb",
            backgroundColor: "rgba(216, 136, 187, 0.1)",
            tension: 0.4,
            pointStyle: "circle",
            pointRadius: 4,
            pointBackgroundColor: "#d888bb",
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
          tooltip: {
            mode: "index",
            intersect: false,
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: "Date (daily)",
            },
          },
          y: {
            title: {
              display: true,
              text: "Body Metrics (cm)",
            },
            beginAtZero: false,
            min: yMin,
            max: yMax,
            ticks: {
              stepSize: 5,
            },
          },
        },
      },
    })

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [measurementHistory])

  return (
    <Card>
      <Card.Header>
        <h3 className="text-lg font-medium text-gray-900">Measurement Trends</h3>
      </Card.Header>
      <Card.Body>
        <div className="h-80">
          <canvas ref={chartRef}></canvas>
        </div>
      </Card.Body>
    </Card>
  )
}

export default MeasurementChart
