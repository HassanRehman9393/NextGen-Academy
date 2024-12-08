import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="text-center py-8 bg-red-500/10 rounded-xl">
                    <h2 className="text-red-300">Something went wrong.</h2>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary; 