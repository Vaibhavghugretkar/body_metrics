import Company from "../models/companyModel.js";

// Create or update company profile for business user
export const upsertCompanyProfile = async (req, res) => {
  try {
    const { name, products } = req.body;
    const userId = req.user.id;
    // Find or create company by userId
    let company = await Company.findOne({ user: userId });
    if (!company) {
      company = new Company({ name, products, user: userId });
    } else {
      company.name = name;
      company.products = products;
    }
    await company.save();
    res.status(200).json({ company });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to save company profile", error: err.message });
  }
};

// Get company profile for business user
export const getCompanyProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const company = await Company.findOne({ user: userId });
    if (!company)
      return res.status(404).json({ message: "No company profile found" });
    res.status(200).json({ company });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch company profile", error: err.message });
  }
};

// Generate and save API key for business user
export const generateApiKey = async (req, res) => {
  try {
    const userId = req.user.id;
    const company = await Company.findOne({ user: userId });
    if (!company)
      return res.status(404).json({ message: "No company profile found" });
    const apiKey = await company.generateApiKey();
    await company.save();
    res.status(200).json({ apiKey });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to generate API key", error: err.message });
  }
};
