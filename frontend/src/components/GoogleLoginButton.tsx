import React from 'react';
import { googleLogin } from '../services/auth';

export const GoogleLoginButton: React.FC = () => {
    return (
        <button 
            onClick={googleLogin}
            className="google-login-button"
            style={{
                backgroundColor: '#4285f4',
                color: 'white',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
            }}
        >
            <img 
                src="/google-icon.png" 
                alt="Google"
                style={{ width: '20px', height: '20px' }}
            />
            Login with Google
        </button>
    );
}; 