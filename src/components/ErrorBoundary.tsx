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
                <h1 className="font-display text-4xl">Mamma mia, it broke</h1>
                <p className="font-semibold text-gelato-soft">Your level progress is saved.</p>
                <button
                    onClick={() => window.location.reload()}
                    className="bg-gelato-strawberry hover:bg-gelato-strawberry-hi text-gelato-strawberry-ink font-display text-xl py-3 px-8 rounded-[18px] shadow-button"
                >
                    Reload
                </button>
            </div>
        );
    }
}
