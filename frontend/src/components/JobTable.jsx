import { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Menu,
  MenuItem
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Search, MoreVert, Edit, Delete, Visibility } from '@mui/icons-material';

const JobTable = ({ jobs, onEdit, onDelete, onView }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return '#ff9800';
      case 'In Progress': return '#2196f3';
      case 'Completed': return '#4caf50';
      default: return '#757575';
    }
  };

  const handleMenuClick = (event, job) => {
    setAnchorEl(event.currentTarget);
    setSelectedJob(job);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedJob(null);
  };

  const handleAction = (action) => {
    if (selectedJob) {
      switch (action) {
        case 'view':
          onView?.(selectedJob);
          break;
        case 'edit':
          onEdit?.(selectedJob);
          break;
        case 'delete':
          onDelete?.(selectedJob);
          break;
      }
    }
    handleMenuClose();
  };

  const filteredJobs = jobs.filter(job =>
    job.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.mobileNumber?.includes(searchTerm) ||
    job.uid?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.mobileModel?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      field: 'uid',
      headerName: 'Job ID',
      width: 100,
      minWidth: 80,
      fontWeight: 'bold',
      renderCell: (params) => (
        <Typography 
          variant="body2" 
          sx={{ 
            fontWeight: 'bold',
            cursor: 'pointer',
            color: '#007BFF',
            '&:hover': { textDecoration: 'underline' },
            fontSize: { xs: '0.75rem', md: '0.875rem' }
          }}
          onClick={() => onView?.(params.row)}
        >
          {params.value}
        </Typography>
      )
    },
    {
      field: 'customerName',
      headerName: 'Customer',
      width: 120,
      minWidth: 100,
      flex: 1,
      renderCell: (params) => (
        <Typography 
          variant="body2" 
          sx={{ 
            cursor: 'pointer',
            '&:hover': { color: '#007BFF' },
            fontSize: { xs: '0.75rem', md: '0.875rem' }
          }}
          onClick={() => onView?.(params.row)}
        >
          {params.value}
        </Typography>
      )
    },
    {
      field: 'mobileNumber',
      headerName: 'Mobile',
      width: 110,
      minWidth: 90,
      renderCell: (params) => (
        <Typography 
          variant="body2" 
          sx={{ 
            cursor: 'pointer',
            '&:hover': { color: '#007BFF' },
            fontSize: { xs: '0.75rem', md: '0.875rem' }
          }}
          onClick={() => onView?.(params.row)}
        >
          {params.value}
        </Typography>
      )
    },
    {
      field: 'mobileModel',
      headerName: 'Device',
      width: 120,
      minWidth: 100,
      flex: 1,
      renderCell: (params) => (
        <Typography 
          variant="body2" 
          sx={{ 
            cursor: 'pointer',
            '&:hover': { color: '#007BFF' },
            fontSize: { xs: '0.75rem', md: '0.875rem' }
          }}
          onClick={() => onView?.(params.row)}
        >
          {params.value}
        </Typography>
      )
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 100,
      minWidth: 80,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          sx={{
            bgcolor: getStatusColor(params.value),
            color: 'white',
            fontWeight: 'bold',
            fontSize: { xs: '0.65rem', md: '0.75rem' },
            height: { xs: 20, md: 24 }
          }}
        />
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 60,
      minWidth: 50,
      sortable: false,
      renderCell: (params) => (
        <IconButton
          size="small"
          onClick={(e) => handleMenuClick(e, params.row)}
          sx={{ color: '#007BFF', p: { xs: 0.5, md: 1 } }}
        >
          <MoreVert sx={{ fontSize: { xs: 18, md: 24 } }} />
        </IconButton>
      )
    }
  ];

  return (
    <Card 
      sx={{ 
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
        boxShadow: '0 8px 32px rgba(0, 123, 255, 0.1)',
        borderRadius: 3,
        border: '1px solid rgba(0, 123, 255, 0.1)'
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography 
            variant="h5" 
            sx={{ 
              color: '#007BFF', 
              fontWeight: 'bold'
            }}
          >
            Job Entries ({filteredJobs.length})
          </Typography>
          
          <TextField
            size="small"
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ 
              width: 300,
              '& .MuiOutlinedInput-root': { borderRadius: 2 }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: '#007BFF' }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Box sx={{ 
          height: 500, 
          width: '100%',
          overflow: 'auto'
        }}>
          <DataGrid
            rows={filteredJobs}
            columns={columns}
            getRowId={(row) => row.uid}
            pageSize={10}
            rowsPerPageOptions={[10, 25, 50]}
            disableSelectionOnClick
            disableColumnResize={false} // Allows column resizing
            sx={{
              border: 'none',
              '& .MuiDataGrid-columnHeaders': {
                bgcolor: '#f8f9fa',
                color: '#007BFF',
                fontWeight: 'bold',
                fontSize: '0.875rem'
              },
              '& .MuiDataGrid-row': {
                '&:hover': {
                  bgcolor: 'rgba(0, 123, 255, 0.04)'
                }
              },
              '& .MuiDataGrid-cell': {
                fontSize: '0.875rem'
              },
              '& .MuiDataGrid-virtualScroller': {
                // Ensures proper scrolling behavior
                overflowX: 'auto'
              }
            }}
          />
        </Box>
      </CardContent>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }
        }}
      >
        <MenuItem onClick={() => handleAction('view')}>
          <Visibility sx={{ mr: 1, fontSize: '1rem' }} />
          View Details
        </MenuItem>
        <MenuItem onClick={() => handleAction('edit')}>
          <Edit sx={{ mr: 1, fontSize: '1rem' }} />
          Edit Job
        </MenuItem>
        <MenuItem onClick={() => handleAction('delete')} sx={{ color: '#f44336' }}>
          <Delete sx={{ mr: 1, fontSize: '1rem' }} />
          Delete Job
        </MenuItem>
      </Menu>
    </Card>
  );
};

export default JobTable;
