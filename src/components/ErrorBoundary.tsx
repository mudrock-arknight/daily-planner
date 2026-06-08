import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="bg-surface-card rounded-card p-10 shadow-card max-w-md w-full text-center">
            <div className="w-20 h-20 bg-danger/10 rounded-card flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-ink mb-3">页面出错了</h2>
            <p className="text-ink-subtle mb-2">抱歉，页面遇到了一些问题</p>
            {this.state.error && (
              <p className="text-sm text-ink-muted bg-surface-hover rounded-btn p-3 mb-6 break-all">
                {this.state.error.message}
              </p>
            )}
            <button
              onClick={this.handleRetry}
              className="btn-primary px-8 py-3 rounded-btn font-semibold"
            >
              重试
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
