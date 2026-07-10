const User = require('../module/User.module');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Secret key for JWT (Move this to an environment variable in production)
const JWT_SECRET = process.env.JWT_SECRET;


// 1. Login User
exports.login = async (req, res) => {
    try {
        const { email, password ,roletype } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

      if(roletype === "admin" && user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied for this role' });
      }
      if(roletype === "employee" && user.role !== 'employee') {
        return res.status(403).json({ message: 'Access denied for this role' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const payload = { userId: user._id.toString(),
             role: user.role,
             email: user.email
             };
        // Generate Token
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

        res.status(200).json({ 
            message: 'Login successful', 
            token, 
            user:payload
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// 3. Logout User
exports.logout = async (req, res) => {
    // Stateless JWTs cannot be invalidated by the server natively.
    // Client-side application must delete the token from its storage (localStorage/cookies).
    res.status(200).json({ message: 'Logged out successfully. Please clear your token from client storage.' });
};

// 4. Password Reset Request (Generates dummy token for simplicity)
exports.requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Generate a random temporary reset code
        const resetToken = Math.random().toString(36).substring(2, 8).toUpperCase();
        
        user.resetToken = resetToken;
        user.resetTokenExpiry = Date.now() + 3 600000; // 1 Hour from now
        await user.save();

        // In a real application, you would send this token via email (e.g., using nodemailer)
        res.status(200).json({ 
            message: 'Reset token generated successfully.', 
            dev_only_token: resetToken // Returning it directly for testing purposes
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// 5. Reset Password Execution
exports.resetPassword = async (req, res) => {
    try {
        const { email, resetToken, newPassword } = req.body;

        const user = await User.findOne({ 
            email, 
            resetToken, 
            resetTokenExpiry: { $gt: Date.now() } 
        });

        if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

        // Update password and clear reset fields
        user.password = newPassword;
        user.resetToken = null;
        user.resetTokenExpiry = null;
        await user.save();

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
