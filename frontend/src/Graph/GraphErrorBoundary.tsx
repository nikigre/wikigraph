import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class GraphErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Graph error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div
            style={{
              color: "white",
              textAlign: "center",
              padding: "50px",
              background: "rgba(0,0,0,0.8)",
              borderRadius: "8px",
              margin: "20px",
            }}
          >
            <h2>Graf se je sesul</h2>
            <p>Prišlo je do napake pri prikazovanju grafa.</p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              style={{
                padding: "10px 20px",
                background: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                marginTop: "10px",
              }}
            >
              Ponovno naloži
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

export default GraphErrorBoundary;
