
import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = "https://localhost:7094/api"; // Ensure HTTPS

const OrderComponent = () => {
    const [orders, setOrders] = useState([]);
    const [newOrder, setNewOrder] = useState({ name: "", email: "", phone: "", orderAmount: 0 });
    const [apiVersion, setApiVersion] = useState("1.0"); // Toggle between "1.0" and "2.0"
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, [apiVersion]);

    const fetchOrders = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/v${apiVersion}/Order`);
            setOrders(response.data);
        } catch (err) {
            console.error("Error fetching orders:", err);
            setError("Failed to fetch orders.");
        }
    };

    const addOrder = async () => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/v${apiVersion}/Order`,
                newOrder,
                { withCredentials: true }
            );
            setOrders([...orders, { id: response.data, ...newOrder }]);
            setNewOrder({ name: "", email: "", phone: "", orderAmount: 0 });
        } catch (err) {
            console.error("Error adding order:", err);
            setError("Failed to add order.");
        }
    };

    const deleteOrder = async (id) => {
        try {
            await axios.delete(`${API_BASE_URL}/v${apiVersion}/Order/${id}`);
            setOrders(orders.filter((order) => order.id !== id));
        } catch (err) {
            console.error("Error deleting order:", err);
            setError("Failed to delete order.");
        }
    };

    return (
        <div>
            <h1>Orders (API v{apiVersion})</h1>
            <button onClick={() => setApiVersion(apiVersion === "1.0" ? "2.0" : "1.0")}>
                Switch to API v{apiVersion === "1.0" ? "2.0" : "1.0"}
            </button>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <ul>
                {orders.map((order) => (
                    <li key={order.id}>
                        {order.name} ({order.email}, {order.phone}) - ${order.orderAmount}
                        <button onClick={() => deleteOrder(order.id)}>Delete</button>
                    </li>
                ))}
            </ul>

            <h2>Add Order</h2>
            <input
                type="text"
                placeholder="Name"
                value={newOrder.name}
                onChange={(e) => setNewOrder({ ...newOrder, name: e.target.value })}
            />
            <input
                type="email"
                placeholder="Email"
                value={newOrder.email}
                onChange={(e) => setNewOrder({ ...newOrder, email: e.target.value })}
            />
            <input
                type="text"
                placeholder="Phone"
                value={newOrder.phone}
                onChange={(e) => setNewOrder({ ...newOrder, phone: e.target.value })}
            />
            <input
                type="number"
                placeholder="Order Amount"
                value={newOrder.orderAmount}
                onChange={(e) => setNewOrder({ ...newOrder, orderAmount: Number(e.target.value) })}
            />
            <button onClick={addOrder}>Add Order</button>
        </div>
    );
};

export default OrderComponent;
