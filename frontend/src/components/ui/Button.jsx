const Button = ({ children, variant = "primary", size = "md", className = "", ...props }) => {
  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"

  const variantClasses = {
    primary: "bg-gradient-to-r from-[#ffa8b8] to-[#d888bb] text-white hover:opacity-90 focus:ring-[#d888bb]",
    secondary: "bg-[#fed2a5] text-gray-900 hover:bg-[#ffffc1] focus:ring-[#fed2a5]",
    outline:
      "border border-[#d888bb] text-[#d888bb] bg-transparent hover:bg-[#ffa8b8] hover:bg-opacity-10 focus:ring-[#d888bb]",
    ghost: "text-gray-700 hover:bg-gray-100 focus:ring-gray-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
  }

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  }

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  )
}

export default Button
