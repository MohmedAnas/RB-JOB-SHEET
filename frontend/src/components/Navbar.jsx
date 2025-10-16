import { AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import { PhoneAndroid, Login } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <AppBar position="static" sx={{ bgcolor: '#007BFF' }}>
      <Toolbar>
        <PhoneAndroid sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
          RB Mobile Repair
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button
            onClick={handleLoginClick}
            startIcon={<Login />}
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              borderRadius: 2,
              px: 3,
              py: 1,
              fontWeight: 'bold',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
              },
              transition: 'all 0.2s ease'
            }}
          >
            Login
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
