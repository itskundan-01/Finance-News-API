import React, { useState } from "react";
import { 
  Box, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  Divider, 
  Container,
  Stack,
  Paper,
  Chip,
  IconButton,
  useTheme
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import FeedIcon from '@mui/icons-material/Feed';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import CodeIcon from '@mui/icons-material/Code';
import GitHubIcon from '@mui/icons-material/GitHub';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ComingSoonDialog from './ComingSoonDialog';

const API_BASE = process.env.REACT_APP_API_URL;

export default function Landing({ isAuth, user }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const [comingSoonDialog, setComingSoonDialog] = useState({
    open: false,
    planName: ''
  });

  // Handle plan click based on authentication state
  const handlePlanClick = (planType) => {
    if (planType !== 'free') {
      setComingSoonDialog({
        open: true,
        planName: planType.charAt(0).toUpperCase() + planType.slice(1)
      });
      return;
    }
    
    if (isAuth) {
      // User is logged in, redirect to dashboard
      navigate('/dashboard');
    } else {
      // User is not logged in, redirect to register
      navigate('/register');
    }
  };
  
  // Close coming soon dialog
  const handleCloseComingSoonDialog = () => {
    setComingSoonDialog({...comingSoonDialog, open: false});
  };

  const features = [
    {
      title: "Real-time News",
      description: "Get the latest financial news updates as they happen with fast, reliable delivery.",
      icon: <FeedIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      highlight: false
    },
    {
      title: "Simple Integration",
      description: "Easy-to-use REST API with clear documentation and code examples for quick implementation.",
      icon: <CodeIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      highlight: true
    },
    {
      title: "Secure Access",
      description: "API key authentication with HTTPS encryption ensures your data remains secure.",
      icon: <SecurityIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      highlight: false
    },
    {
      title: "Flexible Pricing",
      description: "Start with our free tier and scale up as your needs grow with transparent pricing.",
      icon: <MonetizationOnIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      highlight: false
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Register",
      description: "Create a free account and get your API key instantly"
    },
    {
      number: "02",
      title: "Integrate",
      description: "Add the X-API-Key header to your requests"
    },
    {
      number: "03",
      title: "Build",
      description: "Use the finance news data in your applications"
    }
  ];

  return (
    <Box sx={{ overflow: 'hidden' }}>
      {/* Hero Section */}
      <Box 
        sx={{ 
          pt: { xs: 4, sm: 8, md: 12 }, 
          pb: { xs: 8, sm: 12 },
          position: 'relative'
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={7}>
              <Box sx={{ position: 'relative', zIndex: 2 }}>
                <Chip 
                  label="Reliable Finance News API" 
                  color="primary" 
                  sx={{ 
                    mb: 3, 
                    fontWeight: 600, 
                    fontSize: '0.85rem', 
                    py: 0.5,
                    px: 1,
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                    boxShadow: '0 4px 14px rgba(37, 99, 235, 0.2)',
                  }} 
                />

                <Typography 
                  variant="h1" 
                  sx={{ 
                    fontSize: { xs: '2.5rem', md: '3.5rem' }, 
                    mb: 2,
                    background: 'linear-gradient(to right, #2563eb, #4f46e5)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    letterSpacing: '-0.02em'
                  }}
                >
                  Financial News for Developers
                </Typography>

                <Typography 
                  variant="h5" 
                  color="text.secondary" 
                  sx={{ 
                    mb: 3,
                    lineHeight: 1.5,
                    maxWidth: '90%'
                  }}
                >
                  Fast, reliable, and developer-friendly finance news API for your apps, dashboards, and research.
                </Typography>

                <Stack 
                  direction={{ xs: 'column', sm: 'row' }} 
                  spacing={2} 
                  sx={{ mb: 4 }}
                >
                  {isAuth ? (
                    <Button 
                      variant="contained" 
                      size="large" 
                      component={Link} 
                      to="/dashboard"
                      startIcon={<DashboardIcon />}
                      endIcon={<ArrowForwardIcon />}
                      sx={{
                        px: 4,
                        py: 1.5,
                        fontSize: '1rem',
                        boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)',
                      }}
                    >
                      Go to Dashboard
                    </Button>
                  ) : (
                    <Button 
                      variant="contained" 
                      size="large" 
                      component={Link} 
                      to="/register"
                      startIcon={<VpnKeyIcon />}
                      endIcon={<ArrowForwardIcon />}
                      sx={{
                        px: 4,
                        py: 1.5,
                        fontSize: '1rem',
                        boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)',
                      }}
                    >
                      Get Free API Key
                    </Button>
                  )}
                  
                  <Button 
                    variant="outlined"
                    size="large"
                    component={Link}
                    to="/docs"
                    startIcon={<CodeIcon />}
                    sx={{
                      px: 3,
                      py: 1.5,
                      fontSize: '1rem',
                      borderWidth: 2
                    }}
                  >
                    Explore the Docs
                  </Button>
                </Stack>

                <Paper 
                  elevation={0}
                  sx={{ 
                    p: 2, 
                    borderRadius: 2,
                    background: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(226, 232, 240, 0.8)',
                    fontFamily: 'monospace',
                    display: { xs: 'none', md: 'block' },
                    maxWidth: 550,
                  }}
                >
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                    Quick Example
                  </Typography>
                  <Box sx={{ 
                    p: 2, 
                    backgroundColor: '#1e293b',
                    borderRadius: 1.5,
                    position: 'relative',
                    boxShadow: 'inset 0 0 10px rgba(0,0,0,0.2)',
                    overflowX: 'auto',
                    '&::-webkit-scrollbar': {
                      height: 6
                    },
                    '&::-webkit-scrollbar-thumb': {
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      borderRadius: 3
                    }
                  }}>
                    <Typography 
                      sx={{ 
                        color: '#e2e8f0', 
                        fontFamily: 'monospace', 
                        fontSize: '0.9rem',
                        whiteSpace: 'pre',
                      }}
                    >
                      curl -H "X-API-Key: &lt;your_api_key&gt;" \<br/>
                      &nbsp;&nbsp;"{API_BASE}/api/v1/news/latest?limit=5"
                    </Typography>
                  </Box>
                </Paper>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={5}>
              <Box sx={{ 
                position: 'relative', 
                height: { xs: 300, md: 400 },
                width: '100%',
                display: { xs: 'none', sm: 'block' }
              }}>
                <Box sx={{ 
                  position: 'absolute', 
                  top: -30,
                  right: -20,
                  width: '100%',
                  height: '100%',
                  backgroundImage: 'url(https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=600&q=80)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderRadius: 4,
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: 'linear-gradient(135deg, rgba(37,99,235,0.1) 0%, rgba(79,70,229,0.2) 100%)',
                    borderRadius: 4,
                  }
                }} />
                
                <Box sx={{ 
                  position: 'absolute',
                  bottom: -40,
                  left: -40,
                  width: '70%',
                  height: '60%',
                  borderRadius: 4,
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  boxShadow: '0 15px 30px rgba(16, 185, 129, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  p: 3,
                  color: 'white'
                }}>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                      100+ Sources
                    </Typography>
                    <Typography>
                      Aggregated financial news from trusted publications worldwide
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>

        {/* Background Decorations */}
        <Box sx={{ 
          position: 'absolute', 
          top: -100, 
          right: -100, 
          width: 300, 
          height: 300, 
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37,99,235,0.1) 0%, rgba(37,99,235,0) 70%)',
          zIndex: 0
        }} />
        
        <Box sx={{ 
          position: 'absolute', 
          bottom: -50, 
          left: -50, 
          width: 200, 
          height: 200, 
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, rgba(16,185,129,0) 70%)',
          zIndex: 0
        }} />
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 8, backgroundColor: 'rgba(248, 250, 252, 0.8)' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h6" color="primary" sx={{ mb: 1, fontWeight: 600 }}>
              POWERFUL FEATURES
            </Typography>
            <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
              Everything You Need
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
              Our API is designed to provide developers with comprehensive finance news data through an intuitive interface.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card 
                  elevation={feature.highlight ? 4 : 1} 
                  sx={{ 
                    height: '100%', 
                    transition: 'all 0.3s ease',
                    border: feature.highlight ? `2px solid ${theme.palette.primary.light}` : 'none',
                    transform: feature.highlight ? 'translateY(-8px)' : 'none',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 16px 32px rgba(0, 0, 0, 0.1)'
                    }
                  }}
                >
                  <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ mb: 2 }}>
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* How It Works Section */}
      <Box sx={{ py: 10 }}>
        <Container maxWidth="lg">
          <Grid container spacing={8} alignItems="center">
            <Grid item xs={12} md={5}>
              <Typography variant="h6" color="primary" sx={{ mb: 2, fontWeight: 600 }}>
                HOW IT WORKS
              </Typography>
              <Typography variant="h3" sx={{ mb: 3, fontWeight: 700 }}>
                Three Simple Steps
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Getting started with our Finance News API is quick and easy. Follow these steps to integrate financial news into your application.
              </Typography>

              {steps.map((step, index) => (
                <Box 
                  key={index} 
                  sx={{ 
                    display: 'flex', 
                    mb: 3,
                    p: 2,
                    borderRadius: 2,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(236, 244, 255, 0.7)',
                      transform: 'translateX(8px)'
                    }
                  }}
                >
                  <Box 
                    sx={{ 
                      minWidth: 48, 
                      height: 48, 
                      borderRadius: 2, 
                      backgroundColor: theme.palette.primary.main,
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      mr: 2,
                      fontSize: '1.1rem'
                    }}
                  >
                    {step.number}
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                      {step.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {step.description}
                    </Typography>
                  </Box>
                </Box>
              ))}

              <Box sx={{ mt: 4 }}>
                {isAuth ? (
                  <>
                    <Button 
                      variant="contained" 
                      size="large" 
                      component={Link} 
                      to="/dashboard"
                      endIcon={<ArrowForwardIcon />}
                      sx={{ mr: 2 }}
                    >
                      Go to Dashboard
                    </Button>
                    <Button 
                      variant="outlined" 
                      size="large" 
                      component={Link} 
                      to="/docs"
                    >
                      View Documentation
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      variant="contained" 
                      size="large" 
                      component={Link} 
                      to="/register"
                      endIcon={<ArrowForwardIcon />}
                      sx={{ mr: 2 }}
                    >
                      Start Now
                    </Button>
                    <Button 
                      variant="outlined" 
                      size="large" 
                      component={Link} 
                      to="/pricing"
                    >
                      View Pricing
                    </Button>
                  </>
                )}
              </Box>
            </Grid>

            <Grid item xs={12} md={7}>
              <Box sx={{ 
                position: 'relative',
                borderRadius: 4,
                overflow: 'hidden',
                height: 500,
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
              }}>
                <Box sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundImage: 'url(https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(30, 41, 59, 0.7)',
                  }
                }} />

                <Box sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '80%',
                  maxWidth: 500,
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 2,
                  p: 3,
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
                }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                    API Response Example
                  </Typography>
                  
                  <Box sx={{ 
                    p: 2, 
                    backgroundColor: '#1e293b',
                    borderRadius: 1.5,
                    mt: 1,
                    overflowX: 'auto',
                    '&::-webkit-scrollbar': {
                      height: 6
                    },
                    '&::-webkit-scrollbar-thumb': {
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      borderRadius: 3
                    }
                  }}>
                    <Typography component="pre" sx={{ 
                      color: '#e2e8f0', 
                      fontFamily: 'monospace', 
                      fontSize: '0.8rem',
                      margin: 0
                    }}>
{`{
  "count": 2,
  "data": [
    {
      "title": "Markets rally on positive economic data",
      "source": "Financial News",
      "url": "https://example.com/news/markets-rally",
      "timestamp": "10 minutes ago",
      "categories": ["market", "stocks"]
    },
    {
      "title": "Tech stocks surging in pre-market trading",
      "source": "Business Daily",
      "url": "https://example.com/news/tech-stocks",
      "timestamp": "25 minutes ago",
      "categories": ["tech", "stocks"]
    }
  ]
}`}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Pricing CTA */}
      <Box 
        sx={{ 
          py: 8, 
          textAlign: 'center',
          backgroundColor: 'rgba(236, 244, 255, 0.5)'
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h6" color="primary" sx={{ mb: 2, fontWeight: 600 }}>
            PRICING PLANS
          </Typography>
          <Typography variant="h3" sx={{ mb: 3, fontWeight: 700 }}>
            Start Free, Grow With Us
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
            Choose the perfect plan for your needs. Whether you're building a personal project or scaling a business, we have a solution for you.
          </Typography>
          
          <Grid container spacing={4} justifyContent="center">
            {[
              { 
                title: "Free", 
                price: "₹0", 
                features: ["100 requests/day", "15 requests/minute", "Basic news access"],
                primary: false
              },
              { 
                title: "Premium", 
                price: "₹499", 
                features: ["1,000 requests/day", "100 requests/minute", "All features unlocked", "Priority support"],
                primary: true
              }
            ].map((plan, index) => (
              <Grid item xs={12} sm={6} md={5} key={index}>
                <Card 
                  elevation={plan.primary ? 4 : 1}
                  sx={{
                    height: '100%',
                    position: 'relative',
                    overflow: 'visible',
                    borderRadius: 4,
                    border: plan.primary ? `2px solid ${theme.palette.primary.main}` : 'none',
                    transform: plan.primary ? 'scale(1.05)' : 'none',
                    zIndex: plan.primary ? 2 : 1,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: plan.primary ? 'scale(1.08)' : 'scale(1.03)',
                      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
                    }
                  }}
                >
                  {plan.primary && (
                    <Chip
                      label="POPULAR"
                      color="primary"
                      sx={{
                        position: 'absolute',
                        top: -12,
                        right: 24,
                        fontWeight: 600
                      }}
                    />
                  )}
                  <CardContent sx={{ p: 4 }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                      {plan.title}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 3 }}>
                      <Typography variant="h3" sx={{ fontWeight: 800 }}>
                        {plan.price}
                      </Typography>
                      {plan.price !== "₹0" && (
                        <Typography variant="subtitle1" color="text.secondary" sx={{ ml: 1 }}>
                          /month
                        </Typography>
                      )}
                    </Box>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Box sx={{ mb: 3, minHeight: 120 }}>
                      {plan.features.map((feature, idx) => (
                        <Typography 
                          key={idx} 
                          variant="body1" 
                          sx={{ 
                            py: 0.7,
                            display: 'flex',
                            alignItems: 'center',
                            '&:before': {
                              content: '"✓"',
                              color: theme.palette.success.main,
                              fontWeight: 'bold',
                              marginRight: 1
                            }
                          }}
                        >
                          {feature}
                        </Typography>
                      ))}
                    </Box>
                    
                    <Button 
                      variant={plan.primary ? "contained" : "outlined"}
                      fullWidth
                      size="large"
                      onClick={() => handlePlanClick(plan.primary ? "premium" : "free")}
                      sx={{ fontWeight: 600, py: 1.5 }}
                    >
                      {plan.primary ? "Start Premium" : "Start Free"}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          
          <Box sx={{ mt: 6 }}>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              Need a custom plan for enterprise usage?
            </Typography>
            <Button 
              variant="text" 
              color="primary" 
              size="large"
              component={Link}
              to="/contact"
              sx={{ mt: 1, fontWeight: 600 }}
            >
              Contact Sales
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Footer CTA */}
      <Box sx={{ 
        py: 10, 
        textAlign: 'center',
        background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)',
        color: 'white'
      }}>
        <Container maxWidth="md">
          <Typography variant="h3" sx={{ mb: 3, fontWeight: 700 }}>
            Ready to Get Started?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, fontWeight: 400, opacity: 0.9 }}>
            {isAuth ? 'Explore our Finance News API documentation' : 'Join thousands of developers using our Finance News API'}
          </Typography>
          
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            {isAuth ? (
              <Button 
                variant="contained" 
                size="large"
                component={Link}
                to="/dashboard"
                sx={{ 
                  px: 4, 
                  py: 1.5,
                  bgcolor: 'white',
                  color: theme.palette.primary.main,
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.9)'
                  }
                }}
              >
                Go to Dashboard
              </Button>
            ) : (
              <Button 
                variant="contained" 
                size="large"
                component={Link}
                to="/register"
                sx={{ 
                  px: 4, 
                  py: 1.5,
                  bgcolor: 'white',
                  color: theme.palette.primary.main,
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.9)'
                  }
                }}
              >
                Sign Up Free
              </Button>
            )}
            <Button 
              variant="outlined" 
              size="large"
              component={Link}
              to="/docs"
              sx={{ 
                px: 4, 
                py: 1.5,
                borderColor: 'white',
                color: 'white',
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              View Documentation
            </Button>
          </Stack>
          
          <Box sx={{ mt: 8, opacity: 0.8, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ mr: 1 }}>
              Follow us:
            </Typography>
            <IconButton color="inherit" size="small">
              <GitHubIcon fontSize="small" />
            </IconButton>
          </Box>
        </Container>
      </Box>

      {/* Coming Soon Dialog */}
      <ComingSoonDialog 
        open={comingSoonDialog.open} 
        planName={comingSoonDialog.planName} 
        onClose={handleCloseComingSoonDialog} 
      />
    </Box>
  );
}






