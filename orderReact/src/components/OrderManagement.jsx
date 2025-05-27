/*
import { Link } from 'react-router-dom';
import { useState, useEffect } from "react";
import axios from "axios";
import {
    Container,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
    Button,
} from "@mui/material";

const API_BASE_URL = "https://localhost:7094/api";

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [newOrder, setNewOrder] = useState({
        name: "",
        email: "",
        phone: "",
        orderAmount: 0,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/Order`);
            setOrders(response.data);
            setError(null);
        // eslint-disable-next-line no-unused-vars
        } catch (err) {
            setError("Failed to fetch orders");
        }
        setLoading(false);
    };

    const addOrder = async () => {
        setLoading(true);
        try {
            const response = await axios.post(`${API_BASE_URL}/Order`, newOrder);
            setOrders([...orders, { id: response.data, ...newOrder }]);
            setNewOrder({ name: "", email: "", phone: "", orderAmount: 0 });
            setError(null);
        // eslint-disable-next-line no-unused-vars
        } catch (err) {
            setError("Failed to add order");
        }
        setLoading(false);
    };

    const deleteOrder = async (id) => {
        setLoading(true);
        try {
            await axios.delete(`${API_BASE_URL}/Order/${id}`);
            setOrders(orders.filter((order) => order.id !== id));
            setError(null);
        // eslint-disable-next-line no-unused-vars
        } catch (err) {
            setError("Failed to delete order");
        }
        setLoading(false);
    };

    return (
        <Container maxWidth="md">
            <Typography variant="h4" gutterBottom sx={{ color: "purple", fontWeight: "bold" }}>
                Order Management
            </Typography>

            <Paper sx={{ p: 2, mt: 2, backgroundColor: "#f3e5f5" }}>
                <Typography variant="h6" gutterBottom>
                    Add Order
                </Typography>
                <TextField
                    fullWidth
                    label="Name"
                    variant="outlined"
                    value={newOrder.name}
                    onChange={(e) => setNewOrder({ ...newOrder, name: e.target.value })}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    variant="outlined"
                    value={newOrder.email}
                    onChange={(e) => setNewOrder({ ...newOrder, email: e.target.value })}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="Phone"
                    variant="outlined"
                    value={newOrder.phone}
                    onChange={(e) => setNewOrder({ ...newOrder, phone: e.target.value })}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="Order Amount"
                    type="number"
                    variant="outlined"
                    value={newOrder.orderAmount}
                    onChange={(e) => setNewOrder({ ...newOrder, orderAmount: parseInt(e.target.value) })}
                    margin="normal"
                />
                <Button
                    variant="contained"
                    sx={{ backgroundColor: "purple", color: "white", mt: 2 }}
                    onClick={addOrder}
                >
                    Add Order
                </Button>
            </Paper>






            
      
            <div>
            <Link to="/">
                <Button variant="outlined" sx={{ mt: 4, backgroundColor: "#f3e5f5" }}>
                    Go to Home
                </Button>
                </Link>

                <Link to="/Rules">
                    <Button variant="outlined" sx={{ mt: 4, backgroundColor: "#f3e5f5" }}>
                        Go to Rules Management
                    </Button>
                </Link>
            </div>








            {loading ? (
                <Typography sx={{ mt: 2 }}>Loading...</Typography>
            ) : error ? (
                <Typography color="error" sx={{ mt: 2 }}>
                    {error}
                </Typography>
            ) : (
                <TableContainer component={Paper} sx={{ mt: 4 }}>
                    <Table>
                        <TableHead sx={{ backgroundColor: "#6a1b9a" }}>
                            <TableRow>
                                <TableCell sx={{ color: "white" }}>ID</TableCell>
                                <TableCell sx={{ color: "white" }}>Name</TableCell>
                                <TableCell sx={{ color: "white" }}>Email</TableCell>
                                <TableCell sx={{ color: "white" }}>Phone</TableCell>
                                <TableCell sx={{ color: "white" }}>Amount</TableCell>
                                <TableCell sx={{ color: "white" }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell>{order.id}</TableCell>
                                    <TableCell>{order.name}</TableCell>
                                    <TableCell>{order.email}</TableCell>
                                    <TableCell>{order.phone}</TableCell>
                                    <TableCell>${order.orderAmount}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color="error"
                                            onClick={() => deleteOrder(order.id)}
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Container> 
       
                
           
    );
};

export default OrderManagement;
*/




/* second one keep it


import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TextField, Box, CircularProgress, Typography, Snackbar, Alert, Paper,
    Chip, Grid, Tooltip
} from '@mui/material';
import { Delete as DeleteIcon, ArrowBack as ArrowBackIcon, Add as AddIcon } from '@mui/icons-material';

const API_BASE_URL = "https://localhost:7094/api";

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const [newOrder, setNewOrder] = useState({
        name: '',
        email: '',
        phone: '',
        orderAmount: '',
    });

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await axios.get(`${API_BASE_URL}/Order`);
                setOrders(data.map(order => ({
                    ...order,
                    // Ensure orderAmount is a number
                    orderAmount: Number(order.orderAmount) || 0
                })));
            } catch (err) {
                setError(`Failed to load orders: ${err.message}`);
                setSnackbarOpen(true);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
        const interval = setInterval(fetchOrders, 10000);
        return () => clearInterval(interval);
    }, []);

    const addOrder = async () => {
        try {
            if (!newOrder.name || !newOrder.email || !newOrder.phone) {
                throw new Error('Please fill all required fields');
            }

            const orderToCreate = {
                ...newOrder,
                orderAmount: Number(newOrder.orderAmount) || 0
            };

            const { data } = await axios.post(`${API_BASE_URL}/Order`, orderToCreate);

            setOrders(prev => [...prev, {
                ...data,
                orderAmount: Number(data.orderAmount) || 0
            }]);

            setNewOrder({
                name: '',
                email: '',
                phone: '',
                orderAmount: '',
            });

        } catch (err) {
            setError(err.response?.data?.message || err.message);
            setSnackbarOpen(true);
        }
    };

    const deleteOrder = async (id) => {
        if (!window.confirm('Are you sure you want to delete this order?')) return;

        try {
            await axios.delete(`${API_BASE_URL}/Order/${id}`);
            setOrders(prev => prev.filter(order => order.id !== id));
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete order');
            setSnackbarOpen(true);
        }
    };

    const handleSnackbarClose = () => setSnackbarOpen(false);

    if (loading) {
        return <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />;
    }


    return (
        <Box sx={{ p: 4, maxWidth: 1600, margin: '0 auto' }}>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 600, color: 'primary.main' }}>
                    Order Management
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button component={Link} to="/" variant="outlined" startIcon={<ArrowBackIcon />}>
                        Dashboard
                    </Button>
                    <Button component={Link} to="/Rules" variant="outlined" color="secondary">
                        Rules Management
                    </Button>
                </Box>
            </Box>

         
            <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>Create New Order</Typography>
                <Grid container spacing={3}>




                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Name *"
                            value={newOrder.name}
                            onChange={(e) => setNewOrder({ ...newOrder, name: e.target.value })}
                            fullWidth
                            variant="outlined"
                            size="small"
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Email *"
                            type="email"
                            value={newOrder.email}
                            onChange={(e) => setNewOrder({ ...newOrder, email: e.target.value })}
                            fullWidth
                            variant="outlined"
                            size="small"
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Phone *"
                            value={newOrder.phone}
                            onChange={(e) => setNewOrder({ ...newOrder, phone: e.target.value })}
                            fullWidth
                            variant="outlined"
                            size="small"
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Order Amount"
                            type="number"
                            value={newOrder.orderAmount}
                            onChange={(e) => setNewOrder({ ...newOrder, orderAmount: e.target.value })}
                            fullWidth
                            variant="outlined"
                            size="small"
                            InputProps={{
                                startAdornment: '$'
                            }}
                        />
                    </Grid>




                </Grid>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={addOrder}
                    disabled={!newOrder.name || !newOrder.email || !newOrder.phone}
                    startIcon={<AddIcon />}
                    sx={{ mt: 3 }}
                >
                    Add Order
                </Button>
            </Paper>

         
            <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <TableContainer>
                    <Table>
                        <TableHead sx={{ bgcolor: 'primary.main' }}>
                            <TableRow>
                                <TableCell sx={{ color: 'common.white' }}>ID</TableCell>
                                <TableCell sx={{ color: 'common.white' }}>Name</TableCell>
                                <TableCell sx={{ color: 'common.white' }}>Email</TableCell>
                                <TableCell sx={{ color: 'common.white' }}>Phone</TableCell>
                                <TableCell sx={{ color: 'common.white' }}>Amount</TableCell>
                                <TableCell sx={{ color: 'common.white' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orders.map((order) => (
                                <TableRow key={order.id} hover>
                                    <TableCell>{order.id}</TableCell>
                                    <TableCell>{order.name}</TableCell>
                                    <TableCell>{order.email}</TableCell>
                                    <TableCell>{order.phone}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={`$${(Number(order.orderAmount) || 0).toFixed(2)}`}
                                            color="primary"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            startIcon={<DeleteIcon />}
                                            onClick={() => deleteOrder(order.id)}
                                            size="small"
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert severity="error" onClose={handleSnackbarClose}>{error}</Alert>
            </Snackbar>
        </Box>
    );
};

export default OrderManagement;

*/


import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TextField, Box, CircularProgress, Typography, Snackbar, Alert, Paper,
    Chip, Grid, Tooltip
} from '@mui/material';
import { Delete as DeleteIcon, ArrowBack as ArrowBackIcon, Add as AddIcon } from '@mui/icons-material';

const API_BASE_URL = "https://localhost:7094/api";

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const [newOrder, setNewOrder] = useState({
        name: '',
        email: '',
        phone: '',
        orderAmount: '',
    });

    useEffect(() => {
        // this to add jwt heder to request i guess plus addconfig to axios
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
          

        const fetchOrders = async () => {
            try {                                                         //added config here
                const { data } = await axios.get(`${API_BASE_URL}/Order` , config);
                setOrders(data.map(order => ({
                    ...order,
                    orderAmount: Number(order.orderAmount) || 0
                })));
            } catch (err) {
                setError(`Failed to load orders: ${err.message}`);
                setSnackbarOpen(true);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
        const interval = setInterval(fetchOrders, 10000);
        return () => clearInterval(interval);
    }, []); 

    const addOrder = async () => {
        try {
            if (!newOrder.name || !newOrder.email || !newOrder.phone) {
                throw new Error('Please fill all required fields');
            }

            const orderToCreate = {
                ...newOrder,
                orderAmount: Number(newOrder.orderAmount) || 0
            };

            const { data } = await axios.post(`${API_BASE_URL}/Order`, orderToCreate);

            setOrders(prev => [...prev, {
                ...data,
                id: data.id || Date.now(),
                orderAmount: Number(data.orderAmount) || 0
            }]);

            setNewOrder({
                name: '',
                email: '',
                phone: '',
                orderAmount: '',
            });

        } catch (err) {
            setError(err.response?.data?.message || err.message);
            setSnackbarOpen(true);
        }
    };

    const deleteOrder = async (id) => {
        if (!window.confirm('Are you sure you want to delete this order?')) return;

        try {
            await axios.delete(`${API_BASE_URL}/Order/${id}`);
            setOrders(prev => prev.filter(order => order.id !== id));
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete order');
            setSnackbarOpen(true);
        }
    };

    const handleSnackbarClose = () => setSnackbarOpen(false);

    if (loading) {
        return <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />;
    }


    return (
        <Box sx={{ p: 4, maxWidth: 1600, margin: '0 auto' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 600, color: 'primary.main' }}>
                    Order Management
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button component={Link} to="/" variant="outlined" startIcon={<ArrowBackIcon />}>
                        Dashboard
                    </Button>
                    <Button component={Link} to="/Rules" variant="outlined" color="secondary">
                        Rules Management
                    </Button>
                </Box>
            </Box>

            <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>Create New Order</Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Name *"
                            value={newOrder.name}
                            onChange={(e) => setNewOrder({ ...newOrder, name: e.target.value })}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Email *"
                            value={newOrder.email}
                            onChange={(e) => setNewOrder({ ...newOrder, email: e.target.value })}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Phone *"
                            value={newOrder.phone}
                            onChange={(e) => setNewOrder({ ...newOrder, phone: e.target.value })}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Amount"
                            value={newOrder.orderAmount}
                            onChange={(e) => setNewOrder({ ...newOrder, orderAmount: e.target.value })}
                            fullWidth
                            InputProps={{ startAdornment: '$' }}
                        />
                    </Grid>
                </Grid>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={addOrder}
                    disabled={!newOrder.name || !newOrder.email || !newOrder.phone}
                    startIcon={<AddIcon />}
                    sx={{ mt: 3 }}
                >
                    Add Order
                </Button>
            </Paper>

            <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <TableContainer>
                    <Table>
                        <TableHead sx={{ bgcolor: 'primary.main' }}>
                            <TableRow>
                                <TableCell sx={{ color: 'common.white' }}>ID</TableCell>
                                <TableCell sx={{ color: 'common.white' }}>Name</TableCell>
                                <TableCell sx={{ color: 'common.white' }}>Email</TableCell>
                                <TableCell sx={{ color: 'common.white' }}>Phone</TableCell>
                                <TableCell sx={{ color: 'common.white' }}>Amount</TableCell>
                                <TableCell sx={{ color: 'common.white' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orders.map((order) => (
                                <TableRow key={order.id} hover>
                                    <TableCell>{order.id}</TableCell>
                                    <TableCell>{order.name}</TableCell>
                                    <TableCell>{order.email}</TableCell>
                                    <TableCell>{order.phone}</TableCell>
                                    <TableCell>
                                        <Chip label={`$${(Number(order.orderAmount) || 0).toFixed(2)}`} color="primary" />
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            startIcon={<DeleteIcon />}
                                            onClick={() => deleteOrder(order.id)}
                                            size="small"
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert severity="error" onClose={handleSnackbarClose}>{error}</Alert>
            </Snackbar>
        </Box>
    );
};





export default OrderManagement;