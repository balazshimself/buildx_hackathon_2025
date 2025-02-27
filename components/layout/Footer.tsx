import React from 'react';
import { Button } from '@/components/ui/button';
import { Brain } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t w-full bg-background z-10">
      <div className="container mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between py-4 px-4 md:px-6">
        <div className="flex items-center gap-2 mb-2 md:mb-0">
          <Brain className="h-5 w-5" />
          <span className="text-lg font-semibold">QuizGen AI</span>
        </div>
        <p className="text-xs text-muted-foreground">
          © 2025 QuizGen AI. All rights reserved.
        </p>
        <div className="flex items-center gap-4 mt-2 md:mt-0">
          <Button variant="ghost" size="sm">
            Terms
          </Button>
          <Button variant="ghost" size="sm">
            Privacy
          </Button>
          <Button variant="ghost" size="sm">
            Contact
          </Button>
        </div>
      </div>
    </footer>
  );
}