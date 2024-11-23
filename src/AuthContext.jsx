import React, {createContext, useState, useEffect} from 'react';
import Cookies from 'js-cookie';
import {useLocation, useNavigate} from 'react-router-dom';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
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
                console.log("logout from useEffect")
                // logout();
                refreshToken()
            } else {
                setUser({token, role});
            }
        } else {
            console.log("logout from useEffect else")
            logout();
            // refreshToken()
        }

        // Setup Axios interceptor for handling token expiration
        // setupAxiosInterceptor();
    }, []);

    const login = (userData) => {

        // Store user data and token expiration time in cookies
        Cookies.set('access_token', userData.access_token);
        if (userData.refresh_token) {
            Cookies.set('refresh_token', userData.refresh_token);

        }

        if (userData.token_type) {
            Cookies.set('token_type', userData.token_type);

        }
        if (userData.expires_in) {
            const expirationTime = Date.now() + userData.expires_in * 1000;
            Cookies.set('expires_in', expirationTime.toString());
        }

        if (userData.role) {
            Cookies.set('role', userData.role);
        }
        if (userData.company_id) {
            Cookies.set('company_id', userData.company_id);
        }

        setUser({
            token: userData.access_token,
            role: userData.role,
        });
    };

    const logout = () => {
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');
        Cookies.remove('token_type');
        Cookies.remove('expires_in');
        Cookies.remove('role');
        Cookies.remove('company_id');
        setUser(null);

        const protectedPaths = ['/company', '/admin', '/dashboard'];
        if (protectedPaths.some((path) => location.pathname.startsWith(path))) {
            navigate('/login');
        }
    };
    const refreshToken = async () => {
        console.log('refreshToken is calling');
        try {
            const refreshToken = Cookies.get('refresh_token');
            const response = await axios.post('http://127.0.0.1:8000/api/refresh', {
                refresh_token: refreshToken,
            });

            const data = response.data;
            console.log(data);
            return login(data);
        } catch (error) {
            console.error('Failed to refresh token:', error);

            // Log out the user if the refresh fails
            logout();
            return null;
        }
    };
    const setupAxiosInterceptor = () => {
        axios.interceptors.response.use(
            (response) => response,
            async (error) => {
                if (error.response && error.response.status === 401) {
                    // Access token has expired, log out the user
                    console.log('logout from axios')
                    await refreshToken();
                }
                return Promise.reject(error);
            }
        );
    };

    return (
        <AuthContext.Provider value={{user, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};