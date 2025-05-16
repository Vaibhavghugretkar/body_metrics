"use client"
import { X } from "lucide-react"

const MobileMenu = ({ open, setOpen }) => {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-40 md:hidden">
      <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setOpen(false)}></div>
      <div className="fixed inset-0 flex z-40" onClick={() => setOpen(false)}>
        <div className="absolute top-0 right-0 pt-4 pr-4">
          <button
            type="button"
            className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            onClick={() => setOpen(false)}
          >
            <span className="sr-only">Close sidebar</span>
            <X className="h-6 w-6 text-white" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default MobileMenu
