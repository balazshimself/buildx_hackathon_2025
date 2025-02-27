'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Quiz from '@/components/quiz';
import MainLayout from '@/components/layout/MainLayout';
import { Loader2 } from 'lucide-react';

export default function SolveGeneratedQuizPage({ params }: { params: { id: string } }) {
  const [quizData, setQuizData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedQuiz = localStorage.getItem('generated_quiz');
    
    if (!storedQuiz) {
      router.push('/');
      return;
    }
    
    try {
      const parsedQuiz = JSON.parse(storedQuiz);
      
      // Check if the ID matches
      if (parsedQuiz.id !== params.id) {
        throw new Error('Quiz ID mismatch');
      }
      
      setQuizData(parsedQuiz);
    } catch (error) {
      console.error('Error parsing quiz data:', error);
      router.push('/');
    } finally {
      setLoading(false);
    }
  }, [params.id, router]);

  // Function to handle going back
  const clearFiles = () => {
    router.push('/');
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
      clearFiles={clearFiles}
    />
  );
}