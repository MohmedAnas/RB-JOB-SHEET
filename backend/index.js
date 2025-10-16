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

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  const ip = req.ip || req.connection.remoteAddress;
  next();
});

// Routes
try {
  app.use('/api/jobs', (await import('./routes/jobs.js')).default);
  app.use('/api/auth', (await import('./routes/auth.js')).default);
} catch (routeError) {
  // Routes failed to load
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

// Security headers middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Error handler middleware with security considerations
app.use((err, req, res, next) => {
  const isDevelopment = process.env.NODE_ENV !== 'production';
  
  res.status(err.status || 500).json({ 
    success: false,
    error: isDevelopment ? err.message : 'Internal server error',
    timestamp: new Date().toISOString(),
    ...(isDevelopment && { stack: err.stack })
  });
});

// 404 handler
app.use((req, res) => {
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
  } catch (error) {
    // Sheet initialization failed
  }

  try {
    app.listen(PORT, () => {
      // Server started
    });
  } catch (listenError) {
    // Server failed to start
  }
};

startServer();

// Enhanced error handling
process.on('uncaughtException', (err) => {
  process.exit(1);
});

process.on('unhandledRejection', (reason, p) => {
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  process.exit(0);
});

process.on('SIGINT', () => {
  process.exit(0);
});
