import { Mail, Phone, MapPin, Github } from "lucide-react"

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] opacity-50 z-0"></div>

      {/* Gradient overlay */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#ffa8b8]/30 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="col-span-1">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-[#ffa8b8] to-[#d888bb] text-transparent bg-clip-text mb-6">
              SizeFit AI
            </h3>
            <p className="text-gray-400 mb-6">
              Revolutionizing online apparel shopping with AI-powered body measurements.
            </p>
            {/* <a
              href="#"
              className="text-gray-400 hover:text-[#ffa8b8] transition-all duration-300 transform hover:-translate-y-1 inline-block"
            >
              <Github size={24} className="hover:scale-110 transition-transform duration-300" />
              <span className="sr-only">GitHub Repository</span>
            </a> */}
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6 relative inline-block">
              Quick Links
              <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-[#ffa8b8] to-[#d888bb]"></span>
            </h4>
            <ul className="space-y-3 md:space-y-0 md:grid md:grid-cols-2 md:gap-2">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-[#ffa8b8] transition-colors duration-300 flex items-center group"
                >
                  <span className="w-0 h-0.5 bg-[#ffa8b8] mr-0 group-hover:w-2 group-hover:mr-2 transition-all duration-300"></span>
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#steps"
                  className="text-gray-400 hover:text-[#ffa8b8] transition-colors duration-300 flex items-center group"
                >
                  <span className="w-0 h-0.5 bg-[#ffa8b8] mr-0 group-hover:w-2 group-hover:mr-2 transition-all duration-300"></span>
                  How It Works
                </a>
              </li>
              <li>
                <a
                  href="#features"
                  className="text-gray-400 hover:text-[#ffa8b8] transition-colors duration-300 flex items-center group"
                >
                  <span className="w-0 h-0.5 bg-[#ffa8b8] mr-0 group-hover:w-2 group-hover:mr-2 transition-all duration-300"></span>
                  Features
                </a>
              </li>
              <li>
                <a
                  href="/dashboard"
                  className="text-gray-400 hover:text-[#ffa8b8] transition-colors duration-300 flex items-center group"
                >
                  <span className="w-0 h-0.5 bg-[#ffa8b8] mr-0 group-hover:w-2 group-hover:mr-2 transition-all duration-300"></span>
                  Dashboard
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6 relative inline-block">
              Team Sarvasva
              <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-[#ffa8b8] to-[#d888bb]"></span>
            </h4>
            <ul className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-2">
              <li className="flex items-center group text-gray-400">
                Bhaskar Anand
              </li>
              <li className="flex items-center group text-gray-400">
                Rahul Kumar Singh
              </li>
              <li className="flex items-start group text-gray-400">
                Vaibhav Ghugretkar
              </li>
              <li className="flex items-start group text-gray-400">
                Yash Divya
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-4 py-4 text-center text-gray-400 text-sm flex flex-col md:flex-row justify-between items-center">
          <p>&copy; {new Date().getFullYear()} SizeFit AI. All rights reserved.</p>
          <div className="mt-4 md:mt-0">
            <span className="px-2">Made by Team Sarvasva at NMIT Hacks 2025</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
