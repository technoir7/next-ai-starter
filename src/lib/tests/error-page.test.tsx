import React from 'react';
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import dynamic from 'next/dynamic';
import { useSearchParams, useRouter } from 'next/navigation';

// Mock the next/navigation hooks
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
  useSearchParams: vi.fn(() => ({
    get: vi.fn((param) => {
      if (param === 'error') {
        return 'Configuration';
      }
      return null;
    }),
  })),
}));

// Import the ErrorPage component dynamically to avoid issues with client components
const ErrorPage = dynamic(() => import('@/app/auth/error/page'), { ssr: false });

describe('Auth Error Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render with default error message', async () => {
    // Override the mock to return null for error
    (useSearchParams as Mock).mockImplementationOnce(() => ({
      get: (param: string) => param === 'error' ? null : null,
    }));

    render(<ErrorPage />);
    
    // Check that the main error heading is displayed
    expect(await screen.findByText('Authentication Error')).toBeInTheDocument();
    
    // Verify the default error message is shown
    expect(await screen.findByText('An error occurred during authentication. Please try again.')).toBeInTheDocument();
    
    // Verify the try again button is present
    expect(await screen.findByText('Try Again')).toBeInTheDocument();
  });

  it('should render Configuration error message', async () => {
    // Override the mock to return Configuration error
    (useSearchParams as Mock).mockImplementationOnce(() => ({
      get: (param: string) => param === 'error' ? 'Configuration' : null,
    }));

    render(<ErrorPage />);
    
    // Check specific Configuration error message
    expect(await screen.findByText('There is a problem with the authentication configuration. Please contact the administrator.')).toBeInTheDocument();
    
    // Check that the additional information is shown for Configuration errors
    expect(await screen.findByText('This could be due to incomplete email provider settings or missing environment variables.')).toBeInTheDocument();
  });

  it('should render AccessDenied error message', async () => {
    // Override the mock to return AccessDenied error
    (useSearchParams as Mock).mockImplementationOnce(() => ({
      get: (param: string) => param === 'error' ? 'AccessDenied' : null,
    }));

    render(<ErrorPage />);
    
    // Check specific AccessDenied error message
    expect(await screen.findByText('Access denied. You do not have permission to access this resource.')).toBeInTheDocument();
  });

  it('should render CredentialsSignin error message', async () => {
    // Override the mock to return CredentialsSignin error
    (useSearchParams as Mock).mockImplementationOnce(() => ({
      get: (param: string) => param === 'error' ? 'CredentialsSignin' : null,
    }));

    render(<ErrorPage />);
    
    // Check specific CredentialsSignin error message
    expect(await screen.findByText('The credentials you provided are invalid.')).toBeInTheDocument();
  });

  it('should render EmailSignin error message', async () => {
    // Override the mock to return EmailSignin error
    (useSearchParams as Mock).mockImplementationOnce(() => ({
      get: (param: string) => param === 'error' ? 'EmailSignin' : null,
    }));

    render(<ErrorPage />);
    
    // Check specific EmailSignin error message
    expect(await screen.findByText('The email sign-in link is invalid or has expired.')).toBeInTheDocument();
  });

  it('should render SessionRequired error message', async () => {
    // Override the mock to return SessionRequired error
    (useSearchParams as Mock).mockImplementationOnce(() => ({
      get: (param: string) => param === 'error' ? 'SessionRequired' : null,
    }));

    render(<ErrorPage />);
    
    // Check specific SessionRequired error message
    expect(await screen.findByText('You must be signed in to access this page.')).toBeInTheDocument();
  });
}); 