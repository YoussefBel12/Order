/*



import { Link } from 'react-router-dom';
import { Box, Button, Typography, Grid, Paper, IconButton, Popover } from '@mui/material';
import { Inventory as InventoryIcon, Rule as RuleIcon, Notifications as NotificationsIcon } from '@mui/icons-material';
import { useState } from 'react';
import NotificationCenter from './NotificationCenter';

const Home = () => {
    const [anchorEl, setAnchorEl] = useState(null);

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
                    <NotificationsIcon />
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
                    <NotificationCenter />
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
            </Grid>
        </Box>
    );
};

export default Home;

*/


import { Link } from 'react-router-dom';
import { Box, Button, Typography, Grid, Paper, IconButton, Popover, Badge } from '@mui/material';
import { Inventory as InventoryIcon, Rule as RuleIcon, Notifications as NotificationsIcon , Store as StoreIcon} from '@mui/icons-material';
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



                {/*i added this for stock management */} 
                <Grid item xs={12} md={/*4*/6}>
                    <Paper elevation={3} sx={{ p: 4, borderRadius: 2/*, bgcolor: 'success.main' */}}>
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