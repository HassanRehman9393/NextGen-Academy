import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const validateToken = async (token) => {
        try {
            authService.setAuthHeader(token);
            const response = await authService.getProfile();
            return response.user;
        } catch (error) {
            throw error;
        }
    };

    useEffect(() => {
        // Check for stored tokens and validate them
        const checkAuth = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                if (token) {
                    // Validate token and get user data
                    const userData = await validateToken(token);
                    setUser(userData);
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = async (credentials) => {
        try {
            setError(null);
            const response = await authService.login(credentials);
            const { accessToken, refreshToken, user } = response;
            
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            setUser(user);
            
            return user;
        } catch (error) {
            setError(error.message);
            throw error;
        }
    };

    const logout = async () => {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            await authService.logout(refreshToken);
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            setUser(null);
        }
    };

    const value = {
        user,
        loading,
        error,
        login,
        logout,
        setUser,
        setError
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
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