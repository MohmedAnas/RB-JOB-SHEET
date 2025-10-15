import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';

// Rate limiting for auth endpoints
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: { success: false, error: 'Too many authentication attempts. Try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const authMiddleware = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        error: 'Access denied. No token provided.',
        timestamp: new Date().toISOString()
      });
    }

    // Verify JWT with stronger validation
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256'], // Specify allowed algorithms
      maxAge: process.env.JWT_EXPIRES_IN || '24h'
    });

    // Add user info and request tracking
    req.user = decoded;
    req.requestId = Math.random().toString(36).substr(2, 9);
    
    // Log access attempt (for security monitoring)
    console.log(`[${new Date().toISOString()}] Auth access: ${decoded.username || 'unknown'} - ${req.requestId}`);
    
    next();
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Auth failed:`, error.message);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, error: 'Token expired. Please login again.' });
    }
    
    res.status(401).json({ 
      success: false, 
      error: 'Invalid token.',
      timestamp: new Date().toISOString()
    });
  }
};

export default authMiddleware;
