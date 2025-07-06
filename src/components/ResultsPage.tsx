
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Target, 
  TrendingUp, 
  MessageSquare, 
  Star, 
  RotateCcw, 
  Download,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useInterview } from '@/contexts/InterviewContext';

export const ResultsPage = () => {
  const { 
    userProfile, 
    interviewResults, 
    setCurrentStep, 
    setUserProfile,
    setIsInterviewStarted 
  } = useInterview();

  const handleStartOver = () => {
    setCurrentStep('onboarding');
    setUserProfile(null);
    setIsInterviewStarted(false);
  };

  const handleTryDifferentRole = () => {
    setCurrentStep('onboarding');
    setIsInterviewStarted(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return CheckCircle;
    if (score >= 60) return AlertCircle;
    return AlertCircle;
  };

  if (!interviewResults || !userProfile) {
    return null;
  }

  const ScoreIcon = getScoreIcon(interviewResults.overallScore);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-700 to-indigo-800 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Interview Complete!</h1>
          <p className="text-purple-200">
            Thank you, {userProfile.name}. Here's your performance summary for the {userProfile.jobRole} position.
          </p>
        </motion.div>

        {/* Overall Score */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-8"
        >
          <Card className="text-center shadow-2xl bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="pt-8 pb-6">
              <div className="flex items-center justify-center mb-4">
                <ScoreIcon className={`w-16 h-16 ${getScoreColor(interviewResults.overallScore)}`} />
              </div>
              <h2 className="text-4xl font-bold mb-2">
                <span className={getScoreColor(interviewResults.overallScore)}>
                  {interviewResults.overallScore}%
                </span>
              </h2>
              <p className="text-xl text-white">Overall Interview Score</p>
              <p className="text-sm text-purple-200 mt-2">{interviewResults.recommendation}</p>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Strengths */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Card className="h-full shadow-xl bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center text-green-400">
                  <Star className="w-5 h-5 mr-2" />
                  Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {interviewResults.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-purple-100">{strength}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          {/* Areas for Improvement */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Card className="h-full shadow-xl bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center text-orange-400">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Areas for Improvement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {interviewResults.improvements.map((improvement, index) => (
                    <li key={index} className="flex items-start">
                      <Target className="w-4 h-4 text-orange-400 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-purple-100">{improvement}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Detailed Feedback */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mb-8"
        >
          <Card className="shadow-xl bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-400">
                <MessageSquare className="w-5 h-5 mr-2" />
                Detailed Feedback
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-white mb-2">Interview Summary</h4>
                  <p className="text-purple-100 text-sm leading-relaxed">{interviewResults.summary}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Personalized Feedback</h4>
                  <p className="text-purple-100 text-sm leading-relaxed">{interviewResults.feedback}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            onClick={handleTryDifferentRole}
            variant="outline"
            className="flex items-center bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Try Different Role
          </Button>
          <Button
            onClick={handleStartOver}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white flex items-center shadow-lg"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Start New Interview
          </Button>
          <Button
            variant="secondary"
            className="flex items-center bg-white/20 text-white hover:bg-white/30"
            onClick={() => window.print()}
          >
            <Download className="w-4 h-4 mr-2" />
            Download Results
          </Button>
        </motion.div>
      </div>
    </div>
  );
};
