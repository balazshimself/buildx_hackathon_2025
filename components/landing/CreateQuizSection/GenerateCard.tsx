import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, FileText, Share } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { createQuiz } from '@/lib/firestore';

interface GenerateCardProps {
  mainTopic: string;
  subTopics: string;
  files: File[];
  isGenerating: boolean;
  setIsGenerating: (value: boolean) => void;
  generatedQuizId: string | null;
  setGeneratedQuizId: (value: string | null) => void;
  questions: any[];
  setQuestions: (questions: any[]) => void;
  hasError?: boolean;
}

export default function GenerateCard({
  mainTopic,
  subTopics,
  files,
  isGenerating,
  setIsGenerating,
  generatedQuizId,
  setGeneratedQuizId,
  questions,
  setQuestions,
  hasError = false
}: GenerateCardProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [isPublishing, setIsPublishing] = useState(false);

  const encodeFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleGenerateQuiz = async () => {
    // Validate inputs
    if (!mainTopic || !subTopics) {
      toast.error('Please enter a main topic and subtopics');
      return;
    }

    if (files.length === 0) {
      toast.error('Please upload at least one file');
      return;
    }

    setIsGenerating(true);

    try {
      const encodedFiles = await Promise.all(
        files.map(async (file) => ({
          name: file.name,
          type: file.type,
          data: await encodeFileAsBase64(file),
        }))
      );

      const response = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          files: encodedFiles,
          mainTopic,
          subTopics: subTopics.split(',').map(s => s.trim()),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate quiz');
      }

      const result = await response.json();
      setQuestions(result);
      
      // Generate a random ID for demo purposes
      const randomId = Math.random().toString(36).substring(2, 15);
      setGeneratedQuizId(randomId);
      
      // Store the generated quiz in localStorage for the quiz page to access
      localStorage.setItem('generated_quiz', JSON.stringify({
        id: randomId,
        mainTopic,
        subTopics: subTopics.split(',').map(s => s.trim()),
        questions: result
      }));
      
      toast.success('Quiz generated successfully!');
    } catch (error) {
      console.error('Error in generating quiz:', error);
      toast.error('Failed to generate quiz. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSolveQuiz = () => {
    if (generatedQuizId) {
      // Store the generated quiz in localStorage for the quiz page to access
      localStorage.setItem('current_quiz', JSON.stringify({
        id: generatedQuizId,
        mainTopic,
        subTopics: subTopics.split(',').map(s => s.trim()),
        questions: questions,
        creatorName: user ? user.displayName || user.email?.split('@')[0] : 'Guest',
        isPublic: false,
        isTemporary: true // Mark this quiz as temporary (not published)
      }));
      
      // Navigate to the quiz page
      router.push(`/quiz/${generatedQuizId}`);
    }
  };
  
  const publishQuiz = async () => {
    if (!user) {
      toast.error("Please log in to publish quizzes");
      return;
    }
    
    setIsPublishing(true);
    
    try {
      const quizData = {
        title: mainTopic,
        userId: user.uid,
        creatorName: user.displayName || user.email?.split('@')[0] || 'Guest',
        mainTopic,
        subTopics: subTopics.split(',').map(s => s.trim()),
        questions,
        isPublic: true,
        isTemporary: false
      };
      
      const quizId = await createQuiz(quizData);
      
      toast.success("Quiz published successfully!");
      
      // Navigate to the quiz page
      router.push(`/quiz/${quizId}`);
    } catch (error) {
      console.error("Error publishing quiz:", error);
      toast.error("Failed to publish quiz. Please try again.");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <Card className={`w-full h-full ${hasError ? 'error-highlight border-red-500 border-2' : ''}`}>
      <CardHeader>
        <CardTitle className="text-xl">Generate Quiz</CardTitle>
        <CardDescription>
          Use AI to create a personalized quiz from your content! Our AI analyzes your content to create relevant, challenging questions tailored to your specific learning materials.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col justify-between h-[calc(100%-88px)]">
        
        <div className="mt-6 space-y-4">
          {!generatedQuizId ? (
            <Button 
              onClick={handleGenerateQuiz} 
              className="w-full" 
              disabled={isGenerating}
              size="lg"
            >
              {isGenerating ? (
                <span className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Generating Quiz...</span>
                </span>
              ) : (
                "Generate Quiz"
              )}
            </Button>
          ) : (
            <>
              <Button 
                onClick={handleSolveQuiz} 
                className="w-full" 
                size="lg"
                variant="default"
              >
                <FileText className="mr-2 h-4 w-4" /> Take Quiz
              </Button>
              <Button 
                onClick={() => publishQuiz()}
                className="w-full" 
                // size="md"
                variant="outline"
                disabled={!user || isPublishing}
              >
                {isPublishing ? (
                  <span className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Publishing...</span>
                  </span>
                ) : user ? (
                  <><Share className="mr-2 h-4 w-4" /> Publish Quiz</>
                ) : (
                  "Login to Publish Quiz"
                )}
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}