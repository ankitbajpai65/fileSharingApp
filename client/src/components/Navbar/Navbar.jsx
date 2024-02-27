"use client";
import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { Menu, MenuItem, Typography } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { AppContext } from "@/app/context/AppContext";
import './Navbar.css';

const BASE_URL = process.env.BASE_URL;

const Navbar = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [anchorElUser, setAnchorElUser] = useState(null);

    const { isUserLoggedin, setIsUserLoggedin, userData, setUserData } = useContext(AppContext);

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleUserData = async () => {
        const res = await fetch(`${BASE_URL}/user/userData`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            // withCredentials: true,
            credentials: "include",
        })

        const response = await res.json();

        if (response.status === 'ok') {
            setUserData(response.data);
            setIsUserLoggedin(true);
            setLoading(false);
        }
    }

    useEffect(() => {
        handleUserData();
    }, []);

    const handleLogout = async () => {
        const res = await fetch(`${BASE_URL}/user/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            // withCredentials: true,
            credentials: "include",
        })

        const response = await res.json();

        if (response.status === 'ok') {
            setIsUserLoggedin(false);
        }
        handleCloseUserMenu();
    }

    return (
        <nav className='navbar'>
            <img src="/logo.png" alt="" onClick={() => router.push('/')} />
            {
                isUserLoggedin ?
                    <>
                        <AccountCircleIcon
                            sx={{ fontSize: 40 }}
                            onClick={handleOpenUserMenu}
                        />
                        <Menu
                            sx={{ mt: '45px', ml: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            className="dropdownMenu"
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            <MenuItem>
                                <Typography className="username">{userData.name}</Typography>
                            </MenuItem>
                            <MenuItem>
                                <Typography variant="caption" className="userEmail">{userData.email}</Typography>
                            </MenuItem>
                            <MenuItem onClick={handleLogout} className="logoutBtn">
                                <Typography>Logout</Typography>
                            </MenuItem>
                        </Menu>
                    </>
                    :
                    <button
                        className="loginBtn"
                        onClick={() => router.push('/login')}
                    >Login
                    </button>
            }
        </nav>
    );
}

export default Navbar;