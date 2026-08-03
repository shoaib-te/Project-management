const User = require("../module/User.module");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cookieParser = require('cookie-parser')


// Secret key for JWT (Move this to an environment variable in production)
const JWT_SECRET = process.env.JWT_SECRET;

// 1. Login User
exports.login = async (req, res) => {
  try {
    const { email, password, roletype } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    if (roletype === "admin" && user.role !== "admin") {
      return res.status(403).json({ message: "Access denied for this role" });
    }
    if (roletype === "employee" && user.role !== "employee") {
      return res.status(403).json({ message: "Access denied for this role" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials in password" });

    const payload = {
      userId: user._id.toString(),
      role: user.role,
      email: user.email,
    };
    // Generate Token
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

     res.cookie('token', token, {
    httpOnly: true,  // Prevents XSS attacks (JavaScript cannot read it)
    secure: true,    // Requires HTTPS (use false in local development)
    sameSite: 'strict', // Prevents CSRF attacks
    maxAge: 3600000  // Cookie expiration time in milliseconds (1 hour)
  });
    res.status(200).json({
      message: "Login successful",
      token,
      user: payload,
    });
  } catch (error) {
    console.log(error);
    
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


exports.session = async (req, res) => {
  
  if (!req.session ) {
    return res.status(401).json({ message: "Unauthorized in controller" });
  }

  // Return only the safe user data from the verified token.
  return res.json({
    user: req.session,
  });
};

//  Reset Password Execution
exports.resetPassword = async (req, res) => {
  try {
    const session = res.session;
    const { currentpassword, newPassword } = req.body;

    if (!currentpassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Current and new passwords are required" });
    }
     
     const user = await User.findById(session.userId);

    const isValid= await bcrypt.compare(currentpassword, user.password);
    if (!isValid) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }
  
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.findByIdAndUpdate(session.userId, { password: hashedPassword });

    res.status(200).json({ message: "Password updated successfully", success:true });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
