import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';

// A reusable Coming Soon dialog for paid plans
export default function ComingSoonDialog({ open, onClose, planName }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 2,
          px: { xs: 1, sm: 2 },
          py: 2
        }
      }}
    >
      <DialogTitle sx={{ 
        fontWeight: 700,
        textAlign: 'center',
        fontSize: '1.5rem',
        pb: 1
      }}>
        {planName} Plan - Coming Soon!
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ mb: 2, textAlign: 'center' }}>
          <Chip 
            icon={<AccessTimeIcon />} 
            label="LAUNCHING SOON" 
            color="warning" 
            variant="outlined"
            sx={{ fontWeight: 600, mb: 2 }}
          />
        </Box>
        
        <DialogContentText sx={{ textAlign: 'center' }}>
          We're currently working on the {planName} plan. This plan will include more features and higher request limits.
        </DialogContentText>
        
        <Box sx={{ 
          my: 3,
          p: 2, 
          bgcolor: 'background.paper', 
          border: '1px dashed',
          borderColor: 'warning.main',
          borderRadius: 2,
          textAlign: 'center'
        }}>
          <PriorityHighIcon color="warning" sx={{ fontSize: 40, mb: 1 }} />
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            Want to be notified when this plan becomes available?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Leave your email with us, and we'll let you know when we launch.
          </Typography>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ flexDirection: 'column', px: 3, pb: 3 }}>
        <Button
          variant="contained"
          color="warning"
          fullWidth
          size="large"
          startIcon={<NotificationsIcon />}
          onClick={onClose}
          sx={{ mb: 1, py: 1 }}
        >
          Notify Me When Available
        </Button>
        <Button 
          onClick={onClose} 
          color="inherit"
          size="small"
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}