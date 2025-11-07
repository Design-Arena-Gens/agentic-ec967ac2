import { Candidate } from '@/app/page';
import { Mail, Phone, Briefcase, Calendar, Edit2, Trash2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface CandidateListProps {
  candidates: Candidate[];
  onUpdateStatus: (id: string, updates: Partial<Candidate>) => void;
  onDelete: (id: string) => void;
  onEdit: (candidate: Candidate) => void;
}

const statusOptions: Candidate['status'][] = ['new', 'screening', 'interview', 'offer', 'hired', 'rejected'];

export default function CandidateList({ candidates, onUpdateStatus, onDelete, onEdit }: CandidateListProps) {
  const getStatusColor = (status: Candidate['status']) => {
    const colors = {
      new: 'bg-blue-100 text-blue-800',
      screening: 'bg-yellow-100 text-yellow-800',
      interview: 'bg-purple-100 text-purple-800',
      offer: 'bg-orange-100 text-orange-800',
      hired: 'bg-green-100 text-green-800',
      rejected: 'bg-gray-100 text-gray-800',
    };
    return colors[status];
  };

  if (candidates.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-12 text-center">
        <div className="text-gray-400 mb-4">
          <Briefcase className="h-16 w-16 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No candidates yet</h3>
        <p className="text-gray-500">Get started by adding your first candidate</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Candidate
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Position
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Skills
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Applied
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {candidates.map((candidate) => (
              <tr key={candidate.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {candidate.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{candidate.name}</div>
                      <div className="text-sm text-gray-500 flex items-center space-x-3">
                        <span className="flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          {candidate.email}
                        </span>
                        <span className="flex items-center">
                          <Phone className="h-3 w-3 mr-1" />
                          {candidate.phone}
                        </span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{candidate.position}</div>
                  <div className="text-sm text-gray-500">{candidate.experience} experience</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={candidate.status}
                    onChange={(e) => onUpdateStatus(candidate.id, { status: e.target.value as Candidate['status'] })}
                    className={`text-xs font-semibold px-3 py-1 rounded-full border-0 cursor-pointer focus:ring-2 focus:ring-blue-500 ${getStatusColor(candidate.status)}`}
                  >
                    {statusOptions.map(status => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {candidate.skills.slice(0, 3).map((skill, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700"
                      >
                        {skill}
                      </span>
                    ))}
                    {candidate.skills.length > 3 && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                        +{candidate.skills.length - 3}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {format(parseISO(candidate.appliedDate), 'MMM d, yyyy')}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => onEdit(candidate)}
                      className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded transition-colors"
                      title="Edit candidate"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete ${candidate.name}?`)) {
                          onDelete(candidate.id);
                        }
                      }}
                      className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded transition-colors"
                      title="Delete candidate"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
