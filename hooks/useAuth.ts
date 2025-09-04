import { useState, useEffect } from 'react';
import { login, register, resetPassword } from '@/lib/api';
import { useRouter } from 'next/navigation';

export const useAuth = () => {
  const [userId, setUserId] = useState<number | null | "loading">("loading");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {

      try {
      const base64 = token.split(".")[1];
      // convert base64url → base64
      const normalized = base64.replace(/-/g, "+").replace(/_/g, "/");
      const payload = JSON.parse(atob(normalized));
      setUserId(payload.userId);
    } catch (err) {
      console.error("Invalid token in localStorage:", err);
      localStorage.removeItem("token"); // clear bad token
      setUserId(null);
    }
  } else {
    setUserId(null);
  }
  }, []);

  const handleRegister = async (data: { email: string; username: string; password: string }) => {
    setLoading(true);
    setError(null);
    try {
      const { token, userId } = await register(data);
      localStorage.setItem('token', token);
      setUserId(userId);
      router.push('/feed');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (data: { email: string; password: string }) => {
    setLoading(true);
    setError(null);
    try {
      const { token, userId } = await login(data);
      localStorage.setItem('token', token);
      setUserId(userId);
      router.push('/feed');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };
  const handleResetPassword = async (data: { email: string }) => {
    setLoading(true);
    setError(null);
    try {
      await resetPassword(data);
      setError('Password reset link sent to your email'); // Display success as an "error" for simplicity
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUserId(null);
    router.push('/auth/login');
  };

  return { userId, loading, error, handleRegister, handleLogin,handleResetPassword, logout };
};