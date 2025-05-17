"use client"

import { Camera, Upload, Ruler } from "lucide-react"
import { useEffect, useRef } from "react"

const Steps = () => {
  const stepsRef = useRef(null)

  // Intersection Observer for scroll animations
  useEffect(() => {
    if (!stepsRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in")
          }
        })
      },
      { threshold: 0.1 },
    )

    const cards = stepsRef.current.querySelectorAll(".step-card")
    cards.forEach((card) => observer.observe(card))

    return () => {
      cards.forEach((card) => observer.unobserve(card))
    }
  }, [])

  const steps = [
    {
      icon: <Camera size={32} />,
      title: "Step 1: Scan",
      description:
        "Stand in front of a plain background and take a full-body photo using your smartphone or camera. Make sure your whole body is visible for best results.",
    },
    {
      icon: <Upload size={32} />,
      title: "Step 2: Upload",
      description:
        "Upload your image securely through our website. Your photo will be analyzed by our AI model — no manual input required.",
    },
    {
      icon: <Ruler size={32} />,
      title: "Step 3: Get Measurements",
      description:
        "In just a few seconds, get a complete set of body measurements along with recommended apparel sizes tailored to your body — ready for any brand or style.",
    },
  ]

  return (
    <section id="steps" ref={stepsRef} className="py-20 md:py-32 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-white z-0"></div>
      <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-[#ffffc1]/30 blur-3xl z-0"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-[#fed2a5]/20 blur-3xl z-0"></div>

      {/* Connecting lines between steps */}
      <div className="hidden md:block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2/3 h-0.5 bg-gradient-to-r from-[#ffffc1] via-[#fed2a5] to-[#ffa8b8] z-0"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div
          className="text-center mb-16 opacity-0 animate-fadeIn"
          style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}
        >
          <div className="inline-block px-4 py-1 rounded-full bg-[#ffffc1]/50 border border-[#ffa8b8]/20 text-sm font-medium text-[#d888bb] mb-4">
            Simple Process
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Easy to Use: Just 3 Simple Steps</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            A seamless experience from scan to size. We've made it incredibly easy for you to get accurate body
            measurements — no measuring tape needed!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`step-card bg-white rounded-xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border-t-4 opacity-0 transform translate-y-8 ${
                index === 0 ? "md:translate-y-4" : index === 1 ? "md:translate-y-0" : "md:translate-y-4"
              }`}
              style={{
                borderColor: index === 0 ? "#ffffc1" : index === 1 ? "#fed2a5" : "#ffa8b8",
                transitionDelay: `${index * 0.2}s`,
              }}
            >
              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 mx-auto transform transition-transform duration-500 hover:scale-110 relative z-10`}
                style={{
                  backgroundColor: index === 0 ? "#ffffc1" : index === 1 ? "#fed2a5" : "#ffa8b8",
                }}
              >
                {/* Number indicator */}
                <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-lg font-bold text-gray-800">
                  {index + 1}
                </span>
                {step.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">{step.title}</h3>
              <p className="text-gray-600 text-center">{step.description}</p>

              {/* Decorative dots */}
              <div className="absolute bottom-4 right-4 flex space-x-1">
                <div className="w-1 h-1 rounded-full bg-[#ffa8b8]"></div>
                <div className="w-1 h-1 rounded-full bg-[#fed2a5]"></div>
                <div className="w-1 h-1 rounded-full bg-[#ffffc1]"></div>
              </div>
            </div>
          ))}
        </div>

        {/* <div
          className="mt-16 text-center opacity-0 animate-fadeIn"
          style={{ animationDelay: "0.8s", animationFillMode: "forwards" }}
        >
          <button className="bg-gradient-to-r from-[#ffa8b8] to-[#d888bb] text-white px-8 py-3 rounded-full font-medium hover:shadow-lg hover:shadow-[#ffa8b8]/30 transition-all duration-300 transform hover:-translate-y-1 inline-flex items-center">
            Get Started Now
          </button>
        </div> */}
      </div>
    </section>
  )
}

export default Steps
