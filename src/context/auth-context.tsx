'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { User } from '@/types/auth';

type AppError = AxiosError | Error;

/* =======================
   TYPES
======================= */

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
}

interface AuthContextType {
  authState: AuthState;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

/* =======================
   CONTEXT
======================= */

const AuthContext = createContext<AuthContextType | undefined>(undefined);

axios.defaults.baseURL = process.env.NEXT_PUBLIC_ACTIVE_API_URL;
axios.defaults.withCredentials = true;

/* =======================
   PROVIDER
======================= */

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true,
  });

  /* =======================
     FETCH CURRENT USER
  ======================= */

  const refreshUser = async () => {
    try {
      const { data } = await axios.get('/api/auth/me');

      if (data?.user) {
        setAuthState({
          isAuthenticated: true,
          user: data.user,
          isLoading: false,
        });
      } else {
        setAuthState({
          isAuthenticated: false,
          user: null,
          isLoading: false,
        });
      }
    } catch {
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
      });
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  /* =======================
     LOGIN
  ======================= */

  const login = async (email: string, password: string) => {
    try {
      await axios.post('/api/auth/login', { email, password });

      await refreshUser();

      toast.success('Connexion réussie');

      router.push('/dashboard');
    } catch (error) {
      const err = error as AppError;
      console.error(err);
      toast.error('Identifiants invalides');
      throw err;
    }
  };

  /* =======================
     LOGOUT
  ======================= */

  const logout = async () => {
    try {
      await axios.post('/api/auth/logout');

      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
      });

      router.push('/login');
      toast.success('Déconnexion réussie');
    } catch (error) {
      const err = error as AppError;
      console.error(err);
      toast.error('Erreur de déconnexion');
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};



export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
