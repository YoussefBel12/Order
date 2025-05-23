



/*
import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Avatar,
    Button,
    CircularProgress,
    Stack,
    Chip
} from '@mui/material';
import { Notifications as NotificationsIcon, Check as CheckIcon, DoneAll as DoneAllIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = 'https://localhost:7094/api/notify';

function NotificationCenter() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

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

    const confirmNotification = async () => {
        try {
            await axios.post(`${API_URL}/api/notifications/confirm-latest`);
            toast.success('Notification confirmed!');
            fetchNotifications();
        // eslint-disable-next-line no-unused-vars
        } catch (error) {
            toast.error('Confirmation failed');
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    return (
        <Box sx={{ p: 2, minWidth: 350, maxWidth: 400 }}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <NotificationsIcon color="primary" />
                <Typography variant="h6" fontWeight={600}>
                    Notifications
                </Typography>
            </Stack>
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress />
                </Box>
            ) : notifications.length === 0 ? (
                <Typography color="text.secondary" align="center">
                    No notifications found
                </Typography>
            ) : (
                <List
                    sx={{
                        maxHeight: 320,
                        overflowY: 'auto',
                        pr: 1,
                        // Custom scrollbar for modern look
                        '&::-webkit-scrollbar': {
                            width: 8,
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: '#bdbdbd',
                            borderRadius: 4,
                        },
                        '&::-webkit-scrollbar-track': {
                            backgroundColor: '#f5f5f5',
                        },
                    }}
                >
                    {notifications.map((notification) => (
                        <ListItem
                            key={notification.id}
                            sx={{
                                mb: 1,
                                borderRadius: 2,
                                bgcolor: notification.userConfirmed ? 'success.lighter' : 'warning.lighter',
                                border: 1,
                                borderColor: notification.userConfirmed ? 'success.light' : 'warning.light',
                                boxShadow: 1,
                                alignItems: 'flex-start'
                            }}
                            secondaryAction={
                                !notification.userConfirmed && (
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        size="small"
                                        startIcon={<CheckIcon />}
                                        onClick={confirmNotification}
                                    >
                                        Confirm
                                    </Button>
                                )
                            }
                        >
                            <ListItemAvatar>
                                <Avatar sx={{ bgcolor: notification.userConfirmed ? 'success.main' : 'warning.main' }}>
                                    {notification.userConfirmed ? <DoneAllIcon /> : <NotificationsIcon />}
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={
                                    <Typography fontWeight={500}>
                                        {notification.message}
                                    </Typography>
                                }
                                secondary={
                                    notification.stockIds && notification.stockIds.length > 0 && (
                                        <Stack direction="row" spacing={1} mt={1}>
                                            <Typography variant="caption" color="text.secondary">
                                                Stocks:
                                            </Typography>
                                            {notification.stockIds.map((id) => (
                                                <Chip key={id} label={id} size="small" />
                                            ))}
                                        </Stack>
                                    )
                                }
                            />
                        </ListItem>
                    ))}
                </List>
            )}
        </Box>
    );
}

export default NotificationCenter;

*/

import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Avatar,
    Button,
    CircularProgress,
    Stack,
    Chip
} from '@mui/material';
import { Notifications as NotificationsIcon, Check as CheckIcon, DoneAll as DoneAllIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = 'https://localhost:7094/api/notify';

function NotificationCenter({ onUnconfirmedCountChange }) {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            const { data } = await axios.get(`${API_URL}`);
            // Sort by newest first (assuming higher id is newer)
            const sorted = [...data].sort((a, b) => b.id - a.id);
            setNotifications(sorted);
            if (onUnconfirmedCountChange) {
                const unconfirmed = sorted.filter(n => !n.userConfirmed).length;
                onUnconfirmedCountChange(unconfirmed);
            }
        // eslint-disable-next-line no-unused-vars
        } catch (error) {
            toast.error('Failed to load notifications');
        } finally {
            setLoading(false);
        }
    };

    const confirmNotification = async () => {
        try {
            await axios.post(`${API_URL}/api/notifications/confirm-latest`);
            toast.success('Notification confirmed!');
            fetchNotifications();
        // eslint-disable-next-line no-unused-vars
        } catch (error) {
            toast.error('Confirmation failed');
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Optionally, add polling or websocket for real-time updates
        // eslint-disable-next-line
    }, []);

    return (
        <Box sx={{ p: 2, minWidth: 350, maxWidth: 400 }}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <NotificationsIcon color="primary" />
                <Typography variant="h6" fontWeight={600}>
                    Notifications
                </Typography>
            </Stack>
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress />
                </Box>
            ) : notifications.length === 0 ? (
                <Typography color="text.secondary" align="center">
                    No notifications found
                </Typography>
            ) : (
                <List
                    sx={{
                        maxHeight: 320,
                        overflowY: 'auto',
                        pr: 1,
                        '&::-webkit-scrollbar': { width: 8 },
                        '&::-webkit-scrollbar-thumb': { backgroundColor: '#bdbdbd', borderRadius: 4 },
                        '&::-webkit-scrollbar-track': { backgroundColor: '#f5f5f5' },
                    }}
                >
                    {notifications.map((notification) => (
                        <ListItem
                            key={notification.id}
                            sx={{
                                mb: 1,
                                borderRadius: 2,
                                bgcolor: notification.userConfirmed ? 'success.lighter' : 'warning.lighter',
                                border: 1,
                                borderColor: notification.userConfirmed ? 'success.light' : 'warning.light',
                                boxShadow: 1,
                                alignItems: 'flex-start'
                            }}
                            secondaryAction={
                                !notification.userConfirmed && (
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        size="small"
                                        startIcon={<CheckIcon />}
                                        onClick={confirmNotification}
                                    >
                                        Confirm
                                    </Button>
                                )
                            }
                        >
                            <ListItemAvatar>
                                <Avatar sx={{ bgcolor: notification.userConfirmed ? 'success.main' : 'warning.main' }}>
                                    {notification.userConfirmed ? <DoneAllIcon /> : <NotificationsIcon />}
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={
                                    <Typography fontWeight={500}>
                                        {notification.message}
                                    </Typography>
                                }
                                secondary={
                                    notification.stockIds && notification.stockIds.length > 0 && (
                                        <Stack direction="row" spacing={1} mt={1}>
                                            <Typography variant="caption" color="text.secondary">
                                                Stocks:
                                            </Typography>
                                            {notification.stockIds.map((id) => (
                                                <Chip key={id} label={id} size="small" />
                                            ))}
                                        </Stack>
                                    )
                                }
                            />
                        </ListItem>
                    ))}
                </List>
            )}
        </Box>
    );
}

export default NotificationCenter;