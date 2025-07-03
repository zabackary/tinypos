import normalizeException from "normalize-exception";
import React from "react";
import { ScriptErrorPage } from "./error";

interface ErrorBoundaryProps {
  children?: React.ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

export default class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: unknown) {
    // Update state so the next render will show the fallback UI.
    return { error: normalizeException(error) };
  }

  componentDidCatch(error: unknown, errorInfo: unknown) {
    console.error("[important] Component crashed:", error, errorInfo);
  }

  render() {
    const { error } = this.state;
    const { children } = this.props;

    if (error) {
      // You can render any custom fallback UI
      return <ScriptErrorPage error={error} />;
    }

    return children;
  }
}
