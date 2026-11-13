'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { StudentPortalView } from '@/views/portals/StudentPortalView';
import { ShieldAlert, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function StudentPortalPage() {
  const { currentUser } = useApp();

  if (!currentUser) {
    return (
      <div className="w-full py-20 px-4 flex items-center justify-center min-h-[60vh]">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-stone-200 text-center space-y-4 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-orange-100 text-[#FF6B16] flex items-center justify-center mx-auto">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-stone-900 font-display">Student Authentication Required</h2>
          <p className="text-xs text-stone-500">
            Please sign in to your student account to access your live timetable, attendance records, capstone projects, and certificates.
          </p>
          <Link
            href="/login"
            className="w-full py-2.5 px-4 bg-[#FF6B16] hover:bg-orange-600 text-white text-xs font-bold rounded-xl transition-colors inline-flex items-center justify-center gap-2 shadow-xs"
          >
            Sign In to Student Portal <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return <StudentPortalView />;
}

