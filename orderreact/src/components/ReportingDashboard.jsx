
/*
import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Grid, Box } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from "recharts";
import axios from "axios";

const apiBase = "https://localhost:7094/api/reports";

export default function ReportingDashboard() {
    const [summary, setSummary] = useState({});
    const [purchasesPerProduct, setPurchasesPerProduct] = useState([]);
    const [purchasesPerDay, setPurchasesPerDay] = useState([]);

    useEffect(() => {
        axios.get(`${apiBase}/summary`).then(res => setSummary(res.data));
        axios.get(`${apiBase}/purchases-per-product`).then(res => {
            setPurchasesPerProduct(res.data);
        });
        axios.get(`${apiBase}/purchases-per-day`).then(res => {
            setPurchasesPerDay(res.data);
        });
    }, []);

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom fontWeight={700}>
                📊 Real-Time Business Dashboard
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ bgcolor: "#1976d2", color: "#fff" }}>
                        <CardContent>
                            <Typography variant="h6">Products</Typography>
                            <Typography variant="h4">{summary.totalProducts ?? "--"}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ bgcolor: "#388e3c", color: "#fff" }}>
                        <CardContent>
                            <Typography variant="h6">Purchases</Typography>
                            <Typography variant="h4">{summary.totalPurchases ?? "--"}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ bgcolor: "#fbc02d", color: "#fff" }}>
                        <CardContent>
                            <Typography variant="h6">Bills</Typography>
                            <Typography variant="h4">{summary.totalBills ?? "--"}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ bgcolor: "#d32f2f", color: "#fff" }}>
                        <CardContent>
                            <Typography variant="h6">Revenue</Typography>
                            <Typography variant="h4">${summary.totalRevenue?.toLocaleString() ?? "--"}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Grid container spacing={3} sx={{ mt: 2 }}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Purchases per Product
                            </Typography>
                            {purchasesPerProduct.length === 0 ? (
                                <Typography color="textSecondary">No purchase data yet.</Typography>
                            ) : (
                                <ResponsiveContainer width="100%" height={250}>
                                    <BarChart data={purchasesPerProduct}>
                                        <XAxis dataKey="productName" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="count" fill="#1976d2" />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Purchases per Day
                            </Typography>
                            {purchasesPerDay.length === 0 ? (
                                <Typography color="textSecondary">No purchase data yet.</Typography>
                            ) : (
                                <ResponsiveContainer width="100%" height={250}>
                                    <LineChart data={purchasesPerDay}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis
                                            dataKey="date"
                                            tickFormatter={d => d ? new Date(d).toLocaleDateString() : ""}
                                        />
                                        <YAxis />
                                        <Tooltip
                                            labelFormatter={d => d ? new Date(d).toLocaleDateString() : ""}
                                        />
                                        <Line type="monotone" dataKey="count" stroke="#388e3c" />
                                    </LineChart>
                                </ResponsiveContainer>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}

*/ //reporting dash up work i keep it as a backup


import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Grid, Box, Paper, Divider, Avatar } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from "recharts";
import axios from "axios";
import AssessmentIcon from '@mui/icons-material/Assessment';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ReceiptIcon from '@mui/icons-material/Receipt';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

const apiBase = "https://localhost:7094/api/reports";

const summaryCards = [
    {
        label: "Products",
        icon: <AssessmentIcon fontSize="large" />,
        color: "#1976d2",
        key: "totalProducts"
    },
    {
        label: "Purchases",
        icon: <ShoppingCartIcon fontSize="large" />,
        color: "#388e3c",
        key: "totalPurchases"
    },
    {
        label: "Bills",
        icon: <ReceiptIcon fontSize="large" />,
        color: "#fbc02d",
        key: "totalBills"
    },
    {
        label: "Revenue",
        icon: <MonetizationOnIcon fontSize="large" />,
        color: "#d32f2f",
        key: "totalRevenue"
    }
];

export default function ReportingDashboard() {
    const [summary, setSummary] = useState({});
    const [purchasesPerProduct, setPurchasesPerProduct] = useState([]);
    const [purchasesPerDay, setPurchasesPerDay] = useState([]);

    useEffect(() => {
        axios.get(`${apiBase}/summary`).then(res => setSummary(res.data));
        axios.get(`${apiBase}/purchases-per-product`).then(res => {
            setPurchasesPerProduct(res.data);
        });
        axios.get(`${apiBase}/purchases-per-day`).then(res => {
            setPurchasesPerDay(res.data);
        });
    }, []);

    return (
        <Box sx={{ display: "flex", minHeight: "80vh", bgcolor: "#f4f6fa" }}>
            {/* Sidebar with summary cards */}
            <Box sx={{ width: 260, p: 3, bgcolor: "#fff", borderRadius: 3, boxShadow: 2, mr: 4, display: "flex", flexDirection: "column", gap: 3, alignItems: "center" }}>
                <Typography variant="h5" fontWeight={700} sx={{ mb: 2, color: "#1976d2" }}>
                    Dashboard
                </Typography>
                {summaryCards.map(card => (
                    <Card key={card.label} sx={{ width: "100%", bgcolor: card.color, color: "#fff", display: "flex", alignItems: "center", p: 2, boxShadow: 0 }}>
                        <Avatar sx={{ bgcolor: "#fff", color: card.color, mr: 2 }}>
                            {card.icon}
                        </Avatar>
                        <Box>
                            <Typography variant="body2">{card.label}</Typography>
                            <Typography variant="h5" fontWeight={700}>
                                {card.key === "totalRevenue"
                                    ? `$${summary[card.key]?.toLocaleString() ?? "--"}`
                                    : summary[card.key] ?? "--"}
                            </Typography>
                        </Box>
                    </Card>
                ))}
            </Box>

            {/* Main content area */}
            <Box sx={{ flex: 1, p: 3 }}>
                <Typography variant="h4" fontWeight={700} sx={{ mb: 3, color: "#222" }}>
                    📈 Business Insights
                </Typography>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <Paper elevation={3} sx={{ p: 3, borderRadius: 3, height: 370, display: "flex", flexDirection: "column" }}>
                            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                                Purchases per Product
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            {purchasesPerProduct.length === 0 ? (
                                <Typography color="textSecondary" sx={{ mt: 8, textAlign: "center" }}>No purchase data yet.</Typography>
                            ) : (
                                <ResponsiveContainer width="100%" height={250}>
                                    <BarChart data={purchasesPerProduct}>
                                        <XAxis dataKey="productName" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="count" fill="#1976d2" radius={[6, 6, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Paper elevation={3} sx={{ p: 3, borderRadius: 3, height: 370, display: "flex", flexDirection: "column" }}>
                            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                                Purchases per Day
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            {purchasesPerDay.length === 0 ? (
                                <Typography color="textSecondary" sx={{ mt: 8, textAlign: "center" }}>No purchase data yet.</Typography>
                            ) : (
                                <ResponsiveContainer width="100%" height={250}>
                                    <LineChart data={purchasesPerDay}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis
                                            dataKey="date"
                                            tickFormatter={d => d ? new Date(d).toLocaleDateString() : ""}
                                        />
                                        <YAxis />
                                        <Tooltip
                                            labelFormatter={d => d ? new Date(d).toLocaleDateString() : ""}
                                        />
                                        <Line type="monotone" dataKey="count" stroke="#388e3c" strokeWidth={3} dot={{ r: 5 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            )}
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
}