
/*
import { Link } from 'react-router-dom';
import { Box, Button, Typography, Grid, Paper, IconButton, Popover, Badge } from '@mui/material';
import { Inventory as InventoryIcon, Rule as RuleIcon, Notifications as NotificationsIcon, Store as StoreIcon } from '@mui/icons-material';
import { useState } from 'react';
import NotificationCenter from './NotificationCenter';


const Home = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [unconfirmedCount, setUnconfirmedCount] = useState(0);

    const handleOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    return (
        <Box sx={{ p: 4, maxWidth: 1600, margin: '0 auto' }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <IconButton color="primary" onClick={handleOpen}>
                    <Badge
                        badgeContent={unconfirmedCount > 0 ? unconfirmedCount : null}
                        color="error"
                        overlap="circular"
                    >
                        <NotificationsIcon />
                    </Badge>
                </IconButton>
                <Popover
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    PaperProps={{ sx: { minWidth: 350, maxWidth: 400 } }}
                >
                    <NotificationCenter onUnconfirmedCountChange={setUnconfirmedCount} />
                </Popover>
            </Box>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 600, color: 'primary.main', mb: 4 }}>
                Welcome to the Dashboard
            </Typography>

            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Manage Orders
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                            View, add, and delete customer orders.
                        </Typography>
                        <Button
                            component={Link}
                            to="/Order"
                            variant="contained"
                            color="primary"
                            startIcon={<InventoryIcon />}
                            fullWidth
                        >
                            Go to Order Management
                        </Button>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Manage Rules
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                            Configure business rules for order processing.
                        </Typography>
                        <Button
                            component={Link}
                            to="/Rules"
                            variant="contained"
                            color="secondary"
                            startIcon={<RuleIcon />}
                            fullWidth
                        >
                            Go to Rules Management
                        </Button>
                    </Paper>
                </Grid>



             
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 4, borderRadius: 2,  }}>
                        <Typography variant="h6" gutterBottom>
                            Manage Stock
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                            View, add, and update product stock and warehouses.
                        </Typography>
                        <Button
                            component={Link}
                            to="/Stock"
                            variant="contained"
                            sx={{ bgcolor: 'success.dark', '&:hover': { bgcolor: 'success.light' } }}
                            startIcon={<StoreIcon />}
                            fullWidth
                        >
                            Go to Stock Management
                        </Button>
                    </Paper>
                </Grid>










            </Grid>
        </Box>
    );
};

export default Home;

*/
//up is same but only stockmanager see things



import { Link } from 'react-router-dom';
import { Box, Button, Typography, Grid, Paper, IconButton, Popover, Badge } from '@mui/material';
import { Inventory as InventoryIcon, Rule as RuleIcon, Notifications as NotificationsIcon, Store as StoreIcon } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import NotificationCenter from './NotificationCenter';

// Helper to get user role from token (fetches from API/me endpoint)
async function fetchUserRole() {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
        const res = await fetch('https://localhost:7094/api/account/me', {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) return null;
        const data = await res.json();
        return data.role?.toLowerCase() || null;
    } catch {
        return null;
    }
}

const Home = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [unconfirmedCount, setUnconfirmedCount] = useState(0);
    const [userRole, setUserRole] = useState(null);
    const [loadingRole, setLoadingRole] = useState(true);

    useEffect(() => {
        let mounted = true;
        fetchUserRole().then(role => {
            if (mounted) {
                setUserRole(role);
                setLoadingRole(false);
            }
        });
        return () => { mounted = false; };
    }, []);

    const handleOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    if (loadingRole) {
        return (
            <Box sx={{ p: 4, maxWidth: 1600, margin: '0 auto', textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">Loading...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 4, maxWidth: 1600, margin: '0 auto' }}>
            {userRole === 'stockmanager' ? (
                <>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                        <IconButton color="primary" onClick={handleOpen}>
                            <Badge
                                badgeContent={unconfirmedCount > 0 ? unconfirmedCount : null}
                                color="error"
                                overlap="circular"
                            >
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
                        <Popover
                            open={open}
                            anchorEl={anchorEl}
                            onClose={handleClose}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            PaperProps={{ sx: { minWidth: 350, maxWidth: 400 } }}
                        >
                            <NotificationCenter onUnconfirmedCountChange={setUnconfirmedCount} />
                        </Popover>
                    </Box>
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 600, color: 'primary.main', mb: 4 }}>
                        Welcome to the Dashboard
                    </Typography>
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={6}>
                            <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                                <Typography variant="h6" gutterBottom>
                                    Manage Orders
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 2 }}>
                                    View, add, and delete customer orders.
                                </Typography>
                                <Button
                                    component={Link}
                                    to="/Order"
                                    variant="contained"
                                    color="primary"
                                    startIcon={<InventoryIcon />}
                                    fullWidth
                                >
                                    Go to Order Management
                                </Button>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                                <Typography variant="h6" gutterBottom>
                                    Manage Rules
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 2 }}>
                                    Configure business rules for order processing.
                                </Typography>
                                <Button
                                    component={Link}
                                    to="/Rules"
                                    variant="contained"
                                    color="secondary"
                                    startIcon={<RuleIcon />}
                                    fullWidth
                                >
                                    Go to Rules Management
                                </Button>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                                <Typography variant="h6" gutterBottom>
                                    Manage Stock
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 2 }}>
                                    View, add, and update product stock and warehouses.
                                </Typography>
                                <Button
                                    component={Link}
                                    to="/Stock"
                                    variant="contained"
                                    sx={{ bgcolor: 'success.dark', '&:hover': { bgcolor: 'success.light' } }}
                                    startIcon={<StoreIcon />}
                                    fullWidth
                                >
                                    Go to Stock Management
                                </Button>
                            </Paper>
                        </Grid>
                    </Grid>
                </>
            ) : (
                <Typography variant="h4" component="h1" sx={{ fontWeight: 600, color: 'primary.main', mb: 4, textAlign: 'center' }}>
                    Welcome to the Dashboard
                </Typography>
            )}
        </Box>
    );
};

export default Home;