"use client"

import { useEffect, useRef } from "react"
import Chart from "chart.js/auto"
import Card from "../ui/Card"
import { useMeasurements } from "../../context/MeasurementContext"

const MeasurementChart = () => {
  const chartRef = useRef(null)
  const chartInstance = useRef(null)
  const { measurementHistory } = useMeasurements()

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    const ctx = chartRef.current.getContext("2d")

    // Filter out invalid measurements
    const validHistory = Array.isArray(measurementHistory)
      ? measurementHistory.filter(m => m && m.date)
      : []

    // Extract dates and measurements
    const dates = validHistory.map((m) => new Date(m.date).toLocaleDateString())
    const chestData = validHistory.map((m) => m.chest)
    const waistData = validHistory.map((m) => m.waist)
    const hipsData = validHistory.map((m) => m.hips)

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
          },
          {
            label: "Waist",
            data: waistData,
            borderColor: "#fed2a5",
            backgroundColor: "rgba(254, 210, 165, 0.1)",
            tension: 0.4,
          },
          {
            label: "Hips",
            data: hipsData,
            borderColor: "#d888bb",
            backgroundColor: "rgba(216, 136, 187, 0.1)",
            tension: 0.4,
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
          y: {
            title: {
              display: true,
              text: "Measurement (cm)",
            },
            min: Math.min(...[...chestData, ...waistData, ...hipsData].filter(v => typeof v === "number")) * 0.9,
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
