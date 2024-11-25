import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/hooks/useAuth';

const Dashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { setUser } = useAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const handleToken = async () => {
            try {
                const params = new URLSearchParams(location.search);
                const token = params.get('token');

                if (token) {
                    // Store the token
                    localStorage.setItem('token', token);
                    
                    // Clear the URL parameters
                    navigate('/dashboard', { replace: true });
                    
                    // Fetch user profile with token
                    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/profile`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    
                    if (!response.ok) throw new Error('Failed to fetch user profile');
                    
                    const userData = await response.json();
                    setUser(userData.user);
                }
                
                setLoading(false);
            } catch (error) {
                console.error('Dashboard error:', error);
                navigate('/login');
            }
        };

        handleToken();
    }, [location, navigate, setUser]);

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