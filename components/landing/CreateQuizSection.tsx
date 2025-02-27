'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import TopicsCard from './CreateQuizSection/TopicsCard';
import FilesCard from './CreateQuizSection/FilesCard';
import GenerateCard from './CreateQuizSection/GenerateCard';

interface CreateQuizSectionProps {
  isVisible: boolean;
}

export default function CreateQuizSection({ isVisible }: CreateQuizSectionProps) {
  const [mainTopic, setMainTopic] = useState('');
  const [subTopics, setSubTopics] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuizId, setGeneratedQuizId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);

  // Animation variants
  const containerVariants = {
    hidden: { 
      opacity: 0, 
      y: 100,
      height: 0,
      marginTop: '2.5vh',
    },
    visible: { 
      opacity: 1, 
      y: 0,
      height: 'auto',
      transition: { 
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: {
        opacity: 0, y: 40},
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.div
      className={`container mx-auto max-w-7xl h-full ${!isVisible ? 'pointer-events-none' : ''}`}
      variants={containerVariants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}>

      <motion.h2 
        className="text-2xl font-bold text-center mb-8"
        variants={cardVariants}>
        Use our quiz generator!
      </motion.h2>
      
      <div className=" grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div variants={cardVariants} className="h-full">
          <TopicsCard 
            mainTopic={mainTopic}
            setMainTopic={setMainTopic}
            subTopics={subTopics}
            setSubTopics={setSubTopics}
          />
        </motion.div>
        
        <motion.div variants={cardVariants} className="h-full">
          <FilesCard 
            files={files}
            setFiles={setFiles}
          />
        </motion.div>
        
        <motion.div variants={cardVariants} className="h-full">
          <GenerateCard 
            mainTopic={mainTopic}
            subTopics={subTopics}
            files={files}
            isGenerating={isGenerating}
            setIsGenerating={setIsGenerating}
            generatedQuizId={generatedQuizId}
            setGeneratedQuizId={setGeneratedQuizId}
            questions={questions}
            setQuestions={setQuestions}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}