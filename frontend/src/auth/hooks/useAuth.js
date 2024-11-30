import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    console.log('Auth context:', context);
    console.log('Current user:', context.user);
    console.log('Stored token:', localStorage.getItem('token'));

    return context;
}; 