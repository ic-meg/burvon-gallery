import React from "react";

class ThreeErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console
    console.error("3D Viewer Error:", error, errorInfo);

    // Call parent error handler if provided
    if (this.props.onError) {
      this.props.onError(error);
    }
  }

  render() {
    if (this.state.hasError) {
      // Render fallback UI
      return (
        <div className="w-full h-full flex items-center justify-center bg-[#0A0A0A] text-[#FFF7DC]">
          <div className="text-center px-6">
            <p className="avantbold text-lg mb-2">3D Not Available</p>
            <p className="text-sm opacity-70">
              The 3D viewer is temporarily unavailable. Please try again later.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ThreeErrorBoundary;
