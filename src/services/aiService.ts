
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
}
