import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function LogoutAuto() {
  const { logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const disconnect = async () => {
      logout();
      router.replace('/login');
    };
    disconnect();
  }, []);

  return null;
}
