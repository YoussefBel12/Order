import React, { useEffect, useState } from "react";
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
    Stack
} from "@mui/material";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";

const API_BASE_URL = "https://localhost:7094/api";

const MyBills = () => {
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchBills = async () => {
            setLoading(true);
            setError("");
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(`${API_BASE_URL}/bill/mybills`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });
                if (!res.ok) {
                    throw new Error(await res.text());
                }
                const data = await res.json();
                setBills(data);
            } catch (err) {
                setError(err.message || "Failed to load bills.");
            } finally {
                setLoading(false);
            }
        };
        fetchBills();
    }, []);

    return (
        <Box sx={{ p: 4, maxWidth: 900, mx: "auto" }}>
            <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2, bgcolor: "primary.main", color: "white" }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                    <ReceiptLongIcon sx={{ fontSize: 36 }} />
                    <Typography variant="h5" fontWeight={600}>
                        My Bills
                    </Typography>
                </Stack>
            </Paper>
            {loading ? (
                <CircularProgress sx={{ display: "block", mx: "auto", my: 6 }} color="primary" />
            ) : error ? (
                <Alert severity="error">{error}</Alert>
            ) : bills.length === 0 ? (
                <Alert severity="info">No bills found.</Alert>
            ) : (
                <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                    <Table>
                        <TableHead sx={{ bgcolor: "primary.dark" }}>
                            <TableRow>
                                <TableCell sx={{ color: "white" }}>Bill #</TableCell>
                                <TableCell sx={{ color: "white" }}>Date</TableCell>
                                <TableCell sx={{ color: "white" }}>Status</TableCell>
                                <TableCell sx={{ color: "white" }}>Total</TableCell>
                                <TableCell sx={{ color: "white" }}>Items</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {bills.map((bill) => (
                                <TableRow key={bill.id} hover>
                                    <TableCell>{bill.billNumber}</TableCell>
                                    <TableCell>{new Date(bill.date).toLocaleString()}</TableCell>
                                    <TableCell>
                                        <Chip label={bill.status} color={bill.status === "Paid" ? "success" : "warning"} />
                                    </TableCell>
                                    <TableCell>${bill.totalAmount.toFixed(2)}</TableCell>
                                    <TableCell>
                                        <ul style={{ margin: 0, paddingLeft: 16 }}>
                                            {bill.items.map((item) => (
                                                <li key={item.id}>
                                                    {item.description} <b>(${item.amount.toFixed(2)})</b>
                                                </li>
                                            ))}
                                        </ul>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
};

export default MyBills;