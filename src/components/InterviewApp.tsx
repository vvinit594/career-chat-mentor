
import React from 'react';
import { InterviewProvider, useInterview } from '@/contexts/InterviewContext';
import { OnboardingForm } from './OnboardingForm';
import { ChatInterface } from './ChatInterface';

const InterviewContent = () => {
  const { currentStep } = useInterview();

  switch (currentStep) {
    case 'onboarding':
      return <OnboardingForm />;
    case 'interview':
      return <ChatInterface />;
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
