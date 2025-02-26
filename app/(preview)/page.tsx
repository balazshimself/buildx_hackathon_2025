'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileUp, ListChecks } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';

export default function LandingPage() {
  // Function to redirect to the quiz generation page
  const navigateToQuizGenerator = () => {
    window.location.href = '/generate-quiz/';
  };

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="py-12 md:py-24 lg:py-32 xl:py-36 bg-background">
        <div className="container mx-auto max-w-7xl px-4 md:px-6 float-none">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-4">
                <Badge variant="secondary" className="inline-flex rounded-md border border-primary px-3 py-1 text-sm mr-2">
                  <span className="text-primary">Powered by Gemini Pro</span>
                </Badge>
                <Badge variant="secondary" className="inline-flex rounded-md border border-primary px-3 py-1 text-sm mr-2">
                  <span className="text-primary">#BuildXHackathon</span>
                </Badge>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Generate Custom Quizzes in Seconds
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Upload your study materials and let AI create personalized quizzes to test your knowledge with detailed explanations.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button onClick={navigateToQuizGenerator} size="lg" className="gap-2">
                  <FileUp className="h-5 w-5" />
                  Start Building
                </Button>
                <Button onClick={navigateToQuizGenerator} size="lg" className="gap-2 bg-black text-white">
                  <FileUp className="h-5 w-5" />
                  Browse Quizes
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}