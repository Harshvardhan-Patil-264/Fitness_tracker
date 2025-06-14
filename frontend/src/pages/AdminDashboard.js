import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  IconButton,
  Tabs,
  Tab,
  Divider
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
  People as UsersIcon,
  FitnessCenter as WorkoutIcon,
  TrendingUp as AnalyticsIcon,
  Lightbulb as TipsIcon,
  FitnessCenter as FitnessCenterIcon,
  Lightbulb as LightbulbIcon
} from '@mui/icons-material';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [healthTips, setHealthTips] = useState([]);
  const [workoutSuggestions, setWorkoutSuggestions] = useState([]);
  const [aggregateData, setAggregateData] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalWorkouts: 0,
    totalGoals: 0,
    recentActivity: []
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('healthTip'); // 'healthTip' or 'workout'
  const [editingItem, setEditingItem] = useState(null);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'strength',
    difficulty: 'beginner',
    duration: 30,
    tags: '',
    targetAudience: 'all',
    priority: 0,
    isActive: true,
    equipment: [],
    muscleGroups: [],
    caloriesBurn: 0,
    steps: [],
    benefits: [],
    precautions: [],
    videoUrl: '',
    imageUrl: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      // Fetch health tips
      const healthTipsResponse = await axios.get('http://localhost:5000/api/health-tips/all', {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });
      setHealthTips(healthTipsResponse.data);

      // Fetch workout suggestions
      const workoutResponse = await axios.get('http://localhost:5000/api/workouts/suggestions/all', {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });
      setWorkoutSuggestions(workoutResponse.data);

      // Fetch aggregate data
      const analyticsResponse = await axios.get('http://localhost:5000/api/analytics/admin', {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });
      setAggregateData(analyticsResponse.data);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to fetch data');
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleArrayFieldChange = (field, value) => {
    const arrayValue = value.split(',').map(item => item.trim()).filter(item => item);
    setFormData(prev => ({
      ...prev,
      [field]: arrayValue
    }));
  };

  const handleOpenDialog = (type, item = null) => {
    setDialogType(type);
    setEditingItem(item);
    
    if (item) {
      setFormData({
        title: item.title || '',
        description: item.description || '',
        category: item.category || 'strength',
        difficulty: item.difficulty || 'beginner',
        duration: item.duration || 30,
        tags: item.tags || '',
        targetAudience: item.targetAudience || 'all',
        priority: item.priority || 0,
        isActive: item.isActive !== undefined ? item.isActive : true,
        equipment: item.equipment || [],
        muscleGroups: item.muscleGroups || [],
        caloriesBurn: item.caloriesBurn || 0,
        steps: item.steps || [],
        benefits: item.benefits || [],
        precautions: item.precautions || [],
        videoUrl: item.videoUrl || '',
        imageUrl: item.imageUrl || ''
      });
    } else {
      setFormData({
        title: '',
        description: '',
        category: 'strength',
        difficulty: 'beginner',
        duration: 30,
        tags: '',
        targetAudience: 'all',
        priority: 0,
        isActive: true,
        equipment: [],
        muscleGroups: [],
        caloriesBurn: 0,
        steps: [],
        benefits: [],
        precautions: [],
        videoUrl: '',
        imageUrl: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingItem(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const itemData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      if (dialogType === 'healthTip') {
        if (editingItem) {
          await axios.put(
            `http://localhost:5000/api/health-tips/${editingItem._id}`,
            itemData,
            { headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` } }
          );
        } else {
          await axios.post(
            'http://localhost:5000/api/health-tips',
            itemData,
            { headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` } }
          );
        }
      } else {
        if (editingItem) {
          await axios.put(
            `http://localhost:5000/api/workouts/suggestions/${editingItem._id}`,
            itemData,
            { headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` } }
          );
        } else {
          await axios.post(
            'http://localhost:5000/api/workouts/suggestions',
            itemData,
            { headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` } }
          );
        }
      }

      handleCloseDialog();
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save item');
    }
  };

  const handleDelete = async (type, id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        const endpoint = type === 'healthTip' 
          ? `http://localhost:5000/api/health-tips/${id}`
          : `http://localhost:5000/api/workouts/suggestions/${id}`;

        await axios.delete(endpoint, {
          headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
        });
        fetchData();
      } catch (err) {
        setError('Failed to delete item');
      }
    }
  };

  const renderAggregateData = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <UsersIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Total Users</Typography>
            </Box>
            <Typography variant="h4">{aggregateData.totalUsers}</Typography>
            <Typography variant="body2" color="text.secondary">
              Active: {aggregateData.activeUsers}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <WorkoutIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Total Workouts</Typography>
            </Box>
            <Typography variant="h4">{aggregateData.totalWorkouts}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <AnalyticsIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Total Goals</Typography>
            </Box>
            <Typography variant="h4">{aggregateData.totalGoals}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Recent Activity</Typography>
            {aggregateData.recentActivity.map((activity, index) => (
              <Box key={index} sx={{ mb: 1 }}>
                <Typography variant="body2">
                  {activity.description}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(activity.timestamp).toLocaleString()}
                </Typography>
              </Box>
            ))}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderHealthTips = () => (
    <Grid container spacing={3}>
      {healthTips.map((tip) => (
        <Grid item xs={12} md={6} lg={4} key={tip._id}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {tip.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {tip.content}
              </Typography>
              <Typography variant="caption" display="block">
                Category: {tip.category}
              </Typography>
              <Typography variant="caption" display="block">
                Target: {tip.targetAudience}
              </Typography>
              <Typography variant="caption" display="block">
                Priority: {tip.priority}
              </Typography>
            </CardContent>
            <CardActions>
              <IconButton onClick={() => handleOpenDialog('healthTip', tip)}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => handleDelete('healthTip', tip._id)}>
                <DeleteIcon />
              </IconButton>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const renderWorkoutSuggestions = () => (
    <Grid container spacing={3}>
      {workoutSuggestions.map((suggestion) => (
        <Grid item xs={12} md={6} lg={4} key={suggestion._id}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {suggestion.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {suggestion.description}
              </Typography>
              <Box sx={{ mb: 1 }}>
                <Typography variant="caption" display="block" color="text.secondary">
                  Category: {suggestion.category}
                </Typography>
                <Typography variant="caption" display="block" color="text.secondary">
                  Difficulty: {suggestion.difficulty}
                </Typography>
                <Typography variant="caption" display="block" color="text.secondary">
                  Duration: {suggestion.duration} minutes
                </Typography>
                <Typography variant="caption" display="block" color="text.secondary">
                  Calories Burn: ~{suggestion.caloriesBurn} kcal
                </Typography>
              </Box>
              {suggestion.equipment && suggestion.equipment.length > 0 && (
                <Box sx={{ mb: 1 }}>
                  <Typography variant="caption" display="block" color="text.secondary">
                    Equipment: {suggestion.equipment.join(', ')}
                  </Typography>
                </Box>
              )}
              {suggestion.muscleGroups && suggestion.muscleGroups.length > 0 && (
                <Box sx={{ mb: 1 }}>
                  <Typography variant="caption" display="block" color="text.secondary">
                    Target Muscles: {suggestion.muscleGroups.join(', ')}
                  </Typography>
                </Box>
              )}
              {suggestion.benefits && suggestion.benefits.length > 0 && (
                <Box sx={{ mb: 1 }}>
                  <Typography variant="caption" display="block" color="text.secondary">
                    Benefits: {suggestion.benefits.join(', ')}
                  </Typography>
                </Box>
              )}
            </CardContent>
            <CardActions>
              <IconButton onClick={() => handleOpenDialog('workout', suggestion)}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => handleDelete('workout', suggestion._id)}>
                <DeleteIcon />
              </IconButton>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Admin Dashboard
          </Typography>
          <Button
            variant="outlined"
            color="error"
            onClick={() => {
              localStorage.removeItem('adminToken');
              localStorage.removeItem('adminUser');
              navigate('/admin/login');
            }}
          >
            Logout
          </Button>
        </Box>
      </Box>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Analytics Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
              Analytics Overview
            </Typography>
            <Grid container spacing={3}>
              {renderAggregateData()}
            </Grid>
          </Paper>
        </Grid>

        {/* Content Management Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={activeTab} onChange={handleTabChange}>
                  <Tab 
                    icon={<LightbulbIcon />} 
                    label="Health Tips" 
                    sx={{ 
                      minWidth: 150,
                      '&.Mui-selected': { color: 'primary.main' }
                    }} 
                  />
                  <Tab 
                    icon={<FitnessCenterIcon />} 
                    label="Workout Suggestions" 
                    sx={{ 
                      minWidth: 150,
                      '&.Mui-selected': { color: 'primary.main' }
                    }} 
                  />
                </Tabs>
              </Box>
              <Box>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleOpenDialog(activeTab === 0 ? 'healthTip' : 'workout')}
                  startIcon={activeTab === 0 ? <LightbulbIcon /> : <FitnessCenterIcon />}
                  sx={{ mr: 2 }}
                >
                  {activeTab === 0 ? 'Add Health Tip' : 'Add Workout Suggestion'}
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => navigate('/admin/users')}
                  startIcon={<UsersIcon />}
                >
                  Manage Users
                </Button>
              </Box>
            </Box>

            {/* Tab Content */}
            <Box sx={{ mt: 3 }}>
              {activeTab === 0 && renderHealthTips()}
              {activeTab === 1 && renderWorkoutSuggestions()}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Dialog for adding/editing items */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingItem ? `Edit ${dialogType === 'healthTip' ? 'Health Tip' : 'Workout Suggestion'}` : 
            `Add ${dialogType === 'healthTip' ? 'Health Tip' : 'Workout Suggestion'}`}
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            {/* Basic Information */}
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Basic Information
            </Typography>
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              margin="normal"
              required
              multiline
              rows={4}
            />

            {/* Workout Details */}
            {dialogType === 'workout' && (
              <>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Workout Details
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth margin="normal">
                      <InputLabel id="category-label">Category</InputLabel>
                      <Select
                        labelId="category-label"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        label="Category"
                      >
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
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth margin="normal">
                      <InputLabel id="difficulty-label">Difficulty</InputLabel>
                      <Select
                        labelId="difficulty-label"
                        name="difficulty"
                        value={formData.difficulty}
                        onChange={handleChange}
                        label="Difficulty"
                      >
                        <MenuItem value="beginner">Beginner</MenuItem>
                        <MenuItem value="intermediate">Intermediate</MenuItem>
                        <MenuItem value="advanced">Advanced</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Duration (minutes)"
                      name="duration"
                      type="number"
                      value={formData.duration}
                      onChange={handleChange}
                      margin="normal"
                      inputProps={{ min: 1 }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Calories Burn (kcal)"
                      name="caloriesBurn"
                      type="number"
                      value={formData.caloriesBurn}
                      onChange={handleChange}
                      margin="normal"
                      inputProps={{ min: 0 }}
                    />
                  </Grid>
                </Grid>

                {/* Equipment and Muscles */}
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Equipment and Target Muscles
                </Typography>
                <TextField
                  fullWidth
                  label="Equipment (comma-separated)"
                  name="equipment"
                  value={formData.equipment.join(', ')}
                  onChange={(e) => handleArrayFieldChange('equipment', e.target.value)}
                  margin="normal"
                  helperText="List all required equipment, e.g., dumbbells, resistance bands, yoga mat"
                />
                <TextField
                  fullWidth
                  label="Target Muscle Groups (comma-separated)"
                  name="muscleGroups"
                  value={formData.muscleGroups.join(', ')}
                  onChange={(e) => handleArrayFieldChange('muscleGroups', e.target.value)}
                  margin="normal"
                  helperText="e.g., chest, back, legs, core"
                />

                {/* Benefits and Precautions */}
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Benefits and Safety
                </Typography>
                <TextField
                  fullWidth
                  label="Benefits (comma-separated)"
                  name="benefits"
                  value={formData.benefits.join(', ')}
                  onChange={(e) => handleArrayFieldChange('benefits', e.target.value)}
                  margin="normal"
                  helperText="List the main benefits of this workout"
                />
                <TextField
                  fullWidth
                  label="Precautions (comma-separated)"
                  name="precautions"
                  value={formData.precautions.join(', ')}
                  onChange={(e) => handleArrayFieldChange('precautions', e.target.value)}
                  margin="normal"
                  helperText="List any safety precautions or contraindications"
                />

                {/* Media Links */}
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Media Links
                </Typography>
                <TextField
                  fullWidth
                  label="Video URL"
                  name="videoUrl"
                  value={formData.videoUrl}
                  onChange={handleChange}
                  margin="normal"
                  helperText="Link to demonstration video (optional)"
                />
                <TextField
                  fullWidth
                  label="Image URL"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  margin="normal"
                  helperText="Link to workout image (optional)"
                />
              </>
            )}

            {/* Additional Settings */}
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Additional Settings
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Tags (comma-separated)"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="target-audience-label">Target Audience</InputLabel>
                  <Select
                    labelId="target-audience-label"
                    name="targetAudience"
                    value={formData.targetAudience}
                    onChange={handleChange}
                    label="Target Audience"
                  >
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="beginner">Beginner</MenuItem>
                    <MenuItem value="intermediate">Intermediate</MenuItem>
                    <MenuItem value="advanced">Advanced</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Priority (0-10)"
                  name="priority"
                  type="number"
                  value={formData.priority}
                  onChange={handleChange}
                  margin="normal"
                  inputProps={{ min: 0, max: 10 }}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {editingItem ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminDashboard; 