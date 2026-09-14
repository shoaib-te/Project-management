import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

// Import Routers
import authRoutes from './router/User.route.js';
import employeeRoutes from './router/employee.route.js';
import profileRoutes from './router/profile.route.js';
import attendanceRoutes from './router/attendancess.route.js';
import leaveRoutes from './router/Leaves.route.js';
import payslipsRoutes from './router/Payslips.route.js';
import dashbordRoutes from './router/dashbord.route.js';
import cookieParser from 'cookie-parser';

const app = express();

// Global Middlewares
app.use(
  cors({
    origin: ['http://localhost:4173', 'http://localhost:3000'],
    credentials: true,
  }),
);
app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser()); // Middleware to parse cookies
app.use(express.urlencoded({ extended: true }));
// Grouped API Routes (V1)
const apiRouter = express.Router();
app.use('/api', apiRouter);

apiRouter.use('/auth', authRoutes);
apiRouter.use('/employees', employeeRoutes);
apiRouter.use('/profiles', profileRoutes);
apiRouter.use('/attendance', attendanceRoutes);
apiRouter.use('/leave', leaveRoutes);
apiRouter.use('/payslips', payslipsRoutes);
apiRouter.use('/dashbord', dashbordRoutes);
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

export default app;
