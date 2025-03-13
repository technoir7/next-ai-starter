import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { RegisterForm } from '@/components/RegisterForm';
import React from 'react';

// Mock router
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
}));

describe('RegisterForm Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the form correctly', () => {
    render(<RegisterForm onSubmit={() => {}} />);
    
    // Check if all form elements are present
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
  });

  it('should validate form inputs', async () => {
    const mockSubmit = vi.fn();
    render(<RegisterForm onSubmit={mockSubmit} />);
    
    // Submit without filling in any fields
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));
    
    // Should show validation errors
    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
    
    // Submit should not be called
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it('should validate password match', async () => {
    const mockSubmit = vi.fn();
    render(<RegisterForm onSubmit={mockSubmit} />);
    
    // Fill in form with mismatched passwords
    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'password456' } });
    
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));
    
    // Should show password mismatch error
    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    });
    
    // Submit should not be called
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it('should submit the form when valid', async () => {
    const mockSubmit = vi.fn();
    render(<RegisterForm onSubmit={mockSubmit} />);
    
    // Fill in form correctly
    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'password123' } });
    
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));
    
    // Submit should be called with correct data
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  it('should display error message when provided', () => {
    render(<RegisterForm onSubmit={() => {}} error="Test error message" />);
    
    // Error message should be displayed
    expect(screen.getByText('Test error message')).toBeInTheDocument();
  });

  it('should disable the submit button when loading', () => {
    render(<RegisterForm onSubmit={() => {}} isLoading={true} />);
    
    // Button should be disabled
    const button = screen.getByRole('button', { name: /creating account/i });
    expect(button).toBeDisabled();
  });
}); 