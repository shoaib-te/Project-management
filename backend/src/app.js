import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

// Import Routers
import authRoutes from './router/User.route.js';
import employeeRoutes from './router/employee.route.js';
import profileRoutes from './router/profile.route.js';
import attendanceRoutes from './router/attendancess.route.js';
import leaveRoutes from './router/Leaves.route.js';
import payslipsRoutes from './router/Payslips.route.js';
import dashbordRoutes from './router/dashbord.route.js';

const app = express();
const allowedOrigins = [
  'http://localhost:4173',
  'http://localhost:3000',
  'http://localhost:5173',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin) || /^https:\/\/.*\.vercel\.app$/.test(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error('CORS not allowed'));
    },
    credentials: true,
  }),
);
app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Project Management API is running',
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({ success: true, status: 'ok' });
});

const apiRouter = express.Router();
app.use('/api', apiRouter);

apiRouter.use('/auth', authRoutes);
apiRouter.use('/employees', employeeRoutes);
apiRouter.use('/profiles', profileRoutes);
apiRouter.use('/attendance', attendanceRoutes);
apiRouter.use('/leave', leaveRoutes);
apiRouter.use('/payslips', payslipsRoutes);
apiRouter.use('/dashbord', dashbordRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'API endpoint not found' });
});

app.use((err, req, res, next) => {
  console.error('Server Error Context:', err.stack);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
});

export default app;
