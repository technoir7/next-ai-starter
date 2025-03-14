'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RegisterForm } from '@/components/RegisterForm';

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (data: { name: string; email: string; password: string }) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Submitting registration:', { name: data.name, email: data.email });
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log('Registration response:', { status: response.status, ok: response.ok });

      if (!response.ok) {
        console.error('Registration failed:', result);
        throw new Error(result.error || 'Failed to create account');
      }

      console.log('Registration successful, redirecting to sign-in');
      // Redirect to sign-in page after successful registration
      router.push('/auth/signin?registered=true');
    } catch (err) {
      console.error('Registration error:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <RegisterForm 
        onSubmit={handleRegister}
        isLoading={isLoading}
        error={error || undefined}
      />
    </div>
  );
} 