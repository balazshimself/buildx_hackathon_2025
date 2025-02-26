'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { toast } from 'sonner';
import { likeQuiz, dislikeQuiz } from '@/lib/firestore';

interface LikeDislikeButtonsProps {
  quizId: string;
}

export default function LikeDislikeButtons({ quizId }: LikeDislikeButtonsProps) {
  const [isLiking, setIsLiking] = useState(false);
  const [isDisliking, setIsDisliking] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  const handleLike = async () => {
    if (hasVoted) {
      toast.error('You have already voted on this quiz');
      return;
    }
    
    setIsLiking(true);
    try {
      await likeQuiz(quizId);
      setHasVoted(true);
      toast.success('Thanks for your feedback!');
      
      // Store in localStorage to prevent multiple votes
      localStorage.setItem(`quiz_voted_${quizId}`, 'true');
    } catch (error) {
      console.error('Error liking quiz:', error);
      toast.error('Failed to register like. Please try again.');
    } finally {
      setIsLiking(false);
    }
  };

  const handleDislike = async () => {
    if (hasVoted) {
      toast.error('You have already voted on this quiz');
      return;
    }
    
    setIsDisliking(true);
    try {
      await dislikeQuiz(quizId);
      setHasVoted(true);
      toast.success('Thanks for your feedback!');
      
      // Store in localStorage to prevent multiple votes
      localStorage.setItem(`quiz_voted_${quizId}`, 'true');
    } catch (error) {
      console.error('Error disliking quiz:', error);
      toast.error('Failed to register dislike. Please try again.');
    } finally {
      setIsDisliking(false);
    }
  };

  // Check if user has already voted when component mounts
  useState(() => {
    const hasUserVoted = localStorage.getItem(`quiz_voted_${quizId}`);
    if (hasUserVoted) {
      setHasVoted(true);
    }
  });

  return (
    <div className="flex gap-4 w-full">
      <Button
        onClick={handleLike}
        variant="outline"
        className={`flex-1 ${hasVoted ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={isLiking || isDisliking || hasVoted}
      >
        <ThumbsUp className="mr-2 h-4 w-4" /> Helpful
      </Button>
      <Button
        onClick={handleDislike}
        variant="outline"
        className={`flex-1 ${hasVoted ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={isLiking || isDisliking || hasVoted}
      >
        <ThumbsDown className="mr-2 h-4 w-4" /> Not Helpful
      </Button>
    </div>
  );
}