import React, { useState, useRef } from "react";
import { 
  Box, 
  Typography, 
  Paper, 
  Divider, 
  List, 
  ListItem, 
  ListItemText, 
  Alert, 
  Button,
  Card,
  CardContent,
  Grid,
  Tabs,
  Tab,
  Stack,
  Chip,
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  IconButton,
  Tooltip,
  Container,
  Fade,
  useTheme
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import LanguageIcon from '@mui/icons-material/Language';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import CodeIcon from '@mui/icons-material/Code';
import KeyIcon from '@mui/icons-material/Key';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import FilterListIcon from '@mui/icons-material/FilterList';
import SchemaIcon from '@mui/icons-material/Schema';
import ApiIcon from '@mui/icons-material/Api';
import FeedIcon from '@mui/icons-material/Feed';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { Link } from "react-router-dom";

const API_BASE = process.env.REACT_APP_API_URL;

export default function Docs() {
  const theme = useTheme();
  const [copyStatus, setCopyStatus] = useState({});
  const [tabValue, setTabValue] = useState(0);
  const endpointsRef = useRef(null);
  const authRef = useRef(null);
  const examplesRef = useRef(null);
  const isAuthenticated = !!localStorage.getItem("token");

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Scroll to section
  const scrollToSection = (ref) => {
    ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopyStatus(s => ({ ...s, [key]: true }));
    setTimeout(() => setCopyStatus(s => ({ ...s, [key]: false })), 1500);
  };

  const curlCmd = `curl -H "X-API-Key: your_api_key_here" \\\n  "${API_BASE}/api/v1/news/latest?limit=10"`;
  const pythonExample = `import requests

headers = {
    "X-API-Key": "your_api_key_here"
}

response = requests.get(
    "${API_BASE}/api/v1/news/latest",
    headers=headers,
    params={"limit": 10}
)

data = response.json()
print(data)`;

  const nodeExample = `const axios = require('axios');

async function getLatestNews() {
  try {
    const response = await axios.get(
      '${API_BASE}/api/v1/news/latest',
      {
        headers: { 'X-API-Key': 'your_api_key_here' },
        params: { limit: 10 }
      }
    );
    
    console.log(response.data);
  } catch (error) {
    console.error('Error fetching news:', error);
  }
}

getLatestNews();`;

  const endpoints = [
    {
      name: "Get Latest News",
      method: "GET",
      endpoint: "/api/v1/news/latest",
      description: "Returns the most recent financial news articles.",
      params: [
        { name: "limit", type: "integer", description: "Maximum number of results to return (default: 10, max: based on your tier)" }
      ]
    },
    {
      name: "Get All News",
      method: "GET",
      endpoint: "/api/v1/news",
      description: "Returns all news articles with pagination.",
      params: [
        { name: "limit", type: "integer", description: "Maximum number of results to return (default: 20)" },
        { name: "skip", type: "integer", description: "Number of results to skip for pagination (default: 0)" },
        { name: "sort_by", type: "string", description: "Field to sort by (default: 'timestamp_iso')" },
        { name: "sort_order", type: "integer", description: "Sort order: -1 for descending, 1 for ascending (default: -1)" }
      ]
    },
    {
      name: "Get News by Category",
      method: "GET",
      endpoint: "/api/v1/news/category/{category}",
      description: "Returns news articles filtered by category.",
      params: [
        { name: "category", type: "string", description: "Category to filter by (e.g., stocks, market, economy, banking, tech, policy)" },
        { name: "limit", type: "integer", description: "Maximum number of results to return (default: 20)" },
        { name: "skip", type: "integer", description: "Number of results to skip for pagination (default: 0)" }
      ]
    },
    {
      name: "Get News by Source",
      method: "GET",
      endpoint: "/api/v1/news/source/{source}",
      description: "Returns news articles from a specific source.",
      params: [
        { name: "source", type: "string", description: "Source name to filter by (e.g., 'Economic Times', 'Bloomberg Quint')" },
        { name: "limit", type: "integer", description: "Maximum number of results to return (default: 20)" },
        { name: "skip", type: "integer", description: "Number of results to skip for pagination (default: 0)" }
      ]
    },
    {
      name: "Search News",
      method: "GET",
      endpoint: "/api/v1/news/search",
      description: "Searches news articles by keyword.",
      params: [
        { name: "query", type: "string", description: "Search query", required: true },
        { name: "limit", type: "integer", description: "Maximum number of results to return (default: 20)" },
        { name: "skip", type: "integer", description: "Number of results to skip for pagination (default: 0)" }
      ]
    }
  ];

  const CodeBlock = ({ code, language, label, copyKey }) => (
    <Box sx={{ position: 'relative', mt: 2, mb: 3 }}>
      {label && (
        <Typography 
          variant="caption" 
          sx={{ 
            display: 'inline-block', 
            bgcolor: 'background.paper',
            color: 'text.secondary',
            px: 1,
            py: 0.5,
            position: 'absolute',
            top: -10,
            left: 10,
            borderRadius: '4px 4px 0 0',
            border: '1px solid',
            borderColor: 'divider',
            borderBottom: 'none',
            fontSize: '0.75rem'
          }}
        >
          {language}
        </Typography>
      )}
      <Paper 
        variant="outlined" 
        sx={{ 
          p: { xs: 1.5, md: 3 }, 
          position: 'relative', 
          background: '#1e293b',
          overflow: 'auto',
          borderRadius: 2
        }}
      >
        <Box 
          component="pre" 
          sx={{ 
            fontFamily: 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
            fontSize: '0.85rem',
            m: 0,
            color: '#e2e8f0',
            whiteSpace: 'pre',
            overflowX: 'auto',
          }}
        >
          <code>{code}</code>
        </Box>
        <Tooltip title={copyStatus[copyKey] ? "Copied!" : "Copy to clipboard"}>
          <IconButton
            size="small"
            onClick={() => handleCopy(code, copyKey)}
            sx={{
              position: 'absolute',
              top: 10,
              right: 10,
              color: 'grey.500',
              bgcolor: 'rgba(255, 255, 255, 0.1)',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                color: 'grey.100'
              }
            }}
          >
            <ContentCopyIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Paper>
    </Box>
  );

  const methodColors = {
    GET: "success",
    POST: "primary",
    PUT: "warning",
    DELETE: "error"
  };

  return (
    <Fade in={true} timeout={800}>
      <Box sx={{ 
        py: 5, 
        px: { xs: 2, md: 0 },
        backgroundColor: theme.palette.background.default,
        minHeight: '100vh'
      }}>
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            {/* Documentation Header */}
            <Grid item xs={12}>
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Box sx={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                  <ApiIcon fontSize="large" color="primary" sx={{ fontSize: 40, mr: 1.5 }} />
                  <Typography variant="h3" fontWeight="700">
                    API Documentation
                  </Typography>
                </Box>
                <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
                  Get started with the Finance News API. Everything you need to integrate financial news into your application.
                </Typography>
              </Box>
            </Grid>

            {/* Documentation Content Layout */}
            <Grid item xs={12} md={3}>
              {/* Sidebar Navigation */}
              <Card 
                sx={{ 
                  position: { md: 'sticky' }, 
                  top: 24,
                  boxShadow: { xs: 2, md: 'none' },
                  border: { md: '1px solid' },
                  borderColor: 'divider',
                }}
              >
                <CardContent sx={{ p: 0 }}>
                  <Tabs
                    orientation="vertical"
                    variant="scrollable"
                    value={tabValue}
                    onChange={handleTabChange}
                    sx={{
                      borderRight: 1,
                      borderColor: 'divider',
                      minHeight: 400,
                      '& .MuiTab-root': {
                        alignItems: 'flex-start',
                        textAlign: 'left',
                        pl: 2
                      }
                    }}
                  >
                    <Tab 
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <LibraryBooksIcon sx={{ mr: 1, fontSize: 20 }} />
                          <Typography variant="subtitle2" fontWeight={600}>Overview</Typography>
                        </Box>
                      } 
                    />
                    <Tab 
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <KeyIcon sx={{ mr: 1, fontSize: 20 }} />
                          <Typography variant="subtitle2" fontWeight={600}>Authentication</Typography>
                        </Box>
                      } 
                      onClick={() => scrollToSection(authRef)}
                    />
                    <Tab 
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <FeedIcon sx={{ mr: 1, fontSize: 20 }} />
                          <Typography variant="subtitle2" fontWeight={600}>Endpoints</Typography>
                        </Box>
                      } 
                      onClick={() => scrollToSection(endpointsRef)}
                    />
                    <Tab 
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <CodeIcon sx={{ mr: 1, fontSize: 20 }} />
                          <Typography variant="subtitle2" fontWeight={600}>Examples</Typography>
                        </Box>
                      } 
                      onClick={() => scrollToSection(examplesRef)}
                    />
                    <Tab 
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <FilterListIcon sx={{ mr: 1, fontSize: 20 }} />
                          <Typography variant="subtitle2" fontWeight={600}>Rate Limits</Typography>
                        </Box>
                      } 
                    />
                  </Tabs>
                </CardContent>

                {/* CTA Button */}
                <Box sx={{ p: 2 }}>
                  {isAuthenticated ? (
                    <Button 
                      variant="contained" 
                      color="primary"
                      component={Link}
                      to="/dashboard"
                      fullWidth
                      startIcon={<DashboardIcon />}
                    >
                      Go to Dashboard
                    </Button>
                  ) : (
                    <Button 
                      variant="contained" 
                      color="primary"
                      component={Link}
                      to="/register"
                      fullWidth
                      startIcon={<AutoAwesomeIcon />}
                    >
                      Get API Key
                    </Button>
                  )}
                </Box>
              </Card>
            </Grid>

            <Grid item xs={12} md={9}>
              <Paper sx={{ p: { xs: 2, md: 4 }, borderRadius: 2 }} elevation={1}>
                {/* Overview Section */}
                {tabValue === 0 && (
                  <Box>
                    <Typography variant="h4" sx={{ mb: 2, fontWeight: 700, display: 'flex', alignItems: 'center' }}>
                      <LibraryBooksIcon sx={{ mr: 1.5, color: 'primary.main' }} /> Overview
                    </Typography>
                    
                    <Typography variant="body1" paragraph>
                      The Finance News API provides real-time access to financial news from various trusted sources.
                      Our API is designed to be easy to use and integrate with your applications. Whether you're building
                      a financial dashboard, a news aggregator, or conducting research, our API has you covered.
                    </Typography>
                    
                    <Typography variant="h6" sx={{ fontWeight: 600, mt: 4 }}>Base URL</Typography>
                    <Box 
                      sx={{ 
                        borderRadius: 1,
                        bgcolor: 'background.paper',
                        border: '1px solid',
                        borderColor: 'divider',
                        px: 2,
                        py: 1.5,
                        fontFamily: 'monospace',
                        fontSize: '0.9rem',
                        fontWeight: 500,
                        mt: 1
                      }}
                    >
                      {API_BASE}
                    </Box>
                    
                    <Alert 
                      severity="info" 
                      sx={{ 
                        mt: 4, 
                        display: 'flex', 
                        alignItems: 'center',
                        borderRadius: 2
                      }}
                    >
                      <Typography variant="subtitle2">
                        All API requests must include your API key in the <code>X-API-Key</code> header.
                      </Typography>
                    </Alert>
                    
                    <Box sx={{ mt: 4 }}>
                      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>Response Format</Typography>
                      <Typography variant="body2" paragraph>
                        All API endpoints return data in JSON format. The response includes a <code>count</code> field 
                        with the number of returned items and a <code>data</code> array containing the news articles.
                      </Typography>
                      
                      <CodeBlock 
                        code={`{
  "count": 2,
  "data": [
    {
      "title": "Markets rally on positive economic data",
      "source": "Financial News",
      "url": "https://example.com/news/markets-rally",
      "timestamp": "10 minutes ago",
      "timestamp_iso": "2025-04-29T08:30:00Z",
      "categories": ["market", "stocks"],
      "content": "Markets rallied today on better-than-expected economic data..."
    },
    {
      "title": "Tech stocks surging in pre-market trading",
      "source": "Business Daily",
      "url": "https://example.com/news/tech-stocks",
      "timestamp": "25 minutes ago",
      "timestamp_iso": "2025-04-29T08:15:00Z",
      "categories": ["tech", "stocks"],
      "content": "Technology stocks are leading gains in pre-market trading..."
    }
  ]
}`}
                        language="JSON"
                        label="JSON"
                        copyKey="json"
                      />
                    </Box>
                    
                    <Box sx={{ mt: 6 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>Getting Started</Typography>
                      
                      <Box sx={{ mt: 2 }}>
                        <Stack spacing={3}>
                          <Paper sx={{ 
                            p: 2, 
                            display: 'flex',
                            alignItems: 'flex-start',
                            borderRadius: 2,
                            bgcolor: 'background.paper',
                            border: '1px solid',
                            borderColor: 'divider',
                          }}>
                            <Box 
                              sx={{ 
                                minWidth: 32, 
                                height: 32, 
                                backgroundColor: theme.palette.primary.main, 
                                borderRadius: '50%', 
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                mr: 2,
                                mt: 0.5,
                                fontWeight: 'bold'
                              }}
                            >
                              1
                            </Box>
                            <Box>
                              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                {isAuthenticated ? "Access Your API Key" : "Register for an API Key"}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {isAuthenticated 
                                  ? "You already have access to your API key in the dashboard." 
                                  : "Create an account to get your free API key for development and testing."}
                              </Typography>
                              {isAuthenticated ? (
                                <Button 
                                  variant="outlined" 
                                  size="small" 
                                  component={Link} 
                                  to="/dashboard" 
                                  sx={{ mt: 1 }}
                                >
                                  View Dashboard
                                </Button>
                              ) : (
                                <Button 
                                  variant="outlined" 
                                  size="small" 
                                  component={Link} 
                                  to="/register" 
                                  sx={{ mt: 1 }}
                                >
                                  Register Now
                                </Button>
                              )}
                            </Box>
                          </Paper>
                          
                          <Paper sx={{ 
                            p: 2, 
                            display: 'flex',
                            alignItems: 'flex-start',
                            borderRadius: 2,
                            bgcolor: 'background.paper',
                            border: '1px solid',
                            borderColor: 'divider',
                          }}>
                            <Box 
                              sx={{ 
                                minWidth: 32, 
                                height: 32, 
                                backgroundColor: theme.palette.primary.main, 
                                borderRadius: '50%', 
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                mr: 2,
                                mt: 0.5,
                                fontWeight: 'bold'
                              }}
                            >
                              2
                            </Box>
                            <Box>
                              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                Make API Requests
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Include your API key in the <code>X-API-Key</code> header with every request.
                              </Typography>
                              <CodeBlock 
                                code={`curl -H "X-API-Key: your_api_key_here" "${API_BASE}/api/v1/news/latest"`}
                                language="bash"
                                label="CURL"
                                copyKey="curl-simple"
                              />
                            </Box>
                          </Paper>
                          
                          <Paper sx={{ 
                            p: 2, 
                            display: 'flex',
                            alignItems: 'flex-start',
                            borderRadius: 2,
                            bgcolor: 'background.paper',
                            border: '1px solid',
                            borderColor: 'divider',
                          }}>
                            <Box 
                              sx={{ 
                                minWidth: 32, 
                                height: 32, 
                                backgroundColor: theme.palette.primary.main, 
                                borderRadius: '50%', 
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                mr: 2,
                                mt: 0.5,
                                fontWeight: 'bold'
                              }}
                            >
                              3
                            </Box>
                            <Box>
                              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                Process the Response
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Parse the JSON response and integrate the finance news data into your application.
                              </Typography>
                            </Box>
                          </Paper>
                        </Stack>
                      </Box>
                    </Box>
                  </Box>
                )}

                {/* Authentication Section */}
                <Box ref={authRef} sx={{ mt: tabValue !== 1 ? 8 : 0, scrollMarginTop: '100px' }}>
                  <Typography variant="h4" sx={{ mb: 3, fontWeight: 700, display: 'flex', alignItems: 'center' }}>
                    <KeyIcon sx={{ mr: 1.5, color: 'primary.main' }} /> Authentication
                  </Typography>
                  
                  <Typography variant="body1" paragraph>
                    All API requests require authentication using an API key. You'll need to include your API key
                    in the <code>X-API-Key</code> header with every request.
                  </Typography>
                  
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>API Key Header</Typography>
                    <CodeBlock 
                      code={`X-API-Key: your_api_key_here`}
                      language="HTTP Header"
                      label="Header"
                      copyKey="header"
                    />
                  </Box>
                  
                  <Alert 
                    severity="warning" 
                    sx={{ mt: 3, borderRadius: 2 }}
                  >
                    <Typography variant="subtitle2">
                      Keep your API key secure. Do not expose it in client-side code or public repositories.
                    </Typography>
                  </Alert>
                  
                  <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>Example Request with Authentication</Typography>
                    <CodeBlock 
                      code={curlCmd}
                      language="bash"
                      label="cURL"
                      copyKey="curl"
                    />
                  </Box>
                </Box>

                {/* Endpoints Section */}
                <Box ref={endpointsRef} sx={{ mt: tabValue !== 2 ? 8 : 0, scrollMarginTop: '100px' }}>
                  <Typography variant="h4" sx={{ mb: 3, fontWeight: 700, display: 'flex', alignItems: 'center' }}>
                    <FeedIcon sx={{ mr: 1.5, color: 'primary.main' }} /> API Endpoints
                  </Typography>
                  
                  <Typography variant="body1" paragraph>
                    The Finance News API provides several endpoints to access different types of news data.
                  </Typography>
                  
                  {endpoints.map((endpoint, index) => (
                    <Card 
                      key={index} 
                      elevation={0}
                      sx={{ 
                        mb: 4, 
                        border: '1px solid', 
                        borderColor: 'divider',
                        borderRadius: 2,
                        overflow: 'visible'
                      }}
                    >
                      <Box 
                        sx={{ 
                          p: 2,
                          display: 'flex',
                          alignItems: 'center',
                          borderBottom: '1px solid',
                          borderColor: 'divider',
                          bgcolor: 'rgba(0,0,0,0.02)'
                        }}
                      >
                        <Chip 
                          label={endpoint.method} 
                          color={methodColors[endpoint.method]} 
                          size="small"
                          sx={{ 
                            mr: 2,
                            fontWeight: 600,
                            minWidth: 60
                          }}
                        />
                        <Typography 
                          variant="subtitle1" 
                          component="pre"
                          sx={{ 
                            fontFamily: 'monospace', 
                            fontWeight: 600,
                            m: 0
                          }}
                        >
                          {endpoint.endpoint}
                        </Typography>
                      </Box>
                      <CardContent>
                        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                          {endpoint.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          {endpoint.description}
                        </Typography>
                        
                        {endpoint.params && endpoint.params.length > 0 && (
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                              Parameters
                            </Typography>
                            <TableContainer sx={{ 
                              border: '1px solid', 
                              borderColor: 'divider',
                              borderRadius: 1
                            }}>
                              <Table size="small">
                                <TableHead sx={{ bgcolor: 'rgba(0,0,0,0.02)' }}>
                                  <TableRow>
                                    <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Required</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {endpoint.params.map((param, idx) => (
                                    <TableRow key={idx}>
                                      <TableCell 
                                        sx={{ 
                                          fontFamily: 'monospace', 
                                          fontWeight: param.required ? 600 : 400 
                                        }}
                                      >
                                        {param.name}
                                      </TableCell>
                                      <TableCell>{param.type}</TableCell>
                                      <TableCell>{param.description}</TableCell>
                                      <TableCell>
                                        {param.required ? (
                                          <Chip 
                                            label="Required" 
                                            size="small" 
                                            color="primary" 
                                            variant="outlined"
                                          />
                                        ) : "Optional"}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          </Box>
                        )}
                        
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                            Example Request
                          </Typography>
                          <CodeBlock 
                            code={`curl -H "X-API-Key: your_api_key_here" "${API_BASE}${endpoint.endpoint}${endpoint.params.some(p => p.required) 
                              ? `?${endpoint.params.find(p => p.required)?.name}=example` 
                              : ''}"
`}
                            language="bash"
                            copyKey={`curl-${index}`}
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>

                {/* Code Examples Section */}
                <Box ref={examplesRef} sx={{ mt: tabValue !== 3 ? 8 : 0, scrollMarginTop: '100px' }}>
                  <Typography variant="h4" sx={{ mb: 3, fontWeight: 700, display: 'flex', alignItems: 'center' }}>
                    <CodeIcon sx={{ mr: 1.5, color: 'primary.main' }} /> Code Examples
                  </Typography>
                  
                  <Typography variant="body1" paragraph>
                    Here are examples of how to use our API in different programming languages.
                  </Typography>
                  
                  <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                      <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center' }}>
                        <LanguageIcon sx={{ mr: 1, color: theme.palette.info.main }} /> cURL
                      </Box>
                    </Typography>
                    <CodeBlock 
                      code={curlCmd}
                      language="bash"
                      copyKey="curl-example"
                    />
                  </Box>
                  
                  <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                      <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center' }}>
                        <LanguageIcon sx={{ mr: 1, color: theme.palette.info.main }} /> Python
                      </Box>
                    </Typography>
                    <CodeBlock 
                      code={pythonExample}
                      language="python"
                      copyKey="python"
                    />
                  </Box>
                  
                  <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                      <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center' }}>
                        <LanguageIcon sx={{ mr: 1, color: theme.palette.info.main }} /> JavaScript (Node.js)
                      </Box>
                    </Typography>
                    <CodeBlock 
                      code={nodeExample}
                      language="javascript"
                      copyKey="javascript"
                    />
                  </Box>
                </Box>
                
                {/* Rate Limits Section */}
                {tabValue === 4 && (
                  <Box>
                    <Typography variant="h4" sx={{ mb: 3, fontWeight: 700, display: 'flex', alignItems: 'center' }}>
                      <FilterListIcon sx={{ mr: 1.5, color: 'primary.main' }} /> Rate Limits
                    </Typography>
                    
                    <Typography variant="body1" paragraph>
                      API rate limits vary based on your subscription tier. When you reach your rate limit,
                      the API will return a <code>429 Too Many Requests</code> error.
                    </Typography>
                    
                    <TableContainer sx={{ 
                      mt: 3,
                      border: '1px solid', 
                      borderColor: 'divider',
                      borderRadius: 2
                    }}>
                      <Table>
                        <TableHead sx={{ bgcolor: 'rgba(0,0,0,0.02)' }}>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 700 }}>Tier</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Requests per Day</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Requests per Minute</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Max Results per Request</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 600 }}>Free</TableCell>
                            <TableCell>100</TableCell>
                            <TableCell>10</TableCell>
                            <TableCell>20</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 600 }}>Basic</TableCell>
                            <TableCell>1,000</TableCell>
                            <TableCell>30</TableCell>
                            <TableCell>50</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 600 }}>Premium</TableCell>
                            <TableCell>10,000</TableCell>
                            <TableCell>60</TableCell>
                            <TableCell>100</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                    
                    <Alert 
                      severity="info" 
                      sx={{ mt: 4, borderRadius: 2 }}
                    >
                      <Typography variant="subtitle2">
                        When you exceed your rate limit, the API will return a <code>429</code> status code with a <code>Retry-After</code> header indicating how long to wait before making another request.
                      </Typography>
                    </Alert>
                    
                    <Box sx={{ mt: 6, textAlign: 'center' }}>
                      <Typography variant="h6" gutterBottom>
                        Need Higher Limits?
                      </Typography>
                      <Button 
                        variant="contained" 
                        color="primary" 
                        component={Link}
                        to="/pricing"
                        sx={{ mt: 1 }}
                      >
                        View Pricing Plans
                      </Button>
                    </Box>
                  </Box>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Fade>
  );
}
