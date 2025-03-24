import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OrderApp = () => {
    const [orders, setOrders] = useState([]);
    const [orderData, setOrderData] = useState({
        name: '',
        email: '',
        phone: '',
        orderAmount: ''
    });
    const [selectedVersion, setSelectedVersion] = useState('v1'); // Default to v1
    const [rulesVersion, setRulesVersion] = useState('v1'); // Default to v1 rules
    const [error, setError] = useState('');

    // Fetch orders based on the selected API version
    useEffect(() => {
        fetchOrders();
    }, [selectedVersion, rulesVersion]);

    const fetchOrders = async () => {
        try {
            // Ensure the version and rulesVersion are correctly appended to the URL
            const response = await axios.get(
                `https://localhost:7094/api/v${selectedVersion}/Order?version=${selectedVersion}&rulesVersion=${rulesVersion}`
            );
            setOrders(response.data);
        } catch (error) {
            setError('Error fetching orders: ' + error.message);
        }
    };


    // Handle form input changes
    const handleChange = (e) => {
        setOrderData({
            ...orderData,
            [e.target.name]: e.target.value
        });
    };

    // Handle form submission (Create Order)
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                `https://localhost:7094/api/v${selectedVersion}/Order?version=${selectedVersion}&rulesVersion=${rulesVersion}`,
                orderData
            );
            alert('Order created successfully');
            fetchOrders(); // Refetch orders after adding
        } catch (error) {
            setError('Error creating order: ' + error.message);
        }
    };

    return (
        <div>
            <h1>Order Management</h1>

            {/* Version Selection */}
            <div>
                <h3>Select API Version</h3>
                <button onClick={() => setSelectedVersion('1')}>Use v1 (No Rules)</button>
                <button onClick={() => setSelectedVersion('2')}>Use v2 (With Rules)</button>
            </div>

            {/* Rules Version Selection for v2 */}
            {selectedVersion === '2.0' && (
                <div>
                    <h3>Select Rules Version</h3>
                    <button onClick={() => setRulesVersion('v1')}>Use v1 Rules</button>
                    <button onClick={() => setRulesVersion('v2')}>Use v2 Rules</button>
                </div>
            )}

            {/* Order Form */}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name</label>
                    <input
                        type="text"
                        name="name"
                        value={orderData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={orderData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Phone</label>
                    <input
                        type="text"
                        name="phone"
                        value={orderData.phone}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Order Amount</label>
                    <input
                        type="number"
                        name="orderAmount"
                        value={orderData.orderAmount}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">Submit Order</button>
            </form>

            {/* Orders List */}
            <div>
                <h3>Orders</h3>
                {error && <p>{error}</p>}
                <ul>
                    {orders.map((order) => (
                        <li key={order.id}>
                            Order ID: {order.id} - {order.name} - ${order.orderAmount}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default OrderApp;

