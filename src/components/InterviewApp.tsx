
import React from 'react';
import { InterviewProvider, useInterview } from '@/contexts/InterviewContext';
import { OnboardingForm } from './OnboardingForm';
import { ChatInterface } from './ChatInterface';
import { ResultsPage } from './ResultsPage';

const InterviewContent = () => {
  const { currentStep } = useInterview();

  switch (currentStep) {
    case 'onboarding':
      return <OnboardingForm />;
    case 'interview':
      return <ChatInterface />;
    case 'completed':
      return <ResultsPage />;
    default:
      return <OnboardingForm />;
  }
};

export const InterviewApp = () => {
  return (
    <InterviewProvider>
      <InterviewContent />
    </InterviewProvider>
  );
};
