import { NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { prisma } from '@/lib/db';

// Define validation schema
const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export async function POST(request: Request) {
  try {
    // Parse and validate request body
    const body = await request.json();
    console.log('Registration request received:', { name: body.name, email: body.email });
    
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      console.error('Validation error:', validation.error.errors);
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { name, email, password } = validation.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log('User already exists:', email);
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Password hashed successfully');

    // Get current timestamp for created/updated
    const now = new Date();

    try {
      // Create user with all required fields
      const user = await prisma.user.create({
        data: {
          name,
          email,
          hashedPassword,
          createdAt: now,
          updatedAt: now,
          emailVerified: null,
          image: null,
        },
      });

      console.log('User created successfully:', { id: user.id, email: user.email });

      // Return success response (exclude sensitive data)
      return NextResponse.json(
        {
          id: user.id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
        },
        { status: 201 }
      );
    } catch (dbError) {
      console.error('Database error creating user:', dbError);
      // Check if it's a Prisma error and provide more specific information
      return NextResponse.json(
        { error: `Database error: ${dbError instanceof Error ? dbError.message : 'Unknown database error'}` },
        { status: 500 }
      );
    }
  } catch (error) {
    // Log the detailed error for debugging
    console.error('Registration error:', error);
    
    // Check for specific Prisma errors
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint failed')) {
        return NextResponse.json(
          { error: 'Email already registered' },
          { status: 409 }
        );
      }
      
      // Return the actual error message for debugging
      return NextResponse.json(
        { error: `Error: ${error.message}` },
        { status: 500 }
      );
    }
    
    // Generic error response
    return NextResponse.json(
      { error: 'Failed to create account. Please try again.' },
      { status: 500 }
    );
  }
} 