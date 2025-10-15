import { useState, useRef } from 'react';
import {
  Card,
  CardContent,
  TextField,
  MenuItem,
  Button,
  Grid,
  Typography,
  Box,
  Snackbar,
  Alert,
  InputAdornment
} from '@mui/material';
import { Save, Refresh, CalendarToday } from '@mui/icons-material';

// Helper function to format date as dd/mm/yyyy for display
const formatDateForDisplay = (date = new Date()) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Helper function to convert dd/mm/yyyy to yyyy-mm-dd for input
const convertToInputFormat = (ddmmyyyy) => {
  if (!ddmmyyyy) return '';
  const [day, month, year] = ddmmyyyy.split('/');
  return `${year}-${month}-${day}`;
};

// Helper function to convert yyyy-mm-dd to dd/mm/yyyy
const convertFromInputFormat = (yyyymmdd) => {
  if (!yyyymmdd) return '';
  const [year, month, day] = yyyymmdd.split('-');
  return `${day}/${month}/${year}`;
};

const DataForm = ({ onSubmit, initialData = null }) => {
  const [formData, setFormData] = useState({
    uid: initialData?.uid || '',
    customerName: initialData?.customerName || '',
    mobileNumber: initialData?.mobileNumber || '',
    mobileModel: initialData?.mobileModel || '',
    issue: initialData?.issue || '',
    customIssue: initialData?.customIssue || '',
    components: initialData?.components || '',
    expectedDate: initialData?.expectedDate || '',
    entryDate: initialData?.entryDate || formatDateForDisplay(),
    status: initialData?.status || 'Pending',
    totalAmount: initialData?.totalAmount || ''
  });

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Refs for hidden date inputs
  const entryDateRef = useRef(null);
  const completedDateRef = useRef(null);

  // Handle calendar icon clicks
  const handleEntryDateClick = () => {
    entryDateRef.current?.showPicker();
  };

  const handleCompletedDateClick = () => {
    completedDateRef.current?.showPicker();
  };

  // Handle date input changes
  const handleDateChange = (field, value) => {
    if (value) {
      const formattedDate = convertFromInputFormat(value);
      setFormData(prev => ({ ...prev, [field]: formattedDate }));
    }
  };

  const issueOptions = [
    'Display Problem',
    'Charging Issue',
    'Battery Problem',
    'Speaker/Mic Issue',
    'Software Problem',
    'Water Damage',
    'Camera Issue',
    'Network Problem',
    'Other'
  ];

  const statusOptions = ['Pending', 'In Progress', 'Completed'];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const generateUID = () => {
    const timestamp = Date.now().toString().slice(-6);
    const randomNum = Math.floor(Math.random() * 100).toString().padStart(2, '0');
    return `RB${timestamp}${randomNum}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('🔄 FRONTEND: Form submitted - Starting process...');
    console.log('📝 FRONTEND: Raw form data:', formData);
    console.log('🔍 FRONTEND: Components field:', formData.components);
    
    const finalIssue = formData.issue === 'Other' ? formData.customIssue : formData.issue;
    
    const submitData = {
      ...formData,
      issue: finalIssue,
      uid: formData.uid || generateUID(),
      completionDate: formData.status === 'Completed' ? formatDateForDisplay() : ''
    };

    console.log('📤 FRONTEND: Final submit data:', submitData);
    console.log('🔍 FRONTEND: Components in submit data:', submitData.components);
    console.log('🔍 FRONTEND: Is components empty?', !submitData.components);
    console.log('📡 FRONTEND: Calling onSubmit function...');

    try {
      await onSubmit(submitData);
      console.log('✅ FRONTEND: onSubmit completed successfully');
      
      setSnackbar({ open: true, message: 'Job entry saved successfully!', severity: 'success' });
      if (!initialData) {
        console.log('🔄 FRONTEND: Resetting form...');
        setFormData({
          uid: '',
          customerName: '',
          mobileNumber: '',
          mobileModel: '',
          issue: '',
          customIssue: '',
          components: '',
          expectedDate: '',
          entryDate: formatDateForDisplay(),
          status: 'Pending',
          totalAmount: ''
        });
      }
    } catch (error) {
      console.error('❌ FRONTEND: Error in handleSubmit:', error);
      setSnackbar({ open: true, message: 'Error saving job entry', severity: 'error' });
    }
  };

  const handleReset = () => {
    setFormData({
      uid: '',
      customerName: '',
      mobileNumber: '',
      mobileModel: '',
      issue: '',
      customIssue: '',
      components: '',
      expectedDate: '',
      entryDate: formatDateForDisplay(),
      status: 'Pending',
      totalAmount: ''
    });
  };

  return (
    <Card 
      sx={{ 
        width: '100%',
        maxWidth: '100%',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
        boxShadow: '0 8px 32px rgba(0, 123, 255, 0.1)',
        borderRadius: 3,
        border: '1px solid rgba(0, 123, 255, 0.1)'
      }}
    >
      <CardContent sx={{ p: 4 }}>
        <Typography 
          variant="h5" 
          sx={{ 
            mb: 3, 
            color: '#007BFF', 
            fontWeight: 'bold',
            textAlign: 'center'
          }}
        >
          {initialData ? 'Edit Job Entry' : 'Add New Job Entry'}
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Job Sheet ID (UID)"
                name="uid"
                value={formData.uid}
                onChange={handleChange}
                placeholder="Auto-generated if empty"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                required
                label="Customer Name"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                required
                label="Mobile Number"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                type="tel"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                required
                label="Mobile Model"
                name="mobileModel"
                value={formData.mobileModel}
                onChange={handleChange}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                required
                select
                label="Issue"
                name="issue"
                value={formData.issue}
                onChange={handleChange}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              >
                {issueOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {formData.issue === 'Other' && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  label="Please specify the issue"
                  name="customIssue"
                  value={formData.customIssue}
                  onChange={handleChange}
                  placeholder="Describe the specific issue..."
                  multiline
                  rows={3}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
            )}

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Components Changed"
                name="components"
                value={formData.components}
                onChange={handleChange}
                placeholder="e.g., Display changed, Battery replaced, Body changed, etc."
                multiline
                rows={3}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Entry Date"
                name="entryDate"
                type="text"
                value={formData.entryDate}
                onChange={handleChange}
                placeholder="DD/MM/YYYY"
                helperText="Format: DD/MM/YYYY"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <CalendarToday 
                        sx={{ color: '#666', cursor: 'pointer' }} 
                        onClick={handleEntryDateClick}
                      />
                    </InputAdornment>
                  )
                }}
                sx={{ 
                  '& .MuiOutlinedInput-root': { borderRadius: 2 },
                  '& .MuiInputBase-input.Mui-disabled': {
                    WebkitTextFillColor: '#666',
                    backgroundColor: '#f5f5f5'
                  }
                }}
              />
              {/* Hidden date input for Entry Date */}
              <input
                ref={entryDateRef}
                type="date"
                style={{ display: 'none' }}
                onChange={(e) => handleDateChange('entryDate', e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Completed Date"
                name="expectedDate"
                type="text"
                value={formData.expectedDate}
                onChange={handleChange}
                placeholder="DD/MM/YYYY"
                helperText="Format: DD/MM/YYYY"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <CalendarToday 
                        sx={{ color: '#666', cursor: 'pointer' }} 
                        onClick={handleCompletedDateClick}
                      />
                    </InputAdornment>
                  )
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
              {/* Hidden date input for Completed Date */}
              <input
                ref={completedDateRef}
                type="date"
                style={{ display: 'none' }}
                onChange={(e) => handleDateChange('expectedDate', e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              >
                {statusOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Total Cost (INR)"
                name="totalAmount"
                value={formData.totalAmount}
                onChange={handleChange}
                type="number"
                placeholder="Enter total repair cost"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<Save />}
                  sx={{
                    bgcolor: '#007BFF',
                    minWidth: 160,
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    '&:hover': { bgcolor: '#0056b3' }
                  }}
                >
                  {initialData ? 'Update Entry' : 'Save Entry'}
                </Button>

                <Button
                  type="button"
                  variant="outlined"
                  startIcon={<Refresh />}
                  onClick={handleReset}
                  sx={{
                    borderColor: '#007BFF',
                    color: '#007BFF',
                    minWidth: 160,
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    '&:hover': { 
                      borderColor: '#0056b3',
                      color: '#0056b3',
                      bgcolor: 'rgba(0, 123, 255, 0.04)'
                    }
                  }}
                >
                  Reset Form
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </CardContent>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Card>
  );
};

export default DataForm;
