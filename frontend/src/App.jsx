import { Routes, Route } from 'react-router-dom';

function App() {
    return (
        <Routes>
            {/* ... other routes ... */}
            <Route path="/verify-email/:token" element={<EmailVerification />} />
            {/* ... other routes ... */}
        </Routes>
    );
}