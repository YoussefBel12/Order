import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaBell, FaCheck, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = 'https://localhost:7094/api/notify'; // Update with your API URL

 function NotificationCenter() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch notifications
    const fetchNotifications = async () => {
        try {
            const { data } = await axios.get(`${API_URL}`);
            setNotifications(data);
        // eslint-disable-next-line no-unused-vars
        } catch (error) {
            toast.error('Failed to load notifications');
        } finally {
            setLoading(false);
        }
    };

     // Confirm notification
    //i changed the endpoint lbare7 from used id to last-confirm
    const confirmNotification = async (/*id*/) => {
        try {
            await axios.post(`${API_URL}/api/notifications/confirm-latest`);
          /*  setNotifications(notifications.map(n =>
                n.id === id ? { ...n, userConfirmed: true } : n
            )); */
            toast.success('Notification confirmed!');
        // eslint-disable-next-line no-unused-vars
        } catch (error) {
            toast.error('Confirmation failed');
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    if (loading) return <div className="p-4">Loading...</div>;

    return (
        <div className="max-w-md mx-auto p-4">
            <div className="flex items-center mb-6">
                <FaBell className="text-blue-500 mr-2" size={24} />
                <h1 className="text-2xl font-bold">Notifications</h1>
            </div>

            {notifications.length === 0 ? (
                <p className="text-gray-500">No notifications found</p>
            ) : (
                <ul className="space-y-3">
                    {notifications.map((notification) => (
                        <li
                            key={notification.id}
                            className={`p-4 rounded-lg border ${notification.userConfirmed
                                    ? 'bg-green-50 border-green-200'
                                    : 'bg-yellow-50 border-yellow-200'
                                }`}
                        >
                            <div className="flex justify-between">
                                <div>
                                    <p className="font-medium">{notification.message}</p>
                                    <p className="text-sm text-gray-600">
                                        Stocks: {notification.stockIds?.join(', ')}
                                    </p>
                                </div>
                                {!notification.userConfirmed && (
                                    <button
                                        onClick={() => confirmNotification(notification.id)}
                                        className="flex items-center text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                    >
                                        <FaCheck className="mr-1" /> Confirm
                                    </button>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}


export default NotificationCenter;