// services/auth/login.ts
import bcrypt from 'bcryptjs';
import prisma from '../../lib/db';
import { generateToken } from '../../lib/auth';

export async function login({ email, password }: { email: string; password: string }) {
  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }

  const token = generateToken({ userId: user.id });
  return { id: user.id, username: user.username, email: user.email, token };
}