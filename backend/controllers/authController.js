import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

const createToken = (user) => {
  return jwt.sign(
    { id: user._id, username: user.username, type: user.userType },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

export const signup = async (req, res) => {
  try {
    const { username, email, password, gender, userType } = req.body;
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });
    const user = await User.create({
      username,
      email,
      password,
      gender,
      userType,
    });

    if (userType === "Business") {
      const Company = (await import("../models/companyModel.js")).default;
      await Company.create({
        name: username,
        user: user._id,
        products: [],
      });
    }
    const token = createToken(user);
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 604800000,
    });
    res.status(201).json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        gender: user.gender,
        userType: user.userType,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Signup failed", error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });
    const token = createToken(user);
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 604800000,
    });
    res.status(200).json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        gender: user.gender,
        userType: user.userType,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.status(200).json({ user });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch profile", error: err.message });
  }
};

export const logout = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    sameSite: "lax",
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
};
