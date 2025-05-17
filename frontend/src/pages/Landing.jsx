"use client"

import { useEffect } from "react"
import Navbar from "../components/landing/Navbar"
import Hero from "../components/landing/Hero"
import Steps from "../components/landing/Steps"
import Features from "../components/landing/Feature"
import Footer from "../components/landing/Footer"

const Landing = () => {
  // Add smooth scrolling behavior
  useEffect(() => {
    // Add CSS animations
    const style = document.createElement("style")
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes slideUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      @keyframes float {
        0% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
        100% { transform: translateY(0px); }
      }
      
      @keyframes bounceX {
        0%, 100% { transform: translateX(0); }
        50% { transform: translateX(5px); }
      }
      
      @keyframes pulse {
        0% { opacity: 0.6; }
        50% { opacity: 1; }
        100% { opacity: 0.6; }
      }
      
      .animate-fadeIn {
        animation: fadeIn 1s ease forwards;
      }
      
      .animate-slideUp {
        animation: slideUp 1s ease forwards;
      }
      
      .animate-float {
        animation: float 6s ease-in-out infinite;
      }
      
      .animate-bounceX {
        animation: bounceX 1.5s ease-in-out infinite;
      }
      
      .animate-pulse {
        animation: pulse 3s ease-in-out infinite;
      }
      
      .step-card.animate-in,
      .feature-card.animate-in {
        opacity: 1;
        transform: translateY(0);
      }
      
      .perspective-1000 {
        perspective: 1000px;
      }
      
      .rotate-x-1:hover {
        transform: rotateX(1deg);
      }
    `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Steps />
        <Features />
      </main>
      <Footer />
    </div>
  )
}

export default Landing
