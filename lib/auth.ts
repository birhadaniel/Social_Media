// lib/auth.ts
import jwt from 'jsonwebtoken';

export function generateToken(payload: { userId: number }) {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '1h' });
}

export function verifyToken(token: string) {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not set');
  }
  
  try {
    return jwt.verify(token, process.env.JWT_SECRET) as { userId: number };
  } catch (error) {
    console.error('JWT verification error:', error);
    throw error;
  }
}