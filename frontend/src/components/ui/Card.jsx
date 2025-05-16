const Card = ({ children, className = "", ...props }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`} {...props}>
      {children}
    </div>
  )
}

Card.Header = ({ children, className = "", ...props }) => (
  <div className={`px-6 py-4 border-b ${className}`} {...props}>
    {children}
  </div>
)

Card.Body = ({ children, className = "", ...props }) => (
  <div className={`px-6 py-4 ${className}`} {...props}>
    {children}
  </div>
)

Card.Footer = ({ children, className = "", ...props }) => (
  <div className={`px-6 py-4 border-t bg-gray-50 ${className}`} {...props}>
    {children}
  </div>
)

export default Card
