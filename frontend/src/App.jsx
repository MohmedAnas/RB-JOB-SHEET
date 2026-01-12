import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SidebarProvider } from './context/SidebarContext';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Pages
import CustomerHome from './Pages/CustomerHome';
import Login from './Pages/Login';
import Dashboard from './Pages/Dashboard';
import AddJob from './Pages/AddJob';
import ViewJobs from './Pages/ViewJobs';
import Settings from './Pages/Settings';

// Theme configuration
const theme = createTheme({
  palette: {
    primary: {
      main: '#007BFF',
    },
    secondary: {
      main: '#0056b3',
    },
  },
});

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Route tracker component
const RouteTracker = () => {
  const location = useLocation();
  
  useEffect(() => {
    console.log(`[App.jsx] Route changed to: ${location.pathname}`);
  }, [location.pathname]);
  
  return null;
};

function App() {
  useEffect(() => {
    console.log('[App.jsx] App component mounted');
    
    // Global error handler
    const handleError = (event) => {
      console.error(`[App.jsx] ERROR in file: ${event.filename || 'unknown'}, line: ${event.lineno || 'unknown'}, message: ${event.message}`);
    };
    
    const handleRejection = (event) => {
      console.error(`[App.jsx] PROMISE REJECTION: ${event.reason}`);
    };
    
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);
    
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <SidebarProvider>
          <Router>
            <RouteTracker />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<CustomerHome />} />
              <Route path="/login" element={<Login />} />
              
              {/* Protected Admin Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/add-job" element={
                <ProtectedRoute>
                  <AddJob />
                </ProtectedRoute>
              } />
              <Route path="/view-jobs" element={
                <ProtectedRoute>
                  <ViewJobs />
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } />
              
              {/* Redirect unknown routes */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </Router>
        </SidebarProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
