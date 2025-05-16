import Card from "../ui/Card"

const PostureGuide = () => {
  const guidelines = [
    {
      title: "Stand Straight",
      description: "Keep your back straight and shoulders relaxed.",
      icon: "🧍‍♂️",
    },
    {
      title: "Arms Position",
      description: "Keep arms slightly away from your body (about 15cm).",
      icon: "💪",
    },
    {
      title: "Face Forward",
      description: "Look directly at the camera with a neutral expression.",
      icon: "👀",
    },
    {
      title: "Wear Fitting Clothes",
      description: "Wear form-fitting clothes for accurate measurements.",
      icon: "👕",
    },
    {
      title: "Full Body Visible",
      description: "Ensure your entire body is visible in the frame.",
      icon: "📏",
    },
    {
      title: "Good Lighting",
      description: "Stand in a well-lit area with even lighting.",
      icon: "💡",
    },
  ]

  return (
    <Card>
      <Card.Header>
        <h3 className="text-lg font-medium text-gray-900">Posture Guidelines</h3>
      </Card.Header>
      <Card.Body>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {guidelines.map((guide, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#ffffc1] flex items-center justify-center text-2xl">
                {guide.icon}
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900">{guide.title}</h4>
                <p className="mt-1 text-sm text-gray-500">{guide.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Card.Body>
    </Card>
  )
}

export default PostureGuide
