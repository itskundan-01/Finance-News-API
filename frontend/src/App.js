import React, { useEffect, useState, useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  Fade, 
  useMediaQuery, 
  Container, 
  IconButton, 
  Menu, 
  MenuItem, 
  Avatar, 
  Drawer, 
  List, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText,
  Tooltip,
  CssBaseline,
  ThemeProvider,
  Divider,
  Badge
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import ArticleIcon from '@mui/icons-material/Article';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import FeedIcon from '@mui/icons-material/Feed';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ApiIcon from '@mui/icons-material/Api';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import { lightTheme, darkTheme } from "./theme";
import { ThemeContext, ThemeProvider as CustomThemeProvider } from "./context/ThemeContext"; 
import Landing from "./components/Landing";
import Register from "./components/Register";
import Login from "./components/Login";
import Pricing from "./components/Pricing";
import NewsFeed from "./components/NewsFeed";
import Dashboard from "./components/Dashboard";
import Docs from "./components/Docs";

function getUserFromStorage() {
  try {
    const userString = localStorage.getItem("user");
    if (!userString) return null;
    return JSON.parse(userString);
  } catch {
    return null;
  }
}

function isAuthenticated() {
  return !!localStorage.getItem("token");
}

function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    window.location.href = "/login";
    return null;
  }
  return children;
}

function AppContent() {
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem("token"));
  const [user, setUser] = useState(getUserFromStorage());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const { mode, toggleColorMode } = useContext(ThemeContext);
  const darkMode = mode === 'dark';
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    setIsAuth(!!localStorage.getItem("token"));
    setUser(getUserFromStorage());
  }, [location.pathname]);

  const handleThemeToggle = () => {
    toggleColorMode();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuth(false);
    setUser(null);
    handleUserMenuClose();
    navigate("/login");
  };

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase();
  };

  const navigationItems = [
    { label: "Home", path: "/", icon: <HomeIcon />, showAlways: true },
    { label: "Pricing", path: "/pricing", icon: <MonetizationOnIcon />, showAlways: true },
    { label: "API Docs", path: "/docs", icon: <ArticleIcon />, showAlways: true },
    { label: "News Feed", path: "/news", icon: <FeedIcon />, showAlways: true },
    { label: "Login", path: "/login", icon: <LoginIcon />, showWhen: !isAuth },
    { label: "Register", path: "/register", icon: <PersonAddIcon />, showWhen: !isAuth },
    { label: "Dashboard", path: "/dashboard", icon: <DashboardIcon />, showWhen: isAuth },
  ];

  return (
    <>
      <Fade in={true} timeout={700}>
        <AppBar 
          position="sticky" 
          elevation={1} 
          color="primary"
          sx={{
            backdropFilter: "blur(20px)",
            backgroundColor: theme.palette.mode === 'light' 
              ? 'rgba(255, 255, 255, 0.8)' 
              : 'rgba(15, 23, 42, 0.8)',
          }}
        >
          <Container maxWidth="xl">
            <Toolbar disableGutters sx={{ justifyContent: 'space-between', height: 70 }}>
              {/* Logo and Title */}
              <Typography
                variant="h6"
                component={Link}
                to="/"
                sx={{
                  mr: 2,
                  fontWeight: 700,
                  color: 'text.primary',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <FeedIcon sx={{ mr: 1, mb: 0.1, color: theme.palette.primary.main }} />
                Finance News API
              </Typography>

              {/* Desktop Navigation Links */}
              {!isMobile && (
                <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, justifyContent: 'center' }}>
                  {navigationItems
                    .filter(item => item.showAlways || item.showWhen)
                    .map((item) => (
                      <Button
                        key={item.path}
                        component={Link}
                        to={item.path}
                        color="inherit"
                        sx={{ 
                          mx: 0.5,
                          px: 1.5,
                          borderRadius: 2,
                          color: 'text.primary',
                          '&:hover': { 
                            backgroundColor: theme.palette.mode === 'light' 
                              ? 'rgba(0, 0, 0, 0.04)' 
                              : 'rgba(255, 255, 255, 0.08)' 
                          },
                          ...(location.pathname === item.path && {
                            backgroundColor: theme.palette.mode === 'light' 
                              ? 'rgba(37, 99, 235, 0.08)'
                              : 'rgba(96, 165, 250, 0.15)',
                            color: theme.palette.primary.main,
                            fontWeight: 600
                          })
                        }}
                        startIcon={item.icon}
                      >
                        {item.label}
                      </Button>
                    ))}
                </Box>
              )}

              {/* Right Controls Section */}
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {/* Theme Toggle */}
                <Tooltip title={darkMode ? "Switch to light mode" : "Switch to dark mode"}>
                  <IconButton 
                    onClick={handleThemeToggle} 
                    sx={{ 
                      ml: 1,
                      color: 'text.primary',
                    }}
                  >
                    {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
                  </IconButton>
                </Tooltip>

                {/* Notification Bell (for authenticated users) */}
                {isAuth && (
                  <Tooltip title="Notifications">
                    <IconButton sx={{ ml: 1, color: 'text.primary' }}>
                      <Badge color="error" variant="dot">
                        <NotificationsIcon />
                      </Badge>
                    </IconButton>
                  </Tooltip>
                )}

                {/* Mobile Menu Toggle */}
                {isMobile && (
                  <IconButton
                    aria-label="menu"
                    onClick={toggleMobileMenu}
                    edge="end"
                    sx={{ ml: 0.5, color: 'text.primary' }}
                  >
                    <MenuIcon />
                  </IconButton>
                )}

                {/* User Menu (Desktop) */}
                {!isMobile && isAuth && user && (
                  <>
                    <Tooltip title="Account">
                      <IconButton
                        onClick={handleUserMenuOpen}
                        size="small"
                        sx={{ ml: 2 }}
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                      >
                        <Avatar
                          sx={{
                            width: 35,
                            height: 35,
                            bgcolor: theme.palette.primary.main,
                            fontSize: '0.875rem',
                            fontWeight: 700
                          }}
                        >
                          {getInitials(user.name || user.email)}
                        </Avatar>
                      </IconButton>
                    </Tooltip>

                    <Menu
                      id="menu-appbar"
                      anchorEl={userMenuAnchor}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                      }}
                      keepMounted
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                      open={Boolean(userMenuAnchor)}
                      onClose={handleUserMenuClose}
                      PaperProps={{
                        elevation: 3,
                        sx: { 
                          mt: 1.5,
                          minWidth: 220,
                          overflow: 'visible',
                          filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
                          '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                          }
                        },
                      }}
                    >
                      <Box sx={{ px: 2, py: 1.5, borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}>
                        <Typography variant="subtitle1" noWrap sx={{ fontWeight: 600 }}>
                          {user.name || user.email}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {user.email}
                        </Typography>
                      </Box>

                      <MenuItem component={Link} to="/dashboard" onClick={handleUserMenuClose}>
                        <ListItemIcon>
                          <DashboardIcon fontSize="small" />
                        </ListItemIcon>
                        Dashboard
                      </MenuItem>

                      <MenuItem onClick={handleUserMenuClose}>
                        <ListItemIcon>
                          <AccountCircleIcon fontSize="small" />
                        </ListItemIcon>
                        Profile
                      </MenuItem>

                      <MenuItem onClick={handleUserMenuClose}>
                        <ListItemIcon>
                          <ApiIcon fontSize="small" />
                        </ListItemIcon>
                        <Typography sx={{ color: theme => theme.palette.mode === 'dark' ? 'text.primary' : 'text.primary', fontWeight: 500 }}>
                          API Keys
                        </Typography>
                      </MenuItem>

                      <MenuItem onClick={handleUserMenuClose}>
                        <ListItemIcon>
                          <SettingsIcon fontSize="small" />
                        </ListItemIcon>
                        Settings
                      </MenuItem>

                      <Divider />

                      <MenuItem onClick={handleLogout}>
                        <ListItemIcon>
                          <LogoutIcon fontSize="small" color="error" />
                        </ListItemIcon>
                        <Typography color="error.main">Logout</Typography>
                      </MenuItem>
                    </Menu>
                  </>
                )}

                {/* Login/Register Buttons for Non-Auth Users on Desktop */}
                {!isMobile && !isAuth && (
                  <>
                    <Button 
                      component={Link} 
                      to="/login" 
                      variant="text" 
                      color="inherit"
                      sx={{
                        ml: 1,
                        color: 'text.primary',
                        fontWeight: 500,
                      }}
                    >
                      Log In
                    </Button>
                    <Button 
                      component={Link} 
                      to="/register" 
                      variant="contained" 
                      color="primary"
                      disableElevation
                      sx={{
                        ml: 1,
                        fontWeight: 500,
                      }}
                    >
                      Sign Up
                    </Button>
                  </>
                )}
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
      </Fade>

      {/* Mobile Menu Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={closeMobileMenu}
        PaperProps={{
          sx: { width: '85%', maxWidth: 320, borderRadius: '16px 0 0 16px' }
        }}
      >
        <Box sx={{ p: 2, borderBottom: '1px solid' + theme.palette.divider }}>
          <Typography variant="h6" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center' }}>
            <FeedIcon sx={{ mr: 1 }} fontSize="small" color="primary" /> Finance News API
          </Typography>
        </Box>
        
        {isAuth && user && (
          <Box sx={{ p: 2, borderBottom: '1px solid ' + theme.palette.divider, display: 'flex', alignItems: 'center' }}>
            <Avatar
              sx={{
                bgcolor: theme.palette.primary.main,
                width: 40,
                height: 40,
                mr: 2
              }}
            >
              {getInitials(user.name || user.email)}
            </Avatar>
            <Box sx={{ overflow: 'hidden' }}>
              <Typography variant="subtitle2" noWrap sx={{ fontWeight: 600 }}>
                {user.name || user.email}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                {user.email}
              </Typography>
            </Box>
          </Box>
        )}

        <List sx={{ mt: 1 }}>
          {navigationItems
            .filter(item => item.showAlways || item.showWhen)
            .map((item) => (
              <ListItemButton
                key={item.path}
                component={Link}
                to={item.path}
                selected={location.pathname === item.path}
                onClick={closeMobileMenu}
                sx={{ 
                  borderRadius: 2,
                  mx: 1,
                  my: 0.5,
                  ...(location.pathname === item.path && {
                    backgroundColor: theme.palette.mode === 'light' 
                      ? 'rgba(37, 99, 235, 0.08)'
                      : 'rgba(96, 165, 250, 0.15)',
                    color: theme.palette.primary.main,
                  })
                }}
              >
                <ListItemIcon 
                  sx={{
                    color: location.pathname === item.path ? theme.palette.primary.main : 'inherit'
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}

          {isAuth && (
            <>
              <Divider sx={{ my: 1.5, mx: 2 }} />
              <ListItemButton
                onClick={handleLogout}
                sx={{ 
                  borderRadius: 2,
                  mx: 1,
                  my: 0.5,
                  color: theme.palette.error.main
                }}
              >
                <ListItemIcon>
                  <LogoutIcon color="error" />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </>
          )}
        </List>
      </Drawer>

      <Box component="main" sx={{ 
        minHeight: 'calc(100vh - 70px)',
        background: theme.palette.mode === 'light' 
          ? 'linear-gradient(145deg, #f8fafc, rgba(236, 244, 255, 0.5))' 
          : 'linear-gradient(145deg, #0f172a, #1e293b)',
        pt: 1
      }}>
        <Routes>
          <Route path="/" element={<Landing isAuth={isAuth} user={user} />} />
          <Route path="/register" element={<Register setUser={setUser} setIsAuth={setIsAuth} />} />
          <Route path="/login" element={<Login setUser={setUser} setIsAuth={setIsAuth} />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/docs" element={<Docs />} />
          <Route path="/news" element={<NewsFeed />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard user={user} /></ProtectedRoute>} />
        </Routes>
      </Box>
    </>
  );
}

function App() {
  return (
    <CustomThemeProvider>
      <AppWithTheme />
    </CustomThemeProvider>
  );
}

function AppWithTheme() {
  const { mode } = useContext(ThemeContext);
  const darkMode = mode === 'dark';
  
  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
