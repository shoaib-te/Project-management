import 'dotenv/config';
import User from '../module/User.module.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// 1. Login User
const login = async (req, res) => {
  try {
    const { email, password, roletype } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    if (roletype === 'admin' && user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied for this role' });
    }
    if (roletype === 'employee' && user.role !== 'employee') {
      return res.status(403).json({ message: 'Access denied for this role' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials in password' });

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('JWT_SECRET is not configured');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    const payload = {
      userId: user._id.toString(),
      role: user.role,
      email: user.email,
    };
    // Generate Token
    const token = jwt.sign(payload, jwtSecret, { expiresIn: '7d' });

    res.cookie('token', token, {
      httpOnly: true, // Prevents XSS attacks (JavaScript cannot read it)
      secure: true, // Requires HTTPS (use false in local development)
      sameSite: 'strict', // Prevents CSRF attacks
      maxAge: 3600000, // Cookie expiration time in milliseconds (1 hour)
    });
    res.status(200).json({
      message: 'Login successful',
      token,
      user: payload,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const session = async (req, res) => {
  if (!req.session) {
    return res.status(401).json({ message: 'Unauthorized in controller' });
  }

  // Return only the safe user data from the verified token.
  return res.json({
    user: req.session,
  });
};

//  Reset Password Execution
const resetPassword = async (req, res) => {
  try {
    const session = res.session;
    const { currentpassword, newPassword } = req.body;

    if (!currentpassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new passwords are required' });
    }

    const user = await User.findById(session.userId);

    const isValid = await bcrypt.compare(currentpassword, user.password);
    if (!isValid) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.findByIdAndUpdate(session.userId, { password: hashedPassword });

    res.status(200).json({ message: 'Password updated successfully', success: true });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export { login, session, resetPassword };
