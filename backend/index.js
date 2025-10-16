// index.js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { initSheet } from './utils/sheetHelper.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// Rate limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 requests per windowMs for sensitive operations
  message: {
    error: 'Too many requests for this operation, please try again later.',
    retryAfter: '15 minutes'
  }
});

app.use('/api/', generalLimiter);
app.use('/api/jobs', strictLimiter);

// CORS with specific origin
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? ['https://rbjobsheets.in', 'https://rb-job-sheets.netlify.app']
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Body parsing with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 🪵 NEW: Detailed Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  const ip = req.ip || req.connection.remoteAddress;
  console.log(`[${timestamp}] Incoming Request: ${req.method} ${req.originalUrl} from IP: ${ip}`);

  const oldSend = res.send;
  res.send = function (data) {
    console.log(`[${new Date().toISOString()}] Response Sent: ${req.method} ${req.originalUrl} with status ${res.statusCode}`);
    res.send = oldSend;
    return res.send(...arguments);
  };
  next();
});

// Routes
try {
  const jobsRoute = (await import('./routes/jobs.js')).default;
  const authRoute = (await import('./routes/auth.js')).default;
  app.use('/api/jobs', jobsRoute);
  app.use('/api/auth', authRoute);
  console.log('✅ Routes loaded successfully: /api/jobs and /api/auth');
} catch (routeError) {
  // 🪵 NEW: Log route loading failure
  console.error('❌ Error loading routes:', routeError);
  // Re-throw the error to ensure the application doesn't start with broken routes
  process.exit(1);
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'Server running securely',
    timestamp: new Date().toISOString(),
    version: '2.0.0-secure',
    environment: process.env.NODE_ENV || 'development'
  });
});

// NEW: Root route for health checks
app.get('/', (req, res) => {
  res.status(200).json({ status: 'Server is healthy' });
});

// Security headers middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// 🪵 NEW: Enhanced Error handler middleware
app.use((err, req, res, next) => {
  const isDevelopment = process.env.NODE_ENV !== 'production';
  const errorMessage = isDevelopment ? err.message : 'Internal server error';

  console.error(`❌ API Error for ${req.method} ${req.originalUrl}:`, errorMessage);
  if (isDevelopment && err.stack) {
    console.error(err.stack);
  }

  res.status(err.status || 500).json({
    success: false,
    error: errorMessage,
    timestamp: new Date().toISOString(),
    ...(isDevelopment && { stack: err.stack })
  });
});

// 🪵 NEW: Detailed 404 handler
app.use((req, res) => {
  console.warn(`⚠️ 404 Not Found for ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    error: 'Route not found',
    timestamp: new Date().toISOString()
  });
});

// Start server and initialize Google Sheets
const startServer = async () => {
  try {
    await initSheet();
    console.log('✅ Google Sheets initialized successfully.');
  } catch (error) {
    // 🪵 NEW: Log sheet initialization failure
    console.error('❌ Google Sheets initialization failed:', error);
    process.exit(1); // Exit if a critical service fails to start
  }

  try {
    app.listen(PORT, () => {
      // 🪵 NEW: Log server start
      console.log(`✅ Server is listening on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode.`);
    });
  } catch (listenError) {
    // 🪵 NEW: Log server start failure
    console.error('❌ Server failed to start:', listenError);
    process.exit(1);
  }
};

startServer();

// 🪵 NEW: Enhanced Enhanced error handling
process.on('uncaughtException', (err) => {
  console.error('🚨 Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, p) => {
  console.error('🚨 Unhandled Rejection at Promise:', p, 'reason:', reason);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🚪 SIGTERM signal received. Shutting down gracefully.');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🚪 SIGINT signal received. Shutting down gracefully.');
  process.exit(0);
});
