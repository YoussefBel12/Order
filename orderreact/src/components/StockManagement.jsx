import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    CircularProgress,
    Alert,
    Chip
} from '@mui/material';
import { Store as StoreIcon } from '@mui/icons-material';

const API_BASE_URL = "https://localhost:7094/api";

const StockManagement = () => {
    const [stocks, setStocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStocks = async () => {
            setLoading(true);
            setError('');
            try {
                const token = localStorage.getItem('token');
                const config = {
                    headers: { Authorization: `Bearer ${token}` }
                };
                const { data } = await axios.get(`${API_BASE_URL}/Stock/stock`, config);
                setStocks(data);
            } catch (err) {
                setError('Failed to load stock data.');
            } finally {
                setLoading(false);
            }
        };
        fetchStocks();
    }, []);

    return (
        <Box sx={{ p: 4, maxWidth: 1200, margin: '0 auto' }}>
            <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 2, bgcolor: 'success.main', color: 'white' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <StoreIcon sx={{ fontSize: 40, mr: 2 }} />
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
                        Stock Management
                    </Typography>
                </Box>
                <Typography variant="body1">
                    View all product stock levels and warehouse assignments.
                </Typography>
            </Paper>
            {loading ? (
                <CircularProgress sx={{ display: 'block', margin: '40px auto' }} color="success" />
            ) : error ? (
                <Alert severity="error">{error}</Alert>
            ) : (
                <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                    <Table>
                        <TableHead sx={{ bgcolor: 'success.dark' }}>
                            <TableRow>
                                <TableCell sx={{ color: 'white' }}>ID</TableCell>
                                <TableCell sx={{ color: 'white' }}>Product</TableCell>
                                <TableCell sx={{ color: 'white' }}>Warehouse</TableCell>
                                <TableCell sx={{ color: 'white' }}>Quantity</TableCell>
                                <TableCell sx={{ color: 'white' }}>Last Updated</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {stocks.map((stock) => (
                                <TableRow key={stock.id} hover>
                                    <TableCell>{stock.id}</TableCell>
                                    <TableCell>
                                        <Chip label={stock.productName || 'N/A'} color="success" />
                                    </TableCell>
                                    <TableCell>
                                        <Chip label={stock.warehouseName || 'N/A'} color="success" variant="outlined" />
                                    </TableCell>
                                    <TableCell>{stock.quantity}</TableCell>
                                    <TableCell>{new Date(stock.lastUpdated).toLocaleString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
};

export default StockManagement;