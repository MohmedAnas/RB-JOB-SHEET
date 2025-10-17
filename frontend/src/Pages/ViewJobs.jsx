import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  IconButton
} from '@mui/material';
import { ViewList, Add, Refresh, Edit, Delete, Visibility, Download, PictureAsPdf, TableChart, Description, Menu as MenuIcon } from '@mui/icons-material';
import Sidebar from '../components/Sidebar';
import JobTable from '../components/JobTable';
import DataForm from '../components/DataForm';
import { useSidebar } from '../context/SidebarContext';

const API_URL = import.meta.env.VITE_API_URL;

const ViewJobs = () => {
  const { isCollapsed, toggleSidebar } = useSidebar();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editDialog, setEditDialog] = useState({ open: false, job: null });
  const [viewDialog, setViewDialog] = useState({ open: false, job: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, job: null });
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const [downloadAnchor, setDownloadAnchor] = useState(null);
  const navigate = useNavigate();

  // Mock data - replace with actual API call
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      console.log('🔄 Fetching jobs from backend...');
      const response = await fetch(`${API_URL}/api/jobs`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch jobs');
      }
      
      const data = await response.json();
      console.log('📋 Raw API response:', data);
      console.log('📋 Jobs data:', data.data);
      
      if (data.data && data.data.length > 0) {
        console.log('📋 First job sample:', data.data[0]);
      }
      
      setJobs(data.data || []);
    } catch (error) {
      console.error('❌ Error fetching jobs:', error);
      setNotification({
        open: true,
        message: 'Failed to fetch jobs',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (job) => {
    setEditDialog({ open: true, job });
  };

  const handleView = (job) => {
    setViewDialog({ open: true, job });
  };

  const handleDelete = (job) => {
    setDeleteDialog({ open: true, job });
  };

  const handleEditSubmit = async (updatedJob) => {
    try {
      // TODO: Replace with actual API call
      console.log('Updating job:', updatedJob);
      
      setJobs(jobs.map(job => 
        job.uid === updatedJob.uid ? updatedJob : job
      ));
      
      setEditDialog({ open: false, job: null });
      setNotification({
        open: true,
        message: `Job ${updatedJob.uid} updated successfully!`,
        severity: 'success'
      });
    } catch (error) {
      setNotification({
        open: true,
        message: 'Failed to update job',
        severity: 'error'
      });
      throw error;
    }
  };

  const confirmDelete = async () => {
    try {
      // TODO: Replace with actual API call
      console.log('Deleting job:', deleteDialog.job.uid);
      
      setJobs(jobs.filter(job => job.uid !== deleteDialog.job.uid));
      setDeleteDialog({ open: false, job: null });
      setNotification({
        open: true,
        message: `Job ${deleteDialog.job.uid} deleted successfully!`,
        severity: 'success'
      });
    } catch (error) {
      setNotification({
        open: true,
        message: 'Failed to delete job',
        severity: 'error'
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return '#ff9800';
      case 'In Progress': return '#2196f3';
      case 'Completed': return '#4caf50';
      default: return '#757575';
    }
  };

  const handleDownloadClick = (event) => {
    setDownloadAnchor(event.currentTarget);
  };

  const handleDownloadClose = () => {
    setDownloadAnchor(null);
  };

  const exportToCSV = () => {
    const headers = ['Job ID', 'Customer Name', 'Mobile Number', 'Device Model', 'Issue', 'Components', 'Status', 'Completed Date'];
    const csvContent = [
      headers.join(','),
      ...jobs.map(job => [
        job.uid,
        `"${job.customerName}"`,
        job.mobileNumber,
        `"${job.mobileModel}"`,
        `"${job.issue}"`,
        `"${job.components || ''}"`,
        job.status,
        job.completionDate || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `job-entries-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    handleDownloadClose();
    setNotification({ open: true, message: 'CSV file downloaded successfully!', severity: 'success' });
  };

  const exportToPDF = () => {
    // Simple PDF export using browser print
    const printWindow = window.open('', '_blank');
    const tableHTML = `
      <html>
        <head>
          <title>Job Entries Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #007BFF; text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f8f9fa; font-weight: bold; }
            .status { padding: 4px 8px; border-radius: 4px; color: white; font-size: 12px; }
            .pending { background-color: #ff9800; }
            .in-progress { background-color: #2196f3; }
            .completed { background-color: #4caf50; }
          </style>
        </head>
        <body>
          <h1>Job Entries Report</h1>
          <p>Generated on: ${new Date().toLocaleDateString('en-GB')}</p>
          <table>
            <thead>
              <tr>
                <th>Job ID</th>
                <th>Customer Name</th>
                <th>Mobile Number</th>
                <th>Device Model</th>
                <th>Issue</th>
                <th>Components</th>
                <th>Status</th>
                <th>Completed Date</th>
              </tr>
            </thead>
            <tbody>
              ${jobs.map(job => `
                <tr>
                  <td>${job.uid}</td>
                  <td>${job.customerName}</td>
                  <td>${job.mobileNumber}</td>
                  <td>${job.mobileModel}</td>
                  <td>${job.issue}</td>
                  <td>${job.components || '-'}</td>
                  <td><span class="status ${job.status.toLowerCase().replace(' ', '-')}">${job.status}</span></td>
                  <td>${job.completionDate || '-'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;
    printWindow.document.write(tableHTML);
    printWindow.document.close();
    printWindow.print();
    handleDownloadClose();
    setNotification({ open: true, message: 'PDF export initiated!', severity: 'success' });
  };

  const exportToExcel = () => {
    const headers = ['Job ID', 'Customer Name', 'Mobile Number', 'Device Model', 'Issue', 'Components', 'Status', 'Completed Date'];
    const data = jobs.map(job => [
      job.uid,
      job.customerName,
      job.mobileNumber,
      job.mobileModel,
      job.issue,
      job.components || '',
      job.status,
      job.completionDate || ''
    ]);

    let csvContent = headers.join('\t') + '\n';
    data.forEach(row => {
      csvContent += row.join('\t') + '\n';
    });

    const blob = new Blob([csvContent], { type: 'application/vnd.ms-excel' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `job-entries-${new Date().toISOString().split('T')[0]}.xlsx`;
    a.click();
    window.URL.revokeObjectURL(url);
    handleDownloadClose();
    setNotification({ open: true, message: 'Excel file downloaded successfully!', severity: 'success' });
  };

  const exportToDoc = () => {
    const docContent = `
      <html>
        <head>
          <meta charset="utf-8">
          <title>Job Entries Report</title>
        </head>
        <body>
          <h1>Job Entries Report</h1>
          <p>Generated on: ${new Date().toLocaleDateString('en-GB')}</p>
          <table border="1" style="border-collapse: collapse; width: 100%;">
            <thead>
              <tr style="background-color: #f8f9fa;">
                <th>Job ID</th>
                <th>Customer Name</th>
                <th>Mobile Number</th>
                <th>Device Model</th>
                <th>Issue</th>
                <th>Components</th>
                <th>Status</th>
                <th>Completed Date</th>
              </tr>
            </thead>
            <tbody>
              ${jobs.map(job => `
                <tr>
                  <td>${job.uid}</td>
                  <td>${job.customerName}</td>
                  <td>${job.mobileNumber}</td>
                  <td>${job.mobileModel}</td>
                  <td>${job.issue}</td>
                  <td>${job.components || '-'}</td>
                  <td>${job.status}</td>
                  <td>${job.completionDate || '-'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

    const blob = new Blob([docContent], { type: 'application/msword' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `job-entries-${new Date().toISOString().split('T')[0]}.doc`;
    a.click();
    window.URL.revokeObjectURL(url);
    handleDownloadClose();
    setNotification({ open: true, message: 'Word document downloaded successfully!', severity: 'success' });
  };

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f5f7fa', minHeight: '100vh', justifyContent: 'center', width: '100vw', overflowX: 'hidden' }}>
      <Sidebar />
      
<Box sx={{ 
   flexGrow: 1, 
   ml: { xs: 0, md: isCollapsed ? '70px' : '240px' },
   p: { xs: 2, sm: 3, md: 4 },
   pt: { xs: '80px', md: 4 },
   minWidth: 0,
   transition: 'margin-left 0.3s ease',
   width: '100%',
   maxWidth: { xs: '100%', md: 1200 }, // Limit overall app width on desktop!
   mx: 'auto',                        // Center main content area
   overflow: 'hidden'
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
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
              <IconButton
                onClick={toggleSidebar}
                sx={{ 
                  display: { xs: 'flex', md: 'none' },
                  color: 'white',
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' },
                  mr: 1
                }}
              >
                <MenuIcon />
              </IconButton>
              <ViewList sx={{ fontSize: { xs: 24, md: 40 } }} />
              <Box sx={{ minWidth: 0 }}>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 'bold', 
                    mb: 0.5,
                    fontSize: { xs: '1.25rem', sm: '1.75rem', md: '2.125rem' }
                  }}
                >
                  Job Entries
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    opacity: 0.9,
                    display: { xs: 'none', sm: 'block' },
                    fontSize: { sm: '0.875rem', md: '1rem' }
                  }}
                >
                  Manage and track all repair jobs
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={fetchJobs}
                disabled={loading}
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  '&:hover': {
                    borderColor: 'rgba(255,255,255,0.8)',
                    bgcolor: 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                Refresh
              </Button>

              <Button
                variant="outlined"
                startIcon={<Download />}
                onClick={handleDownloadClick}
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  '&:hover': {
                    borderColor: 'rgba(255,255,255,0.8)',
                    bgcolor: 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                Download
              </Button>
              
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => navigate('/add-job')}
                sx={{
                  bgcolor: 'white',
                  color: '#007BFF',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.9)'
                  }
                }}
              >
                Add New Job
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* Jobs Table Container */}
        <Box sx={{ 
          width: '100%',
          maxWidth: { xs: '100%', md: 1100 }, // Limit width on desktop/tablet
          mx: 'auto', // Center horizontally
          overflow: 'auto'
        }}>
          <JobTable 
            jobs={jobs}
            onEdit={handleEdit}
            onView={handleView}
            onDelete={handleDelete}
          />
        </Box>

        {/* Edit Dialog */}
        <Dialog 
          open={editDialog.open} 
          onClose={() => setEditDialog({ open: false, job: null })}
          maxWidth="md"
          fullWidth
          sx={{
            zIndex: 1300, // Higher than sidebar z-index (50)
            '& .MuiBackdrop-root': {
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(4px)'
            }
          }}
        >
          <DialogTitle sx={{ bgcolor: '#007BFF', color: 'white' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Edit />
              Edit Job Entry
            </Box>
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            {editDialog.job && (
              <DataForm 
                initialData={editDialog.job}
                onSubmit={handleEditSubmit}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* View Dialog */}
        <Dialog 
          open={viewDialog.open} 
          onClose={() => setViewDialog({ open: false, job: null })}
          maxWidth="sm"
          fullWidth
          sx={{
            zIndex: 1300, // Higher than sidebar z-index (50)
            '& .MuiBackdrop-root': {
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(4px)'
            }
          }}
        >
          <DialogTitle sx={{ bgcolor: '#007BFF', color: 'white' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Visibility />
              Job Details
            </Box>
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            {viewDialog.job && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" sx={{ color: '#007BFF' }}>
                    {viewDialog.job.uid}
                  </Typography>
                  <Chip
                    label={viewDialog.job.status}
                    sx={{
                      bgcolor: getStatusColor(viewDialog.job.status),
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  />
                </Box>
                
                <Typography><strong>Customer:</strong> {viewDialog.job.customerName}</Typography>
                <Typography><strong>Mobile:</strong> {viewDialog.job.mobileNumber}</Typography>
                <Typography><strong>Device:</strong> {viewDialog.job.mobileModel}</Typography>
                <Typography><strong>Issue:</strong> {viewDialog.job.issue}</Typography>
                <Typography><strong>Components:</strong> {viewDialog.job.components || 'None specified'}</Typography>
                <Typography><strong>Completed Date:</strong> {viewDialog.job.completionDate || 'Not completed'}</Typography>
                {viewDialog.job.completionDate && (
                  <Typography><strong>Completed:</strong> {viewDialog.job.completionDate}</Typography>
                )}
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setViewDialog({ open: false, job: null })}>
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog 
          open={deleteDialog.open} 
          onClose={() => setDeleteDialog({ open: false, job: null })}
          sx={{
            zIndex: 1300, // Higher than sidebar z-index (50)
            '& .MuiBackdrop-root': {
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(4px)'
            }
          }}
        >
          <DialogTitle sx={{ color: '#f44336' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Delete />
              Confirm Delete
            </Box>
          </DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete job <strong>{deleteDialog.job?.uid}</strong>?
              This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialog({ open: false, job: null })}>
              Cancel
            </Button>
            <Button 
              onClick={confirmDelete} 
              color="error" 
              variant="contained"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Notifications */}
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

        {/* Download Menu */}
        <Menu
          anchorEl={downloadAnchor}
          open={Boolean(downloadAnchor)}
          onClose={handleDownloadClose}
          PaperProps={{
            sx: {
              borderRadius: 2,
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              minWidth: 180
            }
          }}
        >
          <MenuItem onClick={exportToPDF}>
            <ListItemIcon>
              <PictureAsPdf sx={{ color: '#f44336' }} />
            </ListItemIcon>
            <ListItemText primary="Export as PDF" />
          </MenuItem>
          <MenuItem onClick={exportToCSV}>
            <ListItemIcon>
              <TableChart sx={{ color: '#4caf50' }} />
            </ListItemIcon>
            <ListItemText primary="Export as CSV" />
          </MenuItem>
          <MenuItem onClick={exportToExcel}>
            <ListItemIcon>
              <TableChart sx={{ color: '#2e7d32' }} />
            </ListItemIcon>
            <ListItemText primary="Export as XLSX" />
          </MenuItem>
          <MenuItem onClick={exportToDoc}>
            <ListItemIcon>
              <Description sx={{ color: '#1976d2' }} />
            </ListItemIcon>
            <ListItemText primary="Export as DOC" />
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default ViewJobs;
