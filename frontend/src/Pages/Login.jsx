import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  LinearProgress,
  Backdrop
} from '@mui/material';
import { 
  Login as LoginIcon, 
  Visibility, 
  VisibilityOff, 
  AdminPanelSettings,
  Email,
  Lock,
  Send,
  CloudQueue,
  CheckCircle
} from '@mui/icons-material';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMessage, setForgotMessage] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');
    setLoadingProgress(0);
    setLoadingMessage('Connecting to server...');

    // Attempt timings: 60s, 30s, 15s
    const attemptTimeouts = [60000, 30000, 15000]; // milliseconds
    let currentAttempt = 0;
    let progressInterval;
    let loginSuccessful = false;

    const attemptLogin = async () => {
      currentAttempt++;
      const timeoutDuration = attemptTimeouts[currentAttempt - 1];
      const attemptText = currentAttempt === 1 ? '1st' : currentAttempt === 2 ? '2nd' : '3rd';
      
      setLoadingProgress(0);
      setLoadingMessage(`${attemptText} attempt - Activating server... (${timeoutDuration/1000}s timeout)`);

      // Start progress bar for this attempt
      const startTime = Date.now();
      progressInterval = setInterval(() => {
        if (loginSuccessful) return; // Stop progress if login succeeded
        
        const elapsed = Date.now() - startTime;
        const progress = Math.min((elapsed / timeoutDuration) * 100, 100);
        setLoadingProgress(progress);
        
        if (progress < 30) {
          setLoadingMessage(`${attemptText} attempt - Waking up server...`);
        } else if (progress < 60) {
          setLoadingMessage(`${attemptText} attempt - Starting services...`);
        } else if (progress < 90) {
          setLoadingMessage(`${attemptText} attempt - Connecting...`);
        } else {
          setLoadingMessage(`${attemptText} attempt - Almost ready...`);
        }
      }, 500);

      // Run login attempt in parallel with progress bar
      const loginPromise = login(email, password).then(response => {
        loginSuccessful = true;
        clearInterval(progressInterval);
        setLoadingProgress(100);
        setLoadingMessage('Login successful!');
        
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 500);
        return response;
      }).catch(error => error);

      // Wait for either login success or timeout
      const timeoutPromise = new Promise(resolve => setTimeout(resolve, timeoutDuration));
      
      await Promise.race([loginPromise, timeoutPromise]);
      
      if (!loginSuccessful) {
        clearInterval(progressInterval);
        
        if (currentAttempt < 3) {
          setLoadingMessage(`${attemptText} attempt timed out. Starting ${currentAttempt + 1}${currentAttempt === 1 ? 'nd' : 'rd'} attempt...`);
          setTimeout(() => attemptLogin(), 2000);
        } else {
          setError('Server failed to respond after 3 attempts. Please try again later.');
          setLoading(false);
          setLoadingProgress(0);
          setLoadingMessage('');
        }
      }
    };

    attemptLogin();
  };

  const handleForgotPassword = async () => {
    if (!forgotEmail.trim()) {
      setForgotMessage('Please enter your email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(forgotEmail)) {
      setForgotMessage('Please enter a valid email address');
      return;
    }

    setForgotLoading(true);
    setForgotMessage('');

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: forgotEmail }),
      });

      const data = await response.json();

      if (data.success) {
        setForgotMessage('Password reset instructions sent to your email');
      } else {
        setForgotMessage(data.error || 'Failed to send reset email');
      }
    } catch (error) {
      setForgotMessage('Network error. Please try again.');
    }

    setForgotLoading(false);
  };

  const closeForgotDialog = () => {
    setForgotPasswordOpen(false);
    setForgotEmail('');
    setForgotMessage('');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        background: 'linear-gradient(135deg, #007BFF 0%, #0056b3 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
        margin: 0,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'auto',
        '& @keyframes pulse': {
          '0%': { opacity: 1, transform: 'scale(1)' },
          '50%': { opacity: 0.7, transform: 'scale(1.05)' },
          '100%': { opacity: 1, transform: 'scale(1)' }
        }
      }}
    >
      <Card
        sx={{
          width: '100%',
          maxWidth: 420,
          background: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(20px)',
          borderRadius: 3,
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          mx: 'auto'
        }}
      >
        <CardContent sx={{ p: { xs: 3, sm: 4, md: 5 } }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <AdminPanelSettings 
              sx={{ 
                fontSize: 60, 
                color: '#007BFF', 
                mb: 2,
                filter: 'drop-shadow(0 4px 8px rgba(0, 123, 255, 0.3))'
              }} 
            />
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 'bold', 
                color: '#333',
                mb: 1
              }}
            >
              Admin Login
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: '#666',
                fontSize: '1.1rem'
              }}
            >
              RB Job Sheets Management
            </Typography>
          </Box>

          <Box noValidate>
            <TextField
              fullWidth
              type="email"
              label="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              sx={{ 
                mb: 3,
                '& .MuiOutlinedInput-root': { 
                  borderRadius: 3,
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)'
                  }
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ color: '#007BFF' }} />
                  </InputAdornment>
                )
              }}
            />

            <TextField
              fullWidth
              type={showPassword ? 'text' : 'password'}
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              sx={{ 
                mb: 2,
                '& .MuiOutlinedInput-root': { 
                  borderRadius: 3,
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)'
                  }
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: '#007BFF' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            <Box sx={{ textAlign: 'right', mb: 3 }}>
              <Link
                component="button"
                type="button"
                onClick={() => setForgotPasswordOpen(true)}
                sx={{
                  color: '#007BFF',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
              >
                Forgot Password?
              </Link>
            </Box>

            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3, 
                  borderRadius: 2,
                  backgroundColor: 'rgba(244, 67, 54, 0.1)',
                  border: '1px solid rgba(244, 67, 54, 0.2)'
                }}
              >
                {error}
              </Alert>
            )}

            <Button
              onClick={handleLogin}
              fullWidth
              variant="contained"
              disabled={loading}
              type="button"
              sx={{
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                borderRadius: 3,
                background: 'linear-gradient(45deg, #007BFF 30%, #0056b3 90%)',
                boxShadow: '0 6px 20px rgba(0, 123, 255, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #0056b3 30%, #004085 90%)',
                  boxShadow: '0 8px 25px rgba(0, 123, 255, 0.4)',
                  transform: 'translateY(-2px)'
                },
                '&:disabled': {
                  background: '#ccc'
                }
              }}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
            >
              {loading ? 'Connecting...' : 'Login to Dashboard'}
            </Button>
          </Box>

          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: '#888' }}>
              Authorized personnel only
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Loading Overlay */}
      <Backdrop
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: 'rgba(0, 123, 255, 0.9)',
          backdropFilter: 'blur(10px)'
        }}
        open={loading}
      >
        <Box
          sx={{
            textAlign: 'center',
            p: 4,
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            minWidth: 300,
            maxWidth: 400
          }}
        >
          <CloudQueue 
            sx={{ 
              fontSize: 60, 
              mb: 2,
              animation: 'pulse 2s infinite'
            }} 
          />
          
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            {loadingMessage}
          </Typography>
          
          <Box sx={{ mb: 3 }}>
            <LinearProgress 
              variant="determinate" 
              value={loadingProgress}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4,
                  background: 'linear-gradient(45deg, #4CAF50 30%, #8BC34A 90%)'
                }
              }}
            />
            <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
              {Math.round(loadingProgress)}% Complete
            </Typography>
          </Box>
          
          <Typography variant="body2" sx={{ opacity: 0.8, lineHeight: 1.5 }}>
            Attempts: 60s → 30s → 15s timeouts. Please wait...
          </Typography>
          
          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              Please wait...
            </Typography>
          </Box>
        </Box>
      </Backdrop>

      {/* Forgot Password Dialog */}
      <Dialog 
        open={forgotPasswordOpen} 
        onClose={closeForgotDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#333' }}>
            Reset Password
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography variant="body2" sx={{ mb: 3, color: '#666', textAlign: 'center' }}>
            Enter your email address and we'll send you instructions to reset your password.
          </Typography>
          
          <TextField
            fullWidth
            type="email"
            label="Email Address"
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
            disabled={forgotLoading}
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email sx={{ color: '#007BFF' }} />
                </InputAdornment>
              )
            }}
          />

          {forgotMessage && (
            <Alert 
              severity={forgotMessage.includes('sent') ? 'success' : 'error'}
              sx={{ mb: 2 }}
            >
              {forgotMessage}
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button 
            onClick={closeForgotDialog}
            disabled={forgotLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleForgotPassword}
            variant="contained"
            disabled={forgotLoading}
            startIcon={<Send />}
            sx={{
              background: 'linear-gradient(45deg, #007BFF 30%, #0056b3 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #0056b3 30%, #004085 90%)'
              }
            }}
          >
            {forgotLoading ? 'Sending...' : 'Send Reset Link'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Login;
