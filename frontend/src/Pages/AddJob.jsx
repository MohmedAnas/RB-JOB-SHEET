import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Alert,
  Snackbar,
  Paper
} from '@mui/material';
import { Add, ViewList, ArrowBack } from '@mui/icons-material';
import Sidebar from '../components/Sidebar';
import DataForm from '../components/DataForm';
import { useSidebar } from '../context/SidebarContext';

const AddJob = () => {
  const { isCollapsed } = useSidebar();
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();

  const handleJobSubmit = async (jobData) => {
    try {
      console.log('🚀 ADDJOB: Starting job submission...');
      console.log('📝 ADDJOB: Job data received:', jobData);
      
      // Import jobService at the top of file
      const { jobService } = await import('../services/jobService');
      
      console.log('📡 ADDJOB: Calling jobService.createJob...');
      const response = await jobService.createJob(jobData);
      console.log('✅ ADDJOB: API response:', response);
      
      setNotification({
        open: true,
        message: `Job ${jobData.uid} created successfully!`,
        severity: 'success'
      });

      // Optional: Navigate to view jobs after successful creation
      // setTimeout(() => navigate('/view-jobs'), 2000);
      
    } catch (error) {
      console.error('❌ ADDJOB: Error creating job:', error);
      setNotification({
        open: true,
        message: 'Failed to create job. Please try again.',
        severity: 'error'
      });
      throw error;
    }
  };

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f5f7fa', width: '100vw' }}>
      <Sidebar />
      
      <Box sx={{ 
        flexGrow: 1, 
        ml: isCollapsed ? '70px' : '240px', 
        p: 4,
        transition: 'margin-left 0.3s ease',
        width: '100%',
        maxWidth: 'none'
      }}>
        {/* Header */}
        <Paper 
          sx={{ 
            p: 3, 
            mb: 4, 
            borderRadius: 3,
            background: 'linear-gradient(135deg, #007BFF 0%, #0056b3 100%)',
            color: 'white',
            boxShadow: '0 8px 32px rgba(0, 123, 255, 0.3)'
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Add sx={{ fontSize: 40 }} />
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                  Add New Job Entry
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  Create a new mobile repair job entry
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<ArrowBack />}
                onClick={() => navigate('/admin/dashboard')}
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  '&:hover': {
                    borderColor: 'rgba(255,255,255,0.8)',
                    bgcolor: 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                Back to Dashboard
              </Button>
              
              <Button
                variant="contained"
                startIcon={<ViewList />}
                onClick={() => navigate('/admin/view-jobs')}
                sx={{
                  bgcolor: 'white',
                  color: '#007BFF',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.9)'
                  }
                }}
              >
                View All Jobs
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* Form Section */}
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <DataForm onSubmit={handleJobSubmit} />
        </Box>

        {/* Instructions Card */}
        <Paper 
          sx={{ 
            mt: 4, 
            p: 3, 
            borderRadius: 3,
            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
            border: '1px solid rgba(0, 123, 255, 0.1)'
          }}
        >
          <Typography 
            variant="h6" 
            sx={{ 
              color: '#007BFF', 
              fontWeight: 'bold', 
              mb: 2 
            }}
          >
            Instructions
          </Typography>
          
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3 }}>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, color: '#333' }}>
                Job Sheet ID (UID)
              </Typography>
              <Typography variant="body2" sx={{ color: '#666' }}>
                Leave empty for auto-generation (format: RB + timestamp + random number)
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, color: '#333' }}>
                Customer Information
              </Typography>
              <Typography variant="body2" sx={{ color: '#666' }}>
                Ensure customer name and mobile number are accurate for status tracking
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, color: '#333' }}>
                Issue Selection
              </Typography>
              <Typography variant="body2" sx={{ color: '#666' }}>
                Choose the most appropriate issue type. Use "Others" for unlisted problems
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, color: '#333' }}>
                Status Management
              </Typography>
              <Typography variant="body2" sx={{ color: '#666' }}>
                Completion date is auto-filled when status is changed to "Completed"
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Success/Error Notifications */}
        <Snackbar
          open={notification.open}
          autoHideDuration={6000}
          onClose={() => setNotification({ ...notification, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert 
            severity={notification.severity} 
            onClose={() => setNotification({ ...notification, open: false })}
            sx={{ borderRadius: 2 }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default AddJob;
