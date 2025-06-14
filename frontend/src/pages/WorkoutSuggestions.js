import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  FitnessCenter as FitnessCenterIcon,
  Search as SearchIcon,
  Timer as TimerIcon,
  LocalFireDepartment as CaloriesIcon,
} from '@mui/icons-material';
import axios from 'axios';

const WorkoutSuggestions = () => {
  const [workouts, setWorkouts] = useState([]);
  const [filteredWorkouts, setFilteredWorkouts] = useState([]);
  const [category, setCategory] = useState('all');
  const [difficulty, setDifficulty] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/workouts/suggestions');
      setWorkouts(response.data);
      setFilteredWorkouts(response.data);
    } catch (error) {
      console.error('Error fetching workouts:', error);
    }
  };

  useEffect(() => {
    filterWorkouts();
  }, [category, difficulty, searchTerm, workouts]);

  const filterWorkouts = () => {
    let filtered = [...workouts];

    if (category !== 'all') {
      filtered = filtered.filter(workout => workout.category === category);
    }

    if (difficulty !== 'all') {
      filtered = filtered.filter(workout => workout.difficulty === difficulty);
    }

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(workout =>
        workout.title.toLowerCase().includes(searchLower) ||
        workout.description.toLowerCase().includes(searchLower) ||
        workout.muscleGroups.some(muscle => muscle.toLowerCase().includes(searchLower)) ||
        workout.equipment.some(item => item.toLowerCase().includes(searchLower))
      );
    }

    setFilteredWorkouts(filtered);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner':
        return 'success';
      case 'intermediate':
        return 'warning';
      case 'advanced':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Workout Suggestions
      </Typography>

      {/* Filters */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Search Workouts"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={category}
                label="Category"
                onChange={(e) => setCategory(e.target.value)}
              >
                <MenuItem value="all">All Categories</MenuItem>
                <MenuItem value="strength">Strength</MenuItem>
                <MenuItem value="cardio">Cardio</MenuItem>
                <MenuItem value="flexibility">Flexibility</MenuItem>
                <MenuItem value="balance">Balance</MenuItem>
                <MenuItem value="hiit">HIIT</MenuItem>
                <MenuItem value="yoga">Yoga</MenuItem>
                <MenuItem value="pilates">Pilates</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Difficulty</InputLabel>
              <Select
                value={difficulty}
                label="Difficulty"
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <MenuItem value="all">All Levels</MenuItem>
                <MenuItem value="beginner">Beginner</MenuItem>
                <MenuItem value="intermediate">Intermediate</MenuItem>
                <MenuItem value="advanced">Advanced</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {/* Workout Cards */}
      <Grid container spacing={3}>
        {filteredWorkouts.map((workout) => (
          <Grid item xs={12} md={6} lg={4} key={workout._id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {workout.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {workout.description}
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Chip
                    label={workout.category}
                    color="primary"
                    size="small"
                    sx={{ mr: 1, mb: 1 }}
                  />
                  <Chip
                    label={workout.difficulty}
                    color={getDifficultyColor(workout.difficulty)}
                    size="small"
                    sx={{ mr: 1, mb: 1 }}
                  />
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <TimerIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {workout.duration} minutes
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CaloriesIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    ~{workout.caloriesBurn} calories
                  </Typography>
                </Box>

                {workout.equipment && workout.equipment.length > 0 && (
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Equipment Needed:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {workout.equipment.map((item, index) => (
                        <Chip
                          key={index}
                          label={item}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Box>
                )}

                {workout.muscleGroups && workout.muscleGroups.length > 0 && (
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Target Muscles:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {workout.muscleGroups.map((muscle, index) => (
                        <Chip
                          key={index}
                          label={muscle}
                          size="small"
                          variant="outlined"
                          color="primary"
                        />
                      ))}
                    </Box>
                  </Box>
                )}

                {workout.benefits && workout.benefits.length > 0 && (
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Benefits:
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {workout.benefits.join(', ')}
                    </Typography>
                  </Box>
                )}

                {workout.precautions && workout.precautions.length > 0 && (
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Precautions:
                    </Typography>
                    <Typography variant="body2" color="error">
                      {workout.precautions.join(', ')}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default WorkoutSuggestions; 