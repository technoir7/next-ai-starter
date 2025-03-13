import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { prisma } from '@/lib/db';
import { authOptions } from '@/lib/auth';
import { AdapterUser } from 'next-auth/adapters';

describe('Sign-in Flow Tests', () => {
  // Test credentials
  const testUser = {
    name: 'Test User',
    email: 'test-signin@example.com',
  };

  beforeAll(async () => {
    // Create a test user if it doesn't exist
    await prisma.user.upsert({
      where: { email: testUser.email },
      update: {},
      create: {
        name: testUser.name,
        email: testUser.email,
        updatedAt: new Date(),
      },
    });
  });

  afterAll(async () => {
    // Clean up
    await prisma.user.deleteMany({
      where: { email: testUser.email },
    });
    await prisma.$disconnect();
  });

  it('should have EmailProvider configured correctly', () => {
    // Check if the email provider is configured
    const emailProvider = authOptions.providers.find(
      (provider) => provider.id === 'email'
    );
    expect(emailProvider).toBeDefined();

    // @ts-ignore - EmailProvider has options
    const options = emailProvider.options;
    expect(options).toBeDefined();
    expect(options.server).toBeDefined();
    expect(options.from).toBeDefined();

    // Check if the server details are correct
    expect(options.server.host).toBe('smtp.resend.com');
    expect(options.server.port).toBe(465);
    expect(options.server.auth).toBeDefined();
    expect(options.server.auth.user).toBe('resend');
    expect(options.server.auth.pass).toBeDefined();
  });

  it('should have correct NextAuth secret', () => {
    expect(authOptions.secret).toBeDefined();
    expect(typeof authOptions.secret).toBe('string');
    expect((authOptions.secret as string).length).toBeGreaterThan(32);
  });

  it('should have a working signIn callback', async () => {
    // Get the signIn callback from auth options
    const signInCallback = authOptions.callbacks?.signIn;
    expect(signInCallback).toBeDefined();

    if (signInCallback) {
      // Find the test user to get a proper ID
      const user = await prisma.user.findUnique({
        where: { email: testUser.email },
      });
      expect(user).toBeDefined();

      if (user) {
        // Mock the callback parameters with proper types
        const mockParams: any = {
          user: {
            id: user.id,
            email: testUser.email,
            emailVerified: null,
          },
          account: null,
          profile: undefined,
          email: { verificationRequest: true },
          credentials: undefined,
        };

        // The callback should return true for a valid user
        const result = await signInCallback(mockParams);
        expect(result).toBe(true);
      }
    }
  });

  it('should have a working session callback', async () => {
    // Get the session callback from auth options
    const sessionCallback = authOptions.callbacks?.session;
    expect(sessionCallback).toBeDefined();

    if (sessionCallback) {
      // Find the test user
      const user = await prisma.user.findUnique({
        where: { email: testUser.email },
      });
      expect(user).toBeDefined();

      if (user) {
        // Mock session parameters with proper types
        const mockParams: any = {
          session: {
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
            },
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(), // 1 day from now
          },
          user: user as AdapterUser,
          token: undefined,
        };

        // The callback should return a valid session
        const result = await sessionCallback(mockParams);
        expect(result).toBeDefined();
        expect(result.user).toBeDefined();
        if (result.user) {
          expect(result.user.id).toBe(user.id);
        }
      }
    }
  });
}); 