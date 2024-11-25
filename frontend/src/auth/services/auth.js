const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8081/api';

export const githubLogin = () => {
    window.location.href = `${API_URL}/auth/github`;
};

export const googleLogin = () => {
    window.location.href = `${API_URL}/auth/google`;
}; 