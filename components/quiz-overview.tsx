import { Check, X, ChevronDown, ChevronUp, School } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Question } from '@/lib/schemas'
import { Button } from './ui/button'
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface QuizReviewProps {
  questions: Question[]
  userAnswers: string[]
  mainTopic?: string
  subTopics?: string[]
}

export default function QuizReview({ questions, userAnswers, mainTopic = "Quiz", subTopics = [] }: QuizReviewProps) {
  const answerLabels: ("A" | "B" | "C" | "D" | "E")[] = ["A", "B", "C", "D", "E"]
  
  // Track which subtopics are expanded
  const [expandedSubtopics, setExpandedSubtopics] = useState<Record<number, boolean>>({})
  
  // Track which questions have the School button clicked
  const [explanationShown, setExplanationShown] = useState<Record<string, boolean>>({})
  
  // Group questions by subtopic
  const questionsBySubtopic = useMemo(() => {
    const grouped: Record<number, Question[]> = {}
    
    questions.forEach(question => {
      const subtopicIndex = question.subtopic || 0
      if (!grouped[subtopicIndex]) {
        grouped[subtopicIndex] = []
      }
      grouped[subtopicIndex].push(question)
    })
    
    return grouped
  }, [questions])
  
  // Calculate correct answers per subtopic
  const subtopicStats = useMemo(() => {
    const stats: Record<number, { correct: number, total: number }> = {}
    
    questions.forEach((question, index) => {
      const subtopicIndex = question.subtopic || 0
      
      if (!stats[subtopicIndex]) {
        stats[subtopicIndex] = { correct: 0, total: 0 }
      }
      
      stats[subtopicIndex].total += 1
      
      if (userAnswers[index] === question.answer) {
        stats[subtopicIndex].correct += 1
      }
    })
    
    return stats
  }, [questions, userAnswers])
  
  // Toggle subtopic expansion
  const toggleSubtopic = (subtopicIndex: number) => {
    setExpandedSubtopics(prev => ({
      ...prev,
      [subtopicIndex]: !prev[subtopicIndex]
    }))
  }
  
  // Get subtopic name (fall back to "Subtopic X" if not provided)
  const getSubtopicName = (index: number) => {
    if (subTopics && subTopics[index-1]) {
      return subTopics[index-1]
    }
    return `Subtopic ${index + 1}`
  }

  // Toggle explanation and animate answers
  const toggleExplanation = (subtopicIndex: number, questionIndex: number) => {
    const key = `${subtopicIndex}-${questionIndex}`
    setExplanationShown(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  // Check if explanation is shown for a specific question
  const isExplanationShown = (subtopicIndex: number, questionIndex: number) => {
    const key = `${subtopicIndex}-${questionIndex}`
    return !!explanationShown[key]
  }

  return (
    <div className="w-full">
        {Object.entries(questionsBySubtopic).map(([subtopicIndexStr, subtopicQuestions]) => {
          const subtopicIndex = parseInt(subtopicIndexStr)
          const stats = subtopicStats[subtopicIndex]
          const isExpanded = expandedSubtopics[subtopicIndex]
          
          return (
            <Card key={subtopicIndex} className="mb-6 last:mb-0">
              <CardHeader 
                className="flex flex-row items-center justify-between cursor-pointer"
                onClick={() => toggleSubtopic(subtopicIndex)}
              >
                <CardTitle className="text-xl font-bold">
                  {getSubtopicName(subtopicIndex)}
                </CardTitle>
                <div className="flex items-center">
                  <span className="mr-2 font-medium">
                    {stats.correct}/{stats.total} correct
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </div>
              </CardHeader>
              
              <AnimatePresence mode="wait">
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <CardContent className="pt-2">
                      {subtopicQuestions.map((question, questionIndex) => {
                        // Find the original index in the full questions array to get correct userAnswer
                        const originalIndex = questions.findIndex(q => 
                          q.question === question.question && q.subtopic === question.subtopic
                        )
                        
                        const showingExplanation = isExplanationShown(subtopicIndex, questionIndex)
                        
                        return (
                          <Card key={questionIndex} className="mb-6 p-1 last:mb-0 bg-gray">
                            <CardHeader className="flex flex-row items-start justify-between gap-4">
                              <CardTitle className="text-lg font-bold">{question.question}</CardTitle>
                              <div className="relative">
                                <Button 
                                  className={`rounded-full shrink-0 transition-all duration-300 ${showingExplanation ? 'bg-blue-500 hover:bg-blue-600 text-white' : ''}`}
                                  onClick={() => toggleExplanation(subtopicIndex, questionIndex)}
                                >
                                  <School className="h-5 w-5" /> 
                                </Button>
                                
                                {/* Speech bubble explanation */}
                                <AnimatePresence>
                                  {showingExplanation && question.explanation && (
                                    <motion.div 
                                      initial={{ opacity: 0, scale: 0.8, x: -20, y: -20 }}
                                      animate={{ opacity: 1, scale: 1, x: 0 }}
                                      exit={{ opacity: 0, scale: 0.8, x: -20, y: -20 }}
                                      transition={{ duration: 0.3 }}
                                      className="absolute z-10 left-full ml-2 top-0 w-64 p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg shadow-lg"
                                    >
                                      <h4 className="font-bold mb-2">Explanation:</h4>
                                      <p className="text-sm">{question.explanation}</p>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-2 min-h-32 relative">
                              {/* Answers section */}
                              <div className="space-y-2">
                                {question.options.map((option, optionIndex) => {
                                  const currentLabel = answerLabels[optionIndex]
                                  const isCorrect = currentLabel === question.answer
                                  const isSelected = currentLabel === userAnswers[originalIndex]
                                  const isIncorrectSelection = isSelected && !isCorrect
                                  
                                  // When explanation is shown, determine if we should highlight this answer
                                  const isRelevantAnswer = isCorrect || isSelected
                                  
                                  return (
                                    <motion.div
                                      key={optionIndex}
                                      animate={{ 
                                        opacity: showingExplanation && !isRelevantAnswer ? 0.1 : 1,
                                      }}
                                      transition={{ duration: 0.4 }}
                                      className={`
                                        flex items-center p-4 rounded-lg mb-2
                                        ${
                                          isCorrect
                                            ? 'bg-green-100 dark:bg-green-700/50'
                                            : isIncorrectSelection
                                            ? 'bg-red-100 dark:bg-red-700/50'
                                            : 'border border-border'
                                        }
                                      `}
                                    >
                                      <span className="text-lg font-medium mr-4 w-6">
                                        {currentLabel}
                                      </span>
                                      <span className="flex-grow">
                                        {option}
                                      </span>
                                      {isCorrect && (
                                        <Check className="ml-2 text-green-600 dark:text-green-400" size={20} />
                                      )}
                                      {isIncorrectSelection && (
                                        <X className="ml-2 text-red-600 dark:text-red-400" size={20} />
                                      )}
                                    </motion.div>
                                  )
                                })}
                              </div>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          )
        })}
    </div>
  )
}