import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

describe('Authentication Configuration Tests', () => {
  it('should have a properly configured auth adapter', () => {
    expect(authOptions.adapter).toBeDefined();
  });

  it('should have a properly configured email provider', () => {
    expect(authOptions.providers).toHaveLength(1);
    
    const emailProvider = authOptions.providers[0];
    expect(emailProvider.id).toBe('email');
    
    // @ts-ignore - We know this is the EmailProvider
    const emailConfig = emailProvider.options;
    expect(emailConfig.server).toBeDefined();
    expect(emailConfig.from).toBeDefined();
  });

  it('should have required environment variables set', () => {
    // Check for required environment variables
    expect(process.env.NEXTAUTH_SECRET).toBeDefined();
    expect(process.env.NEXTAUTH_URL).toBeDefined();
    expect(process.env.EMAIL_SERVER_PASSWORD).toBeDefined();
    expect(process.env.EMAIL_FROM).toBeDefined();
    
    // Check if they're not just empty strings
    expect(process.env.NEXTAUTH_SECRET).not.toBe('');
    expect(process.env.NEXTAUTH_URL).not.toBe('');
    expect(process.env.EMAIL_SERVER_PASSWORD).not.toBe('');
    expect(process.env.EMAIL_FROM).not.toBe('');
    
    // Ensure EMAIL_SERVER_PASSWORD is not the default placeholder value
    expect(process.env.EMAIL_SERVER_PASSWORD).not.toBe('your-email-password');
  });

  it('should have correct database session strategy', () => {
    expect(authOptions.session?.strategy).toBe('database');
  });

  it('should have correct auth pages configured', () => {
    expect(authOptions.pages?.signIn).toBe('/auth/signin');
    expect(authOptions.pages?.error).toBe('/auth/error');
  });
});

describe('Database Auth Models Tests', () => {
  beforeAll(async () => {
    // Make sure we have a clean database state for testing
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should be able to connect to the database', async () => {
    // Simple test to ensure we can connect to the database
    const count = await prisma.user.count();
    expect(typeof count).toBe('number');
  });

  it('should have required auth tables in schema', async () => {
    // Test if we can query the required tables without errors
    try {
      await prisma.user.findFirst();
      await prisma.account.findFirst();
      await prisma.session.findFirst();
      await prisma.verificationToken.findFirst();
      // If we get here, the tables exist
      expect(true).toBe(true);
    } catch (error) {
      console.error('Database schema error:', error);
      expect(error).toBeUndefined();
    }
  });
}); 