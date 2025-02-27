'use client';

import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import HeroSection from '@/components/landing/HeroSection';
import CreateQuizSection from '@/components/landing/CreateQuizSection';
import BrowseQuizzesSection from '@/components/landing/BrowseQuizzesSection';

export default function LandingPage() {
  const [activeSection, setActiveSection] = useState<'none' | 'create' | 'browse'>('none');

  const handleCreateClick = () => {
    if (activeSection === 'create') return;
    setActiveSection('create');
  };

  const handleBrowseClick = () => {
    if (activeSection === 'browse') return;
    setActiveSection('browse');
  };

  return (
    <MainLayout>
      <div className="flex flex-col min-h-screen">
        <HeroSection 
          activeSection={activeSection}
          onCreateClick={handleCreateClick}
          onBrowseClick={handleBrowseClick}
        />
        
        <CreateQuizSection isVisible={activeSection === 'create'} />
        
        <BrowseQuizzesSection isVisible={activeSection === 'browse'} />
      </div>
    </MainLayout>
  );
}