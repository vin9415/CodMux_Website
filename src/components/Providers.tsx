'use client';

import React from 'react';
import { AppProvider } from '@/context/AppContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ToastContainer } from '@/components/ToastContainer';
import { EarlyAccessModal } from '@/components/EarlyAccessModal';
import { PrivacyProtectionShield } from '@/components/PrivacyProtectionShield';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <div className="min-h-screen bg-[#FAF8F5] text-stone-900 flex flex-col font-sans selection:bg-orange-500/20 selection:text-orange-950">
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
        <EarlyAccessModal />
        <ToastContainer />
        <PrivacyProtectionShield />
      </div>
    </AppProvider>
  );
}
