import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

// Mock the modules
vi.mock('next/server', async () => {
  const actual = await vi.importActual('next/server');
  return {
    ...actual,
    NextResponse: {
      json: vi.fn((data, options) => ({ data, options })),
    },
  };
});

vi.mock('bcrypt', () => ({
  hash: vi.fn(() => Promise.resolve('hashed_password_mock')),
}));

vi.mock('@/lib/db', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}));

// Import the mocked modules to use in our tests
import { prisma } from '@/lib/db';
import { POST } from '@/app/api/auth/register/route';

describe('Register API Endpoint', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Reset the mocks
    vi.mocked(NextResponse.json).mockClear();
    vi.mocked(bcrypt.hash).mockClear();
    vi.mocked(prisma.user.findUnique).mockClear();
    vi.mocked(prisma.user.create).mockClear();
  });

  it('should validate the input correctly', async () => {
    // Test with invalid input
    const invalidRequest = new NextRequest('http://localhost:3000/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: '', // Empty name
        email: 'not-an-email', // Invalid email
        password: '123', // Too short password
      }),
    });

    await POST(invalidRequest);

    // Should return validation error
    expect(NextResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: expect.any(String) }),
      expect.objectContaining({ status: 400 })
    );
  });

  it('should check if user already exists', async () => {
    // Mock user exists
    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({ id: '1', email: 'test@example.com' } as any);

    const request = new NextRequest('http://localhost:3000/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      }),
    });

    await POST(request);

    // Should return conflict error
    expect(NextResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: 'Email already registered' }),
      expect.objectContaining({ status: 409 })
    );
  });

  it('should create a new user successfully', async () => {
    // Mock user does not exist
    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(null);
    
    // Mock successful user creation
    vi.mocked(prisma.user.create).mockResolvedValueOnce({
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any);

    const request = new NextRequest('http://localhost:3000/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      }),
    });

    await POST(request);

    // Should hash the password
    expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);

    // Should create the user
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        name: 'Test User',
        email: 'test@example.com',
        hashedPassword: 'hashed_password_mock',
        emailVerified: null,
        image: null,
      }),
    });

    // Should return success
    expect(NextResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
      }),
      expect.objectContaining({ status: 201 })
    );
  });

  it('should handle database errors', async () => {
    // Mock user does not exist
    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(null);
    
    // Mock database error
    vi.mocked(prisma.user.create).mockRejectedValueOnce(new Error('Database connection error'));

    const request = new NextRequest('http://localhost:3000/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      }),
    });

    await POST(request);

    // Should return server error
    expect(NextResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: expect.stringContaining('Failed to create account') }),
      expect.objectContaining({ status: 500 })
    );
  });
}); 