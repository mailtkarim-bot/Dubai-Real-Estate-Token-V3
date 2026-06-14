import { Component, type ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: string | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    this.setState({ error, errorInfo: errorInfo.componentStack || null });
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = (): void => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[60vh] flex items-center justify-center px-4">
          <div className="card max-w-lg w-full text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
                <AlertTriangle className="text-red-400" size={32} />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gold-300 mb-2">
              Something Went Wrong
            </h2>

            <p className="text-gray-400 mb-6">
              An unexpected error occurred. Please reload the page to try again.
            </p>

            {this.state.error && (
              <div className="bg-dark-900 rounded-lg p-4 mb-6 text-left overflow-hidden">
                <p className="text-red-400 text-sm font-mono break-words">
                  {this.state.error.message}
                </p>
                {this.state.errorInfo && (
                  <pre className="text-gray-500 text-xs mt-2 overflow-auto max-h-32">
                    {this.state.errorInfo}
                  </pre>
                )}
              </div>
            )}

            <button
              onClick={this.handleReload}
              className="btn-gold inline-flex items-center gap-2"
              aria-label="Reload page"
            >
              <RotateCcw size={18} />
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
