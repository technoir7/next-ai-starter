import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { RegisterForm } from '@/components/RegisterForm';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
}));

describe('RegisterForm Error Handling', () => {
  it('should display the error message when provided as a prop', () => {
    // Arrange
    const errorMessage = 'This email is already registered';
    
    // Act
    render(<RegisterForm error={errorMessage} />);
    
    // Assert
    expect(screen.getByText('Registration Error')).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('should show validation errors for empty form submission', () => {
    // Arrange
    const mockSubmit = vi.fn();
    render(<RegisterForm onSubmit={mockSubmit} />);
    
    // Act - Submit form without filling any fields
    fireEvent.click(screen.getByText('Create Account'));
    
    // Assert
    expect(screen.getByText('Name is required')).toBeInTheDocument();
    expect(screen.getByText('Email is required')).toBeInTheDocument();
    expect(screen.getByText('Password is required')).toBeInTheDocument();
    expect(screen.getByText('Please confirm your password')).toBeInTheDocument();
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it.skip('should show validation error for invalid email', () => {
    // Arrange
    const mockSubmit = vi.fn();
    render(<RegisterForm onSubmit={mockSubmit} />);
    
    // Act - Fill form with invalid email
    fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'invalid-email' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'password123' } });
    
    // Submit the form to trigger validation - click the button  
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));
    
    // Assert - We're looking for a partial text match for the validation error
    expect(screen.getByText(/valid email/i)).toBeInTheDocument();
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it('should show validation error for password mismatch', () => {
    // Arrange
    const mockSubmit = vi.fn();
    render(<RegisterForm onSubmit={mockSubmit} />);
    
    // Act - Fill form with mismatched passwords
    fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'different-password' } });
    
    // Assert - should show error immediately on confirm password change
    expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
    
    // Act - Submit form
    fireEvent.click(screen.getByText('Create Account'));
    
    // Assert
    expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it('should show error for short password', () => {
    // Arrange
    const mockSubmit = vi.fn();
    render(<RegisterForm onSubmit={mockSubmit} />);
    
    // Act - Fill form with short password
    fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'short' } });
    fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'short' } });
    
    fireEvent.click(screen.getByText('Create Account'));
    
    // Assert
    expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument();
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it('should clear validation errors when fields are corrected', () => {
    // Arrange
    const mockSubmit = vi.fn();
    render(<RegisterForm onSubmit={mockSubmit} />);
    
    // Act - Submit empty form to trigger all validation errors
    fireEvent.click(screen.getByText('Create Account'));
    
    // Assert - All validation errors are shown
    expect(screen.getByText('Name is required')).toBeInTheDocument();
    
    // Act - Correct the name field
    fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: 'Test User' } });
    
    // Assert - Name validation error is cleared
    expect(screen.queryByText('Name is required')).not.toBeInTheDocument();
  });
}); 