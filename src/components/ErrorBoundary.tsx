import { Component, type ErrorInfo, type ReactNode } from 'react';

// Last line of defence: without a boundary any render error unmounts the whole app and
// leaves a blank page. Progress lives in localStorage, so reloading loses nothing.
export class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
    state = { failed: false };

    static getDerivedStateFromError() {
        return { failed: true };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        console.error('Brainrot Crush crashed:', error, info.componentStack);
    }

    render() {
        if (!this.state.failed) return this.props.children;

        return (
            <div className="min-h-[100dvh] flex flex-col items-center justify-center gap-4 p-6 text-center">
                <h1 className="text-3xl font-black">Something went wrong</h1>
                <p className="text-white/70">Your level progress is saved.</p>
                <button
                    onClick={() => window.location.reload()}
                    className="bg-yellow-400 hover:bg-yellow-300 text-purple-900 font-black py-3 px-6 rounded-xl"
                >
                    Reload
                </button>
            </div>
        );
    }
}
