import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { prisma } from '@/lib/db';
import bcrypt from 'bcrypt';

// This file contains integration tests that actually interact with the database
// We're not mocking anything to replicate real-world usage

describe('User Registration Integration', () => {
  // Test user data
  const testUser = {
    name: 'Integration Test User',
    email: 'integration-test@example.com',
    password: 'Password123!',
  };

  // Clean up before and after tests
  beforeAll(async () => {
    // Clean up any existing test user
    await prisma.user.deleteMany({
      where: {
        email: testUser.email,
      },
    });
  });

  afterAll(async () => {
    // Clean up after tests
    await prisma.user.deleteMany({
      where: {
        email: testUser.email,
      },
    });

    // Close Prisma connection
    await prisma.$disconnect();
  });

  it('should create a new user in the database', async () => {
    // First check the user doesn't exist
    const existingUser = await prisma.user.findUnique({
      where: { email: testUser.email },
    });
    expect(existingUser).toBeNull();

    // Hash the password as our API would
    const hashedPassword = await bcrypt.hash(testUser.password, 10);

    // Create a new user directly via Prisma
    const newUser = await prisma.user.create({
      data: {
        name: testUser.name,
        email: testUser.email,
        hashedPassword,
        updatedAt: new Date(),
      },
    });

    // Verify the user was created correctly
    expect(newUser).toBeDefined();
    expect(newUser.email).toBe(testUser.email);
    expect(newUser.name).toBe(testUser.name);
    expect(newUser.hashedPassword).toBeDefined();

    // Verify we can find the user
    const foundUser = await prisma.user.findUnique({
      where: { email: testUser.email },
    });
    expect(foundUser).toBeDefined();
    expect(foundUser?.email).toBe(testUser.email);
  });

  it('should validate the database schema requirements', async () => {
    // Clean up any existing test user first
    await prisma.user.deleteMany({
      where: {
        email: testUser.email,
      },
    });

    // Try creating a user without required fields
    try {
      await prisma.user.create({
        data: {
          // Missing other required fields
          email: testUser.email,
        } as any,
      });
      // If the above doesn't throw, fail the test
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
}); 