/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { User, RoleName } from '@/types/auth';
import { loginApi, getCurrentUserApi, registerHospitalApi } from '@/api/auth-api';

interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    isLoading: boolean;
}

interface AuthContextType {
    authState: AuthState;
    login: (email: string, password: string) => Promise<void>;
    registerHospital: (formData: FormData) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
    getRole: () => RoleName | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const [authState, setAuthState] = useState<AuthState>({
        isAuthenticated: false,
        user: null,
        isLoading: true,
    });

    const refreshUser = async () => {
        try {
            const data = await getCurrentUserApi();
            if (data?.user) {
                setAuthState({
                    isAuthenticated: true,
                    user: data.user,
                    isLoading: false,
                });
            } else {
                setAuthState({ isAuthenticated: false, user: null, isLoading: false });
            }
        } catch (error) {
            setAuthState({ isAuthenticated: false, user: null, isLoading: false });
        }
    };

    useEffect(() => {
        refreshUser();
    }, []);

    const getRole = useCallback((): RoleName | null => {
        if (!authState.user) return null;
        // Gère role.name (objet) ou roleName (string directe)
        const role = authState.user.role?.name || authState.user.roleName;
        return (role as RoleName) || null;
    }, [authState.user]);

    const login = async (email: string, password: string) => {
        try {
            await loginApi(email, password);
            await refreshUser();
            toast.success('Connexion réussie');
            router.push('/dashboard/overview');
        } catch (error: any) {
            throw error;
        }
    };

    const registerHospital = async (formData: FormData) => {
        try {
            await registerHospitalApi(formData);
            await refreshUser();
            toast.success('Hôpital créé avec succès');
            router.push('/dashboard/overview');
        } catch (error: any) {
            toast.error(error.message || "Erreur lors de l'inscription");
            throw error;
        }
    };

    const logout = async () => {
        setAuthState({ isAuthenticated: false, user: null, isLoading: false });
        router.push('/login');
        toast.success('Déconnecté');
    };

    return (
        <AuthContext.Provider value={{ authState, login, registerHospital, logout, refreshUser, getRole }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};