import React from 'react';
import { githubLogin } from '../services/auth';

export const LoginButton: React.FC = () => {
    return (
        <button 
            onClick={githubLogin}
            className="github-login-button"
        >
            Login with GitHub
        </button>
    );
}; 