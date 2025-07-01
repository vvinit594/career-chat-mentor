import axios from 'axios';

const OPENROUTER_API_KEY = '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';
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

interface UserProfile {
  name: string;
  email: string;
  resume: string;
  skills: string[];
  experience: string;
  jobRole: string;
}

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface InterviewResults {
  overallScore: number;
  strengths: string[];
  improvements: string[];
  summary: string;
  feedback: string;
  recommendation: string;
}

export class AIService {
  private static generateSystemPrompt(userProfile: UserProfile): string {
    return `You are a professional AI interviewer conducting a structured interview for the ${userProfile.jobRole} position. 

Candidate Information:
- Name: ${userProfile.name}
- Skills: ${userProfile.skills.join(', ')}
- Experience: ${userProfile.experience}
- Resume Summary: ${userProfile.resume}

Interview Guidelines:
1. Ask relevant questions based on the job role and candidate's background
2. Keep questions professional and focused on technical skills, experience, and problem-solving
3. Ask follow-up questions to dive deeper into responses
4. Maintain a professional but friendly tone
5. Ask one question at a time
6. Keep responses concise and clear
7. After 5-7 questions, provide a brief summary and conclude the interview

Start with a professional greeting and your first question.`;
  }

  static async sendMessage(
    userProfile: UserProfile,
    conversationHistory: Array<{ type: 'user' | 'ai'; content: string }>
  ): Promise<string> {
    try {
      const messages: Message[] = [
        {
          role: 'system',
          content: this.generateSystemPrompt(userProfile)
        }
      ];

      // Add conversation history
      conversationHistory.forEach(msg => {
        messages.push({
          role: msg.type === 'user' ? 'user' : 'assistant',
          content: msg.content
        });
      });

      const response = await axios.post(
        `${OPENROUTER_BASE_URL}/chat/completions`,
        {
          model: 'deepseek/deepseek-chat',
          messages,
          temperature: 0.7,
          max_tokens: 500,
        },
        {
          headers: {
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': window.location.origin,
            'X-Title': 'AI Interview System'
          }
        }
      );

      return response.data.choices[0]?.message?.content || 'I apologize, but I encountered an issue. Could you please try again?';
    } catch (error) {
      console.error('AI Service Error:', error);
      throw new Error('Failed to get AI response. Please try again.');
    }
  }

  static async startInterview(userProfile: UserProfile): Promise<string> {
    return this.sendMessage(userProfile, []);
  }

  static async generateInterviewResults(
    userProfile: UserProfile,
    conversationHistory: Array<{ type: 'user' | 'ai'; content: string }>
  ): Promise<InterviewResults> {
    try {
      const systemPrompt = `You are an expert interview evaluator. Based on the following interview conversation for a ${userProfile.jobRole} position, provide a comprehensive assessment.

Candidate Information:
- Name: ${userProfile.name}
- Skills: ${userProfile.skills.join(', ')}
- Experience: ${userProfile.experience}

Please analyze the conversation and provide:
1. An overall score (0-100)
2. 3-4 key strengths
3. 3-4 areas for improvement
4. A brief interview summary
5. Detailed personalized feedback
6. A recommendation (Highly Recommended/Recommended/Needs Improvement)

Format your response as JSON with the following structure:
{
  "overallScore": number,
  "strengths": ["strength1", "strength2", ...],
  "improvements": ["improvement1", "improvement2", ...],
  "summary": "brief summary",
  "feedback": "detailed feedback",
  "recommendation": "recommendation"
}`;

      const messages: Message[] = [
        {
          role: 'system',
          content: systemPrompt
        }
      ];

      // Add conversation history
      conversationHistory.forEach(msg => {
        messages.push({
          role: msg.type === 'user' ? 'user' : 'assistant',
          content: msg.content
        });
      });

      const response = await axios.post(
        `${OPENROUTER_BASE_URL}/chat/completions`,
        {
          model: 'deepseek/deepseek-chat',
          messages,
          temperature: 0.3,
          max_tokens: 1000,
        },
        {
          headers: {
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': window.location.origin,
            'X-Title': 'AI Interview System'
          }
        }
      );

      const resultText = response.data.choices[0]?.message?.content || '';
      
      try {
        const results = JSON.parse(resultText);
        return {
          overallScore: results.overallScore || 70,
          strengths: results.strengths || ['Good communication skills'],
          improvements: results.improvements || ['Could provide more specific examples'],
          summary: results.summary || 'The candidate showed good potential for the role.',
          feedback: results.feedback || 'Overall positive interview performance.',
          recommendation: results.recommendation || 'Recommended'
        };
      } catch (parseError) {
        // Fallback if JSON parsing fails
        return {
          overallScore: 75,
          strengths: [
            'Demonstrated good communication skills',
            'Showed enthusiasm for the role',
            'Relevant technical background'
          ],
          improvements: [
            'Could provide more specific examples',
            'Consider expanding on technical details',
            'Practice behavioral questions'
          ],
          summary: 'The candidate demonstrated good potential and understanding of the role requirements.',
          feedback: 'Overall, this was a positive interview. The candidate showed good communication skills and relevant experience. With some additional preparation on specific examples and technical details, they would be even stronger.',
          recommendation: 'Recommended'
        };
      }
    } catch (error) {
      console.error('Failed to generate interview results:', error);
      throw new Error('Failed to generate interview results');
    }
  }
}
