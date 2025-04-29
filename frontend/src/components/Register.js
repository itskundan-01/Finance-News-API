import React, { useState } from "react";
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper, 
  Alert, 
  Divider, 
  Fade,
  Stack,
  InputAdornment,
  IconButton,
  Container,
  Grid,
  Link as MuiLink,
  useTheme
} from "@mui/material";
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import { Link, useNavigate } from "react-router-dom";

const API_BASE = process.env.REACT_APP_API_URL;
const API_URL = `${API_BASE}/api/v1/auth/user/register`;

export default function Register({ setUser, setIsAuth }) {
  const theme = useTheme();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Form validation
    if (!name || name.length < 2) {
      setError("Please enter your full name (at least 2 characters)");
      return;
    }
    
    if (!email || !validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    
    if (!password || password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }
    
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await fetch(`${API_BASE}/api/v1/auth/user/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, password })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message || "Registration successful! You can now access your account.");
        // Store token in localStorage - this is crucial for auth
        if (data.access_token) {
          localStorage.setItem("token", data.access_token);
        }
        localStorage.setItem("user", JSON.stringify({ email, name }));
        if (setUser) setUser({ email, name });
        if (setIsAuth) setIsAuth(true);
        setEmail("");
        setName("");
        setPassword("");
        setTimeout(() => navigate("/dashboard"), 2000);
      } else {
        setError(data.detail || data.message || "Registration failed");
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
                <VpnKeyIcon sx={{ fontSize: 32, color: 'white' }} />
              </Box>
              <Typography variant="h4" sx={{ mt: 2, fontWeight: 700 }}>Create Account</Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                Sign up to access the Finance News API
              </Typography>
            </Box>
            
            <Box component="form" onSubmit={handleRegister}>
              <Stack spacing={3} sx={{ mt: 3 }}>
                <TextField 
                  label="Full Name" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  required 
                  fullWidth
                  autoFocus
                  error={!!error && error.includes("name")}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon color="action" />
                      </InputAdornment>
                    )
                  }}
                />
                
                <TextField 
                  label="Email Address" 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  required 
                  fullWidth 
                  error={!!error && error.includes("email")}
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
                  error={!!error && error.includes("Password")}
                  helperText="Password must be at least 8 characters long"
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
              
              {error && <Alert severity="error" sx={{ mt: 3, borderRadius: 2 }}>{error}</Alert>}
              {message && !error && <Alert severity="success" sx={{ mt: 3, borderRadius: 2 }}>{message}</Alert>}
              
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                disabled={loading}
                sx={{ 
                  mt: 4,
                  py: 1.5,
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
                startIcon={<HowToRegIcon />}
              >
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
            </Box>
            
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
                    onClick={() => setError("Social registration is not available yet.")}
                  >
                    Google
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button 
                    fullWidth 
                    variant="outlined"
                    sx={{ py: 1 }}
                    onClick={() => setError("Social registration is not available yet.")}
                  >
                    GitHub
                  </Button>
                </Grid>
              </Grid>
            </Box>
            
            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Typography variant="body2">
                Already have an account?{' '}
                <MuiLink 
                  component={Link} 
                  to="/login" 
                  sx={{ 
                    fontWeight: 600, 
                    color: 'primary.main',
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' } 
                  }}
                >
                  Sign in
                </MuiLink>
              </Typography>
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
