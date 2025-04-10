/* eslint-disable no-unused-vars */
/*


import { Link } from 'react-router-dom';
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
        expirationDate: '', // New field for expiration date input as a string
        isActive: true,
    });
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    // Fetch all rules
    useEffect(() => {
        const fetchRules = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/RulesManagement`);
                setRules(response.data);
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
            // Convert the typed expiration date to UTC if provided
            const ruleToPost = {
                ...newRule,
                expirationDate: newRule.expirationDate
                    ? new Date(newRule.expirationDate).toISOString()
                    : null
            };

            const response = await axios.post(`${API_BASE_URL}/RulesManagement`, ruleToPost);
            alert('Rule created successfully');
            setRules([...rules, response.data]);
            // Reset the form fields
            setNewRule({ version: '', workflowName: '', rules: '', expirationDate: '', isActive: true });
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
          
                <TextField
                    label="Expiration Date & Time"
                    type="datetime-local"
                    value={newRule.expirationDate}
                    onChange={(e) => setNewRule({ ...newRule, expirationDate: e.target.value })}
                    variant="outlined"
                    fullWidth
                    size="small"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    helperText="Select a date and time; leave empty for no expiration."
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

            <TableContainer sx={{ boxShadow: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Version</TableCell>
                            <TableCell>Workflow Name</TableCell>
                            <TableCell>Rules</TableCell>
                            <TableCell>Expiration Date (UTC)</TableCell>
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
                                    {rule.expirationDate
                                        ? new Date(rule.expirationDate).toLocaleString()
                                        : 'No Expiration'}
                                </TableCell>
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
*/
//this one up keep it it works and json rule string here is typed directly use it as backup










/*
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Box,
    CircularProgress,
    Typography,
    Snackbar,
    Alert,
    Paper,
    List,
    ListItem,
    ListItemText,
    IconButton
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';

const API_BASE_URL = "https://localhost:7094/api";

const RulesManagement = () => {
    const [rules, setRules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const [newRule, setNewRule] = useState({
        version: '',
        workflowName: '',
        rules: [], // Stores array of rule objects directly
        expirationDate: '',
        isActive: true,
    });

    const [currentRule, setCurrentRule] = useState({
        RuleName: '',
        Expression: '',
        SuccessEvent: '',
        ErrorMessage: ''
    });

    // Fetch all rules with direct array parsing
    useEffect(() => {
        const fetchRules = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/RulesManagement`);
                // Parse rules as direct array
                const parsedRules = response.data.map(rule => ({
                    ...rule,
                    rules: rule.rules ? JSON.parse(rule.rules) : []
                }));
                setRules(parsedRules);
            } catch (err) {
                setError('Error fetching rules.');
                setSnackbarOpen(true);
            } finally {
                setLoading(false);
            }
        };

        fetchRules();
        const interval = setInterval(fetchRules, 5000);
        return () => clearInterval(interval);
    }, []);

    // Add rule to collection (unchanged)
    const addRuleToCollection = () => {
        if (currentRule.RuleName && currentRule.Expression) {
            setNewRule(prev => ({
                ...prev,
                rules: [...prev.rules, currentRule]
            }));
            setCurrentRule({
                RuleName: '',
                Expression: '',
                SuccessEvent: '',
                ErrorMessage: ''
            });
        }
    };

    // Remove rule from collection (unchanged)
    const removeRuleFromCollection = (index) => {
        setNewRule(prev => ({
            ...prev,
            rules: prev.rules.filter((_, i) => i !== index)
        }));
    };

    // Create rule with direct array stringification
    const handleCreateRule = async () => {
        try {
            const ruleData = {
                version: newRule.version,
                workflowName: newRule.workflowName,
                rules: JSON.stringify(newRule.rules), // Direct array stringify
                expirationDate: newRule.expirationDate
                    ? new Date(newRule.expirationDate).toISOString()
                    : null,
                isActive: newRule.isActive
            };

            await axios.post(`${API_BASE_URL}/RulesManagement`, ruleData);
            alert('Rule created successfully');

            // Reset form
            setNewRule({
                version: '',
                workflowName: '',
                rules: [],
                expirationDate: '',
                isActive: true
            });

            // Refresh list
            const response = await axios.get(`${API_BASE_URL}/RulesManagement`);
            setRules(response.data.map(r => ({ ...r, rules: r.rules ? JSON.parse(r.rules) : [] })));

        } catch (err) {
            setError('Error creating rule: ' + (err.response?.data || err.message));
            setSnackbarOpen(true);
        }
    };

    // Toggle active status (unchanged)
    const handleSetActiveRule = async (id) => {
        try {
            await axios.put(`${API_BASE_URL}/RulesManagement/set-active/${id}`);
            setRules(prev => prev.map(rule =>
                rule.id === id ? { ...rule, isActive: !rule.isActive } : rule
            ));
        } catch (err) {
            setError('Error updating status: ' + (err.response?.data || err.message));
            setSnackbarOpen(true);
        }
    };

    // Delete rule (unchanged)
    const handleDeleteRule = async (id) => {
        try {
            await axios.delete(`${API_BASE_URL}/RulesManagement/${id}`);
            setRules(rules.filter(rule => rule.id !== id));
        } catch (err) {
            setError('Error deleting rule: ' + (err.response?.data || err.message));
            setSnackbarOpen(true);
        }
    };

    const handleSnackbarClose = () => setSnackbarOpen(false);

    if (loading) return <CircularProgress sx={{ display: 'block', margin: 'auto' }} />;
    if (error) return <Alert severity="error">{error}</Alert>;


    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom align="center">
                Rules Management
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <Link to="/"><Button variant="outlined">Home</Button></Link>
                <Link to="/Order"><Button variant="outlined">Order Management</Button></Link>
            </Box>

           
            <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                <Box sx={{ display: 'grid', gap: 2 }}>
                    <TextField
                        label="Version"
                        value={newRule.version}
                        onChange={(e) => setNewRule({ ...newRule, version: e.target.value })}
                        required
                    />
                    <TextField
                        label="Workflow Name"
                        value={newRule.workflowName}
                        onChange={(e) => setNewRule({ ...newRule, workflowName: e.target.value })}
                        required
                    />

                    
                    <Paper elevation={2} sx={{ p: 2, mt: 1 }}>
                        <Typography variant="h6">Add Rule</Typography>
                        <Box sx={{ display: 'grid', gap: 2, mt: 1 }}>
                            <TextField
                                label="Rule Name"
                                value={currentRule.RuleName}
                                onChange={(e) => setCurrentRule({ ...currentRule, RuleName: e.target.value })}
                                required
                            />
                            <TextField
                                label="Expression"
                                value={currentRule.Expression}
                                onChange={(e) => setCurrentRule({ ...currentRule, Expression: e.target.value })}
                                required
                                multiline
                                rows={2}
                            />
                            <TextField
                                label="Success Event"
                                value={currentRule.SuccessEvent}
                                onChange={(e) => setCurrentRule({ ...currentRule, SuccessEvent: e.target.value })}
                            />
                            <TextField
                                label="Error Message"
                                value={currentRule.ErrorMessage}
                                onChange={(e) => setCurrentRule({ ...currentRule, ErrorMessage: e.target.value })}
                            />
                            <Button
                                variant="contained"
                                onClick={addRuleToCollection}
                                disabled={!currentRule.RuleName || !currentRule.Expression}
                                startIcon={<AddIcon />}
                            >
                                Add Rule
                            </Button>
                        </Box>
                    </Paper>

                    
                    {newRule.rules.length > 0 && (
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle1">Current Rules:</Typography>
                            <List dense>
                                {newRule.rules.map((rule, index) => (
                                    <ListItem
                                        key={index}
                                        secondaryAction={
                                            <IconButton onClick={() => removeRuleFromCollection(index)}>
                                                <DeleteIcon color="error" />
                                            </IconButton>
                                        }
                                    >
                                        <ListItemText
                                            primary={`${rule.RuleName}: ${rule.Expression}`}
                                            secondary={
                                                <>
                                                    {rule.SuccessEvent && `Success: ${rule.SuccessEvent}`}
                                                    {rule.ErrorMessage && ` | Error: ${rule.ErrorMessage}`}
                                                </>
                                            }
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                    )}

                    <TextField
                        label="Expiration Date"
                        type="datetime-local"
                        value={newRule.expirationDate}
                        onChange={(e) => setNewRule({ ...newRule, expirationDate: e.target.value })}
                        InputLabelProps={{ shrink: true }}
                    />

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleCreateRule}
                        disabled={!newRule.version || !newRule.workflowName || newRule.rules.length === 0}
                        sx={{ mt: 2 }}
                    >
                        Create Rule Package
                    </Button>
                </Box>
            </Paper>

          
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Version</TableCell>
                            <TableCell>Workflow</TableCell>
                            <TableCell>Rules</TableCell>
                            <TableCell>Expires</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rules.map((rule) => (
                            <TableRow key={rule.id}>
                                <TableCell>{rule.version}</TableCell>
                                <TableCell>{rule.workflowName}</TableCell>
                                <TableCell>
                                    {rule.rules.map((r, i) => (
                                        <Box key={i} sx={{ mb: 1 }}>
                                            <div><strong>{r.RuleName}</strong>: {r.Expression}</div>
                                            {r.SuccessEvent && <div>✓ {r.SuccessEvent}</div>}
                                            {r.ErrorMessage && <div>✗ {r.ErrorMessage}</div>}
                                        </Box>
                                    ))}
                                </TableCell>
                                <TableCell>
                                    {rule.expirationDate
                                        ? new Date(rule.expirationDate).toLocaleString()
                                        : 'Never'}
                                </TableCell>
                                <TableCell>
                                    <Box
                                        sx={{
                                            width: 16,
                                            height: 16,
                                            borderRadius: '50%',
                                            backgroundColor: rule.isActive ? 'green' : 'red',
                                        }}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Button
                                        onClick={() => handleSetActiveRule(rule.id)}
                                        color={rule.isActive ? 'warning' : 'success'}
                                        sx={{ mr: 1 }}
                                    >
                                        {rule.isActive ? 'Deactivate' : 'Activate'}
                                    </Button>
                                    <Button
                                        onClick={() => handleDeleteRule(rule.id)}
                                        color="error"
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert severity="error" onClose={handleSnackbarClose}>{error}</Alert>
            </Snackbar>
        </Box>
    );
};

export default RulesManagement;


*/ 
//this is the second backup it have specific rules auto json for db but no created date