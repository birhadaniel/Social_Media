// app/api/auth/register/route.ts
import { NextResponse } from 'next/server';
import { register } from '../../../../services/auth/register';
import { z } from 'zod';

const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, email, password } = registerSchema.parse(body);
    const result = await register({ username, email, password });
    
    // Return the exact structure the frontend expects
    return NextResponse.json({
      message: 'User registered successfully',
      token: result.token,
      userId: result.id,
      user: {
        id: result.id,
        username: result.username,
        email: result.email
      }
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Registration failed', error: String(error) }, { status: 400 });
  }
}