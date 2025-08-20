// services/auth/reset-password.ts
import prisma from '../../lib/db';

export async function resetPassword({ email }: { email: string }) {
  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (!user) {
    throw new Error('User not found');
  }

  // TODO: Implement email service (e.g., AWS SES or SendGrid)
  console.log(`Reset password link for ${email} would be sent here`);
}