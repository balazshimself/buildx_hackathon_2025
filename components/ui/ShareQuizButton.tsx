'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share, Check } from 'lucide-react';
import { toast } from 'sonner';
import { shareQuiz } from '@/lib/firestore';
import ShareQuizModal from './ShareQuizModal';

interface ShareQuizButtonProps {
  quizId: string;
  isPublic: boolean;
}

export default function ShareQuizButton({ quizId, isPublic }: ShareQuizButtonProps) {
  const [isSharing, setIsSharing] = useState(false);
  const [isShared, setIsShared] = useState(isPublic);
  const [isCopied, setIsCopied] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleShare = async () => {
    if (isShared) {
      setIsModalOpen(true);
      return;
    }
    
    setIsSharing(true);
    try {
      await shareQuiz(quizId);
      setIsShared(true);
      toast.success('Quiz is now public and can be shared!');
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error sharing quiz:', error);
      toast.error('Failed to share quiz. Please try again.');
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <>
      <Button
        onClick={handleShare}
        variant="outline"
        className="bg-muted hover:bg-muted/80 w-full"
        disabled={isSharing}
      >
        {isSharing ? (
          <>Loading...</>
        ) : isCopied ? (
          <>
            <Check className="mr-2 h-4 w-4" /> Copied!
          </>
        ) : (
          <>
            <Share className="mr-2 h-4 w-4" /> {isShared ? "Share Quiz" : "Share Quiz"}
          </>
        )}
      </Button>
      
      <ShareQuizModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        quizId={quizId}
      />
    </>
  );
}