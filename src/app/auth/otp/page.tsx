'use client';

import React, { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import OtpVerificationCard from '@/components/auth/otp-verification-card';
import { Loader2 } from 'lucide-react';

function OtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userEmail = searchParams.get('email');


  useEffect(() => {
    if (!userEmail) {
      router.push('/auth/signup');
    }
  }, [userEmail, router]);

  if (!userEmail) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-[#058D66]" size={40} />
      </div>
    );
  }

  const handleVerifySuccess = () => {

    router.push('/dashboard/overview');
  };

  const handleBackToSignup = () => {
    router.push('/auth/signup');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <OtpVerificationCard
        email={userEmail}
        onVerifySuccess={handleVerifySuccess}
        onBackToSignup={handleBackToSignup}
      />
    </div>
  );
}

// L'utilisation de useSearchParams nécessite un Suspense Boundary dans Next.js App Router
export default function OtpVerificationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-[#058D66]" size={40} />
      </div>
    }>
      <OtpContent />
    </Suspense>
  );
}