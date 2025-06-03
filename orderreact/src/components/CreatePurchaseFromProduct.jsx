import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Button, MenuItem, Select, Typography, Snackbar } from '@mui/material';

const API_BASE_URL = "https://localhost:7094/api";

const CreatePurchaseFromProduct = () => {
    const [products, setProducts] = useState([]);
    const [selectedProductId, setSelectedProductId] = useState('');
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        const fetchProducts = async () => {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.get(`${API_BASE_URL}/Stock/product`, config);
            setProducts(data);
        };
        fetchProducts();
    }, []);

    const handleCreatePurchase = async () => {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const product = products.find(p => p.id === parseInt(selectedProductId, 10));
        if (!product) return;

        // 1. Create Purchase
        const purchasePayload = {
            name: product.name,
            sku: product.sku,
            description: product.description,
            price: product.price,
            isActive: product.isActive
        };
        try {
            const { data: purchaseId } = await axios.post(`${API_BASE_URL}/Purchase`, purchasePayload, config);

            // 2. Create PurchaseList (userId is set by backend)
            await axios.post(`${API_BASE_URL}/Purchase/lists`, { purchaseId }, config);

            setSnackbar({ open: true, message: 'Purchase and PurchaseList created!', severity: 'success' });
        } catch (err) {
            setSnackbar({ open: true, message: 'Failed to create purchase.', severity: 'error' });
        }
    };

    return (
        <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>Create Purchase from Product</Typography>
            <Select
                value={selectedProductId}
                onChange={e => setSelectedProductId(e.target.value)}
                displayEmpty
                fullWidth
                sx={{ mb: 2 }}
            >
                <MenuItem value="" disabled>Select a product</MenuItem>
                {products.map(product => (
                    <MenuItem key={product.id} value={product.id}>
                        {product.name} (SKU: {product.sku})
                    </MenuItem>
                ))}
            </Select>
            <Button
                variant="contained"
                color="primary"
                disabled={!selectedProductId}
                onClick={handleCreatePurchase}
            >
                Create Purchase
            </Button>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar(s => ({ ...s, open: false }))}
                message={snackbar.message}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            />
        </Box>
    );
};

export default CreatePurchaseFromProduct;