import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { POST } from '@/app/api/auth/register/route';
import { prisma } from '@/lib/db';
import bcrypt from 'bcrypt';

// Mock Prisma
vi.mock('@/lib/db', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}));

// Mock bcrypt
vi.mock('bcrypt', () => ({
  hash: vi.fn().mockResolvedValue('hashed_password'),
}));

// Mock NextResponse
vi.mock('next/server', () => ({
  NextResponse: {
    json: vi.fn().mockImplementation((data, options) => ({
      data,
      status: options?.status || 200,
    })),
  },
}));

describe('Registration API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should validate required fields', async () => {
    const req = new Request('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // Missing name
        email: 'test@example.com',
        password: 'password123',
      }),
    });

    const response = await POST(req);
    expect(response.status).toBe(400);
    expect(response.data.error).toContain('Name is required');
  });

  it('should check for existing users', async () => {
    // Mock findUnique to return an existing user
    (prisma.user.findUnique as any).mockResolvedValue({
      id: '1',
      email: 'existing@example.com',
    });

    const req = new Request('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Existing User',
        email: 'existing@example.com',
        password: 'password123',
      }),
    });

    const response = await POST(req);
    expect(response.status).toBe(409);
    expect(response.data.error).toContain('already exists');
  });

  it('should create a new user successfully', async () => {
    // Mock findUnique to return null (no existing user)
    (prisma.user.findUnique as any).mockResolvedValue(null);
    
    // Mock create to return a new user
    (prisma.user.create as any).mockResolvedValue({
      id: '123',
      name: 'Test User',
      email: 'newuser@example.com',
      hashedPassword: 'hashed_password',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const req = new Request('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'newuser@example.com',
        password: 'password123',
      }),
    });

    const response = await POST(req);
    expect(response.status).toBe(201);
    expect(response.data.message).toContain('created successfully');
    expect(response.data.user).toBeDefined();

    // Verify bcrypt was called
    expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);

    // Verify prisma.user.create was called with correct data
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        name: 'Test User',
        email: 'newuser@example.com',
        hashedPassword: 'hashed_password',
        updatedAt: expect.any(Date),
      },
    });
  });

  it('should handle database errors when creating a user', async () => {
    // Mock findUnique to return null (no existing user)
    (prisma.user.findUnique as any).mockResolvedValue(null);
    
    // Mock create to throw an error
    (prisma.user.create as any).mockRejectedValue(new Error('Database error'));

    const req = new Request('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'newuser@example.com',
        password: 'password123',
      }),
    });

    const response = await POST(req);
    expect(response.status).toBe(500);
    expect(response.data.error).toContain('Database error');
  });
}); 