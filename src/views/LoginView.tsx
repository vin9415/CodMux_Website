
'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';

import {
  Shield,
  Briefcase,
  GraduationCap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
} from 'lucide-react';

import {
  validateEmail,
  validatePassword,
} from '../utils/validation';

export const LoginView: React.FC = () => {
  const { loginUser, addToast, navigateTo } = useApp();

  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [showPassword, setShowPassword] = useState(false);

  // Login form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Login Handler
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Email validation
    const emailCheck = validateEmail(email);

    if (!emailCheck.isValid) {
      addToast(
        'error',
        'Invalid Email',
        emailCheck.error || 'Please enter a valid email address.'
      );
      return;
    }

    // Password validation
    const passCheck = validatePassword(password);

    if (!passCheck.isValid) {
      addToast(
        'error',
        'Invalid Password',
        passCheck.error || 'Password must be at least 6 characters long.'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
          role: selectedRole,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        addToast(
          'error',
          'Authentication Failed',
          data.error || 'Invalid credentials or unauthorized account.'
        );
        return;
      }

      // Successful database authentication
      loginUser(data.user);

    } catch (err) {
      console.error('Login error:', err);

      addToast(
        'error',
        'Authentication Server Error',
        'Could not communicate with the database authentication server.'
      );

    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full py-12 sm:py-20 bg-[#FAF8F5] min-h-[85vh] flex items-center justify-center px-4 sm:px-6">

      <div className="w-full max-w-xl bg-white border border-stone-200 rounded-3xl shadow-xl overflow-hidden p-6 sm:p-10">

        {/* Brand Header */}
        <div className="text-center space-y-2 mb-8">

          <button
            onClick={() => navigateTo('home')}
            className="inline-flex items-center gap-2.5 mx-auto focus:outline-none cursor-pointer group"
          >
            <img
              src="/assets/aistudio/codemuxlogo_913c6b11.png"
              alt="Code Mux"
              className="w-12 h-12 object-contain rounded-2xl shadow-xs transition-transform group-hover:scale-105"
              referrerPolicy="no-referrer"
            />

            <span className="text-2xl font-bold tracking-tight text-stone-900 font-display">
              Code <span className="text-[#FF6B16]">Mux</span>
            </span>
          </button>

          <h1 className="text-2xl font-bold text-stone-900 font-display">
            Portal Authentication
          </h1>

          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Select your portal role to access your personalized workspace.
          </p>

        </div>

        {/* LOGIN FORM */}
        <form onSubmit={handleLoginSubmit} className="space-y-5">

          {/* Role Selection Tabs */}
          <div>

            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
              Select Your Role Portal
            </label>

            <div className="grid grid-cols-3 gap-2">

              {/* Student */}
              <button
                type="button"
                onClick={() => setSelectedRole('student')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedRole === 'student'
                    ? 'border-[#FF6B16] bg-orange-50/40 text-stone-900'
                    : 'border-stone-200 bg-[#FAF8F5] text-stone-600 hover:bg-white'
                }`}
              >
                <GraduationCap
                  className={`w-4 h-4 mb-1 ${
                    selectedRole === 'student'
                      ? 'text-[#FF6B16]'
                      : 'text-stone-400'
                  }`}
                />

                <div className="text-xs font-bold">
                  Student
                </div>

                <div className="text-[10px] text-stone-500">
                  Learner workspace
                </div>
              </button>

              {/* Mentor */}
              <button
                type="button"
                onClick={() => setSelectedRole('mentor')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedRole === 'mentor'
                    ? 'border-[#FF6B16] bg-orange-50/40 text-stone-900'
                    : 'border-stone-200 bg-[#FAF8F5] text-stone-600 hover:bg-white'
                }`}
              >
                <Briefcase
                  className={`w-4 h-4 mb-1 ${
                    selectedRole === 'mentor'
                      ? 'text-[#FF6B16]'
                      : 'text-stone-400'
                  }`}
                />

                <div className="text-xs font-bold">
                  Mentor
                </div>

                <div className="text-[10px] text-stone-500">
                  Instructor portal
                </div>
              </button>

              {/* Admin */}
              <button
                type="button"
                onClick={() => setSelectedRole('admin')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedRole === 'admin'
                    ? 'border-[#FF6B16] bg-orange-50/40 text-stone-900'
                    : 'border-stone-200 bg-[#FAF8F5] text-stone-600 hover:bg-white'
                }`}
              >
                <Shield
                  className={`w-4 h-4 mb-1 ${
                    selectedRole === 'admin'
                      ? 'text-[#FF6B16]'
                      : 'text-stone-400'
                  }`}
                />

                <div className="text-xs font-bold">
                  Admin
                </div>

                <div className="text-[10px] text-stone-500">
                  System hub
                </div>
              </button>

            </div>
          </div>

          {/* Email */}
          <div>

            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Registered Email Address
            </label>

            <div className="relative">

              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your registered email address"
                required
                className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#FF6B16] transition-colors"
              />

            </div>
          </div>

          {/* Password */}
          <div>

            <div className="flex items-center justify-between mb-1.5">

              <label className="text-xs font-semibold text-stone-700">
                Password
              </label>

              <button
                type="button"
                onClick={() =>
                  addToast(
                    'info',
                    'Password Recovery',
                    'A secure password reset verification code has been dispatched to your registered email.'
                  )
                }
                className="text-xs text-[#FF6B16] hover:underline cursor-pointer"
              >
                Forgot password?
              </button>

            </div>

            <div className="relative">

              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />

              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#FF6B16] transition-colors"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>

            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between text-xs text-stone-600">

            <label className="flex items-center gap-2 cursor-pointer">

              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-stone-300 text-[#FF6B16] focus:ring-[#FF6B16]"
              />

              <span>
                Remember this workstation
              </span>

            </label>

          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 text-xs sm:text-sm font-semibold text-white bg-[#FF6B16] hover:bg-orange-600 disabled:opacity-60 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSubmitting ? (
              <span>
                Authenticating with Database...
              </span>
            ) : (
              <>
                Sign In to{' '}
                {selectedRole.charAt(0).toUpperCase() +
                  selectedRole.slice(1)}{' '}
                Portal

                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

        </form>

      </div>
    </div>
  );
};
