"use client"

import { ArrowRight } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useEffect, useRef } from "react"

const Hero = () => {
  const navigate = useNavigate()
  const heroRef = useRef(null)

  // Parallax effect for background elements
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!heroRef.current) return

      const x = e.clientX / window.innerWidth
      const y = e.clientY / window.innerHeight

      const circles = heroRef.current.querySelectorAll(".bg-circle")
      circles.forEach((circle, index) => {
        const speed = 0.03 * (index + 1)
        const xOffset = (x - 0.5) * speed * 100
        const yOffset = (y - 0.5) * speed * 100
        circle.style.transform = `translate(${xOffset}px, ${yOffset}px)`
      })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <section ref={heroRef} className="relative overflow-hidden pt-28 pb-16 md:pt-32 md:pb-24">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#ffffc1] to-white z-0"></div>

      {/* Animated background circles */}
      <div className="bg-circle absolute top-20 right-[10%] w-64 h-64 rounded-full bg-[#ffa8b8]/5 blur-3xl z-0"></div>
      <div className="bg-circle absolute bottom-20 left-[5%] w-80 h-80 rounded-full bg-[#ffffc1]/30 blur-3xl z-0"></div>
      <div className="bg-circle absolute top-40 left-[15%] w-40 h-40 rounded-full bg-[#fed2a5]/20 blur-3xl z-0"></div>

      {/* Decorative elements */}
      <div className="absolute top-1/4 right-[15%] w-6 h-6 rounded-full bg-[#ffa8b8] opacity-30 animate-pulse z-10"></div>
      {/* <div
        className="absolute bottom-1/3 left-[10%] w-4 h-4 rounded-full bg-[#d888bb] opacity-30 animate-pulse z-10"
        style={{ animationDelay: "1s" }}
      ></div> */}
      <div
        className="absolute top-1/3 left-[30%] w-3 h-3 rounded-full bg-[#fed2a5] opacity-30 animate-pulse z-10"
        style={{ animationDelay: "1.5s" }}
      ></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 md:pr-8 mb-10 md:mb-0">
            <div className="space-y-6">
              <div className="inline-block px-3 py-1 rounded-full bg-white border border-gray-400 text-sm font-medium text-[#d888bb] mb-2 animate-fadeIn">
                AI-Powered Size Recommendations
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight animate-slideUp">
                Collected style, <br />
                <span className="bg-gradient-to-r from-[#ffa8b8] to-[#d888bb] text-transparent bg-clip-text">
                  Perfected by AI
                </span>
              </h1>
              <p
                className="mt-4 text-lg md:text-xl text-gray-600 max-w-lg animate-slideUp"
                style={{ animationDelay: "0.2s" }}
              >
                Say goodbye to sizing issues and returns. Our AI measures your body from a single photo for the perfect
                fit in any brand.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 animate-slideUp" style={{ animationDelay: "0.3s" }}>
                <button
                  className="bg-gradient-to-r from-[#ffa8b8] to-[#d888bb] text-white px-8 py-3 rounded-full font-medium hover:shadow-lg hover:shadow-[#ffa8b8]/30 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center"
                  onClick={() => {
                    navigate("/dashboard")
                  }}
                >
                  Try Now <ArrowRight size={18} className="ml-2 animate-bounceX" />
                </button>
                {/* <button className="border-2 border-[#d888bb] text-[#d888bb] px-8 py-3 rounded-full font-medium hover:bg-[#ffffc1]/30 transition-all duration-300 flex items-center justify-center">
                  Learn More
                </button> */}
              </div>

              {/* Trust indicators */}
              {/* <div
                className="flex items-center space-x-4 mt-8 text-sm text-gray-500 animate-fadeIn"
                style={{ animationDelay: "0.5s" }}
              >
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-green-400 mr-2"></div>
                  <span>99% Accuracy</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-blue-400 mr-2"></div>
                  <span>GDPR Compliant</span>
                </div>
              </div> */}
            </div>
          </div>
          <div className="md:w-1/2 relative flex items-center z-20 justify-center">
            <div className="relative z-20 animate-float">
              <img
                src="/hero-image.png"
                alt="AI Body Measurement Demo"
                className="w-full h-64 sm:h-80 md:h-96 object-cover"
                style={{ objectFit: "cover" }}
                loading="lazy"
              />

              {/* Image decorative elements */}
              <div className="absolute -bottom-2 -right-2 w-24 h-24 rounded-full bg-[#ffffc1] opacity-70 z-0 animate-pulse"></div>
              <div
                className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-[#fed2a5] opacity-70 z-0 animate-pulse"
                style={{ animationDelay: "1s" }}
              ></div>
            </div>

            {/* Floating elements */}
            <div
              className="absolute top-3 right-1/4 p-2 bg-white rounded-lg shadow-lg animate-float"
              style={{ animationDelay: "1s" }}
            >
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-[#ffa8b8]"></div>
                <span className="text-xs font-medium">Perfect Fit</span>
              </div>
            </div>
            <div
              className="absolute -bottom-10 left-1/4 p-2 bg-white rounded-lg shadow-lg animate-float"
              style={{ animationDelay: "1.5s" }}
            >
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-[#d888bb]"></div>
                <span className="text-xs font-medium">AI Powered</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
