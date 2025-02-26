'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Loader2 } from 'lucide-react';
import { getQuiz } from '@/lib/firestore';
import MainLayout from '@/components/layout/MainLayout';
import { Quiz } from '@/lib/firestore';

export default function QuizDetailPage({ params }: { params: { id: string } }) {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const quizData = await getQuiz(params.id);
        if (!quizData) {
          setError('Quiz not found');
          return;
        }
        
        if (!quizData.isPublic) {
          setError('This quiz is not available');
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
  }, [params.id]);

  const handleTakeQuiz = () => {
    // Store quiz data in local storage to be used by the quiz component
    if (quiz) {
      localStorage.setItem('current_quiz', JSON.stringify(quiz));
      router.push(`/quiz/${params.id}/take`);
    }
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

  return (
    <MainLayout>
      <div className="container mx-auto max-w-7xl px-4 py-12 md:py-24">
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-2">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle className="text-2xl font-bold">{quiz.mainTopic}</CardTitle>
              <div className="text-sm text-muted-foreground">
                Created by: {quiz.creatorName || 'Anonymous'}
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {quiz.subTopics.map((topic, index) => (
                <Badge key={index} variant="secondary">
                  {topic}
                </Badge>
              ))}
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <p className="text-muted-foreground">
                This quiz contains {quiz.questions.length} questions about {quiz.mainTopic}.
              </p>
              <p className="text-sm text-muted-foreground">
                Completed {quiz.completions} {quiz.completions === 1 ? 'time' : 'times'}
              </p>
              <Button 
                onClick={handleTakeQuiz} 
                size="lg" 
                className="w-full mt-6 gap-2"
              >
                <FileText className="h-5 w-5" />
                Take Quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}