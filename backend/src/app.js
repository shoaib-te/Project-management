const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Import Routers
const authRoutes = require('./router/user.route');
const employeeRoutes = require('./router/employee.route');
const profileRoutes = require('./router/profile.route');
const attendanceRoutes = require('./router/attendancess.route');
const leaveRoutes = require('./router/Leaves.route');
const payslipsRoutes = require('./router/Payslips.route');


const app = express();

// Global Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Grouped API Routes (V1)
const apiRouter = express.Router();
app.use('/v1/api', apiRouter);

apiRouter.use('/auth', authRoutes);
apiRouter.use('/employees', employeeRoutes);
apiRouter.use('/profiles', profileRoutes);
apiRouter.use('/attendance', attendanceRoutes);
apiRouter.use('/leave',leaveRoutes)
apiRouter.use('/payslips',payslipsRoutes)
// Apply Version Prefix

// Global 404 Route Handler
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'API endpoint not found' });
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error('Server Error Context:', err.stack);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
});

module.exports = app;
