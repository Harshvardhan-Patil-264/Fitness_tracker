import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  LinearProgress,
  Chip,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import Layout from '../components/Layout';
import api from '../services/api';
import { motion } from 'framer-motion';

const MotionCard = motion(Card);
const MotionIcon = motion(IconButton);

function Goals() {
  const [goals, setGoals] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    type: 'workout_frequency',
    target: '',
    unit: 'workouts',
    timeframe: 'monthly',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    description: '',
    progress: 0,
    status: 'active'
  });

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const response = await api.get('/goals');
      setGoals(response.data);
    } catch (error) {
      console.error('Error fetching goals:', error);
      setError('Failed to fetch goals. Please try again.');
    }
  };

  const handleOpenDialog = (goal = null) => {
    if (goal) {
      setSelectedGoal(goal);
      setFormData({
        type: goal.type,
        target: goal.target,
        unit: goal.unit,
        timeframe: goal.timeframe,
        startDate: new Date(goal.startDate).toISOString().split('T')[0],
        endDate: new Date(goal.endDate).toISOString().split('T')[0],
        description: goal.description || '',
        progress: goal.progress || 0,
        status: goal.status || 'active'
      });
    } else {
      setSelectedGoal(null);
      setFormData({
        type: 'workout_frequency',
        target: '',
        unit: 'workouts',
        timeframe: 'monthly',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        description: '',
        progress: 0,
        status: 'active'
      });
    }
    setOpenDialog(true);
    setError('');
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedGoal(null);
    setError('');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate required fields
      if (!formData.target || !formData.endDate) {
        setError('Please fill in all required fields');
        return;
      }

      // Validate dates
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      if (endDate <= startDate) {
        setError('End date must be after start date');
        return;
      }

      const goalData = {
        ...formData,
        target: Number(formData.target),
        progress: Number(formData.progress),
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate)
      };

      if (selectedGoal) {
        await api.put(`/goals/${selectedGoal._id}`, goalData);
      } else {
        await api.post('/goals', goalData);
      }
      handleCloseDialog();
      fetchGoals();
    } catch (error) {
      console.error('Error saving goal:', error);
      setError(error.response?.data?.message || 'Failed to save goal. Please try again.');
    }
  };

  const handleDelete = async (goalId) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      try {
        await api.delete(`/goals/${goalId}`);
        fetchGoals();
      } catch (error) {
        console.error('Error deleting goal:', error);
        setError('Failed to delete goal. Please try again.');
      }
    }
  };

  const handleUpdateProgress = async (goalId, newProgress) => {
    try {
      await api.put(`/goals/${goalId}`, { progress: newProgress });
      fetchGoals();
    } catch (error) {
      console.error('Error updating progress:', error);
      setError('Failed to update progress. Please try again.');
    }
  };

  const getGoalTypeLabel = (type) => {
    const types = {
      workout_frequency: 'Workout Frequency',
      weight_loss: 'Weight Loss',
      distance: 'Distance',
      strength: 'Strength',
      endurance: 'Endurance',
    };
    return types[type] || type;
  };

  const getTimeframeLabel = (timeframe) => {
    const timeframes = {
      daily: 'Daily',
      weekly: 'Weekly',
      monthly: 'Monthly',
      yearly: 'Yearly',
    };
    return timeframes[timeframe] || timeframe;
  };

  const calculateProgress = (goal) => {
    return (goal.progress / goal.target) * 100;
  };

  const getProgressColor = (progress) => {
    if (progress >= 100) return 'success';
    if (progress >= 75) return 'info';
    if (progress >= 50) return 'warning';
    return 'error';
  };

  return (
    <Layout>
      <Box sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h4">Goals</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            component={motion.button}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Add Goal
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {goals.map((goal, index) => (
            <Grid item xs={12} md={6} lg={4} key={goal._id}>
              <MotionCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                sx={{
                  transition: 'box-shadow 0.3s ease-in-out',
                  '&:hover': {
                    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">
                      {getGoalTypeLabel(goal.type)}
                    </Typography>
                    <Chip
                      label={getTimeframeLabel(goal.timeframe)}
                      color="primary"
                      size="small"
                      component={motion.div}
                      whileHover={{ scale: 1.1 }}
                    />
                  </Box>
                  <Typography color="textSecondary" gutterBottom>
                    Target: {goal.target} {goal.unit}
                  </Typography>
                  <Typography color="textSecondary" gutterBottom>
                    Progress: {goal.progress} {goal.unit}
                  </Typography>
                  <Box sx={{ mt: 2, mb: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(calculateProgress(goal), 100)}
                      color={getProgressColor(calculateProgress(goal))}
                      sx={{ height: 10, borderRadius: 5 }}
                    />
                  </Box>
                  {goal.description && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {goal.description}
                    </Typography>
                  )}
                  <Typography variant="caption" color="textSecondary">
                    End Date: {new Date(goal.endDate).toLocaleDateString()}
                  </Typography>
                </CardContent>
                <CardActions>
                  <MotionIcon
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleOpenDialog(goal)}
                  >
                    <EditIcon />
                  </MotionIcon>
                  <MotionIcon
                    whileHover={{ scale: 1.2, rotate: -5 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDelete(goal._id)}
                  >
                    <DeleteIcon />
                  </MotionIcon>
                  {goal.progress < goal.target && (
                    <MotionIcon
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleUpdateProgress(goal._id, goal.progress + 1)}
                      color="success"
                    >
                      <CheckCircleIcon />
                    </MotionIcon>
                  )}
                </CardActions>
              </MotionCard>
            </Grid>
          ))}
        </Grid>

        <Dialog 
          open={openDialog} 
          onClose={handleCloseDialog} 
          maxWidth="sm" 
          fullWidth
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <DialogTitle>
            {selectedGoal ? 'Edit Goal' : 'Create New Goal'}
          </DialogTitle>
          <DialogContent>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
              <TextField
                select
                fullWidth
                label="Goal Type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                margin="normal"
                required
              >
                <MenuItem value="workout_frequency">Workout Frequency</MenuItem>
                <MenuItem value="calories_burned">Calories Burned</MenuItem>
                <MenuItem value="weight_loss">Weight Loss</MenuItem>
                <MenuItem value="strength">Strength</MenuItem>
                <MenuItem value="endurance">Endurance</MenuItem>
                <MenuItem value="custom">Custom</MenuItem>
              </TextField>

              <TextField
                fullWidth
                label="Target"
                name="target"
                type="number"
                value={formData.target}
                onChange={handleChange}
                margin="normal"
                required
                inputProps={{ min: 0 }}
              />

              <TextField
                select
                fullWidth
                label="Unit"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                margin="normal"
                required
              >
                <MenuItem value="workouts">Workouts</MenuItem>
                <MenuItem value="calories">Calories</MenuItem>
                <MenuItem value="kg">Kilograms</MenuItem>
                <MenuItem value="reps">Reps</MenuItem>
                <MenuItem value="minutes">Minutes</MenuItem>
                <MenuItem value="custom">Custom</MenuItem>
              </TextField>

              <TextField
                select
                fullWidth
                label="Timeframe"
                name="timeframe"
                value={formData.timeframe}
                onChange={handleChange}
                margin="normal"
                required
              >
                <MenuItem value="daily">Daily</MenuItem>
                <MenuItem value="weekly">Weekly</MenuItem>
                <MenuItem value="monthly">Monthly</MenuItem>
              </TextField>

              <TextField
                fullWidth
                label="Start Date"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
                margin="normal"
                required
                InputLabelProps={{ shrink: true }}
              />

              <TextField
                fullWidth
                label="End Date"
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleChange}
                margin="normal"
                required
                InputLabelProps={{ shrink: true }}
              />

              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                margin="normal"
                multiline
                rows={3}
              />

              {formData.type === 'custom' && (
                <TextField
                  fullWidth
                  label="Custom Type"
                  name="customType"
                  value={formData.customType || ''}
                  onChange={handleChange}
                  margin="normal"
                />
              )}

              {formData.unit === 'custom' && (
                <TextField
                  fullWidth
                  label="Custom Unit"
                  name="customUnit"
                  value={formData.customUnit || ''}
                  onChange={handleChange}
                  margin="normal"
                />
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={handleCloseDialog}
              component={motion.button}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              variant="contained" 
              color="primary"
              component={motion.button}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {selectedGoal ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Layout>
  );
}

export default Goals; 