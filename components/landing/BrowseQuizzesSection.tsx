'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Quiz } from '@/lib/firestore';
import QuizCard from './QuizCard';
import { Loader2 } from 'lucide-react';
import { Button } from '../ui/button';

interface BrowseQuizzesSectionProps {
  isVisible: boolean;
}

export default function BrowseQuizzesSection({ isVisible }: BrowseQuizzesSectionProps) {
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [loading, setLoading] = useState(false); // Set initial loading to false
    const [hasFetched, setHasFetched] = useState(false); // Track if data has been fetched
  
    // Animation variants
    const containerVariants = {
      hidden: { 
        opacity: 0, 
        y: 100,
        height: 0,
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
  
    const itemVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: { duration: 0.3 }
      }
    };
  
    // Fetch quizzes from Firestore
    const fetchQuizzes = async () => {
      setLoading(true);
      try {
        // Query for public quizzes, ordered by creation date
        const quizzesQuery = query(
          collection(db, 'quizzes'),
          where('isPublic', '==', true),
          orderBy('completions', 'desc'),
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
        setHasFetched(true); // Mark data as fetched
      } catch (error) {
        console.error('Error fetching quizzes:', error);
      } finally {
        setLoading(false);
      }
    };
  
    // Fetch quizzes only when section becomes visible and data hasn't been fetched yet
    useEffect(() => {
      if (isVisible && !hasFetched) {
        fetchQuizzes();
      }
    }, [isVisible, hasFetched]);
  
    return (
      <motion.div
        className={`container mx-auto max-w-7xl h-full ${!isVisible ? 'pointer-events-none' : ''}`}
        variants={containerVariants}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
      >
        <motion.div 
          className="flex justify-center items-center gap-4 mb-8"
          variants={itemVariants}
        >
          <h2 className="text-2xl font-bold text-center">
            Browse Popular Quizzes
          </h2>
          {hasFetched && ( // Only show the button after the first fetch
            <Button
            onClick={fetchQuizzes} // Refetch quizzes on button click
            variant="outline"
            size="sm"
            disabled={loading} // Disable button while loading
            >Refresh</Button>
        )}
        </motion.div>
        
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