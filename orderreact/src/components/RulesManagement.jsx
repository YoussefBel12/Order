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

            {/* New Rule Form */}
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

            {/* Rules Table */}
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
