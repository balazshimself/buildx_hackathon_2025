'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Quiz } from '@/lib/firestore';

interface QuizCardProps {
  quiz: Quiz;
}

export default function QuizCard({ quiz }: QuizCardProps) {
  const router = useRouter();
  
  // Format date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const handleTakeQuiz = () => {
    localStorage.setItem('current_quiz', JSON.stringify(quiz));
    
    // Navigate to the quiz page
    router.push(`/quiz/${quiz.id}`);
  };

  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg line-clamp-1" title={quiz.mainTopic}>
          {quiz.mainTopic}
        </CardTitle>
        <div className="flex items-center text-xs text-muted-foreground gap-1">
          <User className="h-3 w-3" />
          <span>{quiz.creatorName || 'Anonymous'}</span>
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <div className="flex flex-wrap gap-1 mb-3">
          {quiz.subTopics.slice(0, 3).map((topic, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {topic}
            </Badge>
          ))}
          {quiz.subTopics.length > 3 && (
            <Badge variant="outline" className="text-xs">+{quiz.subTopics.length - 3}</Badge>
          )}
        </div>
        
        <div className="text-xs text-muted-foreground space-y-1">
          <div className="flex justify-between">
            <span>Questions:</span>
            <span>{quiz.questions.length}</span>
          </div>
          <div className="flex justify-between">
            <span>Completed:</span>
            <span>{quiz.completions} {quiz.completions === 1 ? 'time' : 'times'}</span>
          </div>
          <div className="flex justify-between">
            <span>Created:</span>
            <span>{formatDate(quiz.createdAt)}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-2">
        <Button 
          onClick={handleTakeQuiz} 
          className="w-full"
          size="sm"
        >
          <FileText className="mr-2 h-4 w-4" /> 
          Take Quiz
        </Button>
      </CardFooter>
    </Card>
  );
}