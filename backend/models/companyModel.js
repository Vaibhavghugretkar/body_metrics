const mongoose = require("mongoose");

const sizeRangeSchema = new mongoose.Schema({
  size: { 
    type: String, 
    enum: ["S", "M", "L", "XL", "XXL", "XXXL"], 
    required: true 
  },
  chest: { type: Number, required: false },  // Chest measurement (in inches) - Shirts/T-Shirts
  waist: { type: Number, required: false },  // Waist measurement (in inches) - Pants
  hip: { type: Number, required: false },    // Hip measurement (in inches) - Pants
  length: { type: Number, required: false }, // Length (in inches) - Shirts/T-Shirts/Pants
  shoeSize: { type: Number, required: false } // Shoe size (standard size or inches)
});

const productSchema = new mongoose.Schema({
  category: { 
    type: String, 
    enum: ["Shirt", "T-Shirt", "Pant", "Shoe"], 
    required: true 
  },
  sizes: [sizeRangeSchema] // Array of size range objects
});

const companySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true 
  }, // Company name
  products: [productSchema], // Array of products with size ranges
}, { timestamps: true });

const Company = mongoose.model("Company", companySchema);

module.exports = Company;
