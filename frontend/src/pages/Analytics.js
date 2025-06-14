import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Tooltip as MuiTooltip,
  IconButton,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  FitnessCenter as FitnessCenterIcon,
  Timer as TimerIcon,
  LocalFireDepartment as CaloriesIcon,
  Flag as FlagIcon,
  Info as InfoIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import Layout from '../components/Layout';
import api from '../services/api';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

function Analytics() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeRange, setTimeRange] = useState('week');
  const [analytics, setAnalytics] = useState({
    totalWorkouts: 0,
    totalDuration: 0,
    totalCaloriesBurned: 0,
    workoutTypeDistribution: {},
    weeklyActivity: [],
    progressOverTime: [],
    goalCompletionRate: 0,
    mostCommonExercises: []
  });

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.post('/analytics/generate', { timeRange });
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setError(error.response?.data?.message || 'Failed to fetch analytics data');
    } finally {
      setLoading(false);
    }
  };

  const handleTimeRangeChange = (event) => {
    setTimeRange(event.target.value);
  };

  const getWorkoutTypeLabel = (type) => {
    const types = {
      cardio: 'Cardio',
      strength: 'Strength',
      flexibility: 'Flexibility',
      hiit: 'HIIT',
      other: 'Other'
    };
    return types[type] || type;
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

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
          <Alert severity="error">{error}</Alert>
        </Box>
      </Layout>
    );
  }

  // Prepare data for charts
  const weeklyActivityData = analytics.weeklyActivity.map(day => ({
    date: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
    workouts: day.count,
    duration: day.duration,
    calories: day.caloriesBurned
  }));

  const workoutTypeData = Object.entries(analytics.workoutTypeDistribution).map(([type, count]) => ({
    name: getWorkoutTypeLabel(type),
    value: count
  }));

  const progressData = analytics.progressOverTime.map(day => ({
    date: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
    progress: day.progress
  }));

  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="h4">Analytics</Typography>
            <MuiTooltip title="Hover over charts to see details. Click legend items to toggle visibility.">
              <IconButton size="small" sx={{ ml: 1 }}>
                <InfoIcon />
              </IconButton>
            </MuiTooltip>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Time Range</InputLabel>
              <Select
                value={timeRange}
                label="Time Range"
                onChange={handleTimeRangeChange}
              >
                <MenuItem value="week">Week</MenuItem>
                <MenuItem value="month">Month</MenuItem>
                <MenuItem value="year">Year</MenuItem>
              </Select>
            </FormControl>
            <MuiTooltip title="Refresh data">
              <IconButton onClick={fetchAnalytics}>
                <RefreshIcon />
              </IconButton>
            </MuiTooltip>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* Summary Cards */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <FitnessCenterIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">Total Workouts</Typography>
                </Box>
                <Typography variant="h4">{analytics.totalWorkouts}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TimerIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">Total Duration</Typography>
                </Box>
                <Typography variant="h4">{formatDuration(analytics.totalDuration)}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CaloriesIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">Calories Burned</Typography>
                </Box>
                <Typography variant="h4">{analytics.totalCaloriesBurned}</Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Weekly Activity Chart */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    Weekly Activity
                  </Typography>
                  <MuiTooltip title="Shows your daily workout activity and calories burned">
                    <IconButton size="small" sx={{ ml: 1 }}>
                      <InfoIcon />
                    </IconButton>
                  </MuiTooltip>
                </Box>
                <Box sx={{ height: 400 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyActivityData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis yAxisId="left" orientation="left" stroke="#8884d8" label={{ value: 'Workouts', angle: -90, position: 'insideLeft' }} />
                      <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" label={{ value: 'Calories', angle: 90, position: 'insideRight' }} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
                        formatter={(value, name) => {
                          if (name === 'calories') return [`${value} calories`, 'Calories Burned'];
                          if (name === 'workouts') return [`${value} workouts`, 'Workouts'];
                          return [value, name];
                        }}
                      />
                      <Legend />
                      <Bar yAxisId="left" dataKey="workouts" name="Workouts" fill="#8884d8" />
                      <Bar yAxisId="right" dataKey="calories" name="Calories Burned" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Workout Type Distribution */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    Workout Type Distribution
                  </Typography>
                  <MuiTooltip title="Shows the distribution of your workout types">
                    <IconButton size="small" sx={{ ml: 1 }}>
                      <InfoIcon />
                    </IconButton>
                  </MuiTooltip>
                </Box>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={workoutTypeData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {workoutTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value, name) => [`${value} workouts`, name]}
                        contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Progress Over Time */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    Progress Over Time
                  </Typography>
                  <MuiTooltip title="Shows your progress trend over the selected time period">
                    <IconButton size="small" sx={{ ml: 1 }}>
                      <InfoIcon />
                    </IconButton>
                  </MuiTooltip>
                </Box>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={progressData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis label={{ value: 'Progress (%)', angle: -90, position: 'insideLeft' }} />
                      <Tooltip 
                        formatter={(value) => [`${value.toFixed(1)}%`, 'Progress']}
                        contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="progress"
                        name="Progress"
                        stroke="#8884d8"
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Most Common Exercises */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    Most Common Exercises
                  </Typography>
                  <MuiTooltip title="Shows your most frequently performed exercises">
                    <IconButton size="small" sx={{ ml: 1 }}>
                      <InfoIcon />
                    </IconButton>
                  </MuiTooltip>
                </Box>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics.mostCommonExercises}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis label={{ value: 'Times Performed', angle: -90, position: 'insideLeft' }} />
                      <Tooltip 
                        formatter={(value) => [`${value} times`, 'Times Performed']}
                        contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
                      />
                      <Legend />
                      <Bar dataKey="count" name="Times Performed" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
}

export default Analytics; 