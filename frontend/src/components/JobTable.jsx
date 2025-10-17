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
import useMediaQuery from '@mui/material/useMediaQuery';
import { DataGrid } from '@mui/x-data-grid';
import { Search, MoreVert, Edit, Delete, Visibility } from '@mui/icons-material';

const JobTable = ({ jobs, onEdit, onDelete, onView }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const isMobile = useMediaQuery('(max-width:600px)');

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
        default:
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
      <CardContent sx={{ p: { xs: 1, sm: 3 } }}>
        {/* Search & Heading */}
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'start', sm: 'center' },
          mb: 2,
          gap: 1
        }}>
          <Typography
            variant="h5"
            sx={{ color: '#007BFF', fontWeight: 'bold', mb: { xs: 1, sm: 0 } }}
          >
            Job Entries ({filteredJobs.length})
          </Typography>
          <TextField
            size="small"
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              width: { xs: '100%', sm: 300 },
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

        {/* Desktop/Table: DataGrid, Mobile: Card List */}
        {!isMobile ? (
          <Box sx={{ height: 500, width: '100%', overflow: 'auto' }}>
            <DataGrid
              rows={filteredJobs}
              columns={columns}
              getRowId={(row) => row.uid}
              pageSize={10}
              rowsPerPageOptions={[10, 25, 50]}
              disableSelectionOnClick
              disableColumnResize={false}
              sx={{
                border: 'none',
                '& .MuiDataGrid-columnHeaders': {
                  bgcolor: '#f8f9fa',
                  color: '#007BFF',
                  fontWeight: 'bold',
                  fontSize: '0.875rem'
                },
                '& .MuiDataGrid-row': {
                  '&:hover': { bgcolor: 'rgba(0, 123, 255, 0.04)' }
                },
                '& .MuiDataGrid-cell': { fontSize: '0.875rem' },
                '& .MuiDataGrid-virtualScroller': { overflowX: 'auto' }
              }}
            />
          </Box>
        ) : (
          <Box>
            {filteredJobs.length === 0 ? (
              <Typography sx={{ py: 2, textAlign: 'center', color: '#888' }}>No jobs found.</Typography>
            ) : (
              filteredJobs.map((job) => (
                <Card key={job.uid} elevation={2} sx={{ mb: 2, borderLeft: `5px solid ${getStatusColor(job.status)}` }}>
                  <CardContent sx={{ py: 1.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#007BFF' }}>
                        {job.uid}
                      </Typography>
                      <Chip label={job.status} size="small" sx={{ bgcolor: getStatusColor(job.status), color: 'white', fontWeight: 'bold' }} />
                    </Box>
                    <Typography><b>Customer:</b> {job.customerName}</Typography>
                    <Typography><b>Mobile:</b> {job.mobileNumber}</Typography>
                    <Typography><b>Device:</b> {job.mobileModel}</Typography>
                    <Box sx={{ pt: 1, display: 'flex', gap: 1 }}>
                      <IconButton size="small" onClick={() => onView(job)} sx={{ color: '#2196f3' }}>
                        <Visibility fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => onEdit(job)} sx={{ color: '#ff9800' }}>
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => onDelete(job)} sx={{ color: '#f44336' }}>
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              ))
            )}
          </Box>
        )}
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
