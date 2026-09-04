import express from 'express';
import cors from 'cors';
import reportRoutes from './routes/reportRoutes.js';
import scheduleRoutes from './routes/scheduleRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';
import communityRoutes from './routes/communityRoutes.js';

const app = express();

// Middlewares
app.use(cors({
  origin: '*', // Allow frontend during local dev and deployment
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'CleanLK Backend API',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/reports', reportRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/community-requests', communityRoutes);

app.get('/', (req, res) => {
  res.send('CleanLK Backend API is running!');
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route '${req.originalUrl}' not found.`,
  });
});

// Central Error Handler
app.use(errorHandler);



export default app;
