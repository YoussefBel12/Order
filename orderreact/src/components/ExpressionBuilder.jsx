/*

import React, { useState } from "react";
import { TextField, MenuItem, Grid, Button } from "@mui/material";

// Example fields
const fields = ["OrderAmount", "Name", "Email", "Phone"];

// Map user-friendly operators to RulesEngine syntax
const operators = [
    { label: "equals", value: "==" },
    { label: "not equals", value: "!=" },
    { label: "greater than", value: ">" },
    { label: "greater than or equal to", value: ">=" },
    { label: "less than", value: "<" },
    { label: "less than or equal to", value: "<=" },
    { label: "is null", value: "== null" },
    { label: "is not null", value: "!= null" },
    { label: "length equals", value: "Length ==" },
    { label: "length not equals", value: "Length !=" },
    { label: "length greater than", value: "Length >" },
    { label: "length less than", value: "Length <" },
];

const ExpressionBuilder = ({ onExpressionChange }) => {
    const [selectedField, setSelectedField] = useState("");
    const [selectedOperator, setSelectedOperator] = useState("");
    const [value, setValue] = useState("");

    const handleAddExpression = () => {
        if (selectedField && selectedOperator) {
            let expression = "";

            // Handle special cases for null checks
            if (selectedOperator.includes("null")) {
                expression = `${selectedField} ${selectedOperator}`;
            }
            // Handle special cases for Length
            else if (selectedOperator.includes("Length")) {
                expression = `${selectedField}.${selectedOperator} ${value}`;
            }
            // Default case for other operators
            else {
                expression = `${selectedField} ${selectedOperator} ${value}`;
            }

            onExpressionChange(expression);
            setSelectedField("");
            setSelectedOperator("");
            setValue("");
        }
    };

    return (
        <Grid container spacing={2}>
            <Grid item xs={4}>
                <TextField
                    select
                    label="Field"
                    value={selectedField}
                    onChange={(e) => setSelectedField(e.target.value)}
                    fullWidth
                >
                    {fields.map((field) => (
                        <MenuItem key={field} value={field}>
                            {field}
                        </MenuItem>
                    ))}
                </TextField>
            </Grid>
            <Grid item xs={4}>
                <TextField
                    select
                    label="Operator"
                    value={selectedOperator}
                    onChange={(e) => setSelectedOperator(e.target.value)}
                    fullWidth
                >
                    {operators.map((operator) => (
                        <MenuItem key={operator.value} value={operator.value}>
                            {operator.label}
                        </MenuItem>
                    ))}
                </TextField>
            </Grid>
            <Grid item xs={4}>
                <TextField
                    label="Value"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    fullWidth
                    disabled={selectedOperator.includes("null")} // Disable value input for null checks
                />
            </Grid>
            <Grid item xs={12}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddExpression}
                    disabled={!selectedField || !selectedOperator || (!value && !selectedOperator.includes("null"))}
                >
                    Add Expression
                </Button>
            </Grid>
        </Grid>
    );
};

export default ExpressionBuilder;

*/

//the one up is without operations like &&


import React, { useState } from "react";
import { TextField, MenuItem, Grid, Button, Box, Typography } from "@mui/material";

// Example fields
const fields = ["OrderAmount", "Name", "Email", "Phone", "OrderDate"];

// Map user-friendly operators to RulesEngine syntax
const operators = [
    { label: "equals", value: "==" },
    { label: "not equals", value: "!=" },
    { label: "greater than", value: ">" },
    { label: "greater than or equal to", value: ">=" },
    { label: "less than", value: "<" },
    { label: "less than or equal to", value: "<=" },
    { label: "contains", value: "Contains" }, // Added Contains operator
    { label: "starts with", value: "StartsWith" },
    { label: "ends with", value: "EndsWith" },
    { label: "is null", value: "== null" },
    { label: "is not null", value: "!= null" },
    { label: "length equals", value: "Length ==" },
    { label: "length not equals", value: "Length !=" },
    { label: "length greater than", value: "Length >" },
    { label: "length less than", value: "Length <" }
];

// Logical operators mapped to RulesEngine syntax
const logicalOperators = [
    { label: "AND", value: "&&" },
    { label: "OR", value: "||" },
    { label: "NOT", value: "!" }
];

const ExpressionBuilder = ({ onExpressionChange }) => {
    const [conditions, setConditions] = useState([]);
    const [selectedField, setSelectedField] = useState("");
    const [selectedOperator, setSelectedOperator] = useState("");
    const [value, setValue] = useState("");
    const [logicalOperator, setLogicalOperator] = useState("");

    const handleAddCondition = () => {
        if (selectedField && selectedOperator) {
            let expression = "";

            // Handle special cases for null checks
            if (selectedOperator.includes("null")) {
                expression = `${selectedField} ${selectedOperator}`;
            }
            // Handle special cases for Length
            else if (selectedOperator.startsWith("Length")) {
                const operator = selectedOperator.split(" ")[1]; // Extract the actual operator (e.g., "==", "!=")
                expression = `${selectedField}.Length ${operator} ${value}`;
            }
            // Handle Contains, StartsWith, and EndsWith
            else if (["Contains", "StartsWith", "EndsWith"].includes(selectedOperator)) {
                expression = `${selectedField}.${selectedOperator}("${value}")`;
            }
            // Default case for other operators
            else {
                // Detect if the value is a number or string
                const formattedValue = isNaN(value) ? `"${value}"` : value;
                expression = `${selectedField} ${selectedOperator} ${formattedValue}`;
            }

            const newCondition = {
                expression,
                logicalOperator: conditions.length > 0 ? logicalOperator : null
            };

            setConditions([...conditions, newCondition]);
            setSelectedField("");
            setSelectedOperator("");
            setValue("");
            setLogicalOperator("");
        }
    };

    const handleGenerateExpression = () => {
        const fullExpression = conditions
            .map((cond) =>
                cond.logicalOperator
                    ? `${cond.logicalOperator} ${cond.expression}`
                    : cond.expression
            )
            .join(" ");
        onExpressionChange(fullExpression);
    };

    return (
        <Box>
            <Grid container spacing={2}>
                <Grid item xs={3}>
                    <TextField
                        select
                        label="Field"
                        value={selectedField}
                        onChange={(e) => setSelectedField(e.target.value)}
                        fullWidth
                    >
                        {fields.map((field) => (
                            <MenuItem key={field} value={field}>
                                {field}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={3}>
                    <TextField
                        select
                        label="Operator"
                        value={selectedOperator}
                        onChange={(e) => setSelectedOperator(e.target.value)}
                        fullWidth
                    >
                        {operators.map((operator) => (
                            <MenuItem key={operator.value} value={operator.value}>
                                {operator.label}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={3}>
                    <TextField
                        label="Value"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        fullWidth
                        disabled={selectedOperator.includes("null")} // Disable value input for null checks
                    />
                </Grid>
                <Grid item xs={3}>
                    <TextField
                        select
                        label="Logical Operator"
                        value={logicalOperator}
                        onChange={(e) => setLogicalOperator(e.target.value)}
                        fullWidth
                        disabled={conditions.length === 0} // Disable for the first condition
                    >
                        {logicalOperators.map((op) => (
                            <MenuItem key={op.value} value={op.value}>
                                {op.label}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={12}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAddCondition}
                        disabled={!selectedField || !selectedOperator || (!value && !selectedOperator.includes("null"))}
                    >
                        Add Condition
                    </Button>
                </Grid>
            </Grid>

            <Box mt={2}>
                <Typography variant="h6">Conditions:</Typography>
                {conditions.map((cond, index) => (
                    <Typography key={index}>
                        {cond.logicalOperator ? `${cond.logicalOperator} ` : ""}
                        {cond.expression}
                    </Typography>
                ))}
            </Box>

            <Button
                variant="contained"
                color="secondary"
                onClick={handleGenerateExpression}
                disabled={conditions.length === 0}
                sx={{ mt: 2 }}
            >
                Generate Expression
            </Button>
        </Box>
    );
};

export default ExpressionBuilder;

