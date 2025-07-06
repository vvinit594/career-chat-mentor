
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, User, Briefcase, Code, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useInterview } from '@/contexts/InterviewContext';

const jobRoles = [
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Data Scientist',
  'DevOps Engineer',
  'Product Manager',
  'UI/UX Designer',
  'Software Engineer',
  'Mobile Developer',
  'Cloud Architect'
];

export const OnboardingForm = () => {
  const { setUserProfile, setCurrentStep } = useInterview();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    resume: '',
    skills: '',
    experience: '',
    jobRole: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const profile = {
      ...formData,
      skills: formData.skills.split(',').map(skill => skill.trim()).filter(Boolean)
    };
    
    setUserProfile(profile);
    setCurrentStep('interview');
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-700 to-indigo-800 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl"
      >
        <Card className="shadow-2xl border-0 bg-white/10 backdrop-blur-lg border border-white/20">
          <CardHeader className="text-center pb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mb-4 shadow-lg"
            >
              <Briefcase className="w-8 h-8 text-white" />
            </motion.div>
            <CardTitle className="text-2xl font-bold text-white">AI Interview System</CardTitle>
            <p className="text-purple-100 mt-2">Prepare for your next career opportunity</p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-2"
              >
                <label className="flex items-center text-sm font-medium text-white">
                  <User className="w-4 h-4 mr-2" />
                  Full Name
                </label>
                <Input
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                  className="transition-all duration-200 focus:scale-[1.02] bg-white/10 border-white/20 text-white placeholder:text-purple-200 focus:border-purple-400"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-2"
              >
                <label className="flex items-center text-sm font-medium text-white">
                  <FileText className="w-4 h-4 mr-2" />
                  Email Address
                </label>
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                  className="transition-all duration-200 focus:scale-[1.02] bg-white/10 border-white/20 text-white placeholder:text-purple-200 focus:border-purple-400"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-2"
              >
                <label className="flex items-center text-sm font-medium text-white">
                  <Briefcase className="w-4 h-4 mr-2" />
                  Job Role
                </label>
                <Select value={formData.jobRole} onValueChange={(value) => handleInputChange('jobRole', value)}>
                  <SelectTrigger className="transition-all duration-200 focus:scale-[1.02] bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Select the position you're applying for" />
                  </SelectTrigger>
                  <SelectContent className="bg-purple-900 border-purple-600">
                    {jobRoles.map(role => (
                      <SelectItem key={role} value={role} className="text-white hover:bg-purple-700">{role}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="space-y-2"
              >
                <label className="flex items-center text-sm font-medium text-white">
                  <Code className="w-4 h-4 mr-2" />
                  Skills & Technologies
                </label>
                <Input
                  placeholder="React, Node.js, Python, AWS (comma-separated)"
                  value={formData.skills}
                  onChange={(e) => handleInputChange('skills', e.target.value)}
                  required
                  className="transition-all duration-200 focus:scale-[1.02] bg-white/10 border-white/20 text-white placeholder:text-purple-200 focus:border-purple-400"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="space-y-2"
              >
                <label className="flex items-center text-sm font-medium text-white">
                  <Upload className="w-4 h-4 mr-2" />
                  Experience Summary
                </label>
                <Textarea
                  placeholder="Briefly describe your professional experience and key achievements..."
                  value={formData.experience}
                  onChange={(e) => handleInputChange('experience', e.target.value)}
                  required
                  rows={3}
                  className="transition-all duration-200 focus:scale-[1.02] resize-none bg-white/10 border-white/20 text-white placeholder:text-purple-200 focus:border-purple-400"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="space-y-2"
              >
                <label className="flex items-center text-sm font-medium text-white">
                  <FileText className="w-4 h-4 mr-2" />
                  Resume/CV Summary
                </label>
                <Textarea
                  placeholder="Paste key highlights from your resume or a brief summary of your professional background..."
                  value={formData.resume}
                  onChange={(e) => handleInputChange('resume', e.target.value)}
                  required
                  rows={4}
                  className="transition-all duration-200 focus:scale-[1.02] resize-none bg-white/10 border-white/20 text-white placeholder:text-purple-200 focus:border-purple-400"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-3 text-lg font-medium transition-all duration-200 hover:scale-[1.02] shadow-lg"
                >
                  Start AI Interview
                </Button>
              </motion.div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
