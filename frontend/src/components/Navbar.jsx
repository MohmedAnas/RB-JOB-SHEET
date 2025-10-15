import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import { PhoneAndroid } from '@mui/icons-material';

const Navbar = () => {
  return (
    <AppBar position="static" sx={{ bgcolor: '#007BFF' }}>
      <Toolbar>
        <PhoneAndroid sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
          RB Mobile Repair
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body2">
            Check Your Repair Status
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
