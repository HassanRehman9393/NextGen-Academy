import React, { createContext, useContext, useState } from 'react';
import AuthService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const login = async (credentials) => {
        try {
            const { user, tokens } = await AuthService.login(credentials);
            
            // Store tokens
            localStorage.setItem('accessToken', tokens.accessToken);
            localStorage.setItem('refreshToken', tokens.refreshToken);
            
            // Update auth state
            setUser(user);
            setIsAuthenticated(true);
            
            return { user, tokens };
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    // Rest of your context provider remains the same...

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated,
            login,
            // ... other methods
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 