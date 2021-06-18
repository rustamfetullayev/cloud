import React from "react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
  }

  render() {
    const { error, errorInfo } = this.state;

    if (error) {
      return (
        <section className="px-5 py-3">
          <h1>Unknown error caught!</h1>
          <div className="alert alert-danger" role="alert">
            {error.toString()}
          </div>
          <div className="alert alert-light" role="alert">
            {errorInfo.componentStack.toString()}
          </div>
        </section>
      );
    }

    return this.props.children;
  }
}
