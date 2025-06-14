import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import Layout from '../../components/Layout';
import api from '../../services/api';

function HealthTips() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [healthTips, setHealthTips] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTip, setEditingTip] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'wellness',
    tags: '',
    targetAudience: 'all',
    priority: 0,
    isActive: true,
  });

  const fetchHealthTips = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Fetching health tips...');
      const response = await api.get('/health-tips/all');
      console.log('Health tips response:', response.data);
      setHealthTips(response.data);
    } catch (error) {
      console.error('Error fetching health tips:', error);
      if (error.response?.status === 403) {
        setError('Access denied. Admin privileges required.');
        window.location.href = '/dashboard';
      } else if (error.response?.status === 401) {
        setError('Please log in to access this page.');
        window.location.href = '/login';
      } else {
        setError(error.response?.data?.message || 'Failed to fetch health tips');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealthTips();
  }, []);

  const handleOpenDialog = (tip = null) => {
    if (tip) {
      setEditingTip(tip);
      setFormData({
        title: tip.title,
        content: tip.content,
        category: tip.category,
        tags: tip.tags.join(', '),
        targetAudience: tip.targetAudience,
        priority: tip.priority,
        isActive: tip.isActive,
      });
    } else {
      setEditingTip(null);
      setFormData({
        title: '',
        content: '',
        category: 'wellness',
        tags: '',
        targetAudience: 'all',
        priority: 0,
        isActive: true,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingTip(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const tipData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      };

      if (editingTip) {
        await api.put(`/health-tips/${editingTip._id}`, tipData);
        setSuccess('Health tip updated successfully');
      } else {
        await api.post('/health-tips', tipData);
        setSuccess('Health tip created successfully');
      }

      handleCloseDialog();
      fetchHealthTips();
    } catch (error) {
      console.error('Error saving health tip:', error);
      if (error.response?.status === 403) {
        setError('Access denied. Admin privileges required.');
      } else {
        setError(error.response?.data?.message || 'Failed to save health tip');
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this health tip?')) {
      try {
        await api.delete(`/health-tips/${id}`);
        setSuccess('Health tip deleted successfully');
        fetchHealthTips();
      } catch (error) {
        console.error('Error deleting health tip:', error);
        if (error.response?.status === 403) {
          setError('Access denied. Admin privileges required.');
        } else {
          setError(error.response?.data?.message || 'Failed to delete health tip');
        }
      }
    }
  };

  const handleCloseSnackbar = () => {
    setSuccess('');
    setError('');
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

  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">Health Tips Management</Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add Health Tip
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Paper>
          <List>
            {healthTips.map((tip) => (
              <ListItem key={tip._id} divider>
                <ListItemText
                  primary={tip.title}
                  secondary={
                    <Box>
                      <Typography variant="body2" color="textSecondary" paragraph>
                        {tip.content}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Chip
                          label={tip.category}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                        {tip.tags.map((tag, index) => (
                          <Chip
                            key={index}
                            label={tag}
                            size="small"
                            variant="outlined"
                          />
                        ))}
                        <Chip
                          label={`Priority: ${tip.priority}`}
                          size="small"
                          variant="outlined"
                        />
                        <Chip
                          label={tip.isActive ? 'Active' : 'Inactive'}
                          size="small"
                          color={tip.isActive ? 'success' : 'default'}
                          variant="outlined"
                        />
                      </Box>
                    </Box>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="edit"
                    onClick={() => handleOpenDialog(tip)}
                    sx={{ mr: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDelete(tip._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Paper>

        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle>
            {editingTip ? 'Edit Health Tip' : 'Add Health Tip'}
          </DialogTitle>
          <DialogContent>
            <Box component="form" sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                margin="normal"
                required
                multiline
                rows={4}
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  label="Category"
                >
                  <MenuItem value="wellness">Wellness</MenuItem>
                  <MenuItem value="nutrition">Nutrition</MenuItem>
                  <MenuItem value="exercise">Exercise</MenuItem>
                  <MenuItem value="recovery">Recovery</MenuItem>
                  <MenuItem value="mental">Mental</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Tags (comma-separated)"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                margin="normal"
                helperText="Enter tags separated by commas"
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Target Audience</InputLabel>
                <Select
                  value={formData.targetAudience}
                  onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                  label="Target Audience"
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="beginner">Beginner</MenuItem>
                  <MenuItem value="intermediate">Intermediate</MenuItem>
                  <MenuItem value="advanced">Advanced</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Priority"
                type="number"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                margin="normal"
                inputProps={{ min: 0, max: 10 }}
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.value })}
                  label="Status"
                >
                  <MenuItem value={true}>Active</MenuItem>
                  <MenuItem value={false}>Inactive</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained" color="primary">
              {editingTip ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={!!success || !!error}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={success ? 'success' : 'error'}
            sx={{ width: '100%' }}
          >
            {success || error}
          </Alert>
        </Snackbar>
      </Box>
    </Layout>
  );
}

export default HealthTips; 