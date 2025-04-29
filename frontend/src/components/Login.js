import React, { useState } from "react";
import { 
  Paper, 
  Typography, 
  Box, 
  TextField, 
  Button, 
  Divider, 
  Alert, 
  Fade,
  Stack,
  InputAdornment,
  IconButton,
  Container,
  Grid,
  Link as MuiLink,
  useTheme
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import LockIcon from '@mui/icons-material/Lock';
import LoginIcon from '@mui/icons-material/Login';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import EmailIcon from '@mui/icons-material/Email';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const API_BASE = process.env.REACT_APP_API_URL;
const API_URL = `${API_BASE}/api/v1/auth/user/login`;

export default function Login({ setUser, setIsAuth }) {
  const theme = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok && data.access_token) {
        localStorage.setItem("token", data.access_token);
        
        // Get user data including name from the server
        try {
          const userRes = await fetch(`${API_BASE}/api/v1/auth/user/me`, {
            headers: { 
              Authorization: `Bearer ${data.access_token}` 
            }
          });
          const userData = await userRes.json();
          
          if (userRes.ok && userData) {
            // Store complete user data including name
            localStorage.setItem("user", JSON.stringify({ 
              email: userData.email,
              name: userData.name 
            }));
            if (setUser) setUser({ 
              email: userData.email,
              name: userData.name 
            });
          } else {
            // Fallback to just email if user data fetch fails
            localStorage.setItem("user", JSON.stringify({ email }));
            if (setUser) setUser({ email });
          }
        } catch (err) {
          // Fallback to just email if user data fetch fails
          localStorage.setItem("user", JSON.stringify({ email }));
          if (setUser) setUser({ email });
        }
        
        if (setIsAuth) setIsAuth(true);
        setSuccess("Login successful! Redirecting...");
        setEmail("");
        setPassword("");
        setTimeout(() => window.location.href = "/dashboard", 1200);
      } else {
        setError(data.detail || "Login failed");
      }
    } catch (err) {
      setError("Network error. Please try again later.");
    }
    setLoading(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center', 
      background: theme.palette.mode === 'dark' 
        ? 'linear-gradient(135deg, #1a1a2e 0%, #121212 100%)' 
        : 'linear-gradient(135deg, #e3f2fd 0%, #fff 100%)' 
    }}>
      <Container maxWidth="sm">
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
          <Button 
            startIcon={<ArrowBackIcon />} 
            component={Link} 
            to="/"
            sx={{ 
              color: theme.palette.mode === 'dark' ? 'primary.light' : 'primary.dark',
              '&:hover': { bgcolor: 'rgba(30, 144, 255, 0.08)' } 
            }}
          >
            Back to Home
          </Button>
        </Box>
        
        <Fade in={true} timeout={700}>
          <Paper 
            elevation={4} 
            sx={{ 
              p: { xs: 3, sm: 4 }, 
              width: '100%', 
              mx: "auto",
              borderRadius: 2,
              boxShadow: theme.palette.mode === 'dark'
                ? '0 8px 32px rgba(0, 0, 0, 0.5)'
                : '0 8px 32px rgba(30, 144, 255, 0.15)'
            }}
          >
            <Box sx={{ textAlign: "center", mb: 3 }}>
              <Box sx={{ 
                width: 60, 
                height: 60, 
                bgcolor: theme.palette.primary.main, 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                margin: '0 auto',
                boxShadow: '0 4px 12px rgba(30, 144, 255, 0.25)'
              }}>
                <LockIcon sx={{ fontSize: 32, color: 'white' }} />
              </Box>
              <Typography variant="h4" sx={{ mt: 2, fontWeight: 700 }}>Welcome Back</Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                Sign in to access your account
              </Typography>
            </Box>
            
            <Divider sx={{ mb: 3 }} />
            
            <Box component="form" onSubmit={handleLogin} sx={{ mt: 2 }}>
              <Stack spacing={3}>
                <TextField 
                  label="Email Address" 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  required 
                  fullWidth 
                  autoFocus 
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon color="action" />
                      </InputAdornment>
                    )
                  }}
                />
                
                <TextField 
                  label="Password" 
                  type={showPassword ? "text" : "password"} 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  required 
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton 
                          aria-label="toggle password visibility" 
                          onClick={togglePasswordVisibility}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Stack>
              
              <Box sx={{ textAlign: 'right', mt: 1 }}>
                <MuiLink component={Link} to="/forgot-password" variant="body2" underline="hover">
                  Forgot password?
                </MuiLink>
              </Box>
              
              <Button 
                type="submit" 
                variant="contained" 
                fullWidth 
                disabled={loading || !email || !password} 
                size="large" 
                sx={{ 
                  mt: 3,
                  py: 1.5,
                  fontWeight: 600,
                  position: 'relative',
                  overflow: 'hidden',
                  '&:after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.3), transparent)',
                    transform: 'translateX(-100%)',
                    animation: loading ? 'shimmer 2s infinite' : 'none',
                  },
                  '@keyframes shimmer': {
                    '100%': {
                      transform: 'translateX(100%)',
                    },
                  },
                }}
                startIcon={<LoginIcon />}
              >
                {loading ? "Signing in..." : "Sign in"}
              </Button>
              
              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Typography variant="body2">
                  Don't have an account?{' '}
                  <MuiLink 
                    component={Link} 
                    to="/register" 
                    sx={{ 
                      fontWeight: 600, 
                      color: 'primary.main',
                      textDecoration: 'none',
                      '&:hover': { textDecoration: 'underline' } 
                    }}
                  >
                    Sign up
                  </MuiLink>
                </Typography>
              </Box>
            </Box>
            
            {error && <Alert severity="error" sx={{ mt: 3, borderRadius: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mt: 3, borderRadius: 2 }}>{success}</Alert>}

            <Box sx={{ mt: 4 }}>
              <Divider sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Or continue with
                </Typography>
              </Divider>
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Button 
                    fullWidth 
                    variant="outlined" 
                    sx={{ py: 1 }}
                    onClick={() => setError("Social login is not available yet.")}
                  >
                    Google
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button 
                    fullWidth 
                    variant="outlined" 
                    sx={{ py: 1 }}
                    onClick={() => setError("Social login is not available yet.")}
                  >
                    GitHub
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Fade>
        
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            &copy; {new Date().getFullYear()} News Fetch API. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
