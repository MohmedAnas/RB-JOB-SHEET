import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  ToggleButton,
  ToggleButtonGroup,
  Chip,
  IconButton
} from '@mui/material';
import { PieChart, ShowChart, Refresh, TrendingUp, Menu } from '@mui/icons-material';
import Sidebar from '../components/Sidebar';
import PieChartCard from '../components/PieChartCard';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useSidebar } from '../context/SidebarContext';

const Dashboard = () => {
  const { isCollapsed, toggleSidebar } = useSidebar();
  const [chartType, setChartType] = useState('pie');
  const [dashboardData, setDashboardData] = useState({
    totalJobs: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    issueTypes: {}
  });

  // Replace MOCK DATA with an actual API call in production
  useEffect(() => {
    const mockData = {
      totalJobs: 156,
      pending: 23,
      inProgress: 45,
      completed: 88,
      issueTypes: {
        'Display Problem': 45,
        'Charging Issue': 32,
        'Battery Problem': 28,
        'Speaker/Mic Issue': 21,
        'Software Problem': 18,
        'Others': 12
      }
    };
    setDashboardData(mockData);
  }, []);

  const statusData = [
    { name: 'Pending', value: dashboardData.pending },
    { name: 'In Progress', value: dashboardData.inProgress },
    { name: 'Completed', value: dashboardData.completed }
  ];

  const issueData = Object.entries(dashboardData.issueTypes).map(([name, value]) => ({
    name,
    value
  }));

  const lineChartData = [
    { month: 'Jan', pending: 15, inProgress: 25, completed: 60 },
    { month: 'Feb', pending: 20, inProgress: 30, completed: 70 },
    { month: 'Mar', pending: 18, inProgress: 35, completed: 85 },
    { month: 'Apr', pending: 23, inProgress: 45, completed: 88 }
  ];

  const statusColors = ['#ff9800', '#2196f3', '#4caf50'];
  const issueColors = ['#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#00bcd4', '#009688'];

  const handleChartTypeChange = (event, newType) => {
    if (newType !== null) {
      setChartType(newType);
    }
  };

  const renderChart = (data, colors, title) => {
    if (chartType === 'pie') {
      return <PieChartCard title={title} data={data} colors={colors} />;
    }

    return (
      <Card
        sx={{
          height: { xs: 220, sm: 300 },
          background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
          boxShadow: '0 8px 32px rgba(0, 123, 255, 0.1)',
          border: '1px solid rgba(0, 123, 255, 0.1)',
          borderRadius: 3
        }}
      >
        <CardContent sx={{ p: { xs: 1, sm: 2 }, height: '100%' }}>
          <Typography
            variant="h6"
            sx={{
              mb: 2,
              color: '#007BFF',
              fontWeight: 'bold',
              textAlign: 'center',
              fontSize: { xs: '1rem', sm: '1.1rem' }
            }}
          >
            {title}
          </Typography>
          <Box sx={{ height: { xs: 120, sm: 200, md: 220 } }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="month" stroke="#666" fontSize={12} />
                <YAxis stroke="#666" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="pending"
                  stroke="#ff9800"
                  strokeWidth={3}
                  dot={{ fill: '#ff9800', strokeWidth: 2, r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="inProgress"
                  stroke="#2196f3"
                  strokeWidth={3}
                  dot={{ fill: '#2196f3', strokeWidth: 2, r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="completed"
                  stroke="#4caf50"
                  strokeWidth={3}
                  dot={{ fill: '#4caf50', strokeWidth: 2, r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f5f7fa', minHeight: '100vh' }}>
      <Sidebar />

      <Box
        sx={{
          flexGrow: 1,
          ml: { xs: 0, md: isCollapsed ? '70px' : '240px' },
          p: { xs: 1, sm: 2, md: 4 },
          pt: { xs: '74px', md: 4 },
          transition: 'margin-left 0.3s ease',
          width: '100%',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <Box sx={{ mb: { xs: 2, sm: 4 } }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'flex-start', sm: 'center' },
              justifyContent: 'space-between',
              mb: { xs: 2, sm: 2 }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: { xs: 1, sm: 0 } }}>
              <IconButton
                onClick={toggleSidebar}
                sx={{
                  display: { xs: 'flex', md: 'none' },
                  color: '#007BFF',
                  bgcolor: 'rgba(0, 123, 255, 0.1)',
                  '&:hover': { bgcolor: 'rgba(0, 123, 255, 0.2)' },
                  mr: 1
                }}
              >
                <Menu />
              </IconButton>
              <TrendingUp sx={{ fontSize: { xs: 22, sm: 28, md: 38 }, color: '#007BFF' }} />
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 'bold',
                  color: '#007BFF',
                  fontSize: { xs: '1.15rem', sm: '1.5rem', md: '2.125rem' }
                }}
              >
                <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                  Dashboard Analytics
                </Box>
                <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>
                  Dashboard
                </Box>
              </Typography>
            </Box>

            {/* Toggle buttons + refresh */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ToggleButtonGroup
                value={chartType}
                exclusive
                onChange={handleChartTypeChange}
                size="small"
                sx={{
                  '& .MuiToggleButton-root': {
                    borderRadius: 2,
                    px: 1.5,
                    fontSize: { xs: '0.9rem', sm: '1rem' },
                    '&.Mui-selected': {
                      bgcolor: '#007BFF',
                      color: 'white',
                      '&:hover': { bgcolor: '#0056b3' }
                    }
                  }
                }}
              >
                <ToggleButton value="pie">
                  <PieChart sx={{ mr: 1, fontSize: 18 }} />
                  Pie
                </ToggleButton>
                <ToggleButton value="line">
                  <ShowChart sx={{ mr: 1, fontSize: 18 }} />
                  Line
                </ToggleButton>
              </ToggleButtonGroup>

              <IconButton
                sx={{
                  bgcolor: '#007BFF',
                  color: 'white',
                  '&:hover': { bgcolor: '#0056b3' }
                }}
              >
                <Refresh />
              </IconButton>
            </Box>
          </Box>

          {/* Stat Cards */}
          <Grid container spacing={2} sx={{ mb: 1 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  borderRadius: 3
                }}
              >
                <CardContent sx={{ textAlign: 'center', py: { xs: 1.5, sm: 2 } }}>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 'bold',
                      fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
                    }}
                  >
                    {dashboardData.totalJobs}
                  </Typography>
                  <Typography variant="body1" sx={{ fontSize: { xs: '1rem', sm: '1.1rem' }, fontWeight: 500 }}>
                    Total Jobs
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  color: 'white',
                  borderRadius: 3
                }}
              >
                <CardContent sx={{ textAlign: 'center', py: { xs: 1.5, sm: 2 } }}>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 'bold',
                      fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
                    }}
                  >
                    {dashboardData.pending}
                  </Typography>
                  <Typography variant="body1" sx={{ fontSize: { xs: '1rem', sm: '1.1rem' }, fontWeight: 500 }}>
                    Pending
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  color: 'white',
                  borderRadius: 3
                }}
              >
                <CardContent sx={{ textAlign: 'center', py: { xs: 1.5, sm: 2 } }}>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 'bold',
                      fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
                    }}
                  >
                    {dashboardData.inProgress}
                  </Typography>
                  <Typography variant="body1" sx={{ fontSize: { xs: '1rem', sm: '1.1rem' }, fontWeight: 500 }}>
                    In Progress
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                  color: 'white',
                  borderRadius: 3
                }}
              >
                <CardContent sx={{ textAlign: 'center', py: { xs: 1.5, sm: 2 } }}>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 'bold',
                      fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
                    }}
                  >
                    {dashboardData.completed}
                  </Typography>
                  <Typography variant="body1" sx={{ fontSize: { xs: '1rem', sm: '1.1rem' }, fontWeight: 500 }}>
                    Completed
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Chart & Info Cards (Stacked on mobile) */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            {renderChart(statusData, statusColors, 'Job Status Distribution')}
          </Grid>
          <Grid item xs={12} md={6}>
            {renderChart(issueData, issueColors, 'Issues by Type')}
          </Grid>
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                height: { xs: 180, md: 300 },
                background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                boxShadow: '0 8px 32px rgba(0, 123, 255, 0.1)',
                border: '1px solid rgba(0, 123, 255, 0.1)',
                borderRadius: 3
              }}
            >
              <CardContent sx={{ p: { xs: 1.5, sm: 3 } }}>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 1,
                    color: '#007BFF',
                    fontWeight: 'bold',
                    fontSize: { xs: '1rem', sm: '1.1rem' }
                  }}
                >
                  Recent Activity
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2">New job added</Typography>
                    <Chip label="2 min ago" size="small" color="primary" />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2">Job RB156 completed</Typography>
                    <Chip label="15 min ago" size="small" color="success" />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2">Status updated</Typography>
                    <Chip label="1 hour ago" size="small" color="info" />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                height: { xs: 180, md: 300 },
                background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                boxShadow: '0 8px 32px rgba(0, 123, 255, 0.1)',
                border: '1px solid rgba(0, 123, 255, 0.1)',
                borderRadius: 3
              }}
            >
              <CardContent sx={{ p: { xs: 1.5, sm: 3 } }}>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 1,
                    color: '#007BFF',
                    fontWeight: 'bold',
                    fontSize: { xs: '1rem', sm: '1.1rem' }
                  }}
                >
                  Quick Stats
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Avg. Completion Time</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>3.2 days</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Customer Satisfaction</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#4caf50' }}>94%</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">This Month's Revenue</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#007BFF' }}>₹45,600</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;
