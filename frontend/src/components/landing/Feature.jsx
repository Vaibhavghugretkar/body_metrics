"use client"

import { CheckCircle, Lock, Ruler, Zap, RefreshCw, Globe } from "lucide-react"
import { useEffect, useRef } from "react"

const Features = () => {
  const featuresRef = useRef(null)

  // Intersection Observer for scroll animations
  useEffect(() => {
    if (!featuresRef.current) return

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

    const cards = featuresRef.current.querySelectorAll(".feature-card")
    cards.forEach((card) => observer.observe(card))

    return () => {
      cards.forEach((card) => observer.unobserve(card))
    }
  }, [])

  const features = [
    {
      icon: <CheckCircle className="text-[#d888bb]" size={24} />,
      title: "Accurate Fit",
      description: "AI-powered measurements from a single photo.",
    },
    {
      icon: <Lock className="text-[#d888bb]" size={24} />,
      title: "Private & Secure",
      description: "Your data is safe and never misused.",
    },
    {
      icon: <Ruler className="text-[#d888bb]" size={24} />,
      title: "Smart Sizing",
      description: "Get size suggestions tailored to brands.",
    },
    {
      icon: <Zap className="text-[#d888bb]" size={24} />,
      title: "Quick & Easy",
      description: "No manual input — just scan and upload.",
    },
    {
      icon: <RefreshCw className="text-[#d888bb]" size={24} />,
      title: "Fewer Returns",
      description: "Right size = fewer size-related returns.",
    },
    {
      icon: <Globe className="text-[#d888bb]" size={24} />,
      title: "Use Anywhere",
      description: "Works on any device, no app needed.",
    },
  ]

  return (
    <section id="features" ref={featuresRef} className="py-20 md:py-32 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-white to-[#ffffc1]/30 z-0"></div>

      {/* Background patterns */}
      <div className="absolute top-0 left-0 w-full h-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9IiNmZmE4YjgiIGZpbGwtb3BhY2l0eT0iMC4xIi8+PC9zdmc+')] opacity-30 z-0"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div
          className="text-center mb-16 opacity-0 animate-fadeIn"
          style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}
        >
          <div className="inline-block px-4 py-1 rounded-full bg-[#ffffc1]/50 border border-[#ffa8b8]/20 text-sm font-medium text-[#d888bb] mb-4">
            Why Choose Us
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Features</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Our technology makes online shopping easier and more accurate than ever before.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="feature-card bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 border border-gray-100 group opacity-0 transform translate-y-8"
              style={{ transitionDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start mb-4">
                <div className="mr-4 mt-1 p-3 rounded-lg bg-[#ffffc1]/30 group-hover:bg-[#ffffc1]/60 transition-colors duration-300">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-[#d888bb] transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>

              {/* Decorative corner */}
              <div className="absolute bottom-0 right-0 w-12 h-12 overflow-hidden">
                <div className="absolute bottom-0 right-0 w-16 h-16 transform rotate-45 translate-x-8 translate-y-8 bg-gradient-to-r from-[#ffffc1]/0 to-[#ffa8b8]/10"></div>
              </div>
            </div>
          ))}
        </div>

        {/* <div
          className="mt-20 bg-white rounded-xl p-8 shadow-xl border border-gray-100 transform perspective-1000 hover:rotate-x-1 transition-transform duration-500 opacity-0 animate-fadeIn"
          style={{ animationDelay: "0.8s", animationFillMode: "forwards" }}
        >
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-2/3 mb-6 md:mb-0 md:pr-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Ready to revolutionize your online shopping experience?
              </h3>
              <p className="text-gray-600">
                Join thousands of shoppers who have already reduced their returns and found their perfect fit with our
                technology.
              </p>
            </div>
            <div className="md:w-1/3 flex justify-center md:justify-end">
              <button className="bg-gradient-to-r from-[#ffa8b8] to-[#d888bb] text-white px-8 py-3 rounded-full font-medium hover:shadow-lg hover:shadow-[#ffa8b8]/30 transition-all duration-300 transform hover:-translate-y-1">
                Try For Free
              </button>
            </div>
          </div>

          <div className="absolute -top-3 -left-3 w-6 h-6 rounded-full bg-[#ffffc1]"></div>
          <div className="absolute -bottom-3 -right-3 w-6 h-6 rounded-full bg-[#ffa8b8]"></div>
        </div> */}
      </div>
    </section>
  )
}

export default Features
