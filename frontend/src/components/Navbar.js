import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { FitnessCenter, Home } from '@mui/icons-material';

const Navbar = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <AppBar
      position="static"
      color="transparent"
      elevation={0}
      sx={{
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Toolbar>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
          }}
          onClick={() => navigate('/')}
        >
          <FitnessCenter
            sx={{
              color: 'primary.main',
              mr: 1,
              fontSize: isMobile ? '1.5rem' : '2rem',
            }}
          />
          <Typography
            variant={isMobile ? 'h6' : 'h5'}
            component="div"
            sx={{
              fontFamily: 'Poppins',
              fontWeight: 600,
              color: 'primary.main',
            }}
          >
            Fitness Tracker
          </Typography>
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        <Button
          variant="outlined"
          startIcon={<Home />}
          onClick={() => navigate('/')}
          sx={{
            fontFamily: 'Poppins',
            textTransform: 'none',
            borderRadius: '20px',
            px: 2,
            '&:hover': {
              backgroundColor: 'primary.light',
              color: 'white',
            },
          }}
        >
          Home
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 