import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Stack,
} from '@mui/material';
import { CheckCircle, Home, Login } from '@mui/icons-material';
import { motion } from 'framer-motion';

const MotionPaper = motion(Paper);

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear any stored authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }, []);

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <MotionPaper
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          elevation={3}
          sx={{
            p: 4,
            textAlign: 'center',
            borderRadius: 2,
          }}
        >
          <CheckCircle
            sx={{
              fontSize: 60,
              color: 'success.main',
              mb: 2,
            }}
          />
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{
              fontFamily: 'Poppins',
              fontWeight: 600,
              color: 'primary.main',
            }}
          >
            Successfully Logged Out
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 4, fontFamily: 'Poppins' }}
          >
            Thank you for using Fitness Tracker. You have been successfully logged out.
          </Typography>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            justifyContent="center"
          >
            <Button
              variant="contained"
              startIcon={<Home />}
              onClick={() => navigate('/')}
              sx={{
                fontFamily: 'Poppins',
                textTransform: 'none',
                px: 3,
              }}
            >
              Home Page
            </Button>
            <Button
              variant="outlined"
              startIcon={<Login />}
              onClick={() => navigate('/login')}
              sx={{
                fontFamily: 'Poppins',
                textTransform: 'none',
                px: 3,
              }}
            >
              Login Again
            </Button>
          </Stack>
        </MotionPaper>
      </Box>
    </Container>
  );
};

export default Logout; 