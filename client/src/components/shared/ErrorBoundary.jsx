import { Component } from "react";

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-boundary-card">
            <span className="error-boundary-mark" aria-hidden="true">
              !
            </span>
            <h2>{this.props.title || "Something went wrong"}</h2>
            <p>
              {this.props.message || this.state.error?.message || "An unexpected error occurred."}
            </p>
            <button
              type="button"
              className="primary-button"
              onClick={() => this.setState({ hasError: false, error: null })}
            >
              {this.props.retryLabel || "Try again"}
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
