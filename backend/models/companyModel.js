import mongoose from "mongoose";

const sizeRangeSchema = new mongoose.Schema({
  // Store only relevant fields for each product type
  size: { type: mongoose.Schema.Types.Mixed, required: true },
  chest: { type: Number }, // Shirt/T-Shirt
  length: { type: Number }, // Shirt/T-Shirt/Pant
  waist: { type: Number }, // Pant
  hip: { type: Number }, // Pant
  height: { type: Number }, // Shoe (person's height)
});

const productSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: ["Shirt", "T-Shirt", "Pant", "Shoe"],
    required: true,
  },
  sizes: [sizeRangeSchema], // Array of size range objects
});

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    }, // Company name
    products: [productSchema], // Array of products with size ranges
    apiKey: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Associated business user
  },
  { timestamps: true }
);

companySchema.methods.generateApiKey = async function () {
  // Use crypto from node:crypto for ESM compatibility
  const crypto = await import("node:crypto");
  const key = crypto.randomBytes(32).toString("hex");
  this.apiKey = key;
  return key;
};

// Pre-save middleware to remove irrelevant fields for each product type
productSchema.pre("save", function (next) {
  this.sizes = this.sizes.map((size) => {
    const s = { size: size.size };
    if (this.category === "Shirt" || this.category === "T-Shirt") {
      if (size.chest !== undefined) s.chest = size.chest;
      if (size.length !== undefined) s.length = size.length;
    } else if (this.category === "Pant") {
      if (size.size !== undefined) s.size = size.size;
      if (size.waist !== undefined) s.waist = size.waist;
      if (size.hip !== undefined) s.hip = size.hip;
      if (size.length !== undefined) s.length = size.length;
    } else if (this.category === "Shoe") {
      if (size.size !== undefined) s.size = size.size;
      if (size.height !== undefined) s.height = size.height;
    }
    return s;
  });
  next();
});

const Company = mongoose.model("Company", companySchema);

// Use ES module export for compatibility with import in companyController.js
export default Company;
