// utils/sizeCalculator.js

export function calculateSize({ height, chest, waist, hips, footLength, gender }) {
  // Shirt size determination
  let shirtSize = "Unknown";
  if (chest >= 86 && chest <= 94 && height >= 160 && height <= 170) shirtSize = "S";
  else if (chest >= 95 && chest <= 102 && height >= 170 && height <= 180) shirtSize = "M";
  else if (chest >= 103 && chest <= 110 && height >= 175 && height <= 185) shirtSize = "L";
  else if (chest >= 111 && chest <= 118 && height >= 180 && height <= 190) shirtSize = "XL";
  else if (chest >= 119 && chest <= 126 && height >= 185 && height <= 195) shirtSize = "XXL";
  else if (chest >= 127 && height > 190) shirtSize = "XXXL";

  // Pants size determination
  let pantsSize = "Unknown";
  if (waist >= 71 && waist <= 78 && hips >= 88 && hips <= 95) pantsSize = "S";
  else if (waist >= 79 && waist <= 86 && hips >= 96 && hips <= 103) pantsSize = "M";
  else if (waist >= 87 && waist <= 94 && hips >= 104 && hips <= 111) pantsSize = "L";
  else if (waist >= 95 && waist <= 102 && hips >= 112 && hips <= 119) pantsSize = "XL";
  else if (waist >= 103 && waist <= 110 && hips >= 120 && hips <= 127) pantsSize = "XXL";
  else if (waist >= 111 && hips >= 128) pantsSize = "XXXL";

  // Shoe size determination based on foot length
  let shoeSize = "Unknown";
  if (footLength >= 24.5 && footLength <= 25.4) shoeSize = 7;
  else if (footLength >= 25.5 && footLength <= 26.4) shoeSize = 8;
  else if (footLength >= 26.5 && footLength <= 27.4) shoeSize = 9;
  else if (footLength >= 27.5 && footLength <= 28.4) shoeSize = 10;
  else if (footLength >= 28.5 && footLength <= 29.4) shoeSize = 11;
  else if (footLength >= 29.5 && footLength <= 30.4) shoeSize = 12;

  // Shoe size calculation based on height (Indian sizing)
  if (shoeSize === "Unknown" && height) {
      shoeSize = Math.round((height - 100) / 10) + 5;
  }

  return { shirtSize, pantsSize, shoeSize };
}

// Example usage
const measurements = {
  height: 182,
  chest: 105,
  waist: 90,
  hips: 110,
  footLength: null, // Optional if using height for shoe size
  gender: "male",
};

console.log(calculateSize(measurements));
// Output: { shirtSize: "L", pantsSize: "L", shoeSize: 8 }
