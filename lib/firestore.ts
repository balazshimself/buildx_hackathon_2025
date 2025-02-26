import { 
    collection, 
    doc, 
    getDoc, 
    getDocs, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    query, 
    where, 
    orderBy, 
    serverTimestamp,
    DocumentData,
    QueryDocumentSnapshot
  } from 'firebase/firestore';
  import { db } from './firebase';
  import { Question } from './schemas';
  
  // User types
  export interface User {
    id: string;
    email: string;
    name: string;
    createdAt: Date;
    lastLogin: Date;
  }
  
  // Quiz types
  export interface Quiz {
    id: string;
    title: string;
    userId: string;
    creatorName?: string;
    createdAt: Date;
    updatedAt: Date;
    mainTopic: string;
    subTopics: string[];
    questions: Question[];
    completions: number;
    likes: number;
    dislikes: number;
    isPublic: boolean;
  }
  
  // Convert Firestore timestamps to Date objects
  const convertTimestamps = (doc: QueryDocumentSnapshot<DocumentData>) => {
    const data = doc.data();
    
    // Convert timestamp fields to Date objects
    Object.keys(data).forEach(key => {
      if (data[key]?.toDate) {
        data[key] = data[key].toDate();
      }
    });
    
    return {
      id: doc.id,
      ...data
    };
  };
  
  // User Operations
  export const getUserData = async (userId: string): Promise<User | null> => {
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        console.log('User not found:', userId);
        return null;
      }
      
      return convertTimestamps(userSnap) as User;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  };
  
  // Quiz Operations
  export const createQuiz = async (quiz: Omit<Quiz, 'id' | 'createdAt' | 'updatedAt' | 'completions' | 'likes' | 'dislikes'>): Promise<string> => {
    try {
      const quizData = {
        ...quiz,
        completions: 0,
        likes: 0,
        dislikes: 0,
        isPublic: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      const docRef = await addDoc(collection(db, 'quizzes'), quizData);
      console.log('Quiz created with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error creating quiz:', error);
      throw error;
    }
  };
  
  export const getQuiz = async (quizId: string): Promise<Quiz | null> => {
    try {
      const quizRef = doc(db, 'quizzes', quizId);
      const quizSnap = await getDoc(quizRef);
      
      if (!quizSnap.exists()) {
        console.log('Quiz not found:', quizId);
        return null;
      }
      
      return convertTimestamps(quizSnap) as Quiz;
    } catch (error) {
      console.error('Error fetching quiz:', error);
      throw error;
    }
  };
  
  export const getUserQuizzes = async (userId: string): Promise<Quiz[]> => {
    try {
      const quizzesQuery = query(
        collection(db, 'quizzes'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(quizzesQuery);
      const quizzes: Quiz[] = [];
      
      querySnapshot.forEach((doc) => {
        quizzes.push(convertTimestamps(doc) as Quiz);
      });
      
      return quizzes;
    } catch (error) {
      console.error('Error fetching user quizzes:', error);
      throw error;
    }
  };
  
  export const updateQuiz = async (quizId: string, updates: Partial<Omit<Quiz, 'id' | 'createdAt' | 'updatedAt'>>): Promise<void> => {
    try {
      const quizRef = doc(db, 'quizzes', quizId);
      
      await updateDoc(quizRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      
      console.log('Quiz updated:', quizId);
    } catch (error) {
      console.error('Error updating quiz:', error);
      throw error;
    }
  };
  
  export const deleteQuiz = async (quizId: string): Promise<void> => {
    try {
      const quizRef = doc(db, 'quizzes', quizId);
      await deleteDoc(quizRef);
      console.log('Quiz deleted:', quizId);
    } catch (error) {
      console.error('Error deleting quiz:', error);
      throw error;
    }
  };
  
  export const shareQuiz = async (quizId: string): Promise<void> => {
    try {
      const quizRef = doc(db, 'quizzes', quizId);
      await updateDoc(quizRef, {
        isPublic: true,
        updatedAt: serverTimestamp()
      });
      console.log('Quiz shared:', quizId);
    } catch (error) {
      console.error('Error sharing quiz:', error);
      throw error;
    }
  };
  
  export const incrementQuizCompletion = async (quizId: string): Promise<void> => {
    try {
      const quizRef = doc(db, 'quizzes', quizId);
      const quizSnap = await getDoc(quizRef);
      
      if (!quizSnap.exists()) {
        throw new Error('Quiz not found');
      }
      
      const completions = quizSnap.data().completions || 0;
      
      await updateDoc(quizRef, {
        completions: completions + 1
      });
      
      console.log('Quiz completion incremented:', quizId);
    } catch (error) {
      console.error('Error incrementing quiz completion:', error);
      throw error;
    }
  };
  
  export const likeQuiz = async (quizId: string): Promise<void> => {
    try {
      const quizRef = doc(db, 'quizzes', quizId);
      const quizSnap = await getDoc(quizRef);
      
      if (!quizSnap.exists()) {
        throw new Error('Quiz not found');
      }
      
      const likes = quizSnap.data().likes || 0;
      
      await updateDoc(quizRef, {
        likes: likes + 1
      });
      
      console.log('Quiz liked:', quizId);
    } catch (error) {
      console.error('Error liking quiz:', error);
      throw error;
    }
  };
  
  export const dislikeQuiz = async (quizId: string): Promise<void> => {
    try {
      const quizRef = doc(db, 'quizzes', quizId);
      const quizSnap = await getDoc(quizRef);
      
      if (!quizSnap.exists()) {
        throw new Error('Quiz not found');
      }
      
      const dislikes = quizSnap.data().dislikes || 0;
      
      await updateDoc(quizRef, {
        dislikes: dislikes + 1
      });
      
      console.log('Quiz disliked:', quizId);
    } catch (error) {
      console.error('Error disliking quiz:', error);
      throw error;
    }
  };