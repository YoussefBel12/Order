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
    IconButton,
    Chip,
    Divider,
    Grid,
    Tooltip
} from '@mui/material';
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon,
    Event as EventIcon,
    Schedule as ScheduleIcon
} from '@mui/icons-material';

const API_BASE_URL = "https://localhost:7094/api";

const RulesManagement = () => {
    const [rules, setRules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const [newRule, setNewRule] = useState({
        version: '',
        workflowName: '',
        rules: [],
        expirationDate: '',
        isActive: false,
        activationDate: '',
        desactivationDate: ''
    });

    const [currentRule, setCurrentRule] = useState({
        RuleName: '',
        Expression: '',
        SuccessEvent: '',
        ErrorMessage: ''
    });

    // Enhanced fetch with error handling
    useEffect(() => {
        const fetchRules = async () => {
            try {
                const { data } = await axios.get(`${API_BASE_URL}/RulesManagement`);
                setRules(data.map(rule => ({
                    ...rule,
                    rules: rule.rules ? JSON.parse(rule.rules) : [],
                    createdDate: new Date(rule.createdDate)
                })));
            } catch (err) {
                setError(`Failed to load rules: ${err.message}`);
                setSnackbarOpen(true);
            } finally {
                setLoading(false);
            }
        };

        fetchRules();
        const interval = setInterval(fetchRules, 10000); // Refresh every 10s
        return () => clearInterval(interval);
    }, []);



    // Add rule with validation
    const addRuleToCollection = () => {
        if (!currentRule.RuleName || !currentRule.Expression) {
            setError('Rule Name and Expression are required');
            setSnackbarOpen(true);
            return;
        }

        setNewRule(prev => ({
            ...prev,
            rules: [...prev.rules, {
                ...currentRule,
                RuleName: currentRule.RuleName.trim(),
                Expression: currentRule.Expression.trim()
            }]
        }));

        setCurrentRule({
            RuleName: '',
            Expression: '',
            SuccessEvent: '',
            ErrorMessage: ''
        });
    };

    // Enhanced delete with confirmation
    const removeRuleFromCollection = (index) => {
        setNewRule(prev => ({
            ...prev,
            rules: prev.rules.filter((_, i) => i !== index)
        }));
    };

    // Create rule with better error handling
    const handleCreateRule = async () => {
        try {
            if (!newRule.version || !newRule.workflowName || newRule.rules.length === 0) {
                throw new Error('Please fill all required fields');

            }
            
                const now = new Date();

                // Validate dates
                if (newRule.activationDate && new Date(newRule.activationDate) < now) {
                    throw new Error("Activation Date must be in the future.");
                }
                if (newRule.desactivationDate && new Date(newRule.desactivationDate) < now) {
                    throw new Error("Desactivation Date must be in the future.");
                }
                if (newRule.expirationDate && new Date(newRule.expirationDate) < now) {
                    throw new Error("Expiration Date must be in the future.");
                }


            const ruleData = {
                ...newRule,
                rules: JSON.stringify(newRule.rules),
                expirationDate: newRule.expirationDate
                    ? new Date(newRule.expirationDate).toISOString()
                    : null,

                     activationDate: newRule.expirationDate
                    ? new Date(newRule.activationDate).toISOString()
                    : null,

                     desactivationDate: newRule.expirationDate
                    ? new Date(newRule.desactivationDate).toISOString()
                    : null,
            };

            console.log('Payload being sent:', ruleData); // Debugging line
            const { data } = await axios.post(`${API_BASE_URL}/RulesManagement`, ruleData);

            setNewRule({
                version: '',
                workflowName: '',
                rules: [],
                expirationDate: '',
                isActive: true,
                activationDate: '',
                desactivationDate: ''
            });

            setRules(prev => [...prev, {
                ...data,
                rules: JSON.parse(data.rules),
                createdDate: new Date(data.createdDate)
            }]);

        } catch (err) {
            setError(err.response?.data?.message || err.message);
            setSnackbarOpen(true);
        }
    };

    // Status toggle with visual feedback
    const handleSetActiveRule = async (id) => {
        try {
            await axios.put(`${API_BASE_URL}/RulesManagement/set-active/${id}`);
            setRules(prev => prev.map(rule =>
                rule.id === id ? { ...rule, isActive: !rule.isActive } : rule
            ));
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update status');
            setSnackbarOpen(true);
        }
    };

    // Enhanced delete with confirmation
    const handleDeleteRule = async (id) => {
        if (!window.confirm('Are you sure you want to delete this rule?')) return;

        try {
            await axios.delete(`${API_BASE_URL}/RulesManagement/${id}`);
            setRules(prev => prev.filter(rule => rule.id !== id));
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete rule');
            setSnackbarOpen(true);
        }
    };

    const handleSnackbarClose = () => setSnackbarOpen(false);

    if (loading) {
        return (
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '80vh'
            }}>
                <CircularProgress size={60} />
            </Box>
        );
    }

    if (error && !loading) {
        return (
            <Alert severity="error" sx={{ m: 2 }}>
                {error} - <Button onClick={() => window.location.reload()}>Refresh</Button>
            </Alert>
        );
    }

    return (
        <Box sx={{ p: 4, maxWidth: 1600, margin: '0 auto' }}>
   
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 4,
                flexWrap: 'wrap',
                gap: 2
            }}>
                <Typography variant="h4" component="h1" sx={{
                    fontWeight: 600,
                    color: 'primary.main'
                }}>
                    Rules Management
                </Typography>

                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        component={Link}
                        to="/"
                        variant="outlined"
                        startIcon={<EventIcon />}
                    >
                        Dashboard
                    </Button>
                    <Button
                        component={Link}
                        to="/Order"
                        variant="outlined"
                        startIcon={<ScheduleIcon />}
                        color="secondary"
                    >
                        Order Management
                    </Button>
                </Box>
            </Box>

         
            <Paper elevation={3} sx={{
                p: 3,
                mb: 4,
                borderRadius: 2
            }}>
                <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                    Create New Rule Package
                </Typography>

                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Version *"
                            value={newRule.version}
                            onChange={(e) => setNewRule({ ...newRule, version: e.target.value })}
                            fullWidth
                            variant="outlined"
                            size="small"
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Workflow Name *"
                            value={newRule.workflowName}
                            onChange={(e) => setNewRule({ ...newRule, workflowName: e.target.value })}
                            fullWidth
                            variant="outlined"
                            size="small"
                        />
                    </Grid>
                </Grid>

                <Paper elevation={0} sx={{
                    p: 2,
                    mt: 3,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1
                }}>
                    <Typography variant="subtitle1" gutterBottom>
                        Add Rule Components
                    </Typography>

                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Rule Name *"
                                value={currentRule.RuleName}
                                onChange={(e) => setCurrentRule({ ...currentRule, RuleName: e.target.value })}
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Expression *"
                                value={currentRule.Expression}
                                onChange={(e) => setCurrentRule({ ...currentRule, Expression: e.target.value })}
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Success Event"
                                value={currentRule.SuccessEvent}
                                onChange={(e) => setCurrentRule({ ...currentRule, SuccessEvent: e.target.value })}
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Error Message"
                                value={currentRule.ErrorMessage}
                                onChange={(e) => setCurrentRule({ ...currentRule, ErrorMessage: e.target.value })}
                                fullWidth
                                size="small"
                            />
                        </Grid>
                    </Grid>

                    <Button
                        variant="contained"
                        onClick={addRuleToCollection}
                        disabled={!currentRule.RuleName || !currentRule.Expression}
                        startIcon={<AddIcon />}
                        sx={{ mt: 2 }}
                    >
                        Add Rule Component
                    </Button>
                </Paper>

                
                {newRule.rules.length > 0 && (
                    <Box sx={{ mt: 3 }}>
                        <Typography variant="subtitle1" gutterBottom>
                            Rule Components ({newRule.rules.length})
                        </Typography>
                        <List dense sx={{
                            maxHeight: 200,
                            overflow: 'auto',
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 1
                        }}>
                            {newRule.rules.map((rule, index) => (
                                <ListItem
                                    key={index}
                                    secondaryAction={
                                        <IconButton
                                            edge="end"
                                            onClick={() => removeRuleFromCollection(index)}
                                            color="error"
                                            size="small"
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    }
                                    sx={{ py: 0.5 }}
                                >
                                    <ListItemText
                                        primary={
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Chip
                                                    label={rule.RuleName}
                                                    size="small"
                                                    color="primary"
                                                />
                                                <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                                    {rule.Expression}
                                                </Typography>
                                            </Box>
                                        }
                                        secondary={
                                            <>
                                                {rule.SuccessEvent && (
                                                    <Box component="span" sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                                                        <CheckCircleIcon color="success" fontSize="small" sx={{ mr: 0.5 }} />
                                                        {rule.SuccessEvent}
                                                    </Box>
                                                )}
                                                {rule.ErrorMessage && (
                                                    <Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <CancelIcon color="error" fontSize="small" sx={{ mr: 0.5 }} />
                                                        {rule.ErrorMessage}
                                                    </Box>
                                                )}
                                            </>
                                        }
                                        sx={{ my: 0 }}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                )}

                <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Expiration Date & Time"
                            type="datetime-local"
                            value={newRule.expirationDate}
                            onChange={(e) => setNewRule({ ...newRule, expirationDate: e.target.value })}
                            fullWidth
                            size="small"
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>

                 
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Activation Date & Time"
                                type="datetime-local"
                                value={newRule.activtionDate}
                                onChange={(e) => setNewRule({ ...newRule, activationDate: e.target.value })}
                                fullWidth
                                size="small"
                                InputLabelProps={{ shrink: true }}
                            />

                    </Grid>


                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Desactivation Date & Time"
                            type="datetime-local"
                            value={newRule.desactivtionDate}
                            onChange={(e) => setNewRule({ ...newRule, desactivationDate: e.target.value })}
                            fullWidth
                            size="small"
                            InputLabelProps={{ shrink: true }}
                        />

                    </Grid>






                    <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'flex-end' }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleCreateRule}
                            disabled={!newRule.version || !newRule.workflowName || newRule.rules.length === 0}
                            size="large"
                            fullWidth
                            sx={{ height: 40 }}
                        >
                            Create Rule Package
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

     
            <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: 'primary.main' }}>
                                <TableCell sx={{ color: 'common.white' }}>Version</TableCell>
                                <TableCell sx={{ color: 'common.white' }}>Workflow</TableCell>
                                <TableCell sx={{ color: 'common.white' }}>Rules</TableCell>
                                <TableCell sx={{ color: 'common.white' }}>Expires</TableCell>
                                <TableCell sx={{ color: 'common.white' }}>Created</TableCell>
                                <TableCell sx={{ color: 'common.white' }}>Status</TableCell>
                                <TableCell sx={{ color: 'common.white' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rules.map((rule) => (
                                <TableRow key={rule.id} hover>
                                    <TableCell>{rule.version}</TableCell>
                                    <TableCell sx={{ fontWeight: 500 }}>{rule.workflowName}</TableCell>
                                    <TableCell>
                                        <Box sx={{ maxHeight: 120, overflow: 'auto' }}>
                                            {rule.rules.map((r, i) => (
                                                <Box key={i} sx={{ mb: 1, pb: 1, borderBottom: i < rule.rules.length - 1 ? '1px dashed' : 'none', borderColor: 'divider' }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Typography variant="subtitle2">{r.RuleName}</Typography>
                                                        <Chip
                                                            label={r.Expression}
                                                            size="small"
                                                            sx={{ fontFamily: 'monospace', fontSize: '0.7rem' }}
                                                        />
                                                    </Box>
                                                    {r.SuccessEvent && (
                                                        <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', color: 'success.main' }}>
                                                            <CheckCircleIcon fontSize="small" sx={{ mr: 0.5 }} />
                                                            {r.SuccessEvent}
                                                        </Typography>
                                                    )}
                                                    {r.ErrorMessage && (
                                                        <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', color: 'error.main' }}>
                                                            <CancelIcon fontSize="small" sx={{ mr: 0.5 }} />
                                                            {r.ErrorMessage}
                                                        </Typography>
                                                    )}
                                                </Box>
                                            ))}
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        {rule.expirationDate ? (
                                            <Tooltip title={new Date(rule.expirationDate).toLocaleString()}>
                                                <Typography>
                                                    {new Date(rule.expirationDate).toLocaleDateString()}
                                                </Typography>
                                            </Tooltip>
                                        ) : 'Never'}
                                    </TableCell>
                                    <TableCell>
                                        <Tooltip title={rule.createdDate.toLocaleString()}>
                                            <Typography>
                                                {rule.createdDate.toLocaleDateString()}
                                            </Typography>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={rule.isActive ? 'Active' : 'Inactive'}
                                            color={rule.isActive ? 'success' : 'error'}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                color={rule.isActive ? 'warning' : 'success'}
                                                onClick={() => handleSetActiveRule(rule.id)}
                                            >
                                                {rule.isActive ? 'Deactivate' : 'Activate'}
                                            </Button>
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                color="error"
                                                onClick={() => handleDeleteRule(rule.id)}
                                            >
                                                Delete
                                            </Button>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    severity="error"
                    onClose={handleSnackbarClose}
                    sx={{ width: '100%' }}
                >
                    {error}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default RulesManagement;

*/

//the one up works but expression typed manually keep it the one below use another component for expressions




import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import ExpressionBuilder from './ExpressionBuilder';
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
    IconButton,
    Chip,
    Divider,
    Grid,
    Tooltip
} from '@mui/material';
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon,
    Event as EventIcon,
    Schedule as ScheduleIcon
} from '@mui/icons-material';

const API_BASE_URL = "https://localhost:7094/api";

const RulesManagement = () => {
    const [rules, setRules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);


    //i added this use new comp
    const handleExpressionChange = (expression) => {
        setCurrentRule((prev) => ({ ...prev, Expression: expression }));
    };



    const [newRule, setNewRule] = useState({
        version: '',
        workflowName: '',
        rules: [],
        expirationDate: '',
        isActive: false,
        activationDate: '',
        desactivationDate: ''
    });

    const [currentRule, setCurrentRule] = useState({
        RuleName: '',
        Expression: '',
        SuccessEvent: '',
        ErrorMessage: ''
    });

    // Enhanced fetch with error handling
    useEffect(() => {
        const fetchRules = async () => {
            try {
                const { data } = await axios.get(`${API_BASE_URL}/RulesManagement`);
                setRules(data.map(rule => ({
                    ...rule,
                    rules: rule.rules ? JSON.parse(rule.rules) : [],
                    createdDate: new Date(rule.createdDate)
                })));
            } catch (err) {
                setError(`Failed to load rules: ${err.message}`);
                setSnackbarOpen(true);
            } finally {
                setLoading(false);
            }
        };

        fetchRules();
        const interval = setInterval(fetchRules, 10000); // Refresh every 10s
        return () => clearInterval(interval);
    }, []);



    // Add rule with validation
    const addRuleToCollection = () => {
        if (!currentRule.RuleName || !currentRule.Expression) {
            setError('Rule Name and Expression are required');
            setSnackbarOpen(true);
            return;
        }

        setNewRule(prev => ({
            ...prev,
            rules: [...prev.rules, {
                ...currentRule,
                RuleName: currentRule.RuleName.trim(),
                Expression: currentRule.Expression.trim()
            }]
        }));

        setCurrentRule({
            RuleName: '',
            Expression: '',
            SuccessEvent: '',
            ErrorMessage: ''
        });
    };

    // Enhanced delete with confirmation
    const removeRuleFromCollection = (index) => {
        setNewRule(prev => ({
            ...prev,
            rules: prev.rules.filter((_, i) => i !== index)
        }));
    };

    // Create rule with better error handling
    const handleCreateRule = async () => {
        try {
            if (!newRule.version || !newRule.workflowName || newRule.rules.length === 0) {
                throw new Error('Please fill all required fields');

            }

            const now = new Date();

            // Validate dates
            if (newRule.activationDate && new Date(newRule.activationDate) < now) {
                throw new Error("Activation Date must be in the future.");
            }
            if (newRule.desactivationDate && new Date(newRule.desactivationDate) < now) {
                throw new Error("Desactivation Date must be in the future.");
            }
            if (newRule.expirationDate && new Date(newRule.expirationDate) < now) {
                throw new Error("Expiration Date must be in the future.");
            }


            const ruleData = {
                ...newRule,
                rules: JSON.stringify(newRule.rules),
                expirationDate: newRule.expirationDate
                    ? new Date(newRule.expirationDate).toISOString()
                    : null,

                activationDate: newRule.expirationDate
                    ? new Date(newRule.activationDate).toISOString()
                    : null,

                desactivationDate: newRule.expirationDate
                    ? new Date(newRule.desactivationDate).toISOString()
                    : null,
            };

            console.log('Payload being sent:', ruleData); // Debugging line
            const { data } = await axios.post(`${API_BASE_URL}/RulesManagement`, ruleData);

            setNewRule({
                version: '',
                workflowName: '',
                rules: [],
                expirationDate: '',
                isActive: true,
                activationDate: '',
                desactivationDate: ''
            });

            setRules(prev => [...prev, {
                ...data,
                rules: JSON.parse(data.rules),
                createdDate: new Date(data.createdDate)
            }]);

        } catch (err) {
            setError(err.response?.data?.message || err.message);
            setSnackbarOpen(true);
        }
    };

    // Status toggle with visual feedback
    const handleSetActiveRule = async (id) => {
        try {
            await axios.put(`${API_BASE_URL}/RulesManagement/set-active/${id}`);
            setRules(prev => prev.map(rule =>
                rule.id === id ? { ...rule, isActive: !rule.isActive } : rule
            ));
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update status');
            setSnackbarOpen(true);
        }
    };

    // Enhanced delete with confirmation
    const handleDeleteRule = async (id) => {
        if (!window.confirm('Are you sure you want to delete this rule?')) return;

        try {
            await axios.delete(`${API_BASE_URL}/RulesManagement/${id}`);
            setRules(prev => prev.filter(rule => rule.id !== id));
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete rule');
            setSnackbarOpen(true);
        }
    };

    const handleSnackbarClose = () => setSnackbarOpen(false);

    if (loading) {
        return (
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '80vh'
            }}>
                <CircularProgress size={60} />
            </Box>
        );
    }

    if (error && !loading) {
        return (
            <Alert severity="error" sx={{ m: 2 }}>
                {error} - <Button onClick={() => window.location.reload()}>Refresh</Button>
            </Alert>
        );
    }

    return (
        <Box sx={{ p: 4, maxWidth: 1600, margin: '0 auto' }}>

            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 4,
                flexWrap: 'wrap',
                gap: 2
            }}>
                <Typography variant="h4" component="h1" sx={{
                    fontWeight: 600,
                    color: 'primary.main'
                }}>
                    Rules Management
                </Typography>

                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        component={Link}
                        to="/"
                        variant="outlined"
                        startIcon={<EventIcon />}
                    >
                        Dashboard
                    </Button>
                    <Button
                        component={Link}
                        to="/Order"
                        variant="outlined"
                        startIcon={<ScheduleIcon />}
                        color="secondary"
                    >
                        Order Management
                    </Button>
                </Box>
            </Box>


            <Paper elevation={3} sx={{
                p: 3,
                mb: 4,
                borderRadius: 2
            }}>
                <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                    Create New Rule Package
                </Typography>

                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Version *"
                            value={newRule.version}
                            onChange={(e) => setNewRule({ ...newRule, version: e.target.value })}
                            fullWidth
                            variant="outlined"
                            size="small"
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Workflow Name *"
                            value={newRule.workflowName}
                            onChange={(e) => setNewRule({ ...newRule, workflowName: e.target.value })}
                            fullWidth
                            variant="outlined"
                            size="small"
                        />
                    </Grid>
                </Grid>

                <Paper elevation={0} sx={{ p: 2, mt: 3, border: "1px solid", borderColor: "divider", borderRadius: 1 }}>
                    <Typography variant="subtitle1" gutterBottom>
                        Add Rule Components
                    </Typography>

                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Rule Name *"
                                value={currentRule.RuleName}
                                onChange={(e) => setCurrentRule({ ...currentRule, RuleName: e.target.value })}
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <ExpressionBuilder onExpressionChange={handleExpressionChange} />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Success Event"
                                value={currentRule.SuccessEvent}
                                onChange={(e) => setCurrentRule({ ...currentRule, SuccessEvent: e.target.value })}
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Error Message"
                                value={currentRule.ErrorMessage}
                                onChange={(e) => setCurrentRule({ ...currentRule, ErrorMessage: e.target.value })}
                                fullWidth
                                size="small"
                            />
                        </Grid>
                    </Grid>

                    <Button
                        variant="contained"
                        onClick={addRuleToCollection}
                        disabled={!currentRule.RuleName || !currentRule.Expression}
                        startIcon={<AddIcon />}
                        sx={{ mt: 2 }}
                    >
                        Add Rule Component
                    </Button>
                </Paper>


                {newRule.rules.length > 0 && (
                    <Box sx={{ mt: 3 }}>
                        <Typography variant="subtitle1" gutterBottom>
                            Rule Components ({newRule.rules.length})
                        </Typography>
                        <List dense sx={{
                            maxHeight: 200,
                            overflow: 'auto',
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 1
                        }}>
                            {newRule.rules.map((rule, index) => (
                                <ListItem
                                    key={index}
                                    secondaryAction={
                                        <IconButton
                                            edge="end"
                                            onClick={() => removeRuleFromCollection(index)}
                                            color="error"
                                            size="small"
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    }
                                    sx={{ py: 0.5 }}
                                >
                                    <ListItemText
                                        primary={
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Chip
                                                    label={rule.RuleName}
                                                    size="small"
                                                    color="primary"
                                                />
                                                <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                                    {rule.Expression}
                                                </Typography>
                                            </Box>
                                        }
                                        secondary={
                                            <>
                                                {rule.SuccessEvent && (
                                                    <Box component="span" sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                                                        <CheckCircleIcon color="success" fontSize="small" sx={{ mr: 0.5 }} />
                                                        {rule.SuccessEvent}
                                                    </Box>
                                                )}
                                                {rule.ErrorMessage && (
                                                    <Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <CancelIcon color="error" fontSize="small" sx={{ mr: 0.5 }} />
                                                        {rule.ErrorMessage}
                                                    </Box>
                                                )}
                                            </>
                                        }
                                        sx={{ my: 0 }}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                )}

                <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Expiration Date & Time"
                            type="datetime-local"
                            value={newRule.expirationDate}
                            onChange={(e) => setNewRule({ ...newRule, expirationDate: e.target.value })}
                            fullWidth
                            size="small"
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>


                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Activation Date & Time"
                            type="datetime-local"
                            value={newRule.activtionDate}
                            onChange={(e) => setNewRule({ ...newRule, activationDate: e.target.value })}
                            fullWidth
                            size="small"
                            InputLabelProps={{ shrink: true }}
                        />

                    </Grid>


                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Desactivation Date & Time"
                            type="datetime-local"
                            value={newRule.desactivtionDate}
                            onChange={(e) => setNewRule({ ...newRule, desactivationDate: e.target.value })}
                            fullWidth
                            size="small"
                            InputLabelProps={{ shrink: true }}
                        />

                    </Grid>






                    <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'flex-end' }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleCreateRule}
                            disabled={!newRule.version || !newRule.workflowName || newRule.rules.length === 0}
                            size="large"
                            fullWidth
                            sx={{ height: 40 }}
                        >
                            Create Rule Package
                        </Button>
                    </Grid>
                </Grid>
            </Paper>


            <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: 'primary.main' }}>
                                <TableCell sx={{ color: 'common.white' }}>Version</TableCell>
                                <TableCell sx={{ color: 'common.white' }}>Workflow</TableCell>
                                <TableCell sx={{ color: 'common.white' }}>Rules</TableCell>
                                <TableCell sx={{ color: 'common.white' }}>Expires</TableCell>
                                <TableCell sx={{ color: 'common.white' }}>Created</TableCell>
                                <TableCell sx={{ color: 'common.white' }}>Status</TableCell>
                                <TableCell sx={{ color: 'common.white' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rules.map((rule) => (
                                <TableRow key={rule.id} hover>
                                    <TableCell>{rule.version}</TableCell>
                                    <TableCell sx={{ fontWeight: 500 }}>{rule.workflowName}</TableCell>
                                    <TableCell>
                                        <Box sx={{ maxHeight: 120, overflow: 'auto' }}>
                                            {rule.rules.map((r, i) => (
                                                <Box key={i} sx={{ mb: 1, pb: 1, borderBottom: i < rule.rules.length - 1 ? '1px dashed' : 'none', borderColor: 'divider' }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Typography variant="subtitle2">{r.RuleName}</Typography>
                                                        <Chip
                                                            label={r.Expression}
                                                            size="small"
                                                            sx={{ fontFamily: 'monospace', fontSize: '0.7rem' }}
                                                        />
                                                    </Box>
                                                    {r.SuccessEvent && (
                                                        <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', color: 'success.main' }}>
                                                            <CheckCircleIcon fontSize="small" sx={{ mr: 0.5 }} />
                                                            {r.SuccessEvent}
                                                        </Typography>
                                                    )}
                                                    {r.ErrorMessage && (
                                                        <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', color: 'error.main' }}>
                                                            <CancelIcon fontSize="small" sx={{ mr: 0.5 }} />
                                                            {r.ErrorMessage}
                                                        </Typography>
                                                    )}
                                                </Box>
                                            ))}
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        {rule.expirationDate ? (
                                            <Tooltip title={new Date(rule.expirationDate).toLocaleString()}>
                                                <Typography>
                                                    {new Date(rule.expirationDate).toLocaleDateString()}
                                                </Typography>
                                            </Tooltip>
                                        ) : 'Never'}
                                    </TableCell>
                                    <TableCell>
                                        <Tooltip title={rule.createdDate.toLocaleString()}>
                                            <Typography>
                                                {rule.createdDate.toLocaleDateString()}
                                            </Typography>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={rule.isActive ? 'Active' : 'Inactive'}
                                            color={rule.isActive ? 'success' : 'error'}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                color={rule.isActive ? 'warning' : 'success'}
                                                onClick={() => handleSetActiveRule(rule.id)}
                                            >
                                                {rule.isActive ? 'Deactivate' : 'Activate'}
                                            </Button>
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                color="error"
                                                onClick={() => handleDeleteRule(rule.id)}
                                            >
                                                Delete
                                            </Button>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    severity="error"
                    onClose={handleSnackbarClose}
                    sx={{ width: '100%' }}
                >
                    {error}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default RulesManagement;
