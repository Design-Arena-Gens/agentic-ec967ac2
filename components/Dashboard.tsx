import { Candidate } from '@/app/page';
import { Users, Clock, CheckCircle, TrendingUp, Calendar } from 'lucide-react';
import { format, parseISO, differenceInDays } from 'date-fns';

interface DashboardProps {
  candidates: Candidate[];
}

export default function Dashboard({ candidates }: DashboardProps) {
  const stats = {
    total: candidates.length,
    new: candidates.filter(c => c.status === 'new').length,
    screening: candidates.filter(c => c.status === 'screening').length,
    interview: candidates.filter(c => c.status === 'interview').length,
    offer: candidates.filter(c => c.status === 'offer').length,
    hired: candidates.filter(c => c.status === 'hired').length,
  };

  const recentCandidates = [...candidates]
    .sort((a, b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime())
    .slice(0, 5);

  const needsAttention = candidates.filter(c => {
    if (!c.lastContact) return c.status !== 'hired' && c.status !== 'rejected';
    const daysSinceContact = differenceInDays(new Date(), parseISO(c.lastContact));
    return daysSinceContact > 3 && c.status !== 'hired' && c.status !== 'rejected';
  });

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Candidates</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">New Applications</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.new}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Interview</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.interview}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Hired</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.hired}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Pipeline Overview */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Pipeline Overview</h3>
        <div className="space-y-4">
          <div className="flex items-center">
            <div className="w-32 text-sm font-medium text-gray-700">Screening</div>
            <div className="flex-1 bg-gray-200 rounded-full h-4 mr-4">
              <div
                className="bg-blue-500 h-4 rounded-full transition-all"
                style={{ width: `${stats.total > 0 ? (stats.screening / stats.total) * 100 : 0}%` }}
              ></div>
            </div>
            <div className="w-12 text-sm font-semibold text-gray-900">{stats.screening}</div>
          </div>

          <div className="flex items-center">
            <div className="w-32 text-sm font-medium text-gray-700">Interview</div>
            <div className="flex-1 bg-gray-200 rounded-full h-4 mr-4">
              <div
                className="bg-purple-500 h-4 rounded-full transition-all"
                style={{ width: `${stats.total > 0 ? (stats.interview / stats.total) * 100 : 0}%` }}
              ></div>
            </div>
            <div className="w-12 text-sm font-semibold text-gray-900">{stats.interview}</div>
          </div>

          <div className="flex items-center">
            <div className="w-32 text-sm font-medium text-gray-700">Offer</div>
            <div className="flex-1 bg-gray-200 rounded-full h-4 mr-4">
              <div
                className="bg-yellow-500 h-4 rounded-full transition-all"
                style={{ width: `${stats.total > 0 ? (stats.offer / stats.total) * 100 : 0}%` }}
              ></div>
            </div>
            <div className="w-12 text-sm font-semibold text-gray-900">{stats.offer}</div>
          </div>

          <div className="flex items-center">
            <div className="w-32 text-sm font-medium text-gray-700">Hired</div>
            <div className="flex-1 bg-gray-200 rounded-full h-4 mr-4">
              <div
                className="bg-green-500 h-4 rounded-full transition-all"
                style={{ width: `${stats.total > 0 ? (stats.hired / stats.total) * 100 : 0}%` }}
              ></div>
            </div>
            <div className="w-12 text-sm font-semibold text-gray-900">{stats.hired}</div>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Candidates */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-blue-600" />
            Recent Applications
          </h3>
          <div className="space-y-4">
            {recentCandidates.length === 0 ? (
              <p className="text-sm text-gray-500">No recent candidates</p>
            ) : (
              recentCandidates.map(candidate => (
                <div key={candidate.id} className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{candidate.name}</p>
                    <p className="text-xs text-gray-500">{candidate.position}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      candidate.status === 'new' ? 'bg-blue-100 text-blue-800' :
                      candidate.status === 'screening' ? 'bg-yellow-100 text-yellow-800' :
                      candidate.status === 'interview' ? 'bg-purple-100 text-purple-800' :
                      candidate.status === 'offer' ? 'bg-orange-100 text-orange-800' :
                      candidate.status === 'hired' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {candidate.status}
                    </span>
                    <span className="text-xs text-gray-400">
                      {format(parseISO(candidate.appliedDate), 'MMM d')}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Needs Attention */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Clock className="h-5 w-5 mr-2 text-orange-600" />
            Needs Attention
          </h3>
          <div className="space-y-4">
            {needsAttention.length === 0 ? (
              <p className="text-sm text-gray-500">All caught up! No candidates need attention.</p>
            ) : (
              needsAttention.slice(0, 5).map(candidate => {
                const daysSinceContact = candidate.lastContact
                  ? differenceInDays(new Date(), parseISO(candidate.lastContact))
                  : differenceInDays(new Date(), parseISO(candidate.appliedDate));

                return (
                  <div key={candidate.id} className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{candidate.name}</p>
                      <p className="text-xs text-gray-500">{candidate.position}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-orange-600 font-medium">
                        {daysSinceContact}d ago
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
