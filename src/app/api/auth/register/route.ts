import { NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { prisma } from '@/lib/db';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

// Define validation schema
const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export async function POST(req: Request) {
  try {
    // Parse request body
    const body = await req.json();
    console.log('Registration request received:', { ...body, password: '***REDACTED***' });
    
    // Validate input
    const validationResult = registerSchema.safeParse(body);
    if (!validationResult.success) {
      console.log('Validation error:', validationResult.error.errors);
      return NextResponse.json(
        { error: validationResult.error.errors[0].message }, 
        { status: 400 }
      );
    }
    
    const { name, email, password } = validationResult.data;
    
    // Check if user already exists
    try {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });
      
      if (existingUser) {
        console.log('User already exists:', email);
        return NextResponse.json(
          { error: 'User with this email already exists' },
          { status: 409 }
        );
      }
    } catch (err) {
      console.error('Error checking existing user:', err);
      return NextResponse.json(
        { error: `Database error while checking for existing user: ${err instanceof Error ? err.message : String(err)}` },
        { status: 500 }
      );
    }
    
    // Hash password
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (err) {
      console.error('Password hashing error:', err);
      return NextResponse.json(
        { error: `Error hashing password: ${err instanceof Error ? err.message : String(err)}` },
        { status: 500 }
      );
    }
    
    // Create user
    try {
      const user = await prisma.user.create({
        data: {
          name,
          email,
          hashedPassword,
          // Add default values for required fields
          updatedAt: new Date(),
        },
      });
      
      // Remove sensitive fields
      const { hashedPassword: _, ...userWithoutPassword } = user;
      
      console.log('User created successfully:', userWithoutPassword.id);
      return NextResponse.json(
        { user: userWithoutPassword, message: 'User created successfully' },
        { status: 201 }
      );
    } catch (err) {
      console.error('Error creating user:', err);
      
      // Handle specific Prisma errors
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          return NextResponse.json(
            { error: 'This email is already registered' },
            { status: 409 }
          );
        }
      }
      
      return NextResponse.json(
        { error: `Database error while creating user: ${err instanceof Error ? err.message : String(err)}` },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Registration error:', error);
    
    return NextResponse.json(
      { error: `Registration failed: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
} 