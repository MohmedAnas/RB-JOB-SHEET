import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Divider,
  Switch,
  FormControlLabel,
  Tab,
  Tabs,
  Snackbar,
  Alert,
  Avatar,
  IconButton
} from '@mui/material';
import { Settings as SettingsIcon, Save, PhotoCamera, Business, Person, Palette, Notifications, Menu } from '@mui/icons-material';
import Sidebar from '../components/Sidebar';
import { useSidebar } from '../context/SidebarContext';

const Settings = () => {
  const { isCollapsed, toggleSidebar } = useSidebar();
  const [activeTab, setActiveTab] = useState(0);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  const [businessSettings, setBusinessSettings] = useState({
    companyName: 'RB Mobile Repair Center',
    email: 'info@rbrepairs.com',
    phone: '+91 98765 43210',
    address: '123 Tech Street, Electronics Market',
    businessHours: '10:00 AM - 8:00 PM',
    website: 'www.rbrepairs.com'
  });

  const [userSettings, setUserSettings] = useState({
    adminName: 'Administrator',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    emailNotifications: true,
    smsNotifications: false
  });

  const [systemSettings, setSystemSettings] = useState({
    uidPrefix: 'RB',
    autoBackup: true,
    defaultStatus: 'Pending',
    reminderDays: 3,
    maxJobs: 1000
  });

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleBusinessChange = (field, value) => {
    setBusinessSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleUserChange = (field, value) => {
    setUserSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSystemChange = (field, value) => {
    setSystemSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = (settingsType) => {
    // TODO: Implement actual save functionality
    console.log(`Saving ${settingsType} settings`);
    setNotification({
      open: true,
      message: `${settingsType} settings saved successfully!`,
      severity: 'success'
    });
  };

  const BusinessSettingsTab = () => (
    <Card sx={{ mt: 2 }}>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h6" sx={{ mb: 3, color: '#007BFF', fontWeight: 'bold' }}>
          Business Information
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Company Name"
              value={businessSettings.companyName}
              onChange={(e) => handleBusinessChange('companyName', e.target.value)}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={businessSettings.email}
              onChange={(e) => handleBusinessChange('email', e.target.value)}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Phone Number"
              value={businessSettings.phone}
              onChange={(e) => handleBusinessChange('phone', e.target.value)}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Business Hours"
              value={businessSettings.businessHours}
              onChange={(e) => handleBusinessChange('businessHours', e.target.value)}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address"
              multiline
              rows={2}
              value={businessSettings.address}
              onChange={(e) => handleBusinessChange('address', e.target.value)}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Website"
              value={businessSettings.website}
              onChange={(e) => handleBusinessChange('website', e.target.value)}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={() => handleSave('Business')}
              sx={{ bgcolor: '#007BFF', '&:hover': { bgcolor: '#0056b3' } }}
            >
              Save Business Settings
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  const UserSettingsTab = () => (
    <Card sx={{ mt: 2 }}>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h6" sx={{ mb: 3, color: '#007BFF', fontWeight: 'bold' }}>
          User Account Settings
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Admin Name"
              value={userSettings.adminName}
              onChange={(e) => handleUserChange('adminName', e.target.value)}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
              Change Password
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Current Password"
              type="password"
              value={userSettings.currentPassword}
              onChange={(e) => handleUserChange('currentPassword', e.target.value)}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="New Password"
              type="password"
              value={userSettings.newPassword}
              onChange={(e) => handleUserChange('newPassword', e.target.value)}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              value={userSettings.confirmPassword}
              onChange={(e) => handleUserChange('confirmPassword', e.target.value)}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
              Notification Preferences
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={userSettings.emailNotifications}
                  onChange={(e) => handleUserChange('emailNotifications', e.target.checked)}
                  color="primary"
                />
              }
              label="Email Notifications"
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={userSettings.smsNotifications}
                  onChange={(e) => handleUserChange('smsNotifications', e.target.checked)}
                  color="primary"
                />
              }
              label="SMS Notifications"
            />
          </Grid>
          
          <Grid item xs={12}>
            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={() => handleSave('User')}
              sx={{ bgcolor: '#007BFF', '&:hover': { bgcolor: '#0056b3' } }}
            >
              Save User Settings
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  const SystemSettingsTab = () => (
    <Card sx={{ mt: 2 }}>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h6" sx={{ mb: 3, color: '#007BFF', fontWeight: 'bold' }}>
          System Configuration
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Job ID Prefix"
              value={systemSettings.uidPrefix}
              onChange={(e) => handleSystemChange('uidPrefix', e.target.value)}
              helperText="Prefix for auto-generated job IDs"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Default Job Status"
              value={systemSettings.defaultStatus}
              onChange={(e) => handleSystemChange('defaultStatus', e.target.value)}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Reminder Days"
              type="number"
              value={systemSettings.reminderDays}
              onChange={(e) => handleSystemChange('reminderDays', parseInt(e.target.value))}
              helperText="Days before expected completion to send reminders"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Maximum Jobs"
              type="number"
              value={systemSettings.maxJobs}
              onChange={(e) => handleSystemChange('maxJobs', parseInt(e.target.value))}
              helperText="Maximum number of jobs in the system"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={systemSettings.autoBackup}
                  onChange={(e) => handleSystemChange('autoBackup', e.target.checked)}
                  color="primary"
                />
              }
              label="Enable Automatic Backup"
            />
          </Grid>
          
          <Grid item xs={12}>
            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={() => handleSave('System')}
              sx={{ bgcolor: '#007BFF', '&:hover': { bgcolor: '#0056b3' } }}
            >
              Save System Settings
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f5f7fa', minHeight: '100vh' }}>
      <Sidebar />
      
      <Box sx={{ 
        flexGrow: 1, 
        ml: { xs: 0, md: isCollapsed ? '70px' : '240px' },
        p: { xs: 2, sm: 3, md: 4 },
        pt: { xs: '80px', md: 4 },
        transition: 'margin-left 0.3s ease',
        width: '100%',
        maxWidth: 'none',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <IconButton
              onClick={toggleSidebar}
              sx={{ 
                display: { xs: 'block', md: 'none' },
                color: '#007BFF',
                bgcolor: 'rgba(0, 123, 255, 0.1)',
                '&:hover': { bgcolor: 'rgba(0, 123, 255, 0.2)' }
              }}
            >
              <Menu />
            </IconButton>
            <SettingsIcon sx={{ fontSize: { xs: 30, md: 40 }, color: '#007BFF' }} />
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 'bold', 
                color: '#007BFF',
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
              }}
            >
              Settings
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ color: '#666' }}>
            Configure your system preferences and business settings
          </Typography>
        </Box>

        {/* Tabs */}
        <Card>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            sx={{ 
              borderBottom: 1, 
              borderColor: 'divider',
              '& .MuiTab-root': { 
                textTransform: 'none',
                fontWeight: 'bold'
              }
            }}
          >
            <Tab icon={<Business />} label="Business" />
            <Tab icon={<Person />} label="User Account" />
            <Tab icon={<SettingsIcon />} label="System" />
          </Tabs>
          
          {activeTab === 0 && <BusinessSettingsTab />}
          {activeTab === 1 && <UserSettingsTab />}
          {activeTab === 2 && <SystemSettingsTab />}
        </Card>

        {/* Notifications */}
        <Snackbar
          open={notification.open}
          autoHideDuration={4000}
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

export default Settings;
