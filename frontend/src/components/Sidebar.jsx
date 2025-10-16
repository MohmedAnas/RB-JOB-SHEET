import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, IconButton, Tooltip } from '@mui/material';
import { Dashboard, Add, ViewList, Settings, Logout, ChevronLeft, ChevronRight } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSidebar } from '../context/SidebarContext';

const Sidebar = () => {
  const { isCollapsed, toggleSidebar } = useSidebar();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
    { text: 'Add Entry', icon: <Add />, path: '/add-job' },
    { text: 'View Entries', icon: <ViewList />, path: '/view-jobs' },
    { text: 'Settings', icon: <Settings />, path: '/settings' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    navigate('/login');
  };

  return (
    <Box
      sx={{
        width: isCollapsed ? 70 : 240,
        height: '100vh',
        bgcolor: '#007BFF',
        color: 'white',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 50,
        transition: 'width 0.3s ease',
        display: { xs: isCollapsed ? 'none' : 'block', md: 'block' }
      }}
    >
      <Box sx={{ 
        p: 2, 
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: isCollapsed ? 'center' : 'space-between',
        minHeight: 64
      }}>
        {!isCollapsed && (
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            RB Job Sheets
          </Typography>
        )}
        <IconButton 
          onClick={toggleSidebar}
          sx={{ 
            color: 'white',
            p: 1,
            '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
          }}
        >
          {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
        </IconButton>
      </Box>

      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: 'calc(100vh - 64px)', // Subtract header height
        pt: 2 
      }}>
        <List sx={{ flexGrow: 1 }}>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <Tooltip title={isCollapsed ? item.text : ''} placement="right">
                <ListItemButton
                  onClick={() => navigate(item.path)}
                  sx={{
                    bgcolor: location.pathname === item.path ? 'rgba(255,255,255,0.1)' : 'transparent',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' },
                    justifyContent: isCollapsed ? 'center' : 'flex-start',
                    px: isCollapsed ? 1 : 2,
                  }}
                >
                  <ListItemIcon sx={{ 
                    color: 'white',
                    minWidth: isCollapsed ? 'auto' : 56,
                    justifyContent: 'center'
                  }}>
                    {item.icon}
                  </ListItemIcon>
                  {!isCollapsed && <ListItemText primary={item.text} />}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          ))}
        </List>

        <List sx={{ mt: 'auto' }}>
          <ListItem disablePadding>
            <Tooltip title={isCollapsed ? 'Logout' : ''} placement="right">
              <ListItemButton 
                onClick={handleLogout}
                sx={{
                  justifyContent: isCollapsed ? 'center' : 'flex-start',
                  px: isCollapsed ? 1 : 2,
                }}
              >
                <ListItemIcon sx={{ 
                  color: 'white',
                  minWidth: isCollapsed ? 'auto' : 56,
                  justifyContent: 'center'
                }}>
                  <Logout />
                </ListItemIcon>
                {!isCollapsed && <ListItemText primary="Logout" />}
              </ListItemButton>
            </Tooltip>
          </ListItem>
        </List>
      </Box>
    </Box>
  );
};

export default Sidebar;
