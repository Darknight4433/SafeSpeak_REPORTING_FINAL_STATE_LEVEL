import React from 'react';
import { toast } from 'sonner';

type Props = { children: React.ReactNode };

type State = { hasError: boolean; error?: Error };

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: any) {
    // Log to console and show a user-friendly toast so user doesn't see a blank white screen
    console.error('Uncaught component error:', error, info);
    try {
      toast.error('An unexpected error occurred. Please try again or reload the page.');
    } catch (e) {
      // if toast fails, still avoid throwing
      console.error('Toast failed in ErrorBoundary:', e);
    }
  }

  render() {
    if (this.state.hasError) {
      // Less-disruptive fallback: show a small fixed banner with controls instead of a full-page block
      return (
        <>
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-2xl px-4">
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 flex items-center justify-between shadow-md">
              <div className="text-sm">
                <div className="font-semibold">Something went wrong</div>
                <div className="text-xs text-muted-foreground">We captured the error and are working on it. You can reload or dismiss this message to continue.</div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.location.reload()}
                  className="px-3 py-1 rounded bg-primary text-white text-sm"
                >
                  Reload
                </button>
                <button
                  onClick={() => this.setState({ hasError: false, error: undefined })}
                  className="px-3 py-1 rounded border text-sm"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
          {/* Still render children so users can continue where possible */}
          {this.props.children}
        </>
      );
    }

    return this.props.children;
  }
}
