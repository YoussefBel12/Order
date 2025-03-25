
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
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from "@mui/material";

const API_BASE_URL = "https://localhost:7094/api";

const OrderManagement = () => {
    const [apiVersion, setApiVersion] = useState("1.0");
    const [rulesEngineVersion, setRulesEngineVersion] = useState("v1");
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
    }, [apiVersion, rulesEngineVersion]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const url =
                apiVersion === "2.0"
                    ? `${API_BASE_URL}/v${apiVersion}/Order?version=${rulesEngineVersion}`
                    : `${API_BASE_URL}/v${apiVersion}/Order`;

            const response = await axios.get(url, {
                headers: { Accept: "text/plain" },
            });

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
            const url =
                apiVersion === "2.0"
                    ? `${API_BASE_URL}/v${apiVersion}/Order?version=${rulesEngineVersion}`
                    : `${API_BASE_URL}/v${apiVersion}/Order`;

            const response = await axios.post(url, newOrder);
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
            await axios.delete(`${API_BASE_URL}/v${apiVersion}/Order/${id}`);
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

            
            <FormControl fullWidth margin="normal">
                <InputLabel>API Version</InputLabel>
                <Select value={apiVersion} onChange={(e) => setApiVersion(e.target.value)}>
                    <MenuItem value="1.0">v1.0 (No Rules Engine)</MenuItem>
                    <MenuItem value="2.0">v2.0 (With Rules Engine)</MenuItem>
                </Select>
            </FormControl>

           
            {apiVersion === "2.0" && (
                <FormControl fullWidth margin="normal">
                    <InputLabel>Rules Engine Version</InputLabel>
                    <Select value={rulesEngineVersion} onChange={(e) => setRulesEngineVersion(e.target.value)}>
                        <MenuItem value="v1">Rules v1</MenuItem>
                        <MenuItem value="v2">Rules v2</MenuItem>
                    </Select>
                </FormControl>
            )}

            
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

