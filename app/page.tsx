'use client';

import { useState, useEffect } from 'react';
import CandidateList from '@/components/CandidateList';
import CandidateForm from '@/components/CandidateForm';
import AgentChat from '@/components/AgentChat';
import Dashboard from '@/components/Dashboard';
import { Users, MessageSquare, BarChart3, Sparkles } from 'lucide-react';

export type Candidate = {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  status: 'new' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected';
  experience: string;
  skills: string[];
  notes: string;
  resumeUrl?: string;
  appliedDate: string;
  lastContact?: string;
};

export default function Home() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'candidates' | 'chat'>('dashboard');
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('vertexhire_candidates');
    if (stored) {
      setCandidates(JSON.parse(stored));
    } else {
      const sampleCandidates: Candidate[] = [
        {
          id: '1',
          name: 'Sarah Johnson',
          email: 'sarah.j@email.com',
          phone: '+1-555-0123',
          position: 'Senior Software Engineer',
          status: 'interview',
          experience: '7 years',
          skills: ['React', 'Node.js', 'TypeScript', 'AWS'],
          notes: 'Strong technical background, excellent communication skills',
          appliedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          lastContact: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '2',
          name: 'Michael Chen',
          email: 'mchen@email.com',
          phone: '+1-555-0124',
          position: 'Product Manager',
          status: 'screening',
          experience: '5 years',
          skills: ['Agile', 'Product Strategy', 'Data Analysis', 'Jira'],
          notes: 'Previous experience at Fortune 500 companies',
          appliedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          lastContact: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '3',
          name: 'Emily Rodriguez',
          email: 'emily.r@email.com',
          phone: '+1-555-0125',
          position: 'UX Designer',
          status: 'new',
          experience: '3 years',
          skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems'],
          notes: 'Impressive portfolio, needs technical assessment',
          appliedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ];
      setCandidates(sampleCandidates);
      localStorage.setItem('vertexhire_candidates', JSON.stringify(sampleCandidates));
    }
  }, []);

  const saveCandidates = (newCandidates: Candidate[]) => {
    setCandidates(newCandidates);
    localStorage.setItem('vertexhire_candidates', JSON.stringify(newCandidates));
  };

  const handleAddCandidate = (candidate: Omit<Candidate, 'id' | 'appliedDate'>) => {
    const newCandidate: Candidate = {
      ...candidate,
      id: Date.now().toString(),
      appliedDate: new Date().toISOString(),
    };
    saveCandidates([...candidates, newCandidate]);
    setIsFormOpen(false);
  };

  const handleUpdateCandidate = (id: string, updates: Partial<Candidate>) => {
    const updated = candidates.map(c =>
      c.id === id ? { ...c, ...updates, lastContact: new Date().toISOString() } : c
    );
    saveCandidates(updated);
    setEditingCandidate(null);
    setIsFormOpen(false);
  };

  const handleDeleteCandidate = (id: string) => {
    saveCandidates(candidates.filter(c => c.id !== id));
  };

  const handleEditClick = (candidate: Candidate) => {
    setEditingCandidate(candidate);
    setIsFormOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">VertexHire</h1>
                <p className="text-sm text-gray-500">AI-Powered Consultancy Agent</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                Agent Active
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'dashboard'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <BarChart3 className="h-5 w-5" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => setActiveTab('candidates')}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'candidates'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Users className="h-5 w-5" />
              <span>Candidates</span>
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'chat'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <MessageSquare className="h-5 w-5" />
              <span>AI Assistant</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && <Dashboard candidates={candidates} />}

        {activeTab === 'candidates' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Candidate Management</h2>
              <button
                onClick={() => {
                  setEditingCandidate(null);
                  setIsFormOpen(true);
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Add Candidate
              </button>
            </div>
            <CandidateList
              candidates={candidates}
              onUpdateStatus={handleUpdateCandidate}
              onDelete={handleDeleteCandidate}
              onEdit={handleEditClick}
            />
          </div>
        )}

        {activeTab === 'chat' && (
          <AgentChat
            candidates={candidates}
            onUpdateCandidate={handleUpdateCandidate}
          />
        )}
      </main>

      {/* Candidate Form Modal */}
      {isFormOpen && (
        <CandidateForm
          candidate={editingCandidate}
          onSubmit={editingCandidate
            ? (data) => handleUpdateCandidate(editingCandidate.id, data)
            : handleAddCandidate
          }
          onClose={() => {
            setIsFormOpen(false);
            setEditingCandidate(null);
          }}
        />
      )}
    </div>
  );
}
