// app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import { login } from '../../../../services/auth/login';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = loginSchema.parse(body);
    const result = await login({ email, password });
    
    // Return the exact structure the frontend expects
    return NextResponse.json({
      message: 'Login successful',
      token: result.token,
      userId: result.id,
      user: {
        id: result.id,
        username: result.username,
        email: result.email
      }
    });
  } catch (error) {
    return NextResponse.json({ message: 'Login failed', error: String(error) }, { status: 401 });
  }
}