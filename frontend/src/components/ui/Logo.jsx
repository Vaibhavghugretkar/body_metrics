const Logo = () => {
  return (
    <div className="flex items-center">
      <div className="h-8 w-8 rounded-md bg-gradient-to-r from-[#ffa8b8] to-[#d888bb] flex items-center justify-center">
        <span className="text-white font-bold text-lg">B</span>
      </div>
      <span className="ml-2 text-xl font-bold bg-gradient-to-r from-[#ffa8b8] to-[#d888bb] text-transparent bg-clip-text">
        BodyMetrics
      </span>
    </div>
  )
}

export default Logo
