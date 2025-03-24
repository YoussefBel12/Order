import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OrdersList = () => {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('https://localhost:7094/api/v2/Order', {
                    params: { version: 'v1' }, // Specify version v1 for the rules engine
                    headers: { 'Accept': 'text/plain' }
                });
                setOrders(response.data);
            } catch (err) {
                setError('Error fetching orders');
                console.error(err);
            }
        };

        fetchOrders();
    }, []);

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h2>Orders List</h2>
            <ul>
                {orders.map((order) => (
                    <li key={order.id}>{order.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default OrdersList;
