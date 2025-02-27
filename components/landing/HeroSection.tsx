'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileUp, Search } from 'lucide-react';

interface HeroSectionProps {
  activeSection: 'none' | 'create' | 'browse';
  onCreateClick: () => void;
  onBrowseClick: () => void;
}

export default function HeroSection({ 
  activeSection, 
  onCreateClick, 
  onBrowseClick 
}: HeroSectionProps) {
  // Animation variants
  const containerVariants = {
    centered: { y: 50 },
    raised: { y: -50, transition: { duration: 0.5, ease: "easeInOut" } }
  };

  return (
    <motion.section
      className="py-6 md:py-12 lg:py-16 xl:py-20 px-4"
      variants={containerVariants}
      initial="centered"
      animate={activeSection !== 'none' ? 'raised' : 'centered'}
    >
      <div className="flex items-center justify-center px-4">
        <div className="flex flex-col items-center text-center">
          <Badge variant="outline" className="inline-flex rounded-md border border-primary px-3 py-1 text-sm mb-4">
            <span className="text-primary">#BuildX Hackathon submission</span>
          </Badge>
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none mb-6">
            Generate Custom Quizzes in Seconds
          </h1>
          <p className="max-w-[600px] text-muted-foreground text-lg mb-8">
            Upload your study materials and let AI create personalized quizzes to test your knowledge with detailed explanations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              size="lg" 
              className="gap-2"
              onClick={onCreateClick}
              disabled={activeSection === 'create'}
            >
              <FileUp className="h-5 w-5" />
              Start Building
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="gap-2"
              onClick={onBrowseClick}
              disabled={activeSection === 'browse'}
            >
              <Search className="h-5 w-5" />
              Browse Quizzes
            </Button>
          </div>
        </div>
      </div>
    </motion.section>
  );
}