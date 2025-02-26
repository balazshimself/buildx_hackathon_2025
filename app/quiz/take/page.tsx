'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Quiz from '@/components/quiz-shared';
import { Loader2 } from 'lucide-react';
import { incrementQuizCompletion } from '@/lib/firestore';
import MainLayout from '@/components/layout/MainLayout';

export default function TakeQuizPage({ params }: { params: { id: string } }) {
  const [quizData, setQuizData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Get quiz data from local storage
    const storedQuiz = localStorage.getItem('current_quiz');
    
    if (!storedQuiz) {
      // If no quiz data, redirect to quiz detail page
      router.push(`/quiz/${params.id}`);
      return;
    }
    
    try {
      const parsedQuiz = JSON.parse(storedQuiz);
      setQuizData(parsedQuiz);
      
      // Increment completion counter when quiz is loaded
      incrementQuizCompletion(params.id).catch(error => {
        console.error('Error incrementing completion count:', error);
      });
    } catch (error) {
      console.error('Error parsing quiz data:', error);
      router.push(`/quiz/${params.id}`);
    } finally {
      setLoading(false);
    }
  }, [params.id, router]);

  const handleReturnToDetail = () => {
    router.push(`/quiz/${params.id}`);
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

  if (!quizData) {
    return (
      <MainLayout>
        <div className="container mx-auto max-w-7xl px-4 py-12 text-center">
          <p>Quiz data not found. Please try again.</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <Quiz 
      questions={quizData.questions} 
      mainTopic={quizData.mainTopic} 
      subTopics={quizData.subTopics}
      quizId={params.id}
      isShared={true}
      returnToDetail={handleReturnToDetail}
    />
  );
}