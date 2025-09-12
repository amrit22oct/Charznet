import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const getProfile = async (req, res) => {
  try {
    res.json(req.user); // already comes from middleware without password
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, dob, about, password } = req.body;

    if (name) req.user.name = name;
    if (dob) req.user.dob = dob;
    if (about) req.user.about = about;
    if (password) {
      req.user.password = await bcrypt.hash(password, 10);
    }

    await req.user.save();
    res.json({ message: "Profile updated successfully", user: req.user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
