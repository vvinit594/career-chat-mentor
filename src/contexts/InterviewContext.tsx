
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UserProfile {
  name: string;
  email: string;
  resume: string;
  skills: string[];
  experience: string;
  jobRole: string;
}

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface InterviewContextType {
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile) => void;
  messages: Message[];
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  isInterviewStarted: boolean;
  setIsInterviewStarted: (started: boolean) => void;
  isTyping: boolean;
  setIsTyping: (typing: boolean) => void;
  currentStep: 'onboarding' | 'interview' | 'completed';
  setCurrentStep: (step: 'onboarding' | 'interview' | 'completed') => void;
}

const InterviewContext = createContext<InterviewContextType | undefined>(undefined);

export const useInterview = () => {
  const context = useContext(InterviewContext);
  if (!context) {
    throw new Error('useInterview must be used within an InterviewProvider');
  }
  return context;
};

export const InterviewProvider = ({ children }: { children: ReactNode }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [currentStep, setCurrentStep] = useState<'onboarding' | 'interview' | 'completed'>('onboarding');

  const addMessage = (message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
  };

  return (
    <InterviewContext.Provider
      value={{
        userProfile,
        setUserProfile,
        messages,
        addMessage,
        isInterviewStarted,
        setIsInterviewStarted,
        isTyping,
        setIsTyping,
        currentStep,
        setCurrentStep,
      }}
    >
      {children}
    </InterviewContext.Provider>
  );
};
