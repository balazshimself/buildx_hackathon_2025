'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';

interface TopicsCardProps {
  mainTopic: string;
  setMainTopic: (value: string) => void;
  subTopics: string;
  setSubTopics: (value: string) => void;
  hasError?: boolean;
}

export default function TopicsCard({ 
  mainTopic, 
  setMainTopic, 
  subTopics, 
  setSubTopics,
  hasError = false
}: TopicsCardProps) {
  const handleJsonUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const text = await file.text();
        const json = JSON.parse(text);
        if (json.mainTopic && json.subTopics) {
          setMainTopic(json.mainTopic);
          setSubTopics(json.subTopics.join(", "));
          toast.success("Topics loaded successfully");
        } else {
          toast.error("Invalid JSON format - missing required fields");
        }
      } catch (error) {
        toast.error("Invalid JSON file format");
      }
    }
  };

  const jsonExample = {
    mainTopic: "Respiratory System",
    subTopics: ["Anatomy of the Respiratory System", "Mechanics of Breathing"]
  };

  return (
    <Card className={`w-full h-full ${hasError ? 'error-highlight border-red-500 border-2' : ''}`}>
      <CardHeader>
        <CardTitle className="text-xl">Define Your Topics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground mb-4">
          Enter your topics or upload a{" "}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="underline">JSON file</TooltipTrigger>
              <TooltipContent>
                <pre className="p-2">{JSON.stringify(jsonExample, null, 2)}</pre>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <Input
          placeholder={`Main topic (e.g. ${jsonExample.mainTopic})`}
          value={mainTopic}
          onChange={(e) => setMainTopic(e.target.value)}
        />
        
        <Input
          placeholder={`Comma-separated subtopics`}
          value={subTopics}
          onChange={(e) => setSubTopics(e.target.value)}
        />
        
        <div className="flex justify-center pt-2">
          <label className="cursor-pointer w-full">
            <input type="file" accept=".json" onChange={handleJsonUpload} className="hidden" />
            <Button variant="outline" className="w-full" asChild>
              <span>Upload JSON File</span>
            </Button>
          </label>
        </div>
      </CardContent>
    </Card>
  );
}