import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OrderManager = () => {
    const [apiVersion, setApiVersion] = useState('v2');
    const [rulesVersion, setRulesVersion] = useState('v1');
    const [orders, setOrders] = useState([]);
    const [orderId, setOrderId] = useState('');
    const [orderDetails, setOrderDetails] = useState(null);
    const [orderCommand, setOrderCommand] = useState({ /* Order data structure */ });
    const [error, setError] = useState(null);

    // Fetch All Orders based on chosen API and rules version
    const fetchOrders = async () => {
        try {
            const response = await axios.get(`https://localhost:7094/api/${apiVersion}/Order`, {
                params: { version: apiVersion, rulesVersion: rulesVersion },
                headers: { 'Accept': 'application/json' }
            });
            setOrders(response.data);
        } catch (err) {
            setError('Error fetching orders');
            console.error(err);
        }
    };

    // Fetch Order By ID
    const fetchOrderById = async () => {
        try {
            const response = await axios.get(`https://localhost:7094/api/${apiVersion}/Order/${orderId}`, {
                params: { version: apiVersion, rulesVersion: rulesVersion }
            });
            setOrderDetails(response.data);
        } catch (err) {
            setError('Error fetching order details');
            console.error(err);
        }
    };

    // Add a New Order
    const addOrder = async () => {
        try {
            const response = await axios.post(`https://localhost:7094/api/${apiVersion}/Order`, orderCommand, {
                params: { version: apiVersion, rulesVersion: rulesVersion },
                headers: { 'Content-Type': 'application/json' }
            });
            setOrders([...orders, response.data]);  // Add new order to state
            alert('Order Created');
        } catch (err) {
            setError('Error adding order');
            console.error(err);
        }
    };

    // Delete Order
    const deleteOrder = async (id) => {
        try {
            await axios.delete(`https://localhost:7094/api/${apiVersion}/Order/${id}`, {
                params: { version: apiVersion, rulesVersion: rulesVersion }
            });
            setOrders(orders.filter(order => order.id !== id));  // Remove deleted order from state
            alert('Order Deleted');
        } catch (err) {
            setError('Error deleting order');
            console.error(err);
        }
    };

    // Effect Hook to fetch orders on initial load
    useEffect(() => {
        fetchOrders();
    }, [apiVersion, rulesVersion]);  // Dependency array to trigger fetch on version change

    return (
        <div>
            <h1>Order Manager</h1>

            {/* API Version Selector */}
            <div>
                <label>API Version: </label>
                <select value={apiVersion} onChange={(e) => setApiVersion(e.target.value)}>
                    <option value="v1">v1</option>
                    <option value="v2">v2</option>
                </select>
            </div>

            {/* Rules Engine Version Selector */}
            <div>
                <label>Rules Engine Version: </label>
                <select value={rulesVersion} onChange={(e) => setRulesVersion(e.target.value)}>
                    <option value="v1">v1</option>
                    <option value="v2">v2</option>
                </select>
            </div>

            {/* Add Order */}
            <div>
                <h2>Add Order</h2>
                <input
                    type="text"
                    placeholder="Order Command"
                    value={orderCommand.command || ''}
                    onChange={(e) => setOrderCommand({ ...orderCommand, command: e.target.value })}
                />
                <button onClick={addOrder}>Add Order</button>
            </div>

            {/* Fetch Order By ID */}
            <div>
                <h2>Get Order By ID</h2>
                <input
                    type="text"
                    placeholder="Order ID"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                />
                <button onClick={fetchOrderById}>Get Order</button>
                {orderDetails && (
                    <div>
                        <h3>Order Details</h3>
                        <pre>{JSON.stringify(orderDetails, null, 2)}</pre>
                    </div>
                )}
            </div>

            {/* Orders List */}
            <div>
                <h2>All Orders</h2>
                {orders.length === 0 ? (
                    <p>No orders found.</p>
                ) : (
                    <ul>
                        {orders.map((order) => (
                            <li key={order.id}>
                                Order ID: {order.id} - {order.command}
                                <button onClick={() => deleteOrder(order.id)}>Delete</button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Error Message */}
            {error && <div style={{ color: 'red' }}>{error}</div>}
        </div>
    );
};

export default OrderManager;
