import React from "react";

type Props = {
  children: React.ReactNode;
};

type State = {
  hasError: boolean;
  error?: Error;
};

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Keep it simple: we just log; no external services.
    // This makes "white screen" issues visible in console.
    console.error("App crashed:", error, info);
  }

  private handleReset = () => {
    // Safety reset in case localStorage data is corrupted.
    try {
      window.localStorage.removeItem("focus-tasks");
      window.localStorage.removeItem("focus-sessions");
      window.localStorage.removeItem("focus-preferences");
      window.localStorage.removeItem("focus-streak");
    } catch {
      // ignore
    }
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-card border border-border rounded-2xl p-6 space-y-3">
          <h1 className="text-lg font-semibold">Something went wrong</h1>
          <p className="text-sm text-muted-foreground">
            The app hit an unexpected error. You can try refreshing, or reset local
            data if something got corrupted.
          </p>
          {this.state.error?.message ? (
            <pre className="text-xs bg-muted rounded-lg p-3 overflow-x-auto">
              {this.state.error.message}
            </pre>
          ) : null}
          <div className="flex gap-2 pt-2">
            <button
              className="flex-1 h-11 rounded-xl bg-foreground text-background text-sm font-medium"
              onClick={() => window.location.reload()}
            >
              Refresh
            </button>
            <button
              className="flex-1 h-11 rounded-xl bg-muted text-foreground text-sm font-medium"
              onClick={this.handleReset}
            >
              Reset local data
            </button>
          </div>
        </div>
      </div>
    );
  }
}
