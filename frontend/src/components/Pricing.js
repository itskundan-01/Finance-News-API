import React, { useState, useContext } from "react";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Divider,
  Switch,
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Fade,
  Chip,
  Stack,
  useTheme
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Link, useNavigate } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import SupportIcon from '@mui/icons-material/Support';
import BusinessIcon from '@mui/icons-material/Business';
import ChatIcon from '@mui/icons-material/Chat';
import SpeedIcon from '@mui/icons-material/Speed';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import { ThemeContext } from '../context/ThemeContext';
import ComingSoonDialog from './ComingSoonDialog';

export default function Pricing() {
  const [annual, setAnnual] = useState(false);
  const theme = useTheme();
  const { mode } = useContext(ThemeContext);
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem("token");
  const [comingSoonDialog, setComingSoonDialog] = useState({
    open: false,
    planName: ''
  });
  
  // Handle subscription/upgrade action based on authentication state
  const handleSubscriptionAction = (planType) => {
    if (planType !== 'free') {
      setComingSoonDialog({
        open: true,
        planName: planType.charAt(0).toUpperCase() + planType.slice(1)
      });
      return;
    }
    
    if (isAuthenticated) {
      // User is logged in, redirect to dashboard with plan parameter
      navigate(`/dashboard?plan=${planType}`);
    } else {
      // User is not logged in, redirect to register
      navigate('/register');
    }
  };
  
  // Close coming soon dialog
  const handleCloseComingSoonDialog = () => {
    setComingSoonDialog({...comingSoonDialog, open: false});
  };

  const plans = [
    {
      name: "Free",
      description: "Perfect for testing our API and small projects",
      price: "₹0",
      perUnit: "",
      features: [
        "100 requests/day",
        "15 requests/minute",
        "Basic news access",
        "Public documentation",
        "Community support"
      ],
      rateLimit: {
        perMinute: 15,
        perDay: 100
      },
      cta: "Get Started",
      color: theme.palette.primary.main,
      highlighted: false,
      popular: false
    },
    {
      name: "Basic",
      description: "Ideal for startups and small apps",
      price: annual ? "₹1,249" : "₹149",
      perUnit: annual ? "/year" : "/month",
      features: [
        "300 requests/day",
        "40 requests/minute",
        "Comprehensive news access",
        "Email support",
        "No credit card required"
      ],
      rateLimit: {
        perMinute: 40,
        perDay: 300
      },
      cta: "Start Basic Plan",
      color: theme.palette.secondary.main,
      highlighted: true,
      popular: true
    },
    {
      name: "Premium",
      description: "Advanced solutions for businesses",
      price: annual ? "₹4,190" : "₹499",
      perUnit: annual ? "/year" : "/month",
      features: [
        "1,000 requests/day",
        "100 requests/minute",
        "Full data access",
        "Priority support",
        "Custom integrations",
        "Dedicated account manager"
      ],
      rateLimit: {
        perMinute: 100,
        perDay: 1000
      },
      cta: "Contact Sales",
      color: theme.palette.warning.main,
      highlighted: false,
      popular: false
    }
  ];

  const freePlanFeatures = [
    "Basic news data",
    "Up to 100 daily requests",
    "15 requests per minute",
    "Standard API access",
    "Community support"
  ];

  const paidPlanFeatures = [
    "Advanced financial data",
    "Higher request limits",
    "Priority API access",
    "Advanced filtering options",
    "Real-time updates",
    "Email support"
  ];

  return (
    <Fade in={true} timeout={800}>
      <Box sx={{ py: 5, px: { xs: 2, md: 0 } }}>
        <Container maxWidth="lg">
          {/* Pricing Header */}
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Chip 
              label="Simple Pricing" 
              color="primary" 
              sx={{ 
                mb: 2, 
                fontWeight: 600, 
                fontSize: '0.85rem', 
                py: 0.5, 
                px: 1.5,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.2)',
              }} 
            />
            
            <Typography 
              variant="h2" 
              component="h1" 
              sx={{ 
                fontWeight: 800, 
                mb: 2,
                fontSize: { xs: '2.5rem', md: '3.5rem' }
              }}
            >
              Choose Your Plan
            </Typography>
            <Typography 
              variant="h6" 
              color="text.secondary" 
              sx={{ 
                maxWidth: 650, 
                mx: 'auto', 
                lineHeight: 1.6, 
                fontWeight: 400
              }}
            >
              Get access to our powerful financial news API with flexible plans that grow with your needs.
              Start free, upgrade when you're ready.
            </Typography>
            
            {/* Billing Toggle */}
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                mt: 4
              }}
            >
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  fontWeight: !annual ? 600 : 400,
                  color: !annual ? 'text.primary' : 'text.secondary'
                }}
              >
                Monthly Billing
              </Typography>
              
              <Switch
                checked={annual}
                onChange={() => setAnnual(!annual)}
                color="primary"
                sx={{ mx: 1 }}
              />
              
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    fontWeight: annual ? 600 : 400,
                    color: annual ? 'text.primary' : 'text.secondary'
                  }}
                >
                  Annual Billing
                </Typography>
                
                <Chip
                  label="Save 30%"
                  size="small"
                  color="success"
                  sx={{ ml: 1, fontWeight: 600, fontSize: '0.7rem' }}
                />
              </Box>
            </Box>
          </Box>

          {/* Pricing Cards */}
          <Grid container spacing={3} justifyContent="center">
            {plans.map((plan, index) => (
              <Grid 
                item 
                xs={12} 
                md={4} 
                key={index} 
                sx={{
                  transform: plan.highlighted ? { md: 'scale(1.05)' } : 'none',
                  zIndex: plan.highlighted ? 2 : 1
                }}
              >
                <Card
                  elevation={plan.highlighted ? 8 : 2}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    overflow: 'visible',
                    borderRadius: 4,
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    border: plan.highlighted ? `2px solid ${plan.color}` : 'none',
                    bgcolor: mode === 'dark' ? 'background.paper' : '#fff',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: `0 20px 30px rgba(0, 0, 0, ${mode === 'dark' ? '0.3' : '0.1'})`
                    }
                  }}
                >
                  {plan.popular && (
                    <Chip
                      label="MOST POPULAR"
                      color="primary"
                      sx={{
                        position: 'absolute',
                        top: -12,
                        right: 24,
                        fontWeight: 600
                      }}
                    />
                  )}
                  
                  <CardHeader
                    title={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box
                          sx={{
                            width: 34,
                            height: 34,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: `${plan.color}${mode === 'dark' ? '30' : '20'}`,
                            color: plan.color,
                            mr: 1.5
                          }}
                        >
                          {index === 0 && <FlashOnIcon />}
                          {index === 1 && <TrendingUpIcon />}
                          {index === 2 && <BusinessIcon />}
                        </Box>
                        <Typography variant="h5" component="h2" fontWeight="700">
                          {plan.name}
                        </Typography>
                      </Box>
                    }
                    sx={{
                      pb: 0,
                      '& .MuiCardHeader-content': { width: '100%' }
                    }}
                  />
                  
                  <CardContent sx={{ pt: 1, pb: 0, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      {plan.description}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 3 }}>
                      <Typography 
                        variant="h3" 
                        component="span"
                        sx={{ 
                          fontWeight: 800, 
                          color: plan.highlighted ? plan.color : 'text.primary'
                        }}
                      >
                        {plan.price}
                      </Typography>
                      <Typography 
                        variant="subtitle1"
                        component="span"
                        color="text.secondary"
                        sx={{ ml: 0.5, fontWeight: 500 }}
                      >
                        {plan.perUnit}
                      </Typography>
                    </Box>
                    
                    <Box 
                      sx={{ 
                        mb: 2,
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: `${plan.color}${mode === 'dark' ? '15' : '10'}`,
                        border: `1px dashed ${plan.color}${mode === 'dark' ? '40' : '30'}`,
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <SpeedIcon 
                        sx={{ 
                          color: plan.color,
                          mr: 1,
                          fontSize: '1.2rem'
                        }} 
                      />
                      <Box>
                        <Typography 
                          variant="caption"
                          sx={{ 
                            fontWeight: 600,
                            color: plan.color,
                            display: 'block'
                          }}
                        >
                          RATE LIMITS
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ 
                            fontWeight: 500,
                            color: 'text.primary',
                          }}
                        >
                          {plan.rateLimit.perMinute} req/min • {plan.rateLimit.perDay.toLocaleString()} req/day
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Box sx={{ mb: 3, flexGrow: 1 }}>
                      <List dense disablePadding>
                        {plan.features.map((feature, idx) => (
                          <ListItem key={idx} sx={{ py: 0.8, px: 0 }}>
                            <ListItemIcon sx={{ minWidth: 36 }}>
                              <CheckCircleIcon 
                                fontSize="small" 
                                sx={{ 
                                  color: plan.highlighted ? plan.color : theme.palette.success.main 
                                }} 
                              />
                            </ListItemIcon>
                            <ListItemText 
                              primary={feature} 
                              primaryTypographyProps={{ 
                                variant: 'body2', 
                                fontWeight: 500,
                                color: 'text.primary'
                              }} 
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                    
                    <Button
                      variant={plan.highlighted ? "contained" : "outlined"}
                      fullWidth
                      size="large"
                      onClick={() => handleSubscriptionAction(plan.name.toLowerCase())}
                      sx={{
                        fontWeight: 600,
                        py: 1.5,
                        borderRadius: 2,
                        backgroundColor: plan.highlighted ? plan.color : undefined,
                        borderColor: plan.highlighted ? undefined : plan.color,
                        color: plan.highlighted ? (mode === 'dark' ? '#121212' : '#fff') : plan.color,
                        '&:hover': {
                          backgroundColor: plan.highlighted ? plan.color : `${plan.color}${mode === 'dark' ? '30' : '20'}`,
                          borderColor: plan.highlighted ? undefined : plan.color,
                          boxShadow: plan.highlighted ? '0 8px 16px rgba(0, 0, 0, 0.1)' : 'none'
                        }
                      }}
                    >
                      {plan.cta}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          
          {/* Feature Comparison Section */}
          <Box sx={{ mt: 12 }}>
            <Typography variant="h4" gutterBottom fontWeight="700" textAlign="center">
              Compare Plans
            </Typography>
            <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ mb: 6, maxWidth: 700, mx: 'auto' }}>
              Find the perfect plan for your needs. All plans include access to our Finance News API with different limits and features.
            </Typography>
            
            <Grid container spacing={4}>
              <Grid item xs={12} md={5}>
                <Card 
                  elevation={2}
                  sx={{ 
                    borderRadius: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    bgcolor: mode === 'dark' ? 'background.paper' : '#fff',
                  }}
                >
                  <Box sx={{ 
                    bgcolor: 'primary.main', 
                    color: 'white',
                    py: 3,
                    px: 3,
                    borderRadius: '12px 12px 0 0',
                    background: 'linear-gradient(45deg, #2563eb, #4f46e5)',
                  }}>
                    <Typography variant="h5" fontWeight="700">
                      Free Plan
                    </Typography>
                    <Typography variant="subtitle1" sx={{ opacity: 0.9, color: '#fff' }}>
                      For personal projects and testing
                    </Typography>
                  </Box>
                  
                  <CardContent sx={{ p: 3, flexGrow: 1 }}>
                    <Typography variant="h4" sx={{ fontWeight: 800 }}>
                      ₹0
                    </Typography>
                    <Typography color="text.secondary" gutterBottom>
                      Free forever
                    </Typography>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <List>
                      {freePlanFeatures.map((feature, idx) => (
                        <ListItem key={idx} sx={{ px: 0 }}>
                          <ListItemIcon>
                            <CheckCircleIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText 
                            primary={feature} 
                            primaryTypographyProps={{ color: 'text.primary' }}
                          />
                        </ListItem>
                      ))}
                    </List>
                    
                    <Button
                      variant="outlined"
                      color="primary"
                      size="large"
                      fullWidth
                      onClick={() => handleSubscriptionAction('free')}
                      sx={{ mt: 2, py: 1.5, fontWeight: 600 }}
                    >
                      Get Started Free
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={7}>
                <Card 
                  elevation={2}
                  sx={{ 
                    borderRadius: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderLeft: { md: `5px solid ${theme.palette.secondary.main}` },
                    bgcolor: mode === 'dark' ? 'background.paper' : '#fff',
                  }}
                >
                  <Box sx={{ 
                    bgcolor: mode === 'dark' ? 'background.paper' : '#f7f9fc', 
                    py: 3,
                    px: 3,
                    borderRadius: '12px 12px 0 0',
                    borderBottom: `1px solid ${theme.palette.divider}`
                  }}>
                    <Typography variant="h5" fontWeight="700" color="secondary">
                      Paid Plans
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                      For businesses and production use
                    </Typography>
                  </Box>
                  
                  <CardContent sx={{ p: 3, flexGrow: 1 }}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item>
                        <Typography variant="h4" sx={{ fontWeight: 800 }}>
                          Starting at ₹149
                        </Typography>
                        <Typography color="text.secondary" gutterBottom>
                          per month
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Chip
                          label="30% OFF Annual Billing"
                          color="success"
                          variant="outlined"
                          size="small"
                          sx={{ fontWeight: 500 }}
                        />
                      </Grid>
                    </Grid>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Grid container spacing={2}>
                      {paidPlanFeatures.map((feature, idx) => (
                        <Grid item xs={12} sm={6} key={idx}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <CheckCircleIcon color="secondary" sx={{ mr: 1 }} fontSize="small" />
                            <Typography variant="body2" color="text.primary">{feature}</Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                    
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 3 }}>
                      <Button
                        variant="contained"
                        color="secondary"
                        size="large"
                        onClick={() => handleSubscriptionAction('basic')}
                        sx={{ py: 1.5, fontWeight: 600, flex: 1 }}
                      >
                        Start Basic Plan - ₹149/mo
                      </Button>
                      <Button
                        variant="outlined"
                        size="large"
                        sx={{ py: 1.5, fontWeight: 600, flex: 1 }}
                        startIcon={<SupportIcon />}
                        onClick={() => handleSubscriptionAction('premium')}
                      >
                        Contact Sales
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
          
          {/* API Keys Section */}
          <Box sx={{ mt: 12 }}>
            <Typography variant="h4" gutterBottom fontWeight="700" textAlign="center">
              Your API Keys
            </Typography>
            <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ mb: 6 }}>
              Our API rate limits are clearly displayed for each plan
            </Typography>
            
            <Card 
              elevation={3}
              sx={{ 
                borderRadius: 3,
                p: 4,
                bgcolor: mode === 'dark' ? 'background.paper' : '#fff',
                border: `1px solid ${theme.palette.divider}`
              }}
            >
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <SpeedIcon color="primary" sx={{ mr: 1.5 }} />
                      <Typography variant="h6" fontWeight="700" gutterBottom color="primary">
                        Rate Limits by Plan
                      </Typography>
                    </Box>
                    
                    {plans.map((plan, idx) => (
                      <Box 
                        key={idx} 
                        sx={{ 
                          mb: 2, 
                          p: 2, 
                          borderRadius: 2, 
                          bgcolor: `${plan.color}${mode === 'dark' ? '15' : '10'}`,
                          border: `1px solid ${plan.color}${mode === 'dark' ? '30' : '20'}`
                        }}
                      >
                        <Typography variant="subtitle2" fontWeight="600" sx={{ color: plan.color, mb: 1 }}>
                          {plan.name} Plan
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                          <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'success.main', mr: 1.5 }}></Box>
                          <Typography variant="body2" color="text.primary" fontWeight="500">
                            <strong>{plan.rateLimit.perMinute}</strong> requests per minute
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'info.main', mr: 1.5 }}></Box>
                          <Typography variant="body2" color="text.primary" fontWeight="500">
                            <strong>{plan.rateLimit.perDay.toLocaleString()}</strong> requests per day
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Box sx={{ 
                    p: 3, 
                    bgcolor: mode === 'dark' ? alpha(theme.palette.primary.main, 0.15) : '#f0f7ff',
                    borderRadius: 2,
                    border: `1px solid ${mode === 'dark' ? alpha(theme.palette.primary.main, 0.3) : theme.palette.primary.light}`
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <VpnKeyIcon color="primary" sx={{ mr: 1.5 }} />
                      <Typography variant="h6" fontWeight="600" gutterBottom color="primary">
                        API Key Example
                      </Typography>
                    </Box>
                    
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        p: 1.5, 
                        bgcolor: mode === 'dark' ? 'rgba(0, 0, 0, 0.3)' : '#fff', 
                        borderRadius: 1,
                        fontFamily: 'monospace',
                        fontSize: '1rem',
                        letterSpacing: '0.5px',
                        color: theme.palette.primary.main,
                        fontWeight: 600,
                        border: `1px solid ${theme.palette.divider}`,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                      }}
                    >
                      nnf_G8cK9p7K3A4rZqQnF3M5lE2tP0vB9xD1jH6sO8yW
                    </Typography>
                    
                    <Box sx={{ mt: 2, p: 1.5, bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#f9f9f9', borderRadius: 1 }}>
                      <Typography variant="subtitle2" fontWeight="600" color="text.primary" sx={{ mb: 1 }}>
                        How to use your API key:
                      </Typography>
                      <Typography variant="body2" color="text.primary" sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                        GET /api/news?apiKey=YOUR_API_KEY
                      </Typography>
                      <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1.5, fontWeight: 500 }}>
                        Keep your API key secure. Never share it publicly or commit it to version control.
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Card>
          </Box>
          
          {/* FAQ Section */}
          <Box sx={{ mt: 12 }}>
            <Typography variant="h4" gutterBottom fontWeight="700" textAlign="center">
              Frequently Asked Questions
            </Typography>
            <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ mb: 6 }}>
              Find answers to common questions about our pricing and plans.
            </Typography>
            
            <Grid container spacing={3}>
              {[
                {
                  question: "Can I switch between plans?",
                  answer: "Yes, you can upgrade, downgrade, or cancel your subscription at any time. Changes will be applied at the start of your next billing cycle."
                },
                {
                  question: "Is there a trial period?",
                  answer: "We offer a forever-free plan that allows you to test our API with basic functionality and limited requests. No credit card required."
                },
                {
                  question: "What payment methods do you accept?",
                  answer: "We accept all major credit cards, including Visa, Mastercard, and American Express. We also support PayPal for annual subscriptions."
                },
                {
                  question: "What happens if I exceed my request limit?",
                  answer: "If you exceed your plan's request limits, additional requests will be rejected. You can upgrade your plan at any time to increase your limits."
                },
                {
                  question: "Do you offer refunds?",
                  answer: "We offer a 7-day money-back guarantee for all paid plans. If you're not satisfied, contact our support team within 7 days of your purchase."
                },
                {
                  question: "Do you offer custom enterprise plans?",
                  answer: "Yes, we offer custom solutions for enterprise clients with specific needs. Contact our sales team to discuss your requirements."
                }
              ].map((item, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Card sx={{ 
                    height: '100%',
                    boxShadow: 'none',
                    bgcolor: mode === 'dark' ? 'background.paper' : '#fff',
                    border: `1px solid ${theme.palette.divider}`,
                    '&:hover': {
                      borderColor: theme.palette.primary.main,
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
                    }
                  }}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" fontWeight="600" gutterBottom color="text.primary">
                        {item.question}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.answer}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
          
          {/* CTA Section */}
          <Box 
            sx={{ 
              mt: 12, 
              p: 5, 
              borderRadius: 4,
              backgroundImage: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)',
              color: 'white',
              textAlign: 'center'
            }}
          >
            <Typography variant="h4" fontWeight="700" gutterBottom>
              Ready to Get Started?
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, fontWeight: 400, opacity: 0.9, maxWidth: 700, mx: 'auto' }}>
              Join thousands of developers using our Finance News API today.
              Start with our free plan and upgrade when you need more.
            </Typography>
            
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={2} 
              sx={{ maxWidth: 500, mx: 'auto' }}
              justifyContent="center"
            >
              <Button 
                variant="contained" 
                size="large"
                onClick={() => handleSubscriptionAction('free')}
                sx={{ 
                  py: 1.5, 
                  px: 4,
                  fontWeight: 600,
                  bgcolor: 'white',
                  color: 'primary.main',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.9)',
                  }
                }}
              >
                Sign Up Free
              </Button>
              <Button 
                variant="outlined" 
                size="large"
                component={Link}
                to="/docs"
                sx={{ 
                  py: 1.5,
                  px: 4,
                  fontWeight: 600,
                  borderColor: 'white',
                  color: 'white',
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
                startIcon={<ChatIcon />}
              >
                Chat with Sales
              </Button>
            </Stack>
          </Box>
        </Container>
        <ComingSoonDialog 
          open={comingSoonDialog.open} 
          planName={comingSoonDialog.planName} 
          onClose={handleCloseComingSoonDialog} 
        />
      </Box>
    </Fade>
  );
}
