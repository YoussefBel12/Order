/*
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div>
            <h1>This is the Home Page To Test</h1>
            <div>
                <Link to="/Order">
                    <button>Go to Order Management</button>
                </Link>
                <Link to="/Rules">
                    <button>Go to Rules Management</button>
                </Link>
            </div>
        </div>
    );
};

export default Home;
*/

import { Link } from 'react-router-dom';
import { Box, Button, Typography, Grid, Paper } from '@mui/material';
import { Inventory as InventoryIcon, Rule as RuleIcon } from '@mui/icons-material';

const Home = () => {
    return (
        <Box sx={{ p: 4, maxWidth: 1600, margin: '0 auto' }}>
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

