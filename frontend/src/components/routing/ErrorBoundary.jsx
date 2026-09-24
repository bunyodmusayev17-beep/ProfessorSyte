import { Component } from 'react';

import { Button } from '@/components/ui/Button';

/**
 * Last line of defence: a render-time crash anywhere below shows a recoverable
 * screen instead of a blank page. Async/query failures are handled per-page.
 */
export class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('Unhandled render error:', error, info);
  }

  handleReload = () => {
    window.location.assign('/');
  };

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <div className="bg-bg flex min-h-screen items-center justify-center px-4">
        <div className="border-line bg-surface rounded-card shadow-card w-full max-w-md border p-8 text-center">
          <h1 className="text-fg text-lg font-semibold">Something went wrong</h1>
          <p className="text-muted mt-2 text-sm">
            This page failed to render. Go back to the home page and try again.
          </p>
          {import.meta.env.DEV && (
            <pre className="bg-raised text-danger mt-4 max-h-40 overflow-auto rounded-lg p-3 text-left text-xs">
              {error.message}
            </pre>
          )}
          <Button className="mt-6" fullWidth onClick={this.handleReload}>
            Back to home
          </Button>
        </div>
      </div>
    );
  }
}
