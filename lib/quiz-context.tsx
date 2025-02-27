'use client';

import React, { createContext, useContext, useState } from 'react';
import { Question } from './schemas';

interface QuizContextType {
  mainTopic: string;
  setMainTopic: (topic: string) => void;
  subTopics: string;
  setSubTopics: (topics: string) => void;
  files: File[];
  setFiles: (files: File[]) => void;
  isGenerating: boolean;
  setIsGenerating: (isGenerating: boolean) => void;
  questions: Question[];
  setQuestions: (questions: Question[]) => void;
  generatedQuizId: string | null;
  setGeneratedQuizId: (id: string | null) => void;
  resetQuizState: () => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export function QuizProvider({ children }: { children: React.ReactNode }) {
  const [mainTopic, setMainTopic] = useState('');
  const [subTopics, setSubTopics] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [generatedQuizId, setGeneratedQuizId] = useState<string | null>(null);

  const resetQuizState = () => {
    setMainTopic('');
    setSubTopics('');
    setFiles([]);
    setIsGenerating(false);
    setQuestions([]);
    setGeneratedQuizId(null);
  };

  return (
    <QuizContext.Provider
      value={{
        mainTopic,
        setMainTopic,
        subTopics,
        setSubTopics,
        files,
        setFiles,
        isGenerating,
        setIsGenerating,
        questions,
        setQuestions,
        generatedQuizId,
        setGeneratedQuizId,
        resetQuizState
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
}