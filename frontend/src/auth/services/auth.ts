const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Update social login functions
export const googleLogin = () => {
    window.location.href = `${API_URL}/auth/google`;
};

export const githubLogin = () => {
    window.location.href = `${API_URL}/auth/github`;
};

export const facebookLogin = () => {
    window.location.href = `${API_URL}/auth/facebook`;
}; 