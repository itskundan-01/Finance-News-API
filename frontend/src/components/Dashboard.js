import React, { useEffect, useState } from "react";
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  List, 
  ListItem, 
  ListItemText,
  IconButton, 
  Tooltip, 
  Alert, 
  CircularProgress, 
  Divider, 
  Fade,
  Card,
  CardHeader,
  CardContent,
  Grid,
  Stack,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Avatar,
  useTheme,
  LinearProgress
} from "@mui/material";
import AutorenewIcon from '@mui/icons-material/Autorenew';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DashboardIcon from '@mui/icons-material/Dashboard';
import KeyIcon from '@mui/icons-material/Key';
import TimerIcon from '@mui/icons-material/Timer';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { jwtDecode } from "jwt-decode";

const API_BASE = process.env.REACT_APP_API_URL;

function getUserEmail() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    return decoded.sub || decoded.email || null;
  } catch {
    return null;
  }
}

export default function Dashboard({ user }) {
  const theme = useTheme();
  const email = getUserEmail();
  const [userData, setUserData] = useState(null);
  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [regenerateDialog, setRegenerateDialog] = useState(false);
  const [revokeDialog, setRevokeDialog] = useState(false);
  const [selectedKey, setSelectedKey] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });
  const [upgradeDialog, setUpgradeDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  
  // Fetch user data from the /user/me endpoint
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token not found. Please log in again.");
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`${API_BASE}/api/v1/auth/user/me`, {
          headers: { 
            Authorization: `Bearer ${token}` 
          }
        });
        let data;
        try {
          data = await res.json();
        } catch (jsonErr) {
          setError("Invalid server response. Please try again later.");
          setLoading(false);
          return;
        }
        if (res.ok) {
          setUserData(data);
          localStorage.setItem("user", JSON.stringify(data)); 
        } else {
          setError(data.detail || "Failed to fetch user details.");
          localStorage.removeItem("user"); 
        }
      } catch (err) {
        setError("Network error while fetching user details.");
        console.error("Error fetching user data:", err);
      }
      setLoading(false);
    };
    fetchUserData();
  }, []); // Run once on component mount

  // Check for plan upgrade parameter in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const planParam = urlParams.get('plan');
    
    if (planParam && ['basic', 'premium'].includes(planParam.toLowerCase())) {
      setSelectedPlan(planParam.toLowerCase());
      setUpgradeDialog(true);
      
      // Clear the URL parameter after processing
      const url = new URL(window.location.href);
      url.searchParams.delete('plan');
      window.history.replaceState({}, '', url.toString());
    }
  }, []);

  const fetchKeys = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`${API_BASE}/api/v1/auth/user/api-keys`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      let data;
      try {
        data = await res.json();
      } catch (jsonErr) {
        setError("Invalid server response. Please try again later.");
        setLoading(false);
        return;
      }
      if (res.ok && data.keys) {
        setKeys(data.keys);
      } else {
        setError(data.detail || "Failed to fetch API keys");
      }
    } catch (err) {
      setError("Network error");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchKeys();
    // eslint-disable-next-line
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleRegenerateDialogOpen = () => {
    setRegenerateDialog(true);
  };

  const handleRegenerateDialogClose = () => {
    setRegenerateDialog(false);
  };

  const handleRevokeDialogOpen = (key) => {
    setSelectedKey(key);
    setRevokeDialog(true);
  };

  const handleRevokeDialogClose = () => {
    setRevokeDialog(false);
    setSelectedKey(null);
  };

  const handleRegenerate = async () => {
    handleRegenerateDialogClose();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`${API_BASE}/api/v1/auth/user/api-keys/regenerate`, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      let data;
      try {
        data = await res.json();
      } catch (jsonErr) {
        setError("Invalid server response. Please try again later.");
        setLoading(false);
        return;
      }
      if (res.ok && data.key) {
        setSuccess("API key regenerated successfully.");
        setSnackbar({ 
          open: true, 
          message: "API key regenerated successfully. Old keys are now inactive." 
        });
        fetchKeys();
      } else {
        setError(data.detail || "Failed to regenerate API key");
      }
    } catch {
      setError("Network error");
    }
    setLoading(false);
  };

  const handleRevoke = async () => {
    if (!selectedKey) return;
    handleRevokeDialogClose();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`${API_BASE}/api/v1/auth/user/api-keys/revoke`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ key: selectedKey })
      });
      let data;
      try {
        data = await res.json();
      } catch (jsonErr) {
        setError("Invalid server response. Please try again later.");
        setLoading(false);
        return;
      }
      if (res.ok) {
        setSuccess("API key revoked successfully.");
        setSnackbar({ 
          open: true, 
          message: "API key revoked successfully." 
        });
        fetchKeys();
      } else {
        setError(data.detail || "Failed to revoke API key");
      }
    } catch {
      setError("Network error");
    }
    setLoading(false);
  };

  const handleCreateApiKey = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`${API_BASE}/api/v1/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_email: user?.email, user_name: user?.name || user?.email })
      });
      let data;
      try {
        data = await res.json();
      } catch (jsonErr) {
        setError("Invalid server response. Please try again later.");
        setLoading(false);
        return;
      }
      if (res.ok && data.key) {
        setSuccess("API key created successfully.");
        setSnackbar({ 
          open: true, 
          message: "New API key created successfully!" 
        });
        fetchKeys();
      } else {
        setError(data.detail || data.message || "Failed to create API key");
      }
    } catch {
      setError("Network error");
    }
    setLoading(false);
  };

  const handleCopyKey = (key) => {
    navigator.clipboard.writeText(key);
    setSnackbar({ 
      open: true, 
      message: "API key copied to clipboard" 
    });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const getTierInfo = (tierName) => {
    const tierInfo = {
      free: {
        color: theme.palette.info.main,
        requests: "100/day",
        rateLimit: "10/minute",
        dailyLimit: 100,
        minuteLimit: 10
      },
      basic: {
        color: theme.palette.success.main,
        requests: "1,000/day",
        rateLimit: "30/minute",
        dailyLimit: 1000,
        minuteLimit: 30
      },
      premium: {
        color: theme.palette.warning.main,
        requests: "10,000/day",
        rateLimit: "60/minute",
        dailyLimit: 10000,
        minuteLimit: 60
      }
    };
    
    return tierInfo[tierName] || tierInfo.free;
  };

  // Handle plan upgrade
  const handleUpgradePlan = async () => {
    setLoading(true);
    setError("");
    
    try {
      // Here we would normally integrate with a payment provider like Stripe
      // For this demo, we'll simulate a successful upgrade
      setSuccess(`Successfully upgraded to ${selectedPlan.toUpperCase()} plan!`);
      setSnackbar({ 
        open: true, 
        message: `Your account has been upgraded to ${selectedPlan.toUpperCase()} plan.` 
      });
      
      // In a real implementation, after payment success, we would call an API endpoint
      // to update the user's subscription tier in the database
      
      // Refresh API keys to show new tier
      await fetchKeys();
      
    } catch (err) {
      setError("Failed to process upgrade. Please try again.");
    }
    
    setLoading(false);
    setUpgradeDialog(false);
  };
  
  const handleCloseUpgradeDialog = () => {
    setUpgradeDialog(false);
    setSelectedPlan(null);
  };
  
  // Get plan details
  const getPlanDetails = (plan) => {
    const planDetails = {
      basic: {
        name: "Basic",
        price: "₹149/month",
        yearlyPrice: "₹1,249/year (save 30%)",
        color: theme.palette.secondary.main,
        requests: "300/day",
        rateLimit: "40/minute"
      },
      premium: {
        name: "Premium",
        price: "₹499/month",
        yearlyPrice: "₹4,190/year (save 30%)",
        color: theme.palette.warning.main,
        requests: "1,000/day",
        rateLimit: "100/minute"
      }
    };
    
    return planDetails[plan] || {};
  };

  return (
    <Box sx={{ py: 4, px: { xs: 2, md: 0 } }}>
      <Container maxWidth="lg">
        <Fade in={true} timeout={700}>
          <Grid container spacing={3}>
            {/* Header Section */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <DashboardIcon color="primary" sx={{ mr: 1.5, fontSize: 28 }} />
                <Typography variant="h4" fontWeight="700">
                  API Dashboard
                </Typography>
              </Box>
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                Manage your API keys and monitor usage
              </Typography>
              <Divider sx={{ mt: 2, mb: 4 }} />
            </Grid>

            {/* User Info Card */}
            <Grid item xs={12} md={4}>
              <Card elevation={2} sx={{ height: '100%' }}>
                <CardHeader
                  avatar={
                    <Avatar 
                      sx={{ 
                        bgcolor: theme.palette.primary.main,
                        width: 56,
                        height: 56,
                        fontSize: '1.5rem'
                      }}
                    >
                      {(userData?.name?.charAt(0) || user?.name?.charAt(0) || email?.charAt(0) || 'U').toUpperCase()}
                    </Avatar>
                  }
                  title={
                    <Typography variant="h6" fontWeight="600">
                      {userData?.name || user?.name || "User"}
                    </Typography>
                  }
                  subheader={email}
                />
                <Divider />
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                    <Chip 
                      label={keys.length > 0 ? keys[0].tier.toUpperCase() : "FREE TIER"} 
                      color={keys.length > 0 ? (keys[0].tier === "premium" ? "warning" : "primary") : "primary"}
                      sx={{ fontWeight: 600 }}
                    />
                    
                    <Typography variant="body2" color="text.secondary">
                      Account since {formatDate(keys.length > 0 ? keys[0].created_at : new Date())}
                    </Typography>
                  </Stack>
                  
                  <Button variant="outlined" onClick={handleLogout} fullWidth sx={{ mt: 1 }}>
                    Logout
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            {/* API Keys Management */}
            <Grid item xs={12} md={8}>
              <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" fontWeight="600">
                    <KeyIcon sx={{ mr: 1, mb: -0.5 }} /> Your API Keys
                  </Typography>
                  
                  {(!keys || keys.length === 0) && !loading && (
                    <Button 
                      variant="contained" 
                      color="primary" 
                      onClick={handleCreateApiKey}
                      startIcon={<AddCircleIcon />}
                    >
                      Create API Key
                    </Button>
                  )}
                  
                  {keys.length > 0 && (
                    <Button 
                      variant="outlined" 
                      color="primary" 
                      onClick={handleRegenerateDialogOpen}
                      startIcon={<AutorenewIcon />}
                      size="small"
                    >
                      Regenerate
                    </Button>
                  )}
                </Box>
                
                {loading && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                    <CircularProgress />
                  </Box>
                )}
                
                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

                {keys.length > 0 ? (
                  <List sx={{ 
                    width: '100%',
                    bgcolor: 'background.paper',
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'divider',
                    overflow: 'hidden'
                  }}>
                    {keys.map((k, index) => {
                      const tierInfo = getTierInfo(k.tier);
                      return (
                        <React.Fragment key={k.key}>
                          {index > 0 && <Divider />}
                          <ListItem
                            disablePadding
                            sx={{ 
                              px: 2, 
                              py: 2,
                              flexDirection: 'column',
                              alignItems: 'flex-start',
                              bgcolor: !k.is_active ? 'rgba(0,0,0,0.02)' : 'transparent'
                            }}
                          >
                            <Box sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              width: '100%',
                              mb: 1
                            }}>
                              <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
                                <Typography 
                                  variant="body2" 
                                  sx={{ 
                                    fontFamily: 'monospace', 
                                    bgcolor: 'rgba(0,0,0,0.03)',
                                    p: 1,
                                    borderRadius: 1,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    opacity: k.is_active ? 1 : 0.5,
                                    fontWeight: 'medium',
                                    flexGrow: 1,
                                    whiteSpace: 'nowrap'
                                  }}
                                >
                                  {k.key}
                                </Typography>
                                
                                <Tooltip title="Copy to clipboard">
                                  <IconButton 
                                    size="small" 
                                    onClick={() => handleCopyKey(k.key)}
                                    sx={{ ml: 1 }}
                                  >
                                    <ContentCopyIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </Box>
                              
                              <Tooltip title="Revoke this key">
                                <IconButton 
                                  edge="end" 
                                  color="error" 
                                  onClick={() => handleRevokeDialogOpen(k.key)}
                                  disabled={!k.is_active}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            </Box>
                            
                            <Grid container spacing={2} sx={{ mt: 0.5 }}>
                              <Grid item xs={6} sm={3}>
                                <Typography variant="caption" color="text.secondary" display="block">
                                  STATUS
                                </Typography>
                                <Chip
                                  label={k.is_active ? "Active" : "Inactive"}
                                  color={k.is_active ? "success" : "default"}
                                  size="small"
                                  sx={{ fontWeight: 500, fontSize: '0.75rem' }}
                                />
                              </Grid>
                              <Grid item xs={6} sm={3}>
                                <Typography variant="caption" color="text.secondary" display="block">
                                  TIER
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <Box 
                                    sx={{ 
                                      width: 10, 
                                      height: 10, 
                                      borderRadius: '50%', 
                                      bgcolor: tierInfo.color,
                                      mr: 0.5
                                    }} 
                                  />
                                  <Typography variant="body2" fontWeight="medium">
                                    {k.tier.charAt(0).toUpperCase() + k.tier.slice(1)}
                                  </Typography>
                                </Box>
                              </Grid>
                              <Grid item xs={6} sm={3}>
                                <Typography variant="caption" color="text.secondary" display="block">
                                  <TimerIcon sx={{ fontSize: 12, mr: 0.5, mb: -0.2 }} />
                                  CREATED
                                </Typography>
                                <Typography variant="body2">
                                  {new Date(k.created_at).toLocaleDateString()}
                                </Typography>
                              </Grid>
                              <Grid item xs={6} sm={3}>
                                <Typography variant="caption" color="text.secondary" display="block">
                                  <AssessmentIcon sx={{ fontSize: 12, mr: 0.5, mb: -0.2 }} />
                                  USAGE
                                </Typography>
                                <Typography variant="body2">
                                  {k.total_requests.toLocaleString()} / {tierInfo.dailyLimit.toLocaleString()} requests
                                </Typography>
                                <LinearProgress 
                                  variant="determinate" 
                                  value={(k.total_requests / tierInfo.dailyLimit) * 100} 
                                  sx={{ mt: 1 }}
                                />
                              </Grid>
                            </Grid>
                          </ListItem>
                        </React.Fragment>
                      );
                    })}
                  </List>
                ) : (
                  !loading && (
                    <Box sx={{ p: 4, textAlign: 'center' }}>
                      <KeyIcon color="action" sx={{ fontSize: 48, opacity: 0.3, mb: 2 }} />
                      <Typography color="text.secondary">
                        No API keys found. Create one to get started.
                      </Typography>
                    </Box>
                  )
                )}
                
                {keys.length > 0 && (
                  <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                    <Box sx={{ 
                      p: 2, 
                      border: '1px solid', 
                      borderColor: 'divider',
                      borderRadius: 1,
                      display: 'flex',
                      alignItems: 'center',
                      bgcolor: theme.palette.mode === 'dark' ? 'rgba(56, 189, 248, 0.2)' : 'rgba(14, 165, 233, 0.15)',
                      color: theme.palette.mode === 'dark' ? '#7dd3fc' : '#0284c7'
                    }}>
                      <TimerIcon sx={{ mr: 1 }} />
                      <Box>
                        <Typography variant="caption" fontWeight="medium" sx={{ opacity: 0.9, color: 'inherit' }}>
                          RATE LIMIT
                        </Typography>
                        <Typography variant="body2" fontWeight="bold" sx={{ color: 'inherit' }}>
                          {keys.length > 0 ? getTierInfo(keys[0].tier).rateLimit : "10/minute"}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ 
                      p: 2, 
                      border: '1px solid', 
                      borderColor: 'divider',
                      borderRadius: 1,
                      display: 'flex',
                      alignItems: 'center',
                      bgcolor: theme.palette.mode === 'dark' ? 'rgba(251, 191, 36, 0.2)' : 'rgba(245, 158, 11, 0.15)',
                      color: theme.palette.mode === 'dark' ? '#fcd34d' : '#b45309'
                    }}>
                      <CalendarTodayIcon sx={{ mr: 1 }} />
                      <Box>
                        <Typography variant="caption" fontWeight="medium" sx={{ opacity: 0.9, color: 'inherit' }}>
                          DAILY LIMIT
                        </Typography>
                        <Typography variant="body2" fontWeight="bold" sx={{ color: 'inherit' }}>
                          {keys.length > 0 ? getTierInfo(keys[0].tier).requests : "100/day"}
                        </Typography>
                      </Box>
                    </Box>
                  </Stack>
                )}
              </Paper>
            </Grid>
            
            {/* API Usage Card */}
            {keys.length > 0 && (
              <Grid item xs={12}>
                <Paper 
                  elevation={1} 
                  sx={{ 
                    p: 3, 
                    mt: 2,
                    borderTop: '4px solid',
                    borderColor: 'primary.main',
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    Quick API Reference
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Include your API key in the <code>X-API-Key</code> header with every request:
                  </Typography>
                  
                  <Box sx={{ 
                    p: 2, 
                    bgcolor: 'rgba(0, 0, 0, 0.03)',
                    borderRadius: 1,
                    fontFamily: 'monospace',
                    fontSize: '0.875rem',
                    overflow: 'auto',
                    position: 'relative'
                  }}>
                    <pre style={{ margin: 0 }}>
                      curl -H "X-API-Key: {keys[0]?.key}" \<br/>
                      &nbsp;&nbsp;"{API_BASE}/api/v1/news/latest?limit=10"
                    </pre>
                    <IconButton
                      size="small"
                      onClick={() => handleCopyKey(`curl -H "X-API-Key: ${keys[0]?.key}" "${API_BASE}/api/v1/news/latest?limit=10"`)}
                      sx={{ 
                        position: 'absolute', 
                        top: 8, 
                        right: 8,
                        bgcolor: 'background.paper'
                      }}
                    >
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  
                  <Button 
                    variant="outlined" 
                    component="a" 
                    href="/docs" 
                    sx={{ mt: 2 }}
                  >
                    View Full API Documentation
                  </Button>
                </Paper>
              </Grid>
            )}
          </Grid>
        </Fade>
      </Container>

      {/* Dialogs */}
      <Dialog
        open={regenerateDialog}
        onClose={handleRegenerateDialogClose}
      >
        <DialogTitle>Regenerate API Key?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will deactivate all your existing API keys and create a new one.
            Any services using your current keys will stop working.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRegenerateDialogClose}>Cancel</Button>
          <Button onClick={handleRegenerate} color="primary" variant="contained" autoFocus>
            Regenerate
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={revokeDialog}
        onClose={handleRevokeDialogClose}
      >
        <DialogTitle>Revoke API Key?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will permanently deactivate this API key.
            Any services using this key will stop working.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRevokeDialogClose}>Cancel</Button>
          <Button onClick={handleRevoke} color="error" variant="contained">
            Revoke
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={upgradeDialog}
        onClose={handleCloseUpgradeDialog}
      >
        <DialogTitle>Upgrade to {selectedPlan?.toUpperCase()} Plan</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {selectedPlan && (
              <>
                <Typography variant="body2" gutterBottom>
                  Upgrade to the {getPlanDetails(selectedPlan).name} plan for better limits:
                </Typography>
                <Typography variant="body2">
                  <strong>Rate Limit:</strong> {getPlanDetails(selectedPlan).rateLimit}
                </Typography>
                <Typography variant="body2">
                  <strong>Daily Requests:</strong> {getPlanDetails(selectedPlan).requests}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  Monthly Price: {getPlanDetails(selectedPlan).price}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Yearly Price: {getPlanDetails(selectedPlan).yearlyPrice}
                </Typography>
              </>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUpgradeDialog}>Cancel</Button>
          <Button onClick={handleUpgradePlan} color="primary" variant="contained">
            Upgrade
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        message={snackbar.message}
      />
    </Box>
  );
}

// Add Container component since it was missing in imports
const Container = ({ maxWidth, children }) => (
  <Box
    sx={{
      width: '100%',
      maxWidth: theme => theme.breakpoints.values[maxWidth] || 'none',
      mx: 'auto',
    }}
  >
    {children}
  </Box>
);
