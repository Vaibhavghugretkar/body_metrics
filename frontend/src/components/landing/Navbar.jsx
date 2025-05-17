"use client"

import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleSmoothScroll = (e, target) => {
    e.preventDefault()
    const el = document.querySelector(target)
    if (el) {
      el.scrollIntoView({ behavior: "smooth" })
      setIsMenuOpen(false)
    }
  }

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-sm shadow-lg py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-2xl font-bold samarkan-text bg-gradient-to-r from-[#ffa8b8] to-[#d888bb] text-transparent bg-clip-text">
              Sarvastara
            </span>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-8 font-semibold">
            <a
              href="#"
              className="text-gray-700 hover:text-[#d888bb] transition-colors relative group"
              onClick={(e) => handleSmoothScroll(e, "body")}
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#d888bb] transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a
              href="#steps"
              className="text-gray-700 hover:text-[#d888bb] transition-colors relative group"
              onClick={(e) => handleSmoothScroll(e, "#steps")}
            >
              How It Works
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#d888bb] transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a
              href="#features"
              className="text-gray-700 hover:text-[#d888bb] transition-colors relative group"
              onClick={(e) => handleSmoothScroll(e, "#features")}
            >
              Features
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#d888bb] transition-all duration-300 group-hover:w-full"></span>
            </a>
            {/* <button className="bg-gradient-to-r from-[#ffa8b8] to-[#d888bb] text-white px-6 py-2 rounded-full font-medium hover:opacity-90 transition-all duration-300 hover:shadow-lg hover:shadow-[#ffa8b8]/20 transform hover:-translate-y-0.5">
              Get Started
            </button> */}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-[#d888bb] focus:outline-none transition-transform duration-300 ease-in-out"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden bg-white/95 backdrop-blur-sm shadow-lg absolute w-full left-0 transition-all duration-300 ease-in-out overflow-hidden ${
          isMenuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 py-3 space-y-2">
          <a
            href="#"
            className="block px-3 py-2 text-gray-700 hover:text-[#d888bb] hover:bg-[#ffffc1]/30 rounded-md transition-colors duration-200"
            onClick={(e) => handleSmoothScroll(e, "body")}
          >
            Home
          </a>
          <a
            href="#steps"
            className="block px-3 py-2 text-gray-700 hover:text-[#d888bb] hover:bg-[#ffffc1]/30 rounded-md transition-colors duration-200"
            onClick={(e) => handleSmoothScroll(e, "#steps")}
          >
            How It Works
          </a>
          <a
            href="#features"
            className="block px-3 py-2 text-gray-700 hover:text-[#d888bb] hover:bg-[#ffffc1]/30 rounded-md transition-colors duration-200"
            onClick={(e) => handleSmoothScroll(e, "#features")}
          >
            Features
          </a>
          {/* <button
            className="w-full text-left px-3 py-2 bg-gradient-to-r from-[#ffa8b8] to-[#d888bb] text-white rounded-md font-medium mt-2 hover:shadow-lg hover:shadow-[#ffa8b8]/20 transition-all duration-300"
            onClick={() => setIsMenuOpen(false)}
          >
            Get Started
          </button> */}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
