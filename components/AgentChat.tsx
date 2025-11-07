import { useState, useRef, useEffect } from 'react';
import { Candidate } from '@/app/page';
import { Send, Bot, User, Sparkles } from 'lucide-react';

interface AgentChatProps {
  candidates: Candidate[];
  onUpdateCandidate: (id: string, updates: Partial<Candidate>) => void;
}

interface Message {
  id: string;
  role: 'user' | 'agent';
  content: string;
  timestamp: Date;
}

export default function AgentChat({ candidates, onUpdateCandidate }: AgentChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'agent',
      content: "Hello! I'm your VertexHire AI assistant. I can help you with:\n\n• Candidate status updates and tracking\n• Quick insights about your pipeline\n• Finding specific candidates\n• Generating follow-up messages\n• Scheduling recommendations\n\nHow can I assist you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAgentResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    // Status queries
    if (lowerMessage.includes('status') || lowerMessage.includes('pipeline')) {
      const stats = {
        total: candidates.length,
        new: candidates.filter(c => c.status === 'new').length,
        screening: candidates.filter(c => c.status === 'screening').length,
        interview: candidates.filter(c => c.status === 'interview').length,
        offer: candidates.filter(c => c.status === 'offer').length,
        hired: candidates.filter(c => c.status === 'hired').length,
      };
      return `Here's your current pipeline status:\n\n• Total Candidates: ${stats.total}\n• New Applications: ${stats.new}\n• In Screening: ${stats.screening}\n• In Interview: ${stats.interview}\n• Offers Extended: ${stats.offer}\n• Hired: ${stats.hired}\n\nWould you like me to help with any specific candidate updates?`;
    }

    // Find candidate by name
    const nameMatch = lowerMessage.match(/(?:about|find|show|update|status of) (.+?)(?:\?|$)/);
    if (nameMatch) {
      const searchName = nameMatch[1].trim();
      const candidate = candidates.find(c =>
        c.name.toLowerCase().includes(searchName)
      );

      if (candidate) {
        return `I found ${candidate.name}:\n\n• Position: ${candidate.position}\n• Status: ${candidate.status}\n• Experience: ${candidate.experience}\n• Skills: ${candidate.skills.join(', ')}\n• Email: ${candidate.email}\n• Phone: ${candidate.phone}\n${candidate.notes ? `\nNotes: ${candidate.notes}` : ''}\n\nWould you like to update their status or send a follow-up message?`;
      }
    }

    // Update candidate status
    if (lowerMessage.includes('update') || lowerMessage.includes('move') || lowerMessage.includes('change status')) {
      return "I can help update a candidate's status. Please tell me:\n1. The candidate's name\n2. Their new status (new, screening, interview, offer, hired, or rejected)\n\nFor example: 'Update Sarah Johnson to interview status'";
    }

    // Generate follow-up messages
    if (lowerMessage.includes('follow up') || lowerMessage.includes('email') || lowerMessage.includes('message')) {
      const candidate = candidates[0]; // Use first candidate as example
      if (candidate) {
        return `Here's a suggested follow-up email template:\n\n---\nSubject: Following up on your ${candidate.position} application\n\nDear ${candidate.name.split(' ')[0]},\n\nThank you for your interest in the ${candidate.position} role. We've reviewed your application and are impressed with your background in ${candidate.skills.slice(0, 2).join(' and ')}.\n\nI'd like to schedule a brief call to discuss the opportunity in more detail. Would you be available this week for a 30-minute conversation?\n\nLooking forward to connecting!\n\nBest regards,\nVertexHire Team\n---\n\nWould you like me to customize this for a specific candidate?`;
      }
    }

    // Recommendations
    if (lowerMessage.includes('recommend') || lowerMessage.includes('suggest') || lowerMessage.includes('should i')) {
      const needsAttention = candidates.filter(c => {
        if (!c.lastContact) return c.status !== 'hired' && c.status !== 'rejected';
        const daysSinceContact = Math.floor((Date.now() - new Date(c.lastContact).getTime()) / (1000 * 60 * 60 * 24));
        return daysSinceContact > 3 && c.status !== 'hired' && c.status !== 'rejected';
      });

      if (needsAttention.length > 0) {
        return `I recommend following up with these candidates:\n\n${needsAttention.slice(0, 3).map(c =>
          `• ${c.name} (${c.position}) - ${c.status} status, no recent contact`
        ).join('\n')}\n\nWould you like me to generate follow-up messages for any of them?`;
      } else {
        return "Great job! All your active candidates have been contacted recently. Your pipeline is looking healthy!";
      }
    }

    // Search by skills
    if (lowerMessage.includes('skill') || lowerMessage.includes('experience')) {
      return "I can help you find candidates with specific skills. For example, try:\n• 'Show me candidates with React skills'\n• 'Find developers with TypeScript experience'\n• 'Who knows Python?'";
    }

    // Help
    if (lowerMessage.includes('help') || lowerMessage.includes('what can you')) {
      return "I can assist you with:\n\n📊 **Pipeline Insights**\n• 'Show me the pipeline status'\n• 'How many candidates are in interview?'\n\n👤 **Candidate Management**\n• 'Find Sarah Johnson'\n• 'Update John to interview status'\n\n✉️ **Communication**\n• 'Generate a follow-up email'\n• 'Create a rejection message'\n\n💡 **Recommendations**\n• 'Who should I contact today?'\n• 'Any candidates need attention?'\n\nWhat would you like to do?";
    }

    // Default response
    return "I'm here to help! You can ask me about:\n• Candidate pipeline status\n• Specific candidate information\n• Updating candidate statuses\n• Generating follow-up messages\n• Recommendations on who to contact\n\nTry asking something like 'Show me the pipeline status' or 'Who needs follow-up?'";
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const agentResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'agent',
        content: generateAgentResponse(input),
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, agentResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-280px)] bg-white rounded-lg shadow">
      {/* Chat Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">VertexHire AI Assistant</h3>
            <p className="text-sm text-gray-500">Your intelligent recruitment companion</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start space-x-2 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className={`flex-shrink-0 ${message.role === 'user' ? 'bg-blue-500' : 'bg-gradient-to-br from-purple-500 to-blue-500'} rounded-full p-2`}>
                {message.role === 'user' ? (
                  <User className="h-4 w-4 text-white" />
                ) : (
                  <Bot className="h-4 w-4 text-white" />
                )}
              </div>
              <div className={`rounded-lg px-4 py-2 ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <p className={`text-xs mt-1 ${message.role === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-start space-x-2">
            <div className="bg-gradient-to-br from-purple-500 to-blue-500 rounded-full p-2">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div className="bg-gray-100 rounded-lg px-4 py-2">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div className="flex space-x-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about your candidates..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
