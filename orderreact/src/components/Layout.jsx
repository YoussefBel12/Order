


{/* you can use this to display fullname if u want 
                            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 0.5 }}>
                                {userData ? userData.firstName + "" +userData.lastName : ''}
                            </Typography>
                            */}

/*
import React, { useState } from 'react';
import {
    Box, Drawer, Typography, List, ListItem, ListItemIcon,
    ListItemText, IconButton, Divider, Tooltip
} from '@mui/material';

import { Link, useLocation } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import InventoryIcon from '@mui/icons-material/Inventory';
import StoreIcon from '@mui/icons-material/Store';
import RuleIcon from '@mui/icons-material/Rule';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'; // Add this import
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'; // Import for My Bills
import LogoutIcon from '@mui/icons-material/Logout'; // Import for Logout

const drawerWidth = 220;
const collapsedWidth = 64;

const navLinks = [
    { text: 'Home', icon: <HomeIcon />, to: '/Home' },
    { text: 'Orders', icon: <InventoryIcon />, to: '/Order' },
    { text: 'Stock', icon: <StoreIcon />, to: '/Stock' },
    { text: 'Rules', icon: <RuleIcon />, to: '/Rules' },
    { text: 'Login', icon: <LoginIcon />, to: '/Login' },
     { text: 'Purchase', icon: <ShoppingCartIcon />, to: '/purchase' }, // <-- Add this line
 //   { text: 'Register', icon: <PersonAddIcon />, to: '/Register' },
    { text: 'My Bills', icon: <ReceiptLongIcon />, to: '/Mybills' },
    { text: 'Logout', icon: <LogoutIcon />, to: '/logout' }
];

const Layout = ({ userData, children }) => {
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f4f6f8' }}>
            <Drawer
                variant="permanent"
                sx={{
                    width: collapsed ? collapsedWidth : drawerWidth,
                    flexShrink: 0,
                    whiteSpace: 'nowrap',
                    [`& .MuiDrawer-paper`]: {
                        width: collapsed ? collapsedWidth : drawerWidth,
                        boxSizing: 'border-box',
                        bgcolor: 'success.main',
                        color: 'white',
                        transition: 'width 0.2s',
                        overflowX: 'hidden',
                    },
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        py: 2,
                        minHeight: 80,
                        justifyContent: 'center',
                    }}
                >
                    <IconButton
                        onClick={() => setCollapsed((prev) => !prev)}
                        sx={{
                            color: 'white',
                            mb: 1,
                            alignSelf: collapsed ? 'center' : 'flex-end',
                        }}
                        size="large"
                    >
                        {collapsed ? <MenuIcon /> : <MenuOpenIcon />}
                    </IconButton>
                    <AccountCircleIcon sx={{ fontSize: 36, mb: collapsed ? 0 : 1 }} />
                    {!collapsed && (
                        <>
                            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 0.5 }}>
                                {userData ? userData.email : 'Not logged in'}                    
                            </Typography>

                          

                            <Typography variant="body2" sx={{ color: 'grey.200' }}>
                                {userData ? userData.role : ''}
                            </Typography>
                        </>
                    )}
                </Box>
                <Divider sx={{ bgcolor: 'grey.700', mb: 1 }} />

                <List>
                    {navLinks.map(({ text, icon, to }) => (
                        <Tooltip
                            key={text}
                            title={collapsed ? text : ''}
                            placement="right"
                            arrow
                        >
                            <ListItem
                                button
                                component={Link}
                                to={to}
                                selected={location.pathname.toLowerCase().startsWith(to.toLowerCase())}
                                sx={{
                                    fontWeight: 'bold',
                                    color: 'white',
                                    '& .MuiListItemText-primary': {
                                        fontWeight: 'bold',
                                        color: 'white',
                                    },
                                    '&.Mui-selected': {
                                        bgcolor: 'success.dark',
                                        color: 'white',
                                        fontWeight: 'bold',
                                        '& .MuiListItemIcon-root': { color: 'white' },
                                        '& .MuiListItemText-primary': {
                                            fontWeight: 'bold',
                                            color: 'white',
                                        },
                                    },
                                    mb: 0.5,
                                    borderRadius: 1,
                                    px: collapsed ? 2 : 3,
                                    justifyContent: collapsed ? 'center' : 'flex-start',
                                }}
                            >
                                <ListItemIcon sx={{ color: 'inherit', minWidth: 0, mr: collapsed ? 0 : 2, justifyContent: 'center' }}>
                                    {icon}
                                </ListItemIcon>
                                {!collapsed && (
                                    <ListItemText
                                        primary={text}
                                        primaryTypographyProps={{ fontWeight: 'bold', color: 'white' }}
                                    />
                                )}
                            </ListItem>




                          





                        </Tooltip>
                    ))}
                </List>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3, minHeight: '100vh' }}>
                {children}
            </Box>
        </Box>
    );
};

export default Layout;

*/
//olld one work fine this one just cover stock and rulesengine for admin


import React, { useState } from 'react';
import {
    Box, Drawer, Typography, List, ListItem, ListItemIcon,
    ListItemText, IconButton, Divider, Tooltip
} from '@mui/material';

import { Link, useLocation } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import InventoryIcon from '@mui/icons-material/Inventory';
import StoreIcon from '@mui/icons-material/Store';
import RuleIcon from '@mui/icons-material/Rule';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import LogoutIcon from '@mui/icons-material/Logout';
import ReportingDashboard from "./ReportingDashboard";


const drawerWidth = 220;
const collapsedWidth = 64;

const navLinks = [
    { text: 'Home', icon: <HomeIcon />, to: '/Home' },
    { text: 'Orders', icon: <InventoryIcon />, to: '/Order' },
    { text: 'Stock', icon: <StoreIcon />, to: '/Stock', roles: ['stockmanager'] }, // Only for stockmanager
    { text: 'Rules', icon: <RuleIcon />, to: '/Rules', roles: ['stockmanager'] }, // Only for stockmanager
    { text: 'Login', icon: <LoginIcon />, to: '/Login' },
    { text: 'Purchase', icon: <ShoppingCartIcon />, to: '/purchase' },
    { text: 'My Bills', icon: <ReceiptLongIcon />, to: '/Mybills' },
    { text: 'Logout', icon: <LogoutIcon />, to: '/logout' }
    //test adding the reporting dashboard link
    , { text: 'Reports', icon: <AccountCircleIcon />, to: '/reports', roles: ['stockmanager']  }
];

const Layout = ({ userData, children }) => {
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);

    // Get user role in lowercase for comparison
    const userRole = userData?.role?.toLowerCase();

    // Filter navLinks based on roles property
    const filteredNavLinks = navLinks.filter(link => {
        if (!link.roles) return true; // No roles means visible to all
        return userRole && link.roles.includes(userRole);
    });

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f4f6f8' }}>
            <Drawer
                variant="permanent"
                sx={{
                    width: collapsed ? collapsedWidth : drawerWidth,
                    flexShrink: 0,
                    whiteSpace: 'nowrap',
                    [`& .MuiDrawer-paper`]: {
                        width: collapsed ? collapsedWidth : drawerWidth,
                        boxSizing: 'border-box',
                        bgcolor: 'success.main',
                        color: 'white',
                        transition: 'width 0.2s',
                        overflowX: 'hidden',
                    },
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        py: 2,
                        minHeight: 80,
                        justifyContent: 'center',
                    }}
                >
                    <IconButton
                        onClick={() => setCollapsed((prev) => !prev)}
                        sx={{
                            color: 'white',
                            mb: 1,
                            alignSelf: collapsed ? 'center' : 'flex-end',
                        }}
                        size="large"
                    >
                        {collapsed ? <MenuIcon /> : <MenuOpenIcon />}
                    </IconButton>
                    <AccountCircleIcon sx={{ fontSize: 36, mb: collapsed ? 0 : 1 }} />
                    {!collapsed && (
                        <>
                            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 0.5 }}>
                                {userData ? userData.email : 'Not logged in'}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'grey.200' }}>
                                {userData ? userData.role : ''}
                            </Typography>
                        </>
                    )}
                </Box>
                <Divider sx={{ bgcolor: 'grey.700', mb: 1 }} />

                <List>
                    {filteredNavLinks.map(({ text, icon, to }) => (
                        <Tooltip
                            key={text}
                            title={collapsed ? text : ''}
                            placement="right"
                            arrow
                        >
                            <ListItem
                                button
                                component={Link}
                                to={to}
                                selected={location.pathname.toLowerCase().startsWith(to.toLowerCase())}
                                sx={{
                                    fontWeight: 'bold',
                                    color: 'white',
                                    '& .MuiListItemText-primary': {
                                        fontWeight: 'bold',
                                        color: 'white',
                                    },
                                    '&.Mui-selected': {
                                        bgcolor: 'success.dark',
                                        color: 'white',
                                        fontWeight: 'bold',
                                        '& .MuiListItemIcon-root': { color: 'white' },
                                        '& .MuiListItemText-primary': {
                                            fontWeight: 'bold',
                                            color: 'white',
                                        },
                                    },
                                    mb: 0.5,
                                    borderRadius: 1,
                                    px: collapsed ? 2 : 3,
                                    justifyContent: collapsed ? 'center' : 'flex-start',
                                }}
                            >
                                <ListItemIcon sx={{ color: 'inherit', minWidth: 0, mr: collapsed ? 0 : 2, justifyContent: 'center' }}>
                                    {icon}
                                </ListItemIcon>
                                {!collapsed && (
                                    <ListItemText
                                        primary={text}
                                        primaryTypographyProps={{ fontWeight: 'bold', color: 'white' }}
                                    />
                                )}
                            </ListItem>
                        </Tooltip>
                    ))}
                </List>
            </Drawer>
            
            <Box component="main" sx={{ flexGrow: 1, p: 3, minHeight: '100vh' }}>
                {children}
            </Box>
           

        </Box>
    );
};

export default Layout;
