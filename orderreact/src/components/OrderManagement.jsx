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
