import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { seedInitialRecipes } from './services/seedService.js';
import visionRoutes from './routes/visionRoutes.js';
import recipeRoutes from './routes/recipeRoutes.js';
import authRoutes from './routes/authRoutes.js';
import pantryRoutes from './routes/pantryRoutes.js';
import favoritesRoutes from './routes/favoritesRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Allowed frontend origins for cross-origin cookie auth (refresh token cookie).
// CLIENT_ORIGIN can be a single origin or a comma-separated list.
const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim());

// Middleware
app.use(
  cors({
    origin(origin, callback) {
      // Allow non-browser tools (curl, Postman) which send no Origin header.
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));
app.use(cookieParser());

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'Fridge to Table Backend Service',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/pantry', pantryRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/vision', visionRoutes);
app.use('/api/recipes', recipeRoutes);

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.url} not found` });
});

// Global Error Handler
app.use(errorHandler);

// Initialize DB and start server
async function startServer() {
  await connectDB();
  await seedInitialRecipes();

  app.listen(PORT, () => {
    console.log(`
=====================================================
🍳 Fridge to Table REST API Server Running
📡 URL: http://localhost:${PORT}
⚡ Health Check: http://localhost:${PORT}/api/health
=====================================================
    `);
  });
}

startServer();
