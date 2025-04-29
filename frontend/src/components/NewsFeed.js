import React, { useState, useEffect } from "react";
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  List, 
  ListItem, 
  Alert, 
  Divider, 
  Card, 
  CardContent, 
  CardHeader,
  Grid,
  InputAdornment,
  Skeleton,
  Chip,
  Link as MuiLink,
  IconButton,
  Snackbar,
  Container,
  Fade,
  Tooltip,
  useTheme
} from "@mui/material";
import FeedIcon from '@mui/icons-material/Feed';
import SearchIcon from '@mui/icons-material/Search';
import KeyIcon from '@mui/icons-material/Key';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import EastIcon from '@mui/icons-material/East';
import { Link } from "react-router-dom";

const API_BASE = process.env.REACT_APP_API_URL;
const API_URL = `${API_BASE}/api/v1/news/latest?limit=10`;

export default function NewsFeed() {
  const theme = useTheme();
  const [apiKey, setApiKey] = useState("");
  const [news, setNews] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    const fetchUserKey = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      
      try {
        const res = await fetch(`${API_BASE}/api/v1/auth/user/api-keys`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok && data.keys && data.keys.length > 0) {
          for (const key of data.keys) {
            if (key.is_active) {
              setApiKey(key.key);
              setIsAuthenticated(true);
              break;
            }
          }
        }
      } catch (err) {
        console.error("Error fetching API key", err);
      }
    };
    
    fetchUserKey();
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    setError("");
    setNews([]);
    try {
      const res = await fetch(API_URL, {
        headers: { "X-API-Key": apiKey }
      });
      const data = await res.json();
      if (res.ok && data.data) {
        setNews(data.data);
      } else {
        setError(data.detail || "Failed to fetch news");
      }
    } catch (err) {
      setError("Network error");
    }
    setLoading(false);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setSnackbar({ open: true, message: "Copied to clipboard" });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getCategoryColor = (category) => {
    const categoryColors = {
      stocks: theme.palette.primary.main,
      market: theme.palette.secondary.main,
      economy: theme.palette.success.main,
      banking: theme.palette.info.main,
      tech: theme.palette.warning.main,
      policy: theme.palette.error.main,
      corporate: theme.palette.secondary.dark,
      finance: theme.palette.primary.dark,
    };
    
    return categoryColors[category.toLowerCase()] || theme.palette.grey[700];
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";
    
    if (timestamp.includes("ago")) {
      return timestamp;
    }
    
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.round(diffMs / 60000);
      const diffHours = Math.round(diffMs / 3600000);
      const diffDays = Math.round(diffMs / 86400000);
      
      if (diffMins < 60) {
        return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
      } else if (diffHours < 24) {
        return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
      } else if (diffDays < 30) {
        return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
      } else {
        return date.toLocaleDateString("en-US", {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        });
      }
    } catch {
      return timestamp;
    }
  };

  return (
    <Box sx={{ py: 5, px: { xs: 2, md: 0 } }}>
      <Container maxWidth="lg">
        <Fade in={true} timeout={800}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Box sx={{ textAlign: "center", mb: 2 }}>
                <Box sx={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                  <FeedIcon color="primary" sx={{ fontSize: 36, mr: 1 }} />
                  <Typography variant="h4" fontWeight="700">
                    News Feed Demo
                  </Typography>
                </Box>
                <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 700, mx: "auto" }}>
                  Enter your API key below to see the power of our Finance News API in action. 
                  This demo showcases the latest financial news from various sources.
                </Typography>
              </Box>
              <Divider sx={{ mb: 4 }} />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box sx={{ position: 'sticky', top: 20 }}>
                <Card elevation={3} sx={{ mb: 3 }}>
                  <CardHeader 
                    title={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <KeyIcon color="primary" sx={{ mr: 1 }} />
                        <Typography variant="h6" fontWeight={600}>API Key</Typography>
                      </Box>
                    } 
                    sx={{ pb: 0 }}
                  />
                  <CardContent>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {isAuthenticated ? 
                        "Enter your API key to authenticate your request. Your key can be found on your dashboard." :
                        <>
                          Enter your API key to authenticate your request. You can get a free API key by 
                          <Link to="/register" style={{ marginLeft: '0.5rem', marginRight: '0.5rem' }}>
                            registering
                          </Link>
                          for an account.
                        </>
                      }
                    </Typography>
                    
                    <TextField
                      label="Your API Key"
                      value={apiKey}
                      onChange={e => setApiKey(e.target.value)}
                      fullWidth
                      variant="outlined"
                      placeholder="Enter your API key here"
                      sx={{ mb: 2 }}
                      InputProps={{
                        endAdornment: apiKey && (
                          <InputAdornment position="end">
                            <Tooltip title="Copy API key">
                              <IconButton 
                                edge="end" 
                                onClick={() => handleCopy(apiKey)}
                                size="small"
                              >
                                <ContentCopyIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </InputAdornment>
                        )
                      }}
                    />
                    
                    <Button 
                      variant="contained" 
                      color="primary" 
                      onClick={fetchNews} 
                      disabled={loading || !apiKey} 
                      size="large"
                      fullWidth
                      sx={{ py: 1.5 }}
                      startIcon={<SearchIcon />}
                    >
                      {loading ? "Fetching..." : "Fetch Latest News"}
                    </Button>
                  </CardContent>
                </Card>
                
                <Card 
                  elevation={1}
                  sx={{ 
                    borderLeft: '4px solid',
                    borderColor: 'primary.main',
                    background: 'linear-gradient(to right, rgba(37, 99, 235, 0.05), transparent)'
                  }}
                >
                  <CardContent sx={{ py: 2 }}>
                    <Typography variant="subtitle2" fontWeight={600} color="primary">
                      About the Demo
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      This demo uses the <code>/api/v1/news/latest</code> endpoint to fetch the latest 
                      financial news. The API returns news from various financial sources in real-time.
                    </Typography>
                    
                    <Box component="pre" sx={{ 
                      mt: 2,
                      p: 1.5,
                      background: 'rgba(0,0,0,0.03)',
                      borderRadius: 1,
                      fontSize: '0.75rem',
                      overflowX: 'auto',
                      fontFamily: 'monospace',
                    }}>
                      GET /api/v1/news/latest?limit=10<br/>
                      X-API-Key: your_api_key_here
                    </Box>
                    
                    <Button 
                      variant="text"
                      color="primary" 
                      size="small" 
                      href="/docs"
                      endIcon={<EastIcon fontSize="small" />}
                      sx={{ mt: 1, textTransform: 'none', fontWeight: 600 }}
                    >
                      View full documentation
                    </Button>
                  </CardContent>
                </Card>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={8}>
              {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
              
              {loading ? (
                <Box>
                  {[...Array(5)].map((_, index) => (
                    <Card key={index} sx={{ mb: 2, borderRadius: 2, overflow: 'hidden' }}>
                      <CardContent>
                        <Skeleton variant="text" height={32} width="80%" sx={{ mb: 1 }} />
                        <Skeleton variant="text" height={20} width="40%" sx={{ mb: 2 }} />
                        <Skeleton variant="text" height={20} width="90%" />
                        <Skeleton variant="text" height={20} width="90%" />
                        <Box sx={{ display: 'flex', mt: 2, gap: 1 }}>
                          <Skeleton variant="rounded" height={24} width={60} />
                          <Skeleton variant="rounded" height={24} width={80} />
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              ) : news.length > 0 ? (
                <Box>
                  <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" fontWeight={600}>
                      Latest Financial News
                      <Typography component="span" variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>
                        ({news.length} articles)
                      </Typography>
                    </Typography>
                  </Box>
                  
                  <Grid container spacing={2}>
                    {news.map((item, index) => (
                      <Grid item xs={12} key={item._id || index}>
                        <Card 
                          elevation={2} 
                          sx={{ 
                            borderRadius: 2, 
                            height: '100%',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-4px)',
                              boxShadow: '0 12px 28px rgba(0,0,0,0.08)'
                            }
                          }}
                        >
                          <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                              <Box>
                                <Chip 
                                  label={item.source || "Financial News"} 
                                  size="small"
                                  sx={{ 
                                    mb: 1.5,
                                    fontWeight: 500,
                                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                                    color: 'primary.dark',
                                    borderRadius: '4px'
                                  }}
                                />
                                <Typography variant="body2" color="text.secondary">
                                  {formatTimestamp(item.timestamp || item.timestamp_iso)}
                                </Typography>
                              </Box>
                            </Box>
                            
                            <Typography 
                              variant="h6" 
                              gutterBottom 
                              sx={{ 
                                mt: 1, 
                                lineHeight: 1.3,
                                fontWeight: 600
                              }}
                            >
                              {item.title}
                            </Typography>
                            
                            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                              {item.content?.length > 180 ? 
                                `${item.content.substring(0, 180)}...` : 
                                item.content || "No content available"}
                            </Typography>
                            
                            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Box sx={{ display: 'flex', gap: 0.8 }}>
                                {item.categories && item.categories.slice(0, 3).map((category, idx) => (
                                  <Chip
                                    key={`${item._id || index}-${idx}`}
                                    label={category}
                                    size="small"
                                    sx={{
                                      backgroundColor: `${getCategoryColor(category)}15`,
                                      color: getCategoryColor(category),
                                      fontWeight: 500,
                                      fontSize: '0.7rem',
                                    }}
                                  />
                                ))}
                              </Box>
                              
                              {item.url && (
                                <Button 
                                  href={item.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  color="primary" 
                                  endIcon={<OpenInNewIcon />}
                                  sx={{ 
                                    fontWeight: 600,
                                    fontSize: '0.85rem',
                                    textTransform: 'none',
                                  }}
                                >
                                  Read More
                                </Button>
                              )}
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              ) : (
                <Box 
                  sx={{ 
                    height: 300,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(37, 99, 235, 0.03)',
                    borderRadius: 4,
                    border: '1px dashed',
                    borderColor: 'primary.light'
                  }}
                >
                  <FeedIcon color="action" sx={{ fontSize: 48, opacity: 0.4, mb: 2 }} />
                  <Typography color="text.secondary" fontWeight={500}>
                    Enter your API key and click "Fetch Latest News"
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Financial news will appear here
                  </Typography>
                </Box>
              )}
            </Grid>
          </Grid>
        </Fade>
      </Container>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        message={snackbar.message}
      />
    </Box>
  );
}
