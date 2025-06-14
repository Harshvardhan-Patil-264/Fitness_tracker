import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import {
  FitnessCenter as WorkoutIcon,
  Flag as GoalIcon,
  Lightbulb as TipIcon,
} from '@mui/icons-material';
import Layout from '../components/Layout';
import api from '../services/api';
import { motion } from 'framer-motion';

const MotionCard = motion(Card);
const MotionPaper = motion(Paper);

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    completedGoals: 0,
    activeGoals: 0,
    recentWorkouts: [],
    recentGoals: [],
    healthTips: [],
  });

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      // Check if user is authenticated
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log('Fetching analytics data...');
      const analyticsResponse = await api.post('/analytics/generate', { 
        timeRange: 'month'
      });
      console.log('Analytics response:', analyticsResponse.data);

      console.log('Fetching recent workouts...');
      const workoutsResponse = await api.get('/workouts?limit=5');
      console.log('Workouts response:', workoutsResponse.data);

      console.log('Fetching recent goals...');
      const goalsResponse = await api.get('/goals');
      console.log('Goals response:', goalsResponse.data);

      // Calculate active and completed goals
      const activeGoals = goalsResponse.data.filter(goal => 
        goal.status === 'active' && new Date(goal.endDate) >= new Date()
      ).length;
      
      const completedGoals = goalsResponse.data.filter(goal => 
        goal.status === 'completed'
      ).length;

      console.log('Goal counts:', { activeGoals, completedGoals, totalGoals: goalsResponse.data.length });

      // Ensure we have valid data from analytics
      const analyticsData = analyticsResponse.data || {};
      
      setStats({
        totalWorkouts: analyticsData.totalWorkouts || 0,
        completedGoals,
        activeGoals,
        recentWorkouts: workoutsResponse.data?.slice(0, 5) || [],
        recentGoals: goalsResponse.data?.slice(0, 5) || [],
        healthTips: [], // Initialize with empty array since health tips endpoint is not available
      });

      // Try to fetch health tips separately
      try {
        console.log('Fetching health tips...');
        const healthTipsResponse = await api.get('/health-tips/active');
        console.log('Health tips response:', healthTipsResponse.data);
        setStats(prevStats => ({
          ...prevStats,
          healthTips: healthTipsResponse.data || []
        }));
      } catch (healthTipsError) {
        console.warn('Could not fetch health tips:', healthTipsError);
        // Don't throw error, just log warning
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch dashboard data. Please try again.';
      setError(errorMessage);
      
      // If unauthorized, redirect to login
      if (error.response?.status === 401 || error.message === 'No authentication token found') {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Layout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Box sx={{ p: 3 }}>
          <Alert 
            severity="error" 
            action={
              <Button color="inherit" size="small" onClick={fetchDashboardData}>
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography 
            variant="h4" 
            gutterBottom
            sx={{ 
              fontFamily: 'Poppins',
              fontWeight: 600,
              color: 'primary.main',
              mb: 4
            }}
          >
            Dashboard
          </Typography>
        </motion.div>
        
        <Grid container spacing={3}>
          {/* Summary Cards */}
          <Grid item xs={12} md={4}>
            <MotionCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ scale: 1.02 }}
              sx={{
                height: '100%',
                background: 'linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%)',
                borderRadius: 2,
                boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
              }}
            >
              <CardContent>
                <Typography 
                  color="textSecondary" 
                  gutterBottom
                  sx={{ fontFamily: 'Poppins' }}
                >
                  Total Workouts
                </Typography>
                <Typography 
                  variant="h4"
                  sx={{ 
                    fontFamily: 'Poppins',
                    fontWeight: 600,
                    color: 'primary.main'
                  }}
                >
                  {stats.totalWorkouts}
                </Typography>
              </CardContent>
            </MotionCard>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <MotionCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ scale: 1.02 }}
              sx={{
                height: '100%',
                background: 'linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%)',
                borderRadius: 2,
                boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
              }}
            >
              <CardContent>
                <Typography 
                  color="textSecondary" 
                  gutterBottom
                  sx={{ fontFamily: 'Poppins' }}
                >
                  Active Goals
                </Typography>
                <Typography 
                  variant="h4"
                  sx={{ 
                    fontFamily: 'Poppins',
                    fontWeight: 600,
                    color: 'success.main'
                  }}
                >
                  {stats.activeGoals}
                </Typography>
              </CardContent>
            </MotionCard>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <MotionCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ scale: 1.02 }}
              sx={{
                height: '100%',
                background: 'linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%)',
                borderRadius: 2,
                boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
              }}
            >
              <CardContent>
                <Typography 
                  color="textSecondary" 
                  gutterBottom
                  sx={{ fontFamily: 'Poppins' }}
                >
                  Completed Goals
                </Typography>
                <Typography 
                  variant="h4"
                  sx={{ 
                    fontFamily: 'Poppins',
                    fontWeight: 600,
                    color: 'info.main'
                  }}
                >
                  {stats.completedGoals}
                </Typography>
              </CardContent>
            </MotionCard>
          </Grid>

          {/* Health Tips */}
          <Grid item xs={12}>
            <MotionPaper
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              sx={{ 
                p: 2,
                background: 'linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%)',
                borderRadius: 2,
                boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TipIcon sx={{ mr: 1, color: 'warning.main' }} />
                <Typography 
                  variant="h6"
                  sx={{ fontFamily: 'Poppins', fontWeight: 600 }}
                >
                  Health Tips
                </Typography>
              </Box>
              <Grid container spacing={2}>
                {stats.healthTips.map((tip, index) => (
                  <Grid item xs={12} md={6} key={tip._id}>
                    <MotionCard
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      sx={{
                        background: 'white',
                        borderRadius: 2,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                      }}
                    >
                      <CardContent>
                        <Typography 
                          variant="h6" 
                          gutterBottom
                          sx={{ fontFamily: 'Poppins', fontWeight: 500 }}
                        >
                          {tip.title}
                        </Typography>
                        <Typography 
                          color="textSecondary" 
                          paragraph
                          sx={{ fontFamily: 'Poppins' }}
                        >
                          {tip.content}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          <Chip 
                            label={tip.category} 
                            size="small" 
                            color="primary" 
                            variant="outlined"
                            sx={{ fontFamily: 'Poppins', borderRadius: '12px' }}
                          />
                          {tip.tags.map((tag, index) => (
                            <Chip 
                              key={index} 
                              label={tag} 
                              size="small" 
                              variant="outlined"
                              sx={{ fontFamily: 'Poppins', borderRadius: '12px' }}
                            />
                          ))}
                        </Box>
                      </CardContent>
                    </MotionCard>
                  </Grid>
                ))}
              </Grid>
            </MotionPaper>
          </Grid>

          {/* Recent Activities */}
          <Grid item xs={12} md={6}>
            <MotionPaper
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              sx={{ 
                p: 2,
                background: 'linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%)',
                borderRadius: 2,
                boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <WorkoutIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography 
                  variant="h6"
                  sx={{ fontFamily: 'Poppins', fontWeight: 600 }}
                >
                  Recent Workouts
                </Typography>
              </Box>
              <List>
                {stats.recentWorkouts.map((workout, index) => (
                  <motion.div
                    key={workout._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <ListItem
                      sx={{
                        background: 'white',
                        borderRadius: 2,
                        mb: 1,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                      }}
                    >
                      <ListItemText
                        primary={
                          <Typography
                            sx={{
                              fontFamily: 'Poppins',
                              fontWeight: 500,
                              color: 'primary.main',
                            }}
                          >
                            {workout.type}
                          </Typography>
                        }
                        secondary={`Duration: ${workout.duration} minutes | Calories: ${workout.caloriesBurned}`}
                      />
                    </ListItem>
                  </motion.div>
                ))}
              </List>
            </MotionPaper>
          </Grid>

          <Grid item xs={12} md={6}>
            <MotionPaper
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              sx={{ 
                p: 2,
                background: 'linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%)',
                borderRadius: 2,
                boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <GoalIcon sx={{ mr: 1, color: 'success.main' }} />
                <Typography 
                  variant="h6"
                  sx={{ fontFamily: 'Poppins', fontWeight: 600 }}
                >
                  Recent Goals
                </Typography>
              </Box>
              <List>
                {stats.recentGoals.map((goal, index) => (
                  <motion.div
                    key={goal._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <ListItem
                      sx={{
                        background: 'white',
                        borderRadius: 2,
                        mb: 1,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                      }}
                    >
                      <ListItemText
                        primary={
                          <Typography
                            sx={{
                              fontFamily: 'Poppins',
                              fontWeight: 500,
                              color: 'success.main',
                            }}
                          >
                            {goal.type}
                          </Typography>
                        }
                        secondary={`Target: ${goal.target} ${goal.unit} | Progress: ${goal.progress}%`}
                      />
                    </ListItem>
                  </motion.div>
                ))}
              </List>
            </MotionPaper>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
}

export default Dashboard; 