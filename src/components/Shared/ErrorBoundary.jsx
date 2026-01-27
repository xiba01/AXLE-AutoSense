import React from 'react';

export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ error, errorInfo });
        console.error("APP CRASH DETECTED:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-red-950 flex items-center justify-center p-6 text-white overflow-auto">
                    <div className="max-w-4xl w-full space-y-4">
                        <h1 className="text-4xl font-bold border-b border-red-500 pb-2">Something went wrong.</h1>
                        <p className="text-xl text-red-200">The application crashed. This is usually due to a property access error or an infinite loop.</p>

                        <div className="bg-black/50 p-6 rounded-xl border border-white/20 font-mono text-xs overflow-x-auto whitespace-pre">
                            <div className="text-red-400 font-bold mb-2">Error: {this.state.error?.toString()}</div>
                            {this.state.errorInfo?.componentStack}
                        </div>

                        <button
                            onClick={() => window.location.reload()}
                            className="px-8 py-3 bg-white text-red-900 rounded-full font-bold hover:bg-gray-200 transition-all"
                        >
                            Reload Application
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
