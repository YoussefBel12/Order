/*
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';

const API_BASE_URL = "https://localhost:7094/api";

const RulesManagement = () => {
    const [rules, setRules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [newRule, setNewRule] = useState({
        version: '',
        workflowName: '',
        rules: '', // JSON string
        isActive: true,
    });

    // Fetch all rules
    useEffect(() => {
        const fetchRules = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/RulesManagement`);
                setRules(response.data); // Ensure all rules, including active ones, are correctly loaded
            } catch (err) {
                setError('Error fetching rules.');
            } finally {
                setLoading(false);
            }
        };

        fetchRules();
    }, []);

    // Create a new rule
    const handleCreateRule = async () => {
        try {
            const response = await axios.post(`${API_BASE_URL}/RulesManagement`, newRule);
            alert('Rule created successfully');
            setRules([...rules, response.data]);
            setNewRule({ version: '', workflowName: '', rules: '', isActive: true }); // Reset form
        } catch (err) {
            setError('Error creating rule.');
        }
    };

    // Update rule status to active
    const handleSetActiveRule = async (id) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/RulesManagement/set-active/${id}`);
            alert(response.data.Message || "Rule activated successfully");

            // Update state to reflect all active rules
            setRules((prevRules) => {
                const updatedRules = prevRules.map((rule) =>
                    rule.id === id
                        ? { ...rule, isActive: true } // Activate this rule
                        : rule.workflowName === prevRules.find((r) => r.id === id).workflowName
                            ? { ...rule, isActive: false } // Deactivate others in the same workflow
                            : rule
                );
                return updatedRules;
            });
        } catch (err) {
            setError('Error setting active rule.');
        }
    };



    // Delete a rule
    const handleDeleteRule = async (id) => {
        try {
            await axios.delete(`${API_BASE_URL}/RulesManagement/${id}`);
            alert('Rule deleted successfully');
            setRules(rules.filter((rule) => rule.id !== id));
        } catch (err) {
            setError('Error deleting rule.');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h2>Rules Management</h2>

           
            <div>
                <TextField
                    label="Version"
                    value={newRule.version}
                    onChange={(e) => setNewRule({ ...newRule, version: e.target.value })}
                />
                <TextField
                    label="Workflow Name"
                    value={newRule.workflowName}
                    onChange={(e) => setNewRule({ ...newRule, workflowName: e.target.value })}
                />
                <TextField
                    label="Rules (JSON)"
                    multiline
                    rows={4}
                    value={newRule.rules}
                    onChange={(e) => setNewRule({ ...newRule, rules: e.target.value })}
                />
                <Button variant="contained" color="primary" onClick={handleCreateRule}>
                    Create New Rule
                </Button>
            </div>

           
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Version</TableCell>
                            <TableCell>Workflow Name</TableCell>
                            <TableCell>Rules</TableCell>
                            <TableCell>Active</TableCell>
                            <TableCell>Created Date</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rules.map((rule) => (
                            <TableRow key={rule.id}>
                                <TableCell>{rule.version}</TableCell>
                                <TableCell>{rule.workflowName}</TableCell>
                                <TableCell>{rule.rules}</TableCell>
                                <TableCell>{rule.isActive ? 'Yes' : 'No'}</TableCell>
                                <TableCell>{new Date(rule.createdDate).toLocaleString()}</TableCell>
                                <TableCell>
                                    {!rule.isActive && (
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => handleSetActiveRule(rule.id)}
                                        >
                                            Set as Active
                                        </Button>
                                    )}
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => handleDeleteRule(rule.id)}
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default RulesManagement;
*/

import { Link } from 'react-router-dom' ;
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Box, CircularProgress, Typography, Snackbar, Alert } from '@mui/material';

const API_BASE_URL = "https://localhost:7094/api";

const RulesManagement = () => {
    const [rules, setRules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [newRule, setNewRule] = useState({
        version: '',
        workflowName: '',
        rules: '', // JSON string
        isActive: true,
    });
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    // Fetch all rules
    useEffect(() => {
        const fetchRules = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/RulesManagement`);
                setRules(response.data);
            // eslint-disable-next-line no-unused-vars
            } catch (err) {
                setError('Error fetching rules.');
            } finally {
                setLoading(false);
            }
        };

        fetchRules();

        // Polling to keep the active status real-time
        const interval = setInterval(fetchRules, 5000); // Refresh every 5 seconds

        return () => clearInterval(interval); // Cleanup interval on unmount
    }, []);

    // Create a new rule
    const handleCreateRule = async () => {
        try {
            const response = await axios.post(`${API_BASE_URL}/RulesManagement`, newRule);
            alert('Rule created successfully');
            setRules([...rules, response.data]);
            setNewRule({ version: '', workflowName: '', rules: '', isActive: true }); // Reset form
        // eslint-disable-next-line no-unused-vars
        } catch (err) {
            setError('Error creating rule.');
        }
    };

    // Update rule status to active or inactive
    const handleSetActiveRule = async (id) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/RulesManagement/set-active/${id}`);
            alert(response.data.Message || "Rule status updated.");
            setRules((prevRules) =>
                prevRules.map((rule) =>
                    rule.id === id ? { ...rule, isActive: !rule.isActive } : rule
                )
            );
        // eslint-disable-next-line no-unused-vars
        } catch (err) {
            setError('Error updating rule status.');
        }
    };

    // Delete a rule
    const handleDeleteRule = async (id) => {
        try {
            await axios.delete(`${API_BASE_URL}/RulesManagement/${id}`);
            alert('Rule deleted successfully');
            setRules(rules.filter((rule) => rule.id !== id));
        // eslint-disable-next-line no-unused-vars
        } catch (err) {
            setError('Error deleting rule.');
        }
    };

    // Snackbar close handler
    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom align="center" color="primary">
                Rules Management
            </Typography>

            <Link to="/">
                <Button variant="outlined" color="primary" sx={{ marginBottom: '20px' }}>
                    Back to Home
                </Button>
            </Link>
            <Link to="/Order">
                <Button variant="outlined" color="primary" sx={{ marginBottom: '20px' }}>
                    Go To Order Management
                </Button>
            </Link>

            {/* New Rule Form */}
            <Box sx={{ display: 'grid', gap: 2, mb: 4 }}>
                <TextField
                    label="Version"
                    value={newRule.version}
                    onChange={(e) => setNewRule({ ...newRule, version: e.target.value })}
                    variant="outlined"
                    fullWidth
                    size="small"
                />
                <TextField
                    label="Workflow Name"
                    value={newRule.workflowName}
                    onChange={(e) => setNewRule({ ...newRule, workflowName: e.target.value })}
                    variant="outlined"
                    fullWidth
                    size="small"
                />
                <TextField
                    label="Rules (JSON)"
                    multiline
                    rows={4}
                    value={newRule.rules}
                    onChange={(e) => setNewRule({ ...newRule, rules: e.target.value })}
                    variant="outlined"
                    fullWidth
                    size="small"
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCreateRule}
                    sx={{ mt: 2 }}
                >
                    Create New Rule
                </Button>
            </Box>

            {/* Rules Table */}
            <TableContainer sx={{ boxShadow: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Version</TableCell>
                            <TableCell>Workflow Name</TableCell>
                            <TableCell>Rules</TableCell>
                            <TableCell>Active</TableCell>
                            <TableCell>Created Date</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rules.map((rule) => (
                            <TableRow key={rule.id}>
                                <TableCell>{rule.version}</TableCell>
                                <TableCell>{rule.workflowName}</TableCell>
                                <TableCell>{rule.rules}</TableCell>
                                <TableCell>
                                    <Box
                                        sx={{
                                            width: 16,
                                            height: 16,
                                            borderRadius: '50%',
                                            backgroundColor: rule.isActive ? 'green' : 'red',
                                            display: 'inline-block',
                                        }}
                                    />
                                </TableCell>
                                <TableCell>{new Date(rule.createdDate).toLocaleString()}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color={rule.isActive ? "secondary" : "primary"}
                                        onClick={() => handleSetActiveRule(rule.id)}
                                        sx={{ mr: 1 }}
                                    >
                                        {rule.isActive ? 'Deactivate' : 'Activate'}
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => handleDeleteRule(rule.id)}
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Snackbar for error messages */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
            >
                <Alert severity="error" onClose={handleSnackbarClose} sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default RulesManagement;

