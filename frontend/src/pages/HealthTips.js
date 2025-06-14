import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import { motion } from 'framer-motion';
import axios from 'axios';

const MotionCard = motion.create(Card);

const HealthTips = () => {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHealthTips = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/health-tips');
        setTips(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch health tips. Please try again later.');
        setLoading(false);
      }
    };

    fetchHealthTips();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{
          fontFamily: 'Poppins',
          fontWeight: 600,
          mb: 4,
          color: 'primary.main',
        }}
      >
        Health Tips
      </Typography>

      <Grid container spacing={3}>
        {tips.map((tip, index) => (
          <Grid item xs={12} md={6} key={tip._id}>
            <MotionCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                },
              }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  component="h2"
                  gutterBottom
                  sx={{
                    fontFamily: 'Poppins',
                    fontWeight: 600,
                    color: 'primary.main',
                  }}
                >
                  {tip.title}
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  paragraph
                  sx={{
                    fontFamily: 'Poppins',
                    mb: 2,
                  }}
                >
                  {tip.content}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {tip.categories?.map((category) => (
                    <Chip
                      key={category}
                      label={category}
                      size="small"
                      sx={{
                        fontFamily: 'Poppins',
                        backgroundColor: 'primary.light',
                        color: 'white',
                      }}
                    />
                  ))}
                </Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    display: 'block',
                    mt: 2,
                    fontFamily: 'Poppins',
                  }}
                >
                  Posted on: {new Date(tip.createdAt).toLocaleDateString()}
                </Typography>
              </CardContent>
            </MotionCard>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default HealthTips; 