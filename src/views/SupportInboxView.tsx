import React, { useState } from 'react';
import { 
  Inbox, 
  Search, 
  Filter, 
  Sparkles, 
  ChevronRight, 
  Clock, 
  Tag, 
  AlertTriangle,
  Cpu
} from 'lucide-react';
import { SupportEmail } from '../types';
import { Badge } from '../components/Badge';

interface SupportInboxViewProps {
  emails: SupportEmail[];
  onSelectEmail: (emailId: string) => void;
  onAnalyzeEmail: (emailId: string) => void;
}

export const SupportInboxView: React.FC<SupportInboxViewProps> = ({
  emails,
  onSelectEmail,
  onAnalyzeEmail
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredEmails = emails.filter((email) => {
    if (priorityFilter !== 'ALL' && email.priority !== priorityFilter) return false;
    if (statusFilter !== 'ALL' && email.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        email.sender.toLowerCase().includes(q) ||
        email.subject.toLowerCase().includes(q) ||
        email.body.toLowerCase().includes(q) ||
        email.id.toLowerCase().includes(q) ||
        email.linkedIncidentId.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div id="support-inbox-view" className="p-8 flex-1 bg-slate-50/50 min-h-full space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h3 className="text-2xl font-bold tracking-tight text-slate-900">Support Inbox</h3>
          <p className="text-sm text-slate-500">
            Ingested customer communications converted to structured engineering incidents
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-slate-600 bg-white border border-gray-200 px-3 py-1.5 rounded">
          <span>Total Received: <strong>{emails.length}</strong></span>
          <span>•</span>
          <span className="text-blue-600 font-bold">{emails.filter(e => e.status === 'New').length} unread</span>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white border border-gray-200 rounded p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search email sender, subject, keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded bg-slate-50 focus:bg-white focus:outline-none focus:border-slate-400 text-slate-900"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          {/* Priority filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="text-xs border border-gray-200 rounded px-2.5 py-1.5 bg-white text-slate-700 focus:outline-none"
          >
            <option value="ALL">All Priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs border border-gray-200 rounded px-2.5 py-1.5 bg-white text-slate-700 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="New">Unread</option>
            <option value="Investigating">Investigating</option>
            <option value="Resolved">Resolved</option>
            <option value="Escalated">Escalated</option>
          </select>
        </div>
      </div>

      {/* Email Ingestion List */}
      <div className="bg-white border border-gray-200 rounded overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Ingested Emails ({filteredEmails.length})
          </span>
          <span className="text-[10px] text-slate-400 font-mono">
            Autonomous ingestion pipeline active
          </span>
        </div>

        <div className="divide-y divide-gray-50">
          {filteredEmails.map((email) => (
            <div
              key={email.id}
              onClick={() => onSelectEmail(email.id)}
              className={`p-4.5 hover:bg-slate-50 cursor-pointer transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                email.status === 'New' ? 'bg-blue-50/20' : ''
              }`}
            >
              {/* Left sender and subject details */}
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center space-x-2.5">
                  <span className="font-mono text-xs font-bold text-blue-600">
                    {email.id}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs font-bold text-slate-900">
                    {email.sender}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    ({email.senderEmail})
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-[11px] text-slate-500">
                    {email.department}
                  </span>
                </div>

                <div className="text-sm font-semibold text-slate-900 truncate">
                  {email.subject}
                </div>

                <div className="text-xs text-slate-500 line-clamp-1">
                  {email.body}
                </div>

                {/* Tags and structured link */}
                <div className="flex items-center space-x-2 pt-1">
                  <span className="text-[10px] font-mono text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded border border-gray-200">
                    Linked: <strong className="text-blue-600">{email.linkedIncidentId}</strong>
                  </span>
                  {email.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right metadata, priority, status and CTA */}
              <div className="flex items-center space-x-3 shrink-0 self-end md:self-center">
                <Badge type="priority" value={email.priority} />
                <Badge type="email_status" value={email.status} />

                <span className="text-xs text-slate-400 font-mono whitespace-nowrap">
                  {email.receivedAt}
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAnalyzeEmail(email.id);
                  }}
                  className="px-3 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors flex items-center space-x-1 cursor-pointer"
                >
                  <Cpu className="w-3.5 h-3.5" />
                  <span>Analyze</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
