import User from "../models/user.model.js";
import Folder from "../models/folder.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Secret key for JWT (keep this in env vars in production)
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Basic input validation
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    // Find user by email and exclude password
    const user = await User.findOne({ email }).select("-password");
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    // Fetch full user including password for password check
    const userWithPassword = await User.findOne({ email });

    // Compare password
    const isMatch = await bcrypt.compare(password, userWithPassword.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    // Create JWT payload
    const payload = {
      userId: user._id,
      email: user.email,
      rootFolder: user.rootFolder,
    };

    // Generate token
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "10h" });

    // Send user info (already without password) and token
    res.status(200).json({
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    console.error("Login Error:", error);
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

    // Fetch user and exclude password field
    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json(user); // Send full user object (except password)
  } catch (error) {
    console.error("Get Current User Error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
}
