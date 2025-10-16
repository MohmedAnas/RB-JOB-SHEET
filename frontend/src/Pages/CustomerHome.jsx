import { useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  Grid,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import { PhoneAndroid, Build, CheckCircle, Schedule, Support } from '@mui/icons-material';
import Navbar from '../components/Navbar';
import StatusCheckForm from '../components/StatusCheckForm';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";


const CustomerHome = () => {
  const handleStatusSearch = async (searchValue) => {
    try {
      console.log('Searching for:', searchValue);
      
      // Call the actual API
      const response = await fetch(`${API_URL}/api/jobs/search?q=${encodeURIComponent(searchValue)}`);
      
      if (!response.ok) {
        throw new Error('Failed to search jobs');
      }
      
      const data = await response.json();
      
      // Return the first matching job or null
      return data.data && data.data.length > 0 ? data.data[0] : null;
      
    } catch (error) {
      console.error('Error searching jobs:', error);
      throw error;
    }
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        width: '100vw',
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        margin: 0,
        padding: 0,
        overflow: 'auto'
      }}
    >
      <Navbar />
      
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 'calc(100vh - 80px)',
          padding: { xs: 2, sm: 3, md: 4 },
          width: '100%'
        }}
      >
        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', mb: 4, maxWidth: 800, width: '100%' }}>
          <Typography 
            variant="h2" 
            sx={{ 
              fontWeight: 'bold', 
              color: '#007BFF',
              mb: 2,
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
            }}
          >
            RB Mobile Repair Center
          </Typography>
          <Typography 
            variant="h5" 
            sx={{ 
              color: '#666', 
              mb: 4,
              fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' }
            }}
          >
            Professional Mobile Repair Services
          </Typography>
        </Box>

        {/* Status Check Section - Centered */}
        <Box sx={{ width: '100%', maxWidth: 600, mb: 4 }}>
          <StatusCheckForm onSearch={handleStatusSearch} />
        </Box>

        {/* Services Section - Perfectly Centered */}
        <Box 
          sx={{ 
            width: '100%',
            maxWidth: 800,
            p: 4,
            borderRadius: 3,
            background: '#ffffff',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
          }}
        >
          <Typography 
            variant="h4" 
            sx={{ 
              color: '#007BFF',
              fontWeight: 'bold',
              textAlign: 'center',
              mb: 1
            }}
          >
            Our Services
          </Typography>
          
          <Typography 
            variant="body1" 
            sx={{ 
              color: '#666',
              textAlign: 'center',
              mb: 4
            }}
          >
            Professional Mobile Repair Solutions
          </Typography>

          {/* Responsive 2x2 Grid */}
          <Grid container spacing={3} sx={{ justifyContent: 'center' }}>
            {/* Display Repair */}
            <Grid item xs={12} sm={6} md={6}>
              <Card 
                sx={{ 
                  height: 200,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  p: 3,
                  borderRadius: 3,
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                  border: '1px solid #f0f0f0',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 40px rgba(0, 123, 255, 0.15)',
                    borderColor: '#007BFF'
                  }
                }}
              >
                <Box 
                  sx={{ 
                    width: 70,
                    height: 70,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2
                  }}
                >
                  <PhoneAndroid sx={{ fontSize: 32, color: '#007BFF' }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333', mb: 1, textAlign: 'center' }}>
                  Display Repair
                </Typography>
                <Typography variant="body2" sx={{ color: '#666', textAlign: 'center', fontSize: '0.9rem' }}>
                  Screen & Touch Issues
                </Typography>
              </Card>
            </Grid>

            {/* Hardware Issues */}
            <Grid item xs={12} sm={6} md={6}>
              <Card 
                sx={{ 
                  height: 200,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  p: 3,
                  borderRadius: 3,
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                  border: '1px solid #f0f0f0',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 40px rgba(0, 123, 255, 0.15)',
                    borderColor: '#007BFF'
                  }
                }}
              >
                <Box 
                  sx={{ 
                    width: 70,
                    height: 70,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2
                  }}
                >
                  <Build sx={{ fontSize: 32, color: '#007BFF' }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333', mb: 1, textAlign: 'center' }}>
                  Hardware Issues
                </Typography>
                <Typography variant="body2" sx={{ color: '#666', textAlign: 'center', fontSize: '0.9rem' }}>
                  Charging & Components
                </Typography>
              </Card>
            </Grid>

            {/* Software Solutions */}
            <Grid item xs={12} sm={6} md={6}>
              <Card 
                sx={{ 
                  height: 200,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  p: 3,
                  borderRadius: 3,
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                  border: '1px solid #f0f0f0',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 40px rgba(0, 123, 255, 0.15)',
                    borderColor: '#007BFF'
                  }
                }}
              >
                <Box 
                  sx={{ 
                    width: 70,
                    height: 70,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2
                  }}
                >
                  <CheckCircle sx={{ fontSize: 32, color: '#007BFF' }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333', mb: 1, textAlign: 'center' }}>
                  Software Solutions
                </Typography>
                <Typography variant="body2" sx={{ color: '#666', textAlign: 'center', fontSize: '0.9rem' }}>
                  OS & App Fixes
                </Typography>
              </Card>
            </Grid>

            {/* Quick Service */}
            <Grid item xs={12} sm={6} md={6}>
              <Card 
                sx={{ 
                  height: 200,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  p: 3,
                  borderRadius: 3,
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                  border: '1px solid #f0f0f0',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 40px rgba(0, 123, 255, 0.15)',
                    borderColor: '#007BFF'
                  }
                }}
              >
                <Box 
                  sx={{ 
                    width: 70,
                    height: 70,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2
                  }}
                >
                  <Schedule sx={{ fontSize: 32, color: '#007BFF' }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333', mb: 1, textAlign: 'center' }}>
                  Quick Service
                </Typography>
                <Typography variant="body2" sx={{ color: '#666', textAlign: 'center', fontSize: '0.9rem' }}>
                  Fast Turnaround
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Contact & Info Section */}
        <Grid container spacing={4} sx={{ mt: 4 }}>
          <Grid item xs={12} md={6}>
            <Paper 
              sx={{ 
                p: 4, 
                borderRadius: 3,
                background: 'linear-gradient(135deg, #007BFF 0%, #0056b3 100%)',
                color: 'white'
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
                Contact Information
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="body1">
                  <strong>Address:</strong> 123 Tech Street, Electronics Market
                </Typography>
                <Typography variant="body1">
                  <strong>Phone:</strong> +91 98765 43210
                </Typography>
                <Typography variant="body1">
                  <strong>Email:</strong> rbphones@yahooo.co.in
                </Typography>
                <Typography variant="body1">
                  <strong>Hours:</strong> Mon-Sat 10AM-8PM
                </Typography>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper 
              sx={{ 
                p: 4, 
                borderRadius: 3,
                background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                border: '1px solid rgba(0, 123, 255, 0.1)'
              }}
            >
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 'bold', 
                  mb: 3,
                  color: '#007BFF'
                }}
              >
                Why Choose Us?
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircle sx={{ color: '#4caf50', fontSize: 20 }} />
                  <Typography variant="body1">Expert technicians</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircle sx={{ color: '#4caf50', fontSize: 20 }} />
                  <Typography variant="body1">Genuine spare parts</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircle sx={{ color: '#4caf50', fontSize: 20 }} />
                  <Typography variant="body1">Warranty on repairs</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircle sx={{ color: '#4caf50', fontSize: 20 }} />
                  <Typography variant="body1">Real-time status tracking</Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Footer */}
        <Box sx={{ mt: 4, textAlign: 'center', maxWidth: 800, width: '100%' }}>
          <Divider sx={{ mb: 3 }} />
          <Typography variant="body2" sx={{ color: '#666' }}>
            © 2024 RB Mobile Repair Center. All rights reserved.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default CustomerHome;
