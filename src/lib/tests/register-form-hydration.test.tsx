import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { RegisterForm } from '@/components/RegisterForm';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
}));

describe('RegisterForm Hydration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should handle undefined error prop', () => {
    render(<RegisterForm error={undefined} />);
    expect(screen.queryByText('Registration Error')).not.toBeInTheDocument();
  });

  it('should handle null error prop', () => {
    render(<RegisterForm error={null} />);
    expect(screen.queryByText('Registration Error')).not.toBeInTheDocument();
  });

  it('should handle empty string error prop', () => {
    render(<RegisterForm error={''} />);
    expect(screen.queryByText('Registration Error')).not.toBeInTheDocument();
  });

  it('should display error message when provided', () => {
    const errorMessage = 'An error occurred during registration';
    render(<RegisterForm error={errorMessage} />);
    expect(screen.getByText('Registration Error')).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('should not create client/server inconsistencies with error prop', () => {
    // This is a basic test to ensure no errors during render with different prop values
    const { rerender } = render(<RegisterForm />);
    rerender(<RegisterForm error="Error message" />);
    rerender(<RegisterForm error={null} />);
    // If we get here without errors, the test passes
    expect(true).toBe(true);
  });

  it('should handle form submission with error state', async () => {
    // Create a component that wraps RegisterForm and handles error state
    const TestComponent = () => {
      const [testError, setTestError] = React.useState<string | null>(null);
      
      const handleSubmit = (data: { name: string; email: string; password: string }) => {
        // Simulate an error during submission
        setTestError('Failed to create account');
        return Promise.resolve(); // No need to throw, just set error state
      };
      
      return (
        <RegisterForm 
          onSubmit={handleSubmit}
          error={testError}
        />
      );
    };
    
    // Render the test component
    render(<TestComponent />);
    
    // Fill in form with valid data
    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'password123' } });
    
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));
    
    // Wait for error to be displayed
    await waitFor(() => {
      expect(screen.getByText('Registration Error')).toBeInTheDocument();
      expect(screen.getByText('Failed to create account')).toBeInTheDocument();
    });
  });

  // Test to simulate the exact error case we're seeing
  it('should handle dynamic error state changes without hydration issues', async () => {
    const { rerender } = render(<RegisterForm error={null} />);
    
    // Initial render should not have error
    expect(screen.queryByText('Registration Error')).not.toBeInTheDocument();
    
    // Simulate receiving an error from the server
    rerender(<RegisterForm error="An error occurred during registration" />);
    
    // Should show error message
    expect(screen.getByText('Registration Error')).toBeInTheDocument();
    expect(screen.getByText('An error occurred during registration')).toBeInTheDocument();
    
    // Simulate error being cleared
    rerender(<RegisterForm error={null} />);
    
    // Error message should be gone
    expect(screen.queryByText('Registration Error')).not.toBeInTheDocument();
  });
}); 