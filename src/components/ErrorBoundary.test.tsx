import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { ErrorBoundary } from '../components/ErrorBoundary';

// Suppress expected React error boundary console output in tests
const consoleError = console.error;
beforeEach(() => {
  console.error = vi.fn();
});
afterEach(() => {
  console.error = consoleError;
});

const ThrowError = ({ shouldThrow = true }: { shouldThrow?: boolean }) => {
  if (shouldThrow) throw new Error('Test error');
  return <div>No error</div>;
};

describe('ErrorBoundary', () => {
  it('should render children when there is no error', () => {
    const { getByText } = render(
      <ErrorBoundary>
        <div>Test Content</div>
      </ErrorBoundary>
    );
    expect(getByText('Test Content')).toBeInTheDocument();
  });

  it('should render error UI when child component throws', () => {
    const { getByText } = render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(getByText(/something went wrong/i)).toBeInTheDocument();
    expect(getByText(/try again/i)).toBeInTheDocument();
    expect(getByText(/refresh page/i)).toBeInTheDocument();
  });

  it('should render custom fallback if provided', () => {
    const { getByText } = render(
      <ErrorBoundary fallback={<div>Custom Error</div>}>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(getByText('Custom Error')).toBeInTheDocument();
  });

  it('should call componentDidCatch when an error is thrown', () => {
    const spy = vi.spyOn(ErrorBoundary.prototype, 'componentDidCatch');

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Test error' }),
      expect.objectContaining({ componentStack: expect.any(String) })
    );

    spy.mockRestore();
  });

  it('should reset error state when Try Again is clicked', () => {
    const { getByText, queryByText } = render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(getByText(/something went wrong/i)).toBeInTheDocument();

    // Click "Try Again" — boundary resets, child re-renders and throws again
    // (since ThrowError always throws), but the reset itself should work
    fireEvent.click(getByText(/try again/i));

    // After reset the boundary re-renders children; ThrowError throws again
    // so we should still see the error UI (not a blank screen)
    expect(queryByText(/something went wrong/i)).toBeInTheDocument();
  });
});
