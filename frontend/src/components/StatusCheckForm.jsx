import { useState } from 'react';
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Box,
  Chip,
  Alert,
  CircularProgress
} from '@mui/material';
import { Search, Phone, Smartphone, CalendarToday, CheckCircle, Download } from '@mui/icons-material';

const StatusCheckForm = ({ onSearch }) => {
  const [searchValue, setSearchValue] = useState('');
  const [jobData, setJobData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return '#ef4444';
      case 'In Progress': return '#eab308';
      case 'Completed': return '#10b981';
      default: return '#6b7280';
    }
  };

  const handleDownloadInvoice = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/jobs/${jobData.uid}/invoice`, {
        method: 'GET',
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Invoice_${jobData.uid}.html`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        setError('Failed to download invoice. Please try again.');
      }
    } catch (err) {
      setError('Error downloading invoice. Please try again.');
    }
  };

  const handleSearch = async () => {
    if (!searchValue.trim()) {
      setError('Please enter Job ID or Mobile Number');
      return;
    }

    setLoading(true);
    setError('');
    setJobData(null);

    try {
      const result = await onSearch(searchValue.trim());
      if (result) {
        setJobData(result);
      } else {
        setError('No job found with the provided Job ID or Mobile Number');
      }
    } catch (err) {
      setError('Error searching for job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '800px', mx: 'auto' }}>
      {/* Check Your Mobile Status Section */}
      <Card 
        sx={{ 
          background: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 15px 35px rgba(0, 123, 255, 0.15)',
          borderRadius: 3,
          border: '1px solid rgba(0, 123, 255, 0.1)',
          mb: 4
        }}
      >
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Typography 
            variant="h4" 
            sx={{ 
              color: '#007BFF',
              fontWeight: 'bold',
              mb: 1,
              textAlign: 'center'
            }}
          >
            Check Your Mobile Status
          </Typography>
          
          <Typography 
            variant="body1" 
            sx={{ 
              color: '#666',
              mb: 4,
              textAlign: 'center'
            }}
          >
            Enter your Job Sheet ID or Mobile Number to check repair status
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              placeholder="Enter Job ID (e.g., RB001) or Mobile Number"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
              sx={{ 
                '& .MuiOutlinedInput-root': { 
                  borderRadius: 3,
                  fontSize: '1.1rem'
                }
              }}
            />
            
            <Button
              fullWidth
              variant="contained"
              onClick={handleSearch}
              disabled={loading}
              sx={{
                bgcolor: '#007BFF',
                py: 1.5,
                borderRadius: 3,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                '&:hover': { bgcolor: '#0056b3' }
              }}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Search />}
            >
              {loading ? 'Fetching details...' : 'CHECK STATUS'}
            </Button>

            {error && (
              <Alert severity="error" sx={{ borderRadius: 2 }}>
                {error}
              </Alert>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Job Details Panel - Below Search Section */}
      {jobData && (
        <Box 
          sx={{ 
            animation: 'slideInUp 0.5s ease-out'
          }}
        >
          <Card 
            sx={{ 
              background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
              boxShadow: '0 8px 32px rgba(0, 123, 255, 0.1)',
              borderRadius: 3,
              border: '1px solid rgba(0, 123, 255, 0.1)',
              transition: 'all 0.3s ease'
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    color: '#007BFF',
                    fontWeight: 'bold'
                  }}
                >
                  Job Details
                </Typography>
                
                <Chip
                  label={jobData.status}
                  sx={{
                    bgcolor: getStatusColor(jobData.status),
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    px: 2,
                    py: 1
                  }}
                />
              </Box>

              {/* Job ID - Full Width */}
              <Box sx={{ 
                p: 2, 
                bgcolor: '#e3f2fd', 
                borderRadius: 2, 
                border: '1px solid #bbdefb',
                mb: 3
              }}>
                <Typography variant="h6" sx={{ color: '#007BFF', fontWeight: 'bold' }}>
                  Job ID: {jobData.uid}
                </Typography>
              </Box>

              {/* Horizontal Layout for Details */}
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
                gap: 3,
                mb: 3
              }}>
                {/* Customer Name */}
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#007BFF', mb: 0.5 }}>
                    Customer Name
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#333' }}>
                    {jobData.customerName}
                  </Typography>
                </Box>

                {/* Mobile Number */}
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#007BFF', mb: 0.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Phone sx={{ fontSize: '1rem' }} />
                    Mobile Number
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#333' }}>
                    {jobData.mobileNumber}
                  </Typography>
                </Box>

                {/* Device Model */}
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#007BFF', mb: 0.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Smartphone sx={{ fontSize: '1rem' }} />
                    Device Model
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#333' }}>
                    {jobData.mobileModel}
                  </Typography>
                </Box>
              </Box>

              {/* Issue Description - Full Width */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#007BFF', mb: 0.5 }}>
                  Issue Description
                </Typography>
                <Typography variant="body1" sx={{ color: '#333' }}>
                  {jobData.issue}
                </Typography>
              </Box>

              {/* Dates - Horizontal Layout */}
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', sm: jobData.completionDate ? '1fr 1fr' : '1fr' },
                gap: 3
              }}>
                {/* Completed Date */}
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#007BFF', mb: 0.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <CalendarToday sx={{ fontSize: '1rem' }} />
                    Completed Date
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#333' }}>
                    {jobData.expectedDate ? new Date(jobData.expectedDate).toLocaleDateString() : 'Not set'}
                  </Typography>
                </Box>

                {/* Completed Date */}
                {jobData.completionDate && jobData.status === 'Completed' && (
                  <Box sx={{ 
                    p: 2, 
                    bgcolor: '#f0fdf4', 
                    borderRadius: 2, 
                    border: '1px solid #bbf7d0' 
                  }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#10b981', mb: 0.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <CheckCircle sx={{ fontSize: '1rem' }} />
                      Completed Date
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#10b981', fontWeight: 'bold' }}>
                      {jobData.completionDate}
                    </Typography>
                  </Box>
                )}
              </Box>

              {/* Download Invoice Button - Only for Completed Jobs */}
              {jobData.status === 'Completed' && (
                <Box sx={{ mt: 3, textAlign: 'center' }}>
                  <Button
                    variant="contained"
                    onClick={handleDownloadInvoice}
                    sx={{
                      bgcolor: '#10b981',
                      color: 'white',
                      py: 1.5,
                      px: 4,
                      borderRadius: 3,
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      '&:hover': { bgcolor: '#059669' }
                    }}
                    startIcon={<Download />}
                  >
                    Download Invoice
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>
      )}

      <style jsx>{`
        @keyframes slideInUp {
          from { 
            opacity: 0; 
            transform: translateY(30px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
      `}</style>
    </Box>
  );
};

export default StatusCheckForm;
