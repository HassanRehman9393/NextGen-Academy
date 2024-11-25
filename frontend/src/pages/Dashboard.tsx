import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/hooks/useAuth';

const Dashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, setUser } = useAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const handleToken = async () => {
            try {
                // Check if we already have a user
                if (user) {
                    setLoading(false);
                    return;
                }

                // Try to get token from URL or localStorage
                const params = new URLSearchParams(location.search);
                const urlToken = params.get('token');
                const storedToken = localStorage.getItem('token');
                const token = urlToken || storedToken;

                if (!token) {
                    navigate('/login');
                    return;
                }

                // Store the token if it came from URL
                if (urlToken) {
                    localStorage.setItem('token', urlToken);
                    // Clear the URL parameters
                    navigate('/dashboard', { replace: true });
                }

                // Fetch user profile with token
                const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/profile`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (!response.ok) {
                    throw new Error('Failed to fetch user profile');
                }
                
                const userData = await response.json();
                setUser(userData.user);
                setLoading(false);
            } catch (error) {
                console.error('Dashboard error:', error);
                localStorage.removeItem('token'); // Clear invalid token
                navigate('/login');
            }
        };

        handleToken();
    }, [location, navigate, setUser, user]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="dashboard">
            <h1>Welcome to Dashboard</h1>
            {/* Add your dashboard content here */}
        </div>
    );
};

export default Dashboard; 