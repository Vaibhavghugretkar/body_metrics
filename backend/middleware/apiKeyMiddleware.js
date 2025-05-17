import Company from "../models/companyModel.js";

export const verifyApiKey = async (req, res, next) => {
  const apiKey = req.header("x-api-key");
  if (!apiKey) {
    return res.status(401).json({ message: "API key missing in headers" });
  }
  try {
    const company = await Company.findOne({ apiKey });
    if (!company) {
      return res.status(403).json({ message: "Invalid API key" });
    }
    req.company = company;
    req.user = { id: company.user.toString() }; 
    next();
  } catch (err) {
    res
      .status(500)
      .json({ message: "API key authentication failed", error: err.message });
  }
};
