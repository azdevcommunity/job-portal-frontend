import React, { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const AuthContextv2 = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    // Check if user info is stored in cookies on mount
    useEffect(() => {
        const token = Cookies.get('access_token');
        const role = Cookies.get('role');
        const expiresIn = Cookies.get('expires_in');

        if (token && role && expiresIn) {
            const expirationTime = parseInt(expiresIn, 10);
            const currentTime = Date.now();

            // If the token is expired, clear the session
            if (currentTime >= expirationTime) {
                logout();
            } else {
                setUser({ token, role });
            }
        }

        // Setup Axios interceptor for handling token expiration
        setupAxiosInterceptor();
    }, []);

    const login = (userData) => {
        const expirationTime = Date.now() + userData.expires_in * 1000;

        // Store user data and token expiration time in cookies
        Cookies.set('access_token', userData.access_token);
        Cookies.set('refresh_token', userData.refresh_token);
        Cookies.set('token_type', userData.token_type);
        Cookies.set('expires_in', expirationTime.toString());
        Cookies.set('role', userData.role);
        Cookies.set('company_id', userData.company_id);

        setUser({
            token: userData.access_token,
            role: userData.role,
        });
    };

    const logout = () => {
        // Remove user data from cookies
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');
        Cookies.remove('token_type');
        Cookies.remove('expires_in');
        Cookies.remove('role');
        Cookies.remove('company_id');
        setUser(null);
        navigate('/login');
    };

    const setupAxiosInterceptor = () => {
        axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response && error.response.status === 401) {
                    // Access token has expired, log out the user
                    logout();
                }
                return Promise.reject(error);
            }
        );
    };

    return (
        <AuthContextv2.Provider value={{ user, login, logout }}>
            {children}
        </AuthContextv2.Provider>
    );
};