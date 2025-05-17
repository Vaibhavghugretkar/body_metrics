import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const DB = process.env.DATABASE_URL.replace(
  process.env.DATABASE_PASSWORD
);

const connectDB = async () => {
  mongoose
    .connect(DB)
    .then(() => {
      console.log("DB Connection Successful");
    })
    .catch((err) => {
      console.log("ERROR: ", err);
    });
};

export default connectDB;
