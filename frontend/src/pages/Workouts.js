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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FitnessCenter as WorkoutIcon,
} from '@mui/icons-material';
import Layout from '../components/Layout';
import api from '../services/api';
import { motion } from 'framer-motion';

const MotionCard = motion(Card);
const MotionPaper = motion(Paper);

function Workouts() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [workouts, setWorkouts] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [formData, setFormData] = useState({
    type: '',
    duration: '',
    caloriesBurned: '',
    date: '',
    notes: '',
  });

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const response = await api.get('/workouts');
      setWorkouts(response.data);
    } catch (error) {
      console.error('Error fetching workouts:', error);
      setError('Failed to fetch workouts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Convert form data to match backend requirements
      const workoutData = {
        ...formData,
        duration: Number(formData.duration),
        caloriesBurned: Number(formData.caloriesBurned),
      };

      if (editingWorkout) {
        await api.put(`/workouts/${editingWorkout._id}`, workoutData);
      } else {
        await api.post('/workouts', workoutData);
      }
      setOpenDialog(false);
      fetchWorkouts();
    } catch (error) {
      console.error('Error saving workout:', error);
      setError(error.response?.data?.message || 'Failed to save workout. Please try again.');
    }
  };

  const handleDelete = async (workoutId) => {
    if (window.confirm('Are you sure you want to delete this workout?')) {
      try {
        await api.delete(`/workouts/${workoutId}`);
        fetchWorkouts();
      } catch (error) {
        console.error('Error deleting workout:', error);
        setError('Failed to delete workout. Please try again.');
      }
    }
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
          <Alert 
            severity="error" 
            action={
              <Button color="inherit" size="small" onClick={fetchWorkouts}>
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
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography 
              variant="h4"
              sx={{ 
                fontFamily: 'Poppins',
                fontWeight: 600,
                color: 'primary.main'
              }}
            >
              Workouts
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                setEditingWorkout(null);
                setFormData({
                  type: '',
                  duration: '',
                  caloriesBurned: '',
                  date: '',
                  notes: '',
                });
                setOpenDialog(true);
              }}
              sx={{
                fontFamily: 'Poppins',
                borderRadius: '20px',
                textTransform: 'none',
                px: 3
              }}
            >
              Add Workout
            </Button>
          </Box>
        </motion.div>

        <Grid container spacing={3}>
          {workouts.map((workout, index) => (
            <Grid item xs={12} md={6} key={workout._id}>
              <MotionCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                sx={{
                  background: 'linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%)',
                  borderRadius: 2,
                  boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <WorkoutIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography 
                        variant="h6"
                        sx={{ 
                          fontFamily: 'Poppins',
                          fontWeight: 600,
                          color: 'primary.main'
                        }}
                      >
                        {workout.type}
                      </Typography>
                    </Box>
                    <Box>
                      <IconButton
                        size="small"
                        onClick={() => {
                          setEditingWorkout(workout);
                          setFormData(workout);
                          setOpenDialog(true);
                        }}
                        sx={{ mr: 1 }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(workout._id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                  <Typography 
                    color="textSecondary"
                    sx={{ fontFamily: 'Poppins', mb: 2 }}
                  >
                    {new Date(workout.date).toLocaleDateString()}
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography 
                        variant="body2" 
                        color="textSecondary"
                        sx={{ fontFamily: 'Poppins' }}
                      >
                        Duration
                      </Typography>
                      <Typography 
                        variant="body1"
                        sx={{ 
                          fontFamily: 'Poppins',
                          fontWeight: 500
                        }}
                      >
                        {workout.duration} minutes
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography 
                        variant="body2" 
                        color="textSecondary"
                        sx={{ fontFamily: 'Poppins' }}
                      >
                        Calories Burned
                      </Typography>
                      <Typography 
                        variant="body1"
                        sx={{ 
                          fontFamily: 'Poppins',
                          fontWeight: 500
                        }}
                      >
                        {workout.caloriesBurned}
                      </Typography>
                    </Grid>
                  </Grid>
                  {workout.notes && (
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        mt: 2,
                        fontFamily: 'Poppins',
                        color: 'text.secondary'
                      }}
                    >
                      {workout.notes}
                    </Typography>
                  )}
                </CardContent>
              </MotionCard>
            </Grid>
          ))}
        </Grid>

        <Dialog 
          open={openDialog} 
          onClose={() => setOpenDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ fontFamily: 'Poppins' }}>
            {editingWorkout ? 'Edit Workout' : 'Add Workout'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel sx={{ fontFamily: 'Poppins' }}>Workout Type</InputLabel>
                <Select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  label="Workout Type"
                  sx={{ fontFamily: 'Poppins' }}
                >
                  <MenuItem value="strength" sx={{ fontFamily: 'Poppins' }}>Strength</MenuItem>
                  <MenuItem value="cardio" sx={{ fontFamily: 'Poppins' }}>Cardio</MenuItem>
                  <MenuItem value="flexibility" sx={{ fontFamily: 'Poppins' }}>Flexibility</MenuItem>
                  <MenuItem value="balance" sx={{ fontFamily: 'Poppins' }}>Balance</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Duration (minutes)"
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                sx={{ mb: 2, fontFamily: 'Poppins' }}
              />
              <TextField
                fullWidth
                label="Calories Burned"
                type="number"
                value={formData.caloriesBurned}
                onChange={(e) => setFormData({ ...formData, caloriesBurned: e.target.value })}
                sx={{ mb: 2, fontFamily: 'Poppins' }}
              />
              <TextField
                fullWidth
                label="Date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 2, fontFamily: 'Poppins' }}
              />
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={4}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                sx={{ fontFamily: 'Poppins' }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => setOpenDialog(false)}
              sx={{ fontFamily: 'Poppins' }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              variant="contained"
              sx={{ 
                fontFamily: 'Poppins',
                borderRadius: '20px',
                textTransform: 'none',
                px: 3
              }}
            >
              {editingWorkout ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Layout>
  );
}

export default Workouts; 