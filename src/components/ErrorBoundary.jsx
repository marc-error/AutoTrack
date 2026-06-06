import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null, showDetails: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo })
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null, showDetails: false })
  }

  handleGoHome = () => {
    this.setState({ hasError: false, error: null, errorInfo: null, showDetails: false })
    window.location.href = '/home'
  }

  toggleDetails = () => {
    this.setState(prev => ({ showDetails: !prev.showDetails }))
  }

  render() {
    if (this.state.hasError) {
      const isDev = import.meta.env?.DEV || false

      return (
        <div className="status-page">
          <div className="status-container">
            <div className="status-giant">!</div>
            <div className="status-label">Error</div>
            <div className="status-subtitle">Something went wrong, but we can help you get back</div>
            <div className="status-links">
              <button className="status-link" onClick={this.handleReset}>Try Again</button>
              <span className="status-link-separator">,</span>
              <button className="status-link" onClick={this.handleGoHome}>Home</button>
            </div>

            {isDev && this.state.error && (
              <div className="status-error-details">
                <button className="status-error-toggle" onClick={this.toggleDetails}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    style={{ transform: this.state.showDetails ? 'rotate(90deg)' : 'rotate(0deg)' }}>
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                  Error Details
                </button>
                {this.state.showDetails && (
                  <div className="status-error-content">
                    <div className="status-error-message">
                      <strong>{this.state.error.name}</strong>
                      <span>{this.state.error.message}</span>
                    </div>
                    {this.state.errorInfo && (
                      <pre className="status-error-stack">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
