import React from 'react';
import { Box, Typography, Link, Container, Grid, IconButton, useTheme, Divider } from '@mui/material';
import {
  LinkedIn as LinkedInIcon,
  GitHub as GitHubIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Code as CodeIcon,
} from '@mui/icons-material';

const Footer = () => {
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        py: 8,
        px: 2,
        mt: 'auto',
        background: '#1a1a1a',
        color: 'white',
        position: 'relative',
        fontFamily: 'Poppins, sans-serif',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: 'linear-gradient(90deg, #00f2fe, #4facfe)',
        },
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={6}>
          {/* About Section */}
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 3 }}>
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 700,
                  mb: 2,
                  background: 'linear-gradient(90deg, #00f2fe, #4facfe)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Harshvardhan Patil
              </Typography>
              <Typography variant="body1" sx={{ color: '#a0a0a0', mb: 2 }}>
                Passionate Computer Science Engineer crafting innovative solutions and pushing the boundaries of technology.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <IconButton
                  component={Link}
                  href="https://www.linkedin.com/in/harshvardhan-patil-hp/"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: '#4facfe',
                    '&:hover': {
                      color: '#00f2fe',
                      transform: 'translateY(-3px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  <LinkedInIcon />
                </IconButton>
                <IconButton
                  component={Link}
                  href="https://github.com/Harshvardhan-Patil-264"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: '#4facfe',
                    '&:hover': {
                      color: '#00f2fe',
                      transform: 'translateY(-3px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  <GitHubIcon />
                </IconButton>
              </Box>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} md={4}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600,
                mb: 3,
                color: '#4facfe',
              }}
            >
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link 
                href="#" 
                sx={{ 
                  color: '#a0a0a0',
                  textDecoration: 'none',
                  '&:hover': {
                    color: '#4facfe',
                    transform: 'translateX(5px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                About Me
              </Link>
              <Link 
                href="#" 
                sx={{ 
                  color: '#a0a0a0',
                  textDecoration: 'none',
                  '&:hover': {
                    color: '#4facfe',
                    transform: 'translateX(5px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Projects
              </Link>
              <Link 
                href="#" 
                sx={{ 
                  color: '#a0a0a0',
                  textDecoration: 'none',
                  '&:hover': {
                    color: '#4facfe',
                    transform: 'translateX(5px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Blog
              </Link>
              <Link 
                href="#" 
                sx={{ 
                  color: '#a0a0a0',
                  textDecoration: 'none',
                  '&:hover': {
                    color: '#4facfe',
                    transform: 'translateX(5px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Contact
              </Link>
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} md={4}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600,
                mb: 3,
                color: '#4facfe',
              }}
            >
              Contact Info
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <EmailIcon sx={{ color: '#4facfe' }} />
                <Link 
                  href="mailto:harsh264patil@gmail.com"
                  sx={{ 
                    color: '#a0a0a0',
                    textDecoration: 'none',
                    '&:hover': {
                      color: '#4facfe',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  harsh264patil@gmail.com
                </Link>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <PhoneIcon sx={{ color: '#4facfe' }} />
                <Link 
                  href="tel:+919096641369"
                  sx={{ 
                    color: '#a0a0a0',
                    textDecoration: 'none',
                    '&:hover': {
                      color: '#4facfe',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  +91 9096641369
                </Link>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <LocationIcon sx={{ color: '#4facfe' }} />
                <Typography sx={{ color: '#a0a0a0' }}>
                  Maharashtra, India
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

        {/* Bottom Section */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
        }}>
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#a0a0a0',
              fontFamily: 'Poppins, sans-serif',
            }}
          >
            © {new Date().getFullYear()} Harshvardhan Patil. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CodeIcon sx={{ color: '#4facfe', fontSize: 20 }} />
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#a0a0a0',
                fontFamily: 'Poppins, sans-serif',
              }}
            >
              Crafted with passion
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 