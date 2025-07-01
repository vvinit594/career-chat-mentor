import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Bot, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useInterview } from '@/contexts/InterviewContext';
import { AIService } from '@/services/aiService';

export const ChatInterface = () => {
  const {
    userProfile,
    messages,
    addMessage,
    isTyping,
    setIsTyping,
    isInterviewStarted,
    setIsInterviewStarted,
    setCurrentStep,
    setInterviewResults
  } = useInterview();

  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (!isInterviewStarted && userProfile) {
      startInterview();
    }
  }, [userProfile, isInterviewStarted]);

  const startInterview = async () => {
    if (!userProfile) return;

    setIsTyping(true);
    try {
      const welcomeMessage = await AIService.startInterview(userProfile);
      addMessage({
        type: 'ai',
        content: welcomeMessage
      });
      setIsInterviewStarted(true);
    } catch (error) {
      console.error('Failed to start interview:', error);
      addMessage({
        type: 'ai',
        content: 'I apologize for the technical difficulty. Let\'s begin with a simple question: Can you tell me about yourself and what interests you about this role?'
      });
    } finally {
      setIsTyping(false);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !userProfile) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    
    addMessage({
      type: 'user',
      content: userMessage
    });

    setIsTyping(true);

    try {
      const conversationHistory = [...messages, { type: 'user' as const, content: userMessage }];
      const aiResponse = await AIService.sendMessage(userProfile, conversationHistory);
      
      addMessage({
        type: 'ai',
        content: aiResponse
      });
    } catch (error) {
      console.error('Failed to send message:', error);
      addMessage({
        type: 'ai',
        content: 'I apologize, but I encountered a technical issue. Could you please repeat your response?'
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const endInterview = async () => {
    if (!userProfile || messages.length < 2) return;

    setIsTyping(true);
    try {
      const conversationHistory = messages.map(msg => ({
        type: msg.type,
        content: msg.content
      }));

      const results = await AIService.generateInterviewResults(userProfile, conversationHistory);
      setInterviewResults(results);
      setCurrentStep('completed');
    } catch (error) {
      console.error('Failed to end interview:', error);
      // Fallback results
      setInterviewResults({
        overallScore: 75,
        strengths: ['Good communication', 'Relevant experience', 'Professional attitude'],
        improvements: ['More specific examples', 'Technical depth', 'Question preparation'],
        summary: 'The candidate performed well in the interview.',
        feedback: 'Overall positive performance with room for improvement.',
        recommendation: 'Recommended'
      });
      setCurrentStep('completed');
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-800">AI Interviewer</h1>
              <p className="text-sm text-gray-500">
                Interviewing for {userProfile?.jobRole}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">{userProfile?.name}</span>
            <Button
              onClick={endInterview}
              variant="outline"
              size="sm"
              disabled={isTyping || messages.length < 2}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              End Interview
            </Button>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-3 max-w-3xl ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.type === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-600 text-white'
                }`}>
                  {message.type === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <Card className={`p-4 shadow-sm ${
                  message.type === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-800'
                }`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                  <div className={`text-xs mt-2 ${
                    message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </Card>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="flex items-start space-x-3 max-w-3xl">
              <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <Card className="p-4 bg-white shadow-sm">
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                  <span className="text-sm text-gray-500">AI is thinking...</span>
                </div>
              </Card>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 px-6 py-4">
        <div className="flex items-center space-x-3">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your response..."
            disabled={isTyping}
            className="flex-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
          <Button
            onClick={sendMessage}
            disabled={!inputMessage.trim() || isTyping}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
