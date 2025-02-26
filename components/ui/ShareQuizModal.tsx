'use client';

import React, { useState } from 'react';
import { X, Copy, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface ShareQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  quizId: string;
}

export default function ShareQuizModal({ isOpen, onClose, quizId }: ShareQuizModalProps) {
  const [isCopied, setIsCopied] = useState(false);
  
  if (!isOpen) return null;
  
  const shareUrl = `${window.location.origin}/quiz/${quizId}`;
  
  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl).then(
      () => {
        setIsCopied(true);
        toast.success('Share link copied to clipboard!');
        setTimeout(() => setIsCopied(false), 2000);
      },
      () => {
        toast.error('Failed to copy link. Please try again.');
      }
    );
  };
  
  const handleVisit = () => {
    window.open(`/quiz/${quizId}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Share Quiz</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Your quiz is now public and can be shared using this link:
          </p>
          <div className="flex">
            <Input 
              value={shareUrl}
              readOnly
              className="rounded-r-none"
            />
            <Button
              onClick={handleCopy}
              variant="secondary"
              className="rounded-l-none"
            >
              {isCopied ? 'Copied!' : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex gap-2 justify-between">
          <Button
            variant="outline"
            className="w-full"
            onClick={onClose}
          >
            Close
          </Button>
          <Button
            className="w-full"
            onClick={handleVisit}
          >
            <ExternalLink className="mr-2 h-4 w-4" /> Visit
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}