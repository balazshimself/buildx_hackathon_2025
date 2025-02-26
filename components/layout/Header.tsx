'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from '@/components/ui/link';
import { Brain } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import AuthModal from '@/components/auth/AuthModal';

export default function Header() {
  const { user, logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');

  const openSignIn = () => {
    setAuthModalMode('signin');
    setIsAuthModalOpen(true);
    console.log('Opening sign in modal');
  };

  const openSignUp = () => {
    setAuthModalMode('signup');
    setIsAuthModalOpen(true);
    console.log('Opening sign up modal');
  };

  const handleLogout = async () => {
    try {
      await logout();
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="border-b w-full">
      <div className="container mx-auto max-w-7xl flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Brain className="h-6 w-6" />
          <span className="text-xl font-bold">QuizGen AI</span>
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <div className="hidden md:flex items-center mr-4">
                <span className="text-sm text-muted-foreground">👋 Hello, {user.displayName || user.email}</span>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
              >
                Log Out
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={openSignUp}
                variant="ghost"
                className="hidden md:flex"
              >
                Get Started
              </Button>
              <Button
                onClick={openSignIn}
                variant="outline"
              >
                Log In
              </Button>
            </>
          )}
        </div>
      </div>
      
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
      />
    </header>
  );
}