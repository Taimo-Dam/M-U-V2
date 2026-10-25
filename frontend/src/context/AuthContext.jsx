import { createContext, useState, useEffect } from 'react';
import { loginUser, registerUser } from '../services/musicService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            setUser(JSON.parse(userInfo));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const data = await loginUser(email, password);
            
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            return { success: true };
        } catch (error) {
            return { 
                success: false, 
                message: error.response && error.response.data.message 
                    ? error.response.data.message 
                    : error.message 
            };
        }
    };

    const register = async (username, email, password) => {
        try {
            const data = await registerUser(username, email, password);
            
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            return { success: true };
        } catch (error) {
            return { 
                success: false, 
                message: error.response && error.response.data.message 
                    ? error.response.data.message 
                    : error.message 
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('userInfo');
        setUser(null);
        window.location.href = '/';
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
