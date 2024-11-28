const API_URL = process.env.REACT_APP_API_URL;

// Update social login functions
export const googleLogin = () => {
    window.location.href = `${process.env.REACT_APP_API_URL}/auth/google`;
};

export const githubLogin = () => {
    window.location.href = `${process.env.REACT_APP_API_URL}/auth/github`;
};

export const facebookLogin = () => {
    window.location.href = `${process.env.REACT_APP_API_URL}/auth/facebook`;
}; 