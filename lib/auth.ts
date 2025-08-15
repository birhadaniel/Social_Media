// lib/auth.ts
import jwt from 'jsonwebtoken';

export function generateToken(payload: { userId: number }) {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '1h' });
}

export function verifyToken(token: string) {
  return jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };
}