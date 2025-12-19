/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ShieldCheck, ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { verifyOtpApi } from '@/api/auth-api';

interface OtpVerificationCardProps {
  email: string;
  onVerifySuccess?: () => void;
  onBackToSignup: () => void;
}

export default function OtpVerificationCard({
  email,
  onVerifySuccess,
  onBackToSignup,
}: OtpVerificationCardProps) {
  const router = useRouter();
  // Passage à 6 chiffres pour l'OTP
  const [otpCode, setOtpCode] = useState<string[]>(new Array(6).fill(''));
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // Focus automatique sur le premier champ au montage
  useEffect(() => {
    inputRefs[0].current?.focus();
  }, []);

  const handleOtpChange = (index: number, value: string): void => {
    // On ne prend que le dernier caractère si l'utilisateur tape vite
    const char = value.slice(-1);
    if (!/^\d*$/.test(char)) return;

    const newOtpCode = [...otpCode];
    newOtpCode[index] = char;
    setOtpCode(newOtpCode);

    // Auto-focus vers le suivant
    if (char && index < 5) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleVerifyCode = async (): Promise<void> => {
    const fullCode = otpCode.join('');

    if (fullCode.length !== 6) {
      toast.error('Veuillez entrer le code complet à 6 chiffres');
      return;
    }

    setIsVerifying(true);

    try {
      const response = await verifyOtpApi(email, fullCode);
      if (response.success) {
        toast.success('Compte vérifié avec succès !');
        if (onVerifySuccess) {
          onVerifySuccess();
        } else {
          router.push('/dashboard');
        }
      }
    } catch (err: any) {
      toast.error(err.message || 'Code invalide ou expiré');
      // On vide le code en cas d'erreur pour des raisons de sécurité
      setOtpCode(new Array(6).fill(''));
      inputRefs[0].current?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Card className="w-full max-w-md bg-white shadow-xl border-gray-100 rounded-2xl overflow-hidden">
      <CardContent className="p-8">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-[#058D66]/10 rounded-full flex items-center justify-center">
            <ShieldCheck className="w-10 h-10 text-[#058D66]" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
          Vérification du compte
        </h1>

        <div className="text-center mb-8">
          <p className="text-slate-500 text-sm">
            Un code de validation a été envoyé à l'adresse :
          </p>
          <p className="text-[#058D66] font-semibold font-mono mt-1">{email}</p>
        </div>

        {/* Inputs de l'OTP */}
        <div className="flex justify-between gap-2 mb-8">
          {otpCode.map((digit, index) => (
            <Input
              key={index}
              ref={inputRefs[index]}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-14 text-center text-2xl font-bold border-2 focus:border-[#058D66] focus:ring-0 rounded-lg"
              disabled={isVerifying}
            />
          ))}
        </div>

        <Button
          onClick={handleVerifyCode}
          disabled={isVerifying || otpCode.join('').length !== 6}
          className="w-full bg-[#058D66] hover:bg-[#047a57] text-white py-6 rounded-xl font-bold text-lg shadow-lg transition-all"
        >
          {isVerifying ? (
            <div className="flex items-center gap-2">
              <Loader2 className="animate-spin" />
              Vérification...
            </div>
          ) : (
            'Vérifier mon compte'
          )}
        </Button>

        <div className="mt-8 space-y-4">
          <div className="bg-slate-50 p-4 rounded-lg">
            <p className="text-xs text-slate-500 font-medium mb-2 uppercase tracking-wider">Conseils :</p>
            <ul className="text-xs text-slate-600 space-y-2">
              <li>• Vérifiez votre dossier de courriers indésirables (Spams).</li>
              <li>• Le code est valable pour une durée limitée.</li>
            </ul>
          </div>

          <button
            onClick={onBackToSignup}
            className="flex items-center justify-center gap-2 w-full text-slate-500 hover:text-slate-800 text-sm font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à l'inscription
          </button>
        </div>
      </CardContent>
    </Card>
  );
}