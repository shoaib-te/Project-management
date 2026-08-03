const jwt = require('jsonwebtoken'); // Ensure jwt is imported

const authmiddleware = (req, res, next) => {
   try {
      // Added optional chaining (?.) to prevent crashes if authorization header is missing
      const token = req.cookies?.token || req.headers.authorization?.split(' ')[1]; 
      
      if (!token) {
         return res.status(401).json({ message: 'Unauthorized' });
      }

      const session = jwt.verify(token, process.env.JWT_SECRET);
      req.session = session;
      next();
   } catch (error) {
      return res.status(401).json({ message: 'Unauthorized' });
   }
};

const adminmiddleware = (req, res, next) => {
   // Added optional chaining (?.) to prevent crashes if req.session is undefined
   if (req.session?.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
   }
   next();
};

// Clear and consistent exports
module.exports = {
   authmiddleware,
   adminmiddleware
};
