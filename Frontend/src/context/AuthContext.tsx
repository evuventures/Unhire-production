import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../api/client';
import { useNavigate } from 'react-router-dom';

interface User {
    _id: string;
    name: string;
    email: string;
    role: 'client' | 'expert' | 'admin';
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (data: any) => void;
    logout: () => void;
    checkAuth: () => Promise<void>;
    setUser: (user: User | null) => void; // Allow manual set for login flow
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const checkAuth = async () => {
        try {
            const { data } = await apiClient.get('/api/auth/me');
            setUser(data);
        } catch (err) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = (userData: any) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData)); // Optional: Keep for quick load
    };

    const logout = async () => {
        try {
            await apiClient.post('/api/auth/logout');
            setUser(null);
            localStorage.removeItem('user');
            navigate('/login');
        } catch (err) {
            console.error("Logout failed", err);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, checkAuth, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
