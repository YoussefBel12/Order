
/*
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

*/

/* eslint-disable no-unused-vars */
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
    Chip,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Snackbar,
    Stack
} from '@mui/material';
import { Store as StoreIcon, Add as AddIcon, Warehouse as WarehouseIcon, Inventory2 as ProductIcon } from '@mui/icons-material';

const API_BASE_URL = "https://localhost:7094/api";

const StockManagement = () => {
    const [stocks, setStocks] = useState([]);
    const [products, setProducts] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [openAddStockDialog, setOpenAddStockDialog] = useState(false);
    const [openAddProductDialog, setOpenAddProductDialog] = useState(false);
    const [openAddWarehouseDialog, setOpenAddWarehouseDialog] = useState(false);

    const [addStockForm, setAddStockForm] = useState({
        productId: '',
        warehouseId: '',
        quantity: ''
    });
    const [addProductForm, setAddProductForm] = useState({
        name: '',
        sku: '',
        description: '',
        price: '',
        isActive: true
    });
    const [addWarehouseForm, setAddWarehouseForm] = useState({
        name: '',
        location: '',
        isActive: true
    });
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // Fetch stocks, products, and warehouses
    const fetchAll = async () => {
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const [stocksRes, productsRes, warehousesRes] = await Promise.all([
                axios.get(`${API_BASE_URL}/Stock/stock`, config),
                axios.get(`${API_BASE_URL}/Stock/product`, config),
                axios.get(`${API_BASE_URL}/Stock/warehouse`, config)
            ]);
            setStocks(stocksRes.data);
            setProducts(productsRes.data);
            setWarehouses(warehousesRes.data);
        } catch (err) {
            setError('Failed to load stock, product, or warehouse data.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAll();
    }, []);

    // Dialog open/close handlers
    const handleOpenAddStockDialog = () => setOpenAddStockDialog(true);
    const handleCloseAddStockDialog = () => {
        setOpenAddStockDialog(false);
        setAddStockForm({ productId: '', warehouseId: '', quantity: '' });
    };

    const handleOpenAddProductDialog = () => setOpenAddProductDialog(true);
    const handleCloseAddProductDialog = () => {
        setOpenAddProductDialog(false);
        setAddProductForm({ name: '', sku: '', description: '', price: '', isActive: true });
    };

    const handleOpenAddWarehouseDialog = () => setOpenAddWarehouseDialog(true);
    const handleCloseAddWarehouseDialog = () => {
        setOpenAddWarehouseDialog(false);
        setAddWarehouseForm({ name: '', location: '', isActive: true });
    };

    // Form change handlers
    const handleAddStockFormChange = (e) => {
        const { name, value } = e.target;
        setAddStockForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddProductFormChange = (e) => {
        const { name, value } = e.target;
        setAddProductForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddWarehouseFormChange = (e) => {
        const { name, value } = e.target;
        setAddWarehouseForm((prev) => ({ ...prev, [name]: value }));
    };

    // Add new stock entry
    const handleAddStock = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const payload = {
                productId: parseInt(addStockForm.productId, 10),
                warehouseId: parseInt(addStockForm.warehouseId, 10),
                quantity: parseInt(addStockForm.quantity, 10)
            };
            await axios.post(`${API_BASE_URL}/Stock/stock`, payload, config);
            setSnackbar({ open: true, message: 'Stock added successfully!', severity: 'success' });
            await fetchAll();
            handleCloseAddStockDialog();
        } catch (err) {
            setSnackbar({ open: true, message: 'Failed to add stock.', severity: 'error' });
        }
    };

    // Add new product
    const handleAddProduct = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const payload = {
                name: addProductForm.name,
                sku: addProductForm.sku,
                description: addProductForm.description,
                price: parseFloat(addProductForm.price),
                isActive: addProductForm.isActive
            };
            await axios.post(`${API_BASE_URL}/Stock/product`, payload, config);
            setSnackbar({ open: true, message: 'Product added successfully!', severity: 'success' });
            await fetchAll();
            handleCloseAddProductDialog();
        } catch (err) {
            setSnackbar({ open: true, message: 'Failed to add product.', severity: 'error' });
        }
    };

    // Add new warehouse
    const handleAddWarehouse = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const payload = {
                name: addWarehouseForm.name,
                location: addWarehouseForm.location,
                isActive: addWarehouseForm.isActive
            };
            await axios.post(`${API_BASE_URL}/Stock/warehouse`, payload, config);
            setSnackbar({ open: true, message: 'Warehouse added successfully!', severity: 'success' });
            await fetchAll();
            handleCloseAddWarehouseDialog();
        } catch (err) {
            setSnackbar({ open: true, message: 'Failed to add warehouse.', severity: 'error' });
        }
    };

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
                <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                    <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<AddIcon />}
                        onClick={handleOpenAddStockDialog}
                    >
                        Add Stock
                    </Button>
                    <Button
                        variant="contained"
                        color="info"
                        startIcon={<ProductIcon />}
                        onClick={handleOpenAddProductDialog}
                    >
                        Add Product
                    </Button>
                    <Button
                        variant="contained"
                        color="warning"
                        startIcon={<WarehouseIcon />}
                        onClick={handleOpenAddWarehouseDialog}
                    >
                        Add Warehouse
                    </Button>
                </Stack>
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
                                        <Chip
                                            label={stock.productName || stock.product?.name || 'N/A'}
                                            color="success"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={stock.warehouseName || stock.warehouse?.name || 'N/A'}
                                            color="success"
                                            variant="outlined"
                                        />
                                    </TableCell>
                                    <TableCell>{stock.quantity}</TableCell>
                                    <TableCell>
                                        {stock.lastUpdated
                                            ? new Date(stock.lastUpdated).toLocaleString()
                                            : 'N/A'}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Add Stock Dialog */}
            <Dialog open={openAddStockDialog} onClose={handleCloseAddStockDialog} maxWidth="xs" fullWidth>
                <DialogTitle>Add Stock</DialogTitle>
                <DialogContent>
                    <TextField
                        select
                        label="Product"
                        name="productId"
                        value={addStockForm.productId}
                        onChange={handleAddStockFormChange}
                        fullWidth
                        margin="normal"
                        required
                    >
                        {products.map((product) => (
                            <MenuItem key={product.id} value={product.id}>
                                {product.name}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        select
                        label="Warehouse"
                        name="warehouseId"
                        value={addStockForm.warehouseId}
                        onChange={handleAddStockFormChange}
                        fullWidth
                        margin="normal"
                        required
                    >
                        {warehouses.map((warehouse) => (
                            <MenuItem key={warehouse.id} value={warehouse.id}>
                                {warehouse.name}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        label="Quantity"
                        name="quantity"
                        type="number"
                        value={addStockForm.quantity}
                        onChange={handleAddStockFormChange}
                        fullWidth
                        margin="normal"
                        required
                        inputProps={{ min: 0 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAddStockDialog}>Cancel</Button>
                    <Button
                        onClick={handleAddStock}
                        variant="contained"
                        color="success"
                        disabled={
                            !addStockForm.productId ||
                            !addStockForm.warehouseId ||
                            !addStockForm.quantity ||
                            isNaN(Number(addStockForm.quantity))
                        }
                    >
                        Add
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Add Product Dialog */}
            <Dialog open={openAddProductDialog} onClose={handleCloseAddProductDialog} maxWidth="xs" fullWidth>
                <DialogTitle>Add Product</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Name"
                        name="name"
                        value={addProductForm.name}
                        onChange={handleAddProductFormChange}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <TextField
                        label="SKU"
                        name="sku"
                        value={addProductForm.sku}
                        onChange={handleAddProductFormChange}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <TextField
                        label="Description"
                        name="description"
                        value={addProductForm.description}
                        onChange={handleAddProductFormChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Price"
                        name="price"
                        type="number"
                        value={addProductForm.price}
                        onChange={handleAddProductFormChange}
                        fullWidth
                        margin="normal"
                        required
                        inputProps={{ min: 0, step: 0.01 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAddProductDialog}>Cancel</Button>
                    <Button
                        onClick={handleAddProduct}
                        variant="contained"
                        color="info"
                        disabled={
                            !addProductForm.name ||
                            !addProductForm.sku ||
                            !addProductForm.price ||
                            isNaN(Number(addProductForm.price))
                        }
                    >
                        Add
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Add Warehouse Dialog */}
            <Dialog open={openAddWarehouseDialog} onClose={handleCloseAddWarehouseDialog} maxWidth="xs" fullWidth>
                <DialogTitle>Add Warehouse</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Name"
                        name="name"
                        value={addWarehouseForm.name}
                        onChange={handleAddWarehouseFormChange}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <TextField
                        label="Location"
                        name="location"
                        value={addWarehouseForm.location}
                        onChange={handleAddWarehouseFormChange}
                        fullWidth
                        margin="normal"
                        required
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAddWarehouseDialog}>Cancel</Button>
                    <Button
                        onClick={handleAddWarehouse}
                        variant="contained"
                        color="warning"
                        disabled={
                            !addWarehouseForm.name ||
                            !addWarehouseForm.location
                        }
                    >
                        Add
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for feedback */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
                message={snackbar.message}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                ContentProps={{
                    sx: { bgcolor: snackbar.severity === 'success' ? 'success.main' : 'error.main', color: 'white' }
                }}
            />
        </Box>
    );
};

export default StockManagement;