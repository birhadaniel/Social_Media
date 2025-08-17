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
    const user = await login({ email, password });
    return NextResponse.json({ message: 'Login successful', user });
  } catch (error) {
    return NextResponse.json({ message: 'Login failed', error: String(error) }, { status: 401 });
  }
}