import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Button,
  LinearProgress,
  Stack,
  Container,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  FitnessCenter as WorkoutIcon,
  Flag as GoalIcon,
  Timeline as TimelineIcon,
  LocalFireDepartment as FireIcon,
  EmojiEvents as TrophyIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';

const MotionCard = motion(Card);
const MotionPaper = motion(Paper);

const Analysis = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/stats');
      setStats(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch statistics');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={fetchStats}>
          Retry
        </Button>
      </Container>
    );
  }

  const statCards = [
    {
      title: 'Total Workouts',
      value: stats.totalWorkouts,
      icon: <WorkoutIcon sx={{ fontSize: 40 }} />,
      color: '#2196F3',
      gradient: 'linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)',
    },
    {
      title: 'Total Duration',
      value: `${Math.floor(stats.totalDuration / 60)}h ${stats.totalDuration % 60}m`,
      icon: <TimelineIcon sx={{ fontSize: 40 }} />,
      color: '#4CAF50',
      gradient: 'linear-gradient(135deg, #4CAF50 0%, #81C784 100%)',
    },
    {
      title: 'Calories Burned',
      value: stats.totalCalories,
      icon: <FireIcon sx={{ fontSize: 40 }} />,
      color: '#FF9800',
      gradient: 'linear-gradient(135deg, #FF9800 0%, #FFB74D 100%)',
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            mb: 4, 
            fontFamily: 'Poppins, sans-serif', 
            fontWeight: 600,
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Fitness Analytics
        </Typography>
      </motion.div>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0 }}
            whileHover={{ 
              scale: 1.02,
              boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
            }}
            sx={{
              height: '100%',
              borderRadius: '16px',
              overflow: 'hidden',
              background: 'white',
              transition: 'all 0.3s ease',
            }}
          >
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Box
                  sx={{
                    background: 'linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)',
                    p: 2,
                    borderRadius: '12px',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <WorkoutIcon sx={{ fontSize: 40 }} />
                </Box>
                <Box>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontFamily: 'Poppins, sans-serif', 
                      fontWeight: 500,
                      color: 'text.secondary',
                    }}
                  >
                    Total Workouts
                  </Typography>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      fontFamily: 'Poppins, sans-serif', 
                      fontWeight: 600,
                      color: '#2196F3',
                    }}
                  >
                    {stats.totalWorkouts}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </MotionCard>
        </Grid>

        <Grid item xs={12} md={4}>
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            whileHover={{ 
              scale: 1.02,
              boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
            }}
            sx={{
              height: '100%',
              borderRadius: '16px',
              overflow: 'hidden',
              background: 'white',
              transition: 'all 0.3s ease',
            }}
          >
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Box
                  sx={{
                    background: 'linear-gradient(135deg, #4CAF50 0%, #81C784 100%)',
                    p: 2,
                    borderRadius: '12px',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <TimelineIcon sx={{ fontSize: 40 }} />
                </Box>
                <Box>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontFamily: 'Poppins, sans-serif', 
                      fontWeight: 500,
                      color: 'text.secondary',
                    }}
                  >
                    Total Duration
                  </Typography>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      fontFamily: 'Poppins, sans-serif', 
                      fontWeight: 600,
                      color: '#4CAF50',
                    }}
                  >
                    {`${Math.floor(stats.totalDuration / 60)}h ${stats.totalDuration % 60}m`}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </MotionCard>
        </Grid>

        <Grid item xs={12} md={4}>
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            whileHover={{ 
              scale: 1.02,
              boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
            }}
            sx={{
              height: '100%',
              borderRadius: '16px',
              overflow: 'hidden',
              background: 'white',
              transition: 'all 0.3s ease',
            }}
          >
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Box
                  sx={{
                    background: 'linear-gradient(135deg, #FF9800 0%, #FFB74D 100%)',
                    p: 2,
                    borderRadius: '12px',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <FireIcon sx={{ fontSize: 40 }} />
                </Box>
                <Box>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontFamily: 'Poppins, sans-serif', 
                      fontWeight: 500,
                      color: 'text.secondary',
                    }}
                  >
                    Calories Burned
                  </Typography>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      fontFamily: 'Poppins, sans-serif', 
                      fontWeight: 600,
                      color: '#FF9800',
                    }}
                  >
                    {stats.totalCalories}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </MotionCard>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <MotionCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              whileHover={{ 
                scale: 1.02,
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
              }}
              sx={{
                height: '100%',
                borderRadius: '16px',
                overflow: 'hidden',
                background: 'white',
                transition: 'all 0.3s ease',
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <Box
                    sx={{
                      background: 'linear-gradient(135deg, #9C27B0 0%, #BA68C8 100%)',
                      p: 2,
                      borderRadius: '12px',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <TrophyIcon sx={{ fontSize: 40 }} />
                  </Box>
                  <Box>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontFamily: 'Poppins, sans-serif', 
                        fontWeight: 500,
                        color: 'text.secondary',
                      }}
                    >
                      Achievements
                    </Typography>
                    <Typography 
                      variant="h4" 
                      sx={{ 
                        fontFamily: 'Poppins, sans-serif', 
                        fontWeight: 600,
                        color: '#9C27B0',
                      }}
                    >
                      {stats.achievements || 0}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </MotionCard>
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <MotionPaper
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            sx={{ 
              p: 3, 
              borderRadius: '16px',
              background: 'white',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            }}
          >
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 3, 
                fontFamily: 'Poppins, sans-serif', 
                fontWeight: 600,
                color: '#2196F3',
              }}
            >
              Weekly Activity
            </Typography>
            <Stack spacing={2}>
              {Object.entries(stats.workoutTypes).map(([type, count], index) => (
                <Box key={type}>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography sx={{ fontFamily: 'Poppins, sans-serif' }}>{type}</Typography>
                    <Typography sx={{ fontFamily: 'Poppins, sans-serif' }}>
                      {count} workouts
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(count / stats.totalWorkouts) * 100}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: 'rgba(33, 150, 243, 0.1)',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 4,
                        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                      },
                    }}
                  />
                </Box>
              ))}
            </Stack>
          </MotionPaper>
        </Grid>

        <Grid item xs={12} md={6}>
          <MotionPaper
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            sx={{ 
              p: 3, 
              borderRadius: '16px',
              background: 'white',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            }}
          >
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 3, 
                fontFamily: 'Poppins, sans-serif', 
                fontWeight: 600,
                color: '#4CAF50',
              }}
            >
              Workout Type Distribution
            </Typography>
            <Stack spacing={2}>
              {Object.entries(stats.workoutTypes).map(([type, count], index) => (
                <Box key={type}>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography sx={{ fontFamily: 'Poppins, sans-serif' }}>{type}</Typography>
                    <Typography sx={{ fontFamily: 'Poppins, sans-serif' }}>{count} workouts</Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(count / stats.totalWorkouts) * 100}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: 'rgba(76, 175, 80, 0.1)',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 4,
                        background: 'linear-gradient(45deg, #4CAF50 30%, #81C784 90%)',
                      },
                    }}
                  />
                </Box>
              ))}
            </Stack>
          </MotionPaper>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <MotionPaper
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            sx={{ 
              p: 3, 
              borderRadius: '16px',
              background: 'white',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            }}
          >
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 3, 
                fontFamily: 'Poppins, sans-serif', 
                fontWeight: 600,
                color: '#FF9800',
              }}
            >
              Progress Over Time
            </Typography>
            <Stack spacing={2}>
              {stats.goalProgress.map((goal, index) => (
                <Box key={goal._id}>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography sx={{ fontFamily: 'Poppins, sans-serif' }}>{goal.type}</Typography>
                    <Typography sx={{ fontFamily: 'Poppins, sans-serif' }}>{goal.progress}%</Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={goal.progress}
                    color={goal.progress >= 100 ? 'success' : 'primary'}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: 'rgba(255, 152, 0, 0.1)',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 4,
                        background: goal.progress >= 100
                          ? 'linear-gradient(45deg, #4CAF50 30%, #81C784 90%)'
                          : 'linear-gradient(45deg, #FF9800 30%, #FFB74D 90%)',
                      },
                    }}
                  />
                </Box>
              ))}
            </Stack>
          </MotionPaper>
        </Grid>

        <Grid item xs={12} md={6}>
          <MotionPaper
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.6 }}
            sx={{ 
              p: 3, 
              borderRadius: '16px',
              background: 'white',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            }}
          >
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 3, 
                fontFamily: 'Poppins, sans-serif', 
                fontWeight: 600,
                color: '#9C27B0',
              }}
            >
              Most Common Exercises
            </Typography>
            <Stack spacing={2}>
              {stats.recentActivity.map((activity, index) => (
                <Box key={activity._id}>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography sx={{ fontFamily: 'Poppins, sans-serif' }}>
                      {activity.description}
                    </Typography>
                    <Typography sx={{ fontFamily: 'Poppins, sans-serif' }}>
                      {new Date(activity.date).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={100}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: 'rgba(156, 39, 176, 0.1)',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 4,
                        background: 'linear-gradient(45deg, #9C27B0 30%, #BA68C8 90%)',
                      },
                    }}
                  />
                </Box>
              ))}
            </Stack>
          </MotionPaper>
        </Grid>
      </Grid>

      <MotionPaper
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.7 }}
        sx={{ 
          p: 3, 
          mt: 3, 
          borderRadius: '16px',
          background: 'white',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        }}
      >
        <Typography 
          variant="h6" 
          sx={{ 
            mb: 3, 
            fontFamily: 'Poppins, sans-serif', 
            fontWeight: 600,
            color: '#FF9800',
          }}
        >
          Recent Activities
        </Typography>
        <Grid container spacing={2}>
          {stats.recentActivity.map((activity, index) => (
            <Grid item xs={12} md={6} key={activity._id}>
              <MotionCard
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                }}
                sx={{
                  borderRadius: '12px',
                  background: 'white',
                  transition: 'all 0.3s ease',
                }}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2}>
                    {activity.type === 'workout' ? (
                      <WorkoutIcon sx={{ color: '#2196F3', fontSize: 30 }} />
                    ) : (
                      <TrophyIcon sx={{ color: '#4CAF50', fontSize: 30 }} />
                    )}
                    <Box>
                      <Typography 
                        variant="subtitle1"
                        sx={{ 
                          fontFamily: 'Poppins, sans-serif',
                          fontWeight: 500,
                          color: activity.type === 'workout' ? '#2196F3' : '#4CAF50',
                        }}
                      >
                        {activity.type === 'workout' ? 'Workout Completed' : 'Goal Updated'}
                      </Typography>
                      <Typography 
                        sx={{ 
                          fontFamily: 'Poppins, sans-serif',
                          color: 'text.secondary',
                        }}
                      >
                        {activity.description}
                      </Typography>
                      <Typography 
                        variant="caption"
                        sx={{ 
                          fontFamily: 'Poppins, sans-serif',
                          color: 'text.secondary',
                        }}
                      >
                        {new Date(activity.date).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </MotionCard>
            </Grid>
          ))}
        </Grid>
      </MotionPaper>
    </Container>
  );
};

export default Analysis; 