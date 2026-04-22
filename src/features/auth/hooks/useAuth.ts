import { useMutation, useQuery } from '@tanstack/react-query';
import { authApi } from '../api/authApi';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { queryClient } from '@/lib/queryClient';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const useAuth = () => {
  const navigate = useNavigate();

  const { data: session, isLoading: isSessionLoading } = useQuery({
    queryKey: ['session'],
    queryFn: authApi.getSession,
  });

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session'] });
      navigate('/dashboard');
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      queryClient.setQueryData(['session'], null);
      navigate('/login');
    },
  });

  return {
    user: session?.user ?? null,
    isAuthenticated: !!session?.user,
    isLoading: isSessionLoading,
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    resetLoginError: loginMutation.reset,
    logout: logoutMutation.mutate,
  };
};
