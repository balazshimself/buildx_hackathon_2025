import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from '@/components/ui/link';
import { Brain } from 'lucide-react';

export default function Header() {
  return (
    <header className="border-b w-full">
      <div className="container mx-auto max-w-7xl flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Brain className="h-6 w-6" />
          <span className="text-xl font-bold">QuizGen AI</span>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          {/* <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Features
          </Link>
          <Link href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            How It Works
          </Link>
          <Link href="#about" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            About
          </Link> */}
        </nav>
        <div className="flex items-center gap-4">
          <Button 
            onClick={() => window.location.href = '/'} 
            variant="outline" 
            className="hidden md:flex"
          >
            Create Quiz
          </Button>
        </div>
      </div>
    </header>
  );
}