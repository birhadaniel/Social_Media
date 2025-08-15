// app/api/auth/reset-password/route.ts
import { NextResponse } from 'next/server';
import { resetPassword } from '../../../../services/auth/reset-password';
import { z } from 'zod';

const resetSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = resetSchema.parse(body);
    await resetPassword({ email });
    return NextResponse.json({ message: 'Reset password email sent' });
  } catch (error) {
    return NextResponse.json({ message: 'Reset password failed', error: String(error) }, { status: 400 });
  }
}