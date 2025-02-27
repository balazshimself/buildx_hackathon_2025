'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Quiz } from '@/lib/firestore';
import QuizCard from './QuizCard';
import { Loader2 } from 'lucide-react';

interface BrowseQuizzesSectionProps {
  isVisible: boolean;
}

export default function BrowseQuizzesSection({ isVisible }: BrowseQuizzesSectionProps) {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  // Animation variants
  const containerVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      height: 0,
    },
    visible: { 
      opacity: 1, 
      y: -100,
      height: 'auto',
      transition: { 
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  // Fetch quizzes from Firestore
  useEffect(() => {
    const fetchQuizzes = async () => {
      if (!isVisible) return; // Only fetch when section is visible
      
      setLoading(true);
      try {
        // Query for public quizzes, ordered by creation date
        const quizzesQuery = query(
          collection(db, 'quizzes'),
          where('isPublic', '==', true),
          orderBy('createdAt', 'desc'),
          limit(8)
        );
        
        const querySnapshot = await getDocs(quizzesQuery);
        const quizData: Quiz[] = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          
          // Convert timestamps to Date objects
          const createdAt = data.createdAt?.toDate() || new Date();
          const updatedAt = data.updatedAt?.toDate() || new Date();
          
          quizData.push({
            id: doc.id,
            ...data,
            createdAt,
            updatedAt
          } as Quiz);
        });
        
        setQuizzes(quizData);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [isVisible]);

  return (
    <motion.div
      className="container mx-auto max-w-7xl px-4 pb-20" 
      variants={containerVariants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
    >
      <motion.h2 
        className="text-2xl font-bold text-center mb-8"
        variants={itemVariants}
      >
        Browse Popular Quizzes
      </motion.h2>
      
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {quizzes.map((quiz) => (
            <motion.div key={quiz.id} variants={itemVariants} className="h-full">
              <QuizCard quiz={quiz} />
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}