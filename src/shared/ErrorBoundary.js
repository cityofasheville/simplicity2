import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // You can also log the error to an error reporting service
    console.log(error, info);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <p className="text-danger">Oops, something went wrong!  Try refreshing the page.  If you tried that and it did not work, please email help@ashevillenc.gov.</p>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
