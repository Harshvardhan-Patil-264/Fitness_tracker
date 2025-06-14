import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Workouts from './pages/Workouts';
import Goals from './pages/Goals';
import Analytics from './pages/Analytics';
import AdminDashboard from './pages/AdminDashboard';
import HealthTips from './pages/admin/HealthTips';
import PrivateRoute from './components/PrivateRoute';
import UserManagement from './pages/admin/UserManagement';
import AdminLogin from './pages/admin/Login';
import WorkoutSuggestions from './pages/WorkoutSuggestions';
import HomePage from './pages/HomePage';
import Logout from './pages/Logout';

// Theme configuration
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontFamily: '"Poppins", sans-serif',
    },
    h2: {
      fontWeight: 600,
      fontFamily: '"Poppins", sans-serif',
    },
    h3: {
      fontWeight: 600,
      fontFamily: '"Poppins", sans-serif',
    },
    h4: {
      fontWeight: 600,
      fontFamily: '"Poppins", sans-serif',
    },
    h5: {
      fontWeight: 500,
      fontFamily: '"Poppins", sans-serif',
    },
    h6: {
      fontWeight: 500,
      fontFamily: '"Poppins", sans-serif',
    },
    subtitle1: {
      fontWeight: 400,
      fontFamily: '"Poppins", sans-serif',
    },
    subtitle2: {
      fontWeight: 400,
      fontFamily: '"Poppins", sans-serif',
    },
    body1: {
      fontWeight: 400,
      fontFamily: '"Poppins", sans-serif',
    },
    body2: {
      fontWeight: 400,
      fontFamily: '"Poppins", sans-serif',
    },
    button: {
      fontWeight: 500,
      fontFamily: '"Poppins", sans-serif',
      textTransform: 'none',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          fontFamily: '"Poppins", sans-serif',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: '"Poppins", sans-serif',
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontFamily: '"Poppins", sans-serif',
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          fontFamily: '"Poppins", sans-serif',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontFamily: '"Poppins", sans-serif',
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          fontFamily: '"Poppins", sans-serif',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/workouts" element={<PrivateRoute><Workouts /></PrivateRoute>} />
          <Route path="/goals" element={<PrivateRoute><Goals /></PrivateRoute>} />
          <Route path="/analytics" element={<PrivateRoute><Analytics /></PrivateRoute>} />
          <Route path="/health-tips" element={<PrivateRoute><HealthTips /></PrivateRoute>} />
          <Route path="/workout-suggestions" element={
            <PrivateRoute>
              <WorkoutSuggestions />
            </PrivateRoute>
          } />
          <Route path="/admin" element={<PrivateRoute role="admin" />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="health-tips" element={<HealthTips />} />
          </Route>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route 
            path="/admin/dashboard" 
            element={
              <PrivateRoute adminOnly>
                <AdminDashboard />
              </PrivateRoute>
            } 
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;