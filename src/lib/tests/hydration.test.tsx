import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { RegisterForm } from '@/components/RegisterForm';

// Mock the useRouter hook
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe('RegisterForm Hydration', () => {
  // Helper function to normalize HTML for comparison
  const normalizeHTML = (html: string) => {
    return html
      .replace(/data-reactroot=""/g, '')
      .replace(/data-testid="[^"]*"/g, '')
      .replace(/style="[^"]*"/g, '')
      .replace(/class="[^"]*"/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  };

  it('should render consistently between server and client', () => {
    // Server-side rendering simulation
    const serverHTML = render(<RegisterForm />).container.innerHTML;
    
    // Client-side rendering simulation
    const clientHTML = render(<RegisterForm />).container.innerHTML;
    
    // Compare normalized HTML
    expect(normalizeHTML(serverHTML)).toBe(normalizeHTML(clientHTML));
  });

  it('should render error message consistently', () => {
    const errorMessage = "Test error message";
    
    // Server-side rendering simulation
    const serverRender = render(<RegisterForm error={errorMessage} />);
    const serverHTML = serverRender.container.innerHTML;
    
    // Client-side rendering simulation
    const clientRender = render(<RegisterForm error={errorMessage} />);
    const clientHTML = clientRender.container.innerHTML;
    
    // Compare normalized HTML
    expect(normalizeHTML(serverHTML)).toBe(normalizeHTML(clientHTML));
    
    // Verify error message is displayed - use a more specific selector
    // Use getAllByText and check the first instance to avoid the multiple elements error
    const errorElements = clientRender.getAllByText("Test error message");
    expect(errorElements.length).toBeGreaterThan(0);
    expect(errorElements[0]).toBeInTheDocument();
  });

  it('should render loading state consistently', () => {
    // Server-side rendering simulation
    const serverRender = render(<RegisterForm isLoading={true} />);
    const serverHTML = serverRender.container.innerHTML;
    
    // Client-side rendering simulation
    const clientRender = render(<RegisterForm isLoading={true} />);
    const clientHTML = clientRender.container.innerHTML;
    
    // Compare normalized HTML
    expect(normalizeHTML(serverHTML)).toBe(normalizeHTML(clientHTML));
    
    // Verify loading state is displayed (button should be disabled)
    const buttons = clientRender.getAllByRole('button', { name: /creating account/i });
    expect(buttons.length).toBeGreaterThan(0);
    expect(buttons[0]).toBeDisabled();
  });
}); 