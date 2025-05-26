// src/utils/auth.js
import axios from 'axios';

export const fetchUserData = async () => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
        const response = await axios.get('https://localhost:7094/api/Account/me', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch {
        return null;
    }
};