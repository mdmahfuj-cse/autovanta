import { Component } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Home, RotateCcw } from 'lucide-react';
import { PATHS } from '../../routes/paths.js';

/** Global render-error boundary with a premium recovery state. */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('[AutoVanta] A render error occurred:', error, info?.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div className="flex min-h-dvh flex-col items-center justify-center bg-base-100 px-6 text-center">
        <div className="max-w-lg rounded-2xl border border-white/10 bg-base-200 p-10">
          <AlertTriangle className="mx-auto h-10 w-10 text-error" aria-hidden="true" />
          <h1 className="mt-4 font-display text-2xl font-bold">Something went wrong</h1>
          <p className="mt-2 text-sm text-muted">An unexpected error interrupted the showroom experience.</p>
          <pre className="mt-4 overflow-auto rounded-lg bg-black/40 p-3 text-left font-mono text-xs text-error/90">
            {String(this.state.error)}
          </pre>
          <div className="mt-6 flex justify-center gap-3">
            <button
              type="button"
              onClick={() => this.setState({ error: null })}
              className="btn btn-primary btn-sm rounded-md"
            >
              <RotateCcw className="h-4 w-4" /> Try again
            </button>
            <Link
              to={PATHS.home}
              onClick={() => this.setState({ error: null })}
              className="btn btn-outline btn-sm rounded-md"
            >
              <Home className="h-4 w-4" /> Home
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
