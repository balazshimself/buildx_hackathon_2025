'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Loader2, ArrowLeft } from 'lucide-react';
import { getQuiz, incrementQuizCompletion } from '@/lib/firestore';
import { useAuth } from '@/lib/auth-context';
import MainLayout from '@/components/layout/MainLayout';
import { Quiz as QuizType } from '@/lib/firestore';
import Quiz from '@/components/quiz';
import { toast } from 'sonner';

export default function QuizDetailPage() {
  const params = useParams();
  const quizId = params.id as string;
  const [quiz, setQuiz] = useState<QuizType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [takingQuiz, setTakingQuiz] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const fetchQuiz = async () => {
      // First check if there's a quiz in localStorage from generation
      const storedQuiz = localStorage.getItem('current_quiz');
      
      if (storedQuiz) {
        const parsedQuiz = JSON.parse(storedQuiz);
        if (parsedQuiz.id === quizId) {
          setQuiz(parsedQuiz);
          setLoading(false);
          return;
        }
      }
      
      // If not found in localStorage, fetch from database
      try {
        const quizData = await getQuiz(quizId);
        if (!quizData) {
          setError('Quiz not found');
          return;
        }
        
        setQuiz(quizData);
      } catch (error) {
        console.error('Error fetching quiz:', error);
        setError('Failed to load quiz');
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId, user]);

  const handleTakeQuiz = () => {
    // Increment completion counter
    if (quiz && !quiz.isTemporary) {
      incrementQuizCompletion(quizId).catch(error => {
        console.error('Error incrementing completion count:', error);
      });
    }
    
    setTakingQuiz(true);
  };
  
  const handleBackToDetails = () => {
    setTakingQuiz(false);
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-[80vh]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </MainLayout>
    );
  }

  if (error || !quiz) {
    return (
      <MainLayout>
        <div className="container mx-auto max-w-7xl px-4 py-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-center">Error</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">{error || 'Something went wrong'}</p>
              <Button 
                onClick={() => router.push('/')} 
                className="mt-4"
              >
                Return Home
              </Button>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  // When taking the quiz, render the Quiz component
  if (takingQuiz) {
    return (
      <Quiz 
        questions={quiz.questions} 
        mainTopic={quiz.mainTopic} 
        subTopics={quiz.subTopics || []}
        clearFiles={handleBackToDetails}
      />
    );
  }

  // Otherwise show the quiz details
  const creatorName = quiz.creatorName || 'Guest';
  
  // Check if creator is current user
  const isCurrentUser = user && quiz.userId === user.uid;
  
  // If creator is "Guest" and user is logged in, show option to claim quiz
  const canClaim = !quiz.userId && creatorName === 'Guest' && user;

  return (
    <MainLayout>
      <div className="container mx-auto max-w-3xl px-4 py-12 md:py-24 flex flex-col items-center justify-center">
        <Card className="border-0 shadow-lg w-full">
          <CardHeader className="pb-2 text-center">
            <CardTitle className="text-3xl font-bold">{quiz.mainTopic}</CardTitle>
            <div className="flex justify-center mt-2">
              <span className="text-sm text-muted-foreground">
                Created by: {isCurrentUser ? 'You' : creatorName}
              </span>
            </div>
            <div className="flex flex-wrap gap-2 mt-4 justify-center">
              {quiz.subTopics && quiz.subTopics.map((topic, index) => (
                <Badge key={index} variant="secondary">
                  {topic}
                </Badge>
              ))}
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4 text-center">
              <p className="text-muted-foreground">
                This quiz contains {quiz.questions.length} questions about {quiz.mainTopic}.
              </p>
              {!quiz.isTemporary && (
                <p className="text-sm text-muted-foreground">
                  Completed {quiz.completions || 0} {quiz.completions === 1 ? 'time' : 'times'}
                </p>
              )}
              <Button 
                onClick={handleTakeQuiz} 
                size="lg" 
                className="mt-6 gap-2 w-full md:w-auto md:px-8"
              >
                <FileText className="h-5 w-5" />
                Take Quiz
              </Button>
              
              {canClaim && (
                <div className="pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // Logic to claim ownership of the quiz
                      toast.success("Quiz claimed successfully!");
                    }}
                  >
                    Claim as your quiz
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}