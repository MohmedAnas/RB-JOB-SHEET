import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { getAdminSheet } from '../config/googleSheet.js';
import { authRateLimit } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply rate limiting to auth routes
router.use(authRateLimit);

// Admin login with email/password
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email and password are required' 
      });
    }

    // Get admin credentials from Google Sheets
    const adminSheet = await getAdminSheet();
    const rows = await adminSheet.getRows();

    // Find admin by email
    const adminRow = rows.find(row => {
      const emailVariations = [
        row.get('Email - ID'),
        row.get('Email-ID'),
        row.get('Email ID'), 
        row.get('Email'),
        row.get('email')
      ];
      
      return emailVariations.some(emailVal => 
        emailVal && emailVal.toLowerCase() === email.toLowerCase()
      );
    });

    if (!adminRow) {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid credentials' 
      });
    }

    const storedPassword = adminRow.get('Password');
    
    if (password !== storedPassword) {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid credentials' 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        email: email,
        role: 'admin', 
        timestamp: Date.now() 
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    res.json({
      success: true,
      token,
      user: {
        email: email,
        role: 'admin'
      },
      message: 'Login successful'
    });

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Authentication failed' 
    });
  }
});

// Forgot password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email is required' 
      });
    }

    // Get admin credentials from Google Sheets
    const adminSheet = await getAdminSheet();
    const rows = await adminSheet.getRows();

    // Find admin by email
    const adminRow = rows.find(row => 
      row.get('Email-ID')?.toLowerCase() === email.toLowerCase()
    );

    if (!adminRow) {
      // Don't reveal if email exists or not for security
      return res.json({ 
        success: true, 
        message: 'If the email exists, password reset instructions have been sent' 
      });
    }

    // Generate reset token (valid for 1 hour)
    const resetToken = jwt.sign(
      { email: email, type: 'password_reset' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // In a real application, you would send this via email
    // For now, we'll log it (you can implement email service later)
    console.log(`[${new Date().toISOString()}] Password reset requested for: ${email}`);
    console.log(`Reset token: ${resetToken}`);

    res.json({
      success: true,
      message: 'Password reset instructions sent to your email',
      // Remove this in production - only for testing
      resetToken: resetToken
    });

  } catch (error) {
    console.error(`[${new Date().toISOString()}] Forgot password error:`, error.message);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to process password reset request' 
    });
  }
});

// Reset password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ 
        success: false, 
        error: 'Token and new password are required' 
      });
    }

    // Verify reset token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.type !== 'password_reset') {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid reset token' 
      });
    }

    // Get admin credentials from Google Sheets
    const adminSheet = await getAdminSheet();
    const rows = await adminSheet.getRows();

    // Find admin by email
    const adminRow = rows.find(row => 
      row.get('Email-ID')?.toLowerCase() === decoded.email.toLowerCase()
    );

    if (!adminRow) {
      return res.status(404).json({ 
        success: false, 
        error: 'Admin not found' 
      });
    }

    // Update password in Google Sheets
    adminRow.set('Password', newPassword);
    await adminRow.save();

    console.log(`[${new Date().toISOString()}] Password reset successful for: ${decoded.email}`);

    res.json({
      success: true,
      message: 'Password reset successful'
    });

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({ 
        success: false, 
        error: 'Reset token has expired' 
      });
    }
    
    console.error(`[${new Date().toISOString()}] Reset password error:`, error.message);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to reset password' 
    });
  }
});

// Verify token
router.get('/verify', (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        error: 'No token provided' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ 
      success: true, 
      valid: true, 
      user: {
        email: decoded.email,
        role: decoded.role
      }
    });

  } catch (error) {
    res.status(401).json({ 
      success: false, 
      valid: false, 
      error: 'Invalid token' 
    });
  }
});

export default router;
