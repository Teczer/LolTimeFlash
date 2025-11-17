/**
 * Note: Error Boundaries must use class components (React limitation)
 */

'use client'

import { Component, type ReactNode } from 'react'
import { Button } from './ui/button'

interface IErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface IErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<
  IErrorBoundaryProps,
  IErrorBoundaryState
> {
  constructor(props: IErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): IErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('❌ Error Boundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return <ErrorFallback error={this.state.error} />
    }

    return this.props.children
  }
}

function ErrorFallback({ error }: { error: Error | null }) {
  const handleReload = () => {
    window.location.reload()
  }

  const handleGoHome = () => {
    window.location.href = '/'
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-8">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="text-6xl">💥</div>
        <h1 className="text-3xl font-bold text-destructive">
          Oops! Something went wrong
        </h1>
        <p className="max-w-md text-muted-foreground">
          An unexpected error occurred. Don't worry, you can try reloading the
          page or going back home.
        </p>

        {error && (
          <details className="max-w-lg rounded-md border border-destructive/50 bg-destructive/10 p-4 text-left">
            <summary className="cursor-pointer font-mono text-sm text-destructive">
              Error details (for debugging)
            </summary>
            <pre className="mt-2 overflow-x-auto text-xs text-muted-foreground">
              {error.message}
              {'\n\n'}
              {error.stack}
            </pre>
          </details>
        )}
      </div>

      <div className="flex gap-4">
        <Button onClick={handleReload} variant="default">
          🔄 Reload Page
        </Button>
        <Button onClick={handleGoHome} variant="outline">
          🏠 Go Home
        </Button>
      </div>
    </div>
  )
}

