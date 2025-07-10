import User from "../models/user.model.js";
import Folder from "../models/folder.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Secret key for JWT (keep this in env vars in production)
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export async function login(req, res) {
  try {
    console.log(req.body);

    // Basic input validation
    if (!req.body?.email || !req.body?.password) {
      return res
        .status(400)
        .json({ error: "Email and password are required." });
    }

    // Destructure email and password from request body
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Email not found." });
    }

    // Compare password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    // Create a JWT payload
    const payload = {
      userId: user._id,
      email: user.email,
      rootFolder: user.rootFolder,
    };

    // Generate JWT token
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "10h",
    });

    // Return token and basic user info (never send password)
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        rootFolder: user.rootFolder,
      },
    });
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({ error: "Internal server error." });
  }
}
export async function register(req, res) {
  try {
    console.log(req.body);

    // Basic input validation
    if (!req.body?.email || !req.body?.password || !req.body?.name) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Destructure email, password, and name from request body
    const { email, password, name } = req.body;

    // Email format validation (simple regex)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format." });
    }

    // Password strength check
    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters long." });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "User already exists." });
    }

    // Hash password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create root folder for the user
    const rootFolder = await Folder.create({
      name: `Root-${email}`,
      parentFolder: null,
      user: null,
    });

    // Create new user with root folder and hashed password
    const newUser = await User.create({
      email,
      password: hashedPassword,
      name,
      rootFolder: rootFolder._id,
    });

    // Response (avoid sending sensitive info like password)
    res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    console.error("Registration Error:", error.message);
    res.status(500).json({ error: "Internal server error." });
  }
}

export async function getCurrentUser(req, res) {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json({
      id: user._id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      rootFolder: user.rootFolder,
    });
  } catch (error) {
    console.error("Get Current User Error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
}
