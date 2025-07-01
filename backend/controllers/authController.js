const bcrypt = require('bcrypt');
const db = require('../config/db');
const jwt = require("jsonwebtoken")

const loginUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  try {
    const [results] = await db.query('SELECT * FROM users WHERE username = ?', [username]);

    if (results.length === 0) {
      return res.status(401).json({ message: "User not found" });
    }

    const user = results[0];
    const isPasswordCorrect = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const payload = {
      id: user.id,
      username: user.username,
      role: user.role
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRY || '1h'
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Only secure in prod
      sameSite: "Strict",
      maxAge: 60 * 60 * 1000 // 1 hour
    });

    req.session.userId = user.id;
    
    res.status(200).json({ message: "Login successful", token, user: payload });

  } catch (err) {
    console.error("❌ Login error:", err.message);
    res.status(500).json({ message: "Server error during login" });
  }
};


const logoutUser = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true, // Use true in production with HTTPS
    sameSite: "Strict"
  });

  return res.status(200).json({ message: "Logged out successfully" });
};


const getCurrentUser = (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Bad request"});

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ username: decoded.username, role: decoded.role });
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};


module.exports = { loginUser, logoutUser, getCurrentUser };
