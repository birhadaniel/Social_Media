// services/auth/register.ts
import bcrypt from 'bcryptjs';
import prisma from '../../lib/db';
import { generateToken } from '../../lib/auth';

export async function register({ username, email, password }: { username: string; email: string; password: string }) {
  const existingUser = await prisma.user.findFirst({
    where: { OR: [{ email }, { username }] },
  });
  if (existingUser) {
    throw new Error('User already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
    },
  });

  const token = generateToken({ userId: user.id });
  return { id: user.id, username, email, token };
}