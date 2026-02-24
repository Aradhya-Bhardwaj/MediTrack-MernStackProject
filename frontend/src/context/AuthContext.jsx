//Its purpose is to manage user authentication globally across the application, including login, logout, registration, and user session handling.
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const API_URL = 'http://localhost:5001/api';

export const AuthProvider = ({ children }) => { //AuthProvider wraps the entire application and provides authentication data and functions to all child components.
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/auth/current_user`, { withCredentials: true });
            setUser(res.data);
        } catch (err) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await axios.get(`${API_URL}/auth/logout`, { withCredentials: true });
            setUser(null);
            window.location.href = '/login';
        } catch (err) {
            console.error('Logout failed');
        }
    };

    const login = (role) => {
        const url = role ? `${API_URL}/auth/google?role=${role}` : `${API_URL}/auth/google`;
        window.location.href = url;
    };

    const loginWithEmail = async (email, password) => {
        try {
            const res = await axios.post(`${API_URL}/auth/login`, { email, password }, { withCredentials: true });
            setUser(res.data);
            return res.data;
        } catch (err) {
            throw err.response ? err.response.data : new Error('Login failed');
        }
    };

    const register = async (userData) => {
        try {
            const res = await axios.post(`${API_URL}/auth/register`, userData, { withCredentials: true });
            setUser(res.data);
            return res.data;
        } catch (err) {
            throw err.response ? err.response.data : new Error('Registration failed');
        }
    };

    const toggleRole = async () => {
        try {
            const res = await axios.post(`${API_URL}/auth/toggle-role`, {}, { withCredentials: true });
            setUser(prev => ({ ...prev, role: res.data.role }));
            return res.data.role;
        } catch (err) {
            console.error('Toggle role failed', err);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, loginWithEmail, register, logout, fetchUser, toggleRole }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
