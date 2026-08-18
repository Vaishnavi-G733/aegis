import React, { useState } from 'react';
import { AlertTriangle, Search, ChevronRight } from 'lucide-react';
import { Incident } from '../types';
import { Badge } from '../components/Badge';

interface IncidentsViewProps {
  incidents: Incident[];
  onSelectIncident: (incidentId: string) => void;
  onAnalyzeIncident: (incidentId: string) => void;
}

export const IncidentsView: React.FC<IncidentsViewProps> = ({
  incidents,
  onSelectIncident,
  onAnalyzeIncident
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [serviceFilter, setServiceFilter] = useState<string>('ALL');

  const services = Array.from(new Set(incidents.map((i) => i.service)));

  const filtered = incidents.filter((inc) => {
    if (priorityFilter !== 'ALL' && inc.priority !== priorityFilter) return false;
    if (statusFilter !== 'ALL' && inc.status !== statusFilter) return false;
    if (serviceFilter !== 'ALL' && inc.service !== serviceFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        inc.id.toLowerCase().includes(q) ||
        inc.issueTitle.toLowerCase().includes(q) ||
        inc.service.toLowerCase().includes(q) ||
        inc.owner.toLowerCase().includes(q) ||
        inc.potentialImpact.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div id="incidents-view" className="p-8 flex-1 bg-slate-50/50 min-h-full space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h3 className="text-2xl font-bold tracking-tight text-slate-900">Incidents Directory</h3>
          <p className="text-sm text-slate-500">
            Structured enterprise support incidents ingested and investigated by Aegis
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs text-slate-500 font-mono bg-white border border-gray-200 px-3 py-1.5 rounded">
          <span>{incidents.length} total incidents</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-gray-200 rounded p-3 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search incident ID, issue, owner, impact..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded bg-slate-50 focus:bg-white focus:outline-none focus:border-slate-400 text-slate-900"
          />
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto flex-wrap gap-y-2">
          {/* Priority */}
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

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs border border-gray-200 rounded px-2.5 py-1.5 bg-white text-slate-700 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="New">New</option>
            <option value="Investigating">Investigating</option>
            <option value="Action Required">Action Required</option>
            <option value="Resolved">Resolved</option>
            <option value="Escalated">Escalated</option>
          </select>

          {/* Service */}
          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="text-xs border border-gray-200 rounded px-2.5 py-1.5 bg-white text-slate-700 focus:outline-none"
          >
            <option value="ALL">All Services</option>
            {services.map((svc) => (
              <option key={svc} value={svc}>
                {svc}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Incidents Table */}
      <div className="bg-white border border-gray-200 rounded overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-800">
            <thead className="bg-slate-50 border-b border-gray-100 text-slate-400 uppercase text-[10px] select-none">
              <tr>
                <th className="py-3 px-4 font-semibold w-28">Incident</th>
                <th className="py-3 px-4 font-semibold">Issue Description</th>
                <th className="py-3 px-4 font-semibold w-32">Service</th>
                <th className="py-3 px-4 font-semibold w-24">Priority</th>
                <th className="py-3 px-4 font-semibold w-28">Status</th>
                <th className="py-3 px-4 font-semibold w-36">Owner</th>
                <th className="py-3 px-4 font-semibold w-44">Potential Impact</th>
                <th className="py-3 px-4 font-semibold text-right w-24">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((inc) => (
                <tr
                  key={inc.id}
                  onClick={() => onSelectIncident(inc.id)}
                  className="hover:bg-slate-50 cursor-pointer transition-colors group"
                >
                  <td className="py-3 px-4 font-mono font-bold text-blue-600">
                    {inc.id}
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-900 max-w-xs truncate">
                    {inc.issueTitle}
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                    {inc.service}
                  </td>
                  <td className="py-3 px-4">
                    <Badge type="priority" value={inc.priority} />
                  </td>
                  <td className="py-3 px-4">
                    <Badge type="status" value={inc.status} />
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {inc.owner}
                  </td>
                  <td className="py-3 px-4 text-slate-500 text-[11px] truncate max-w-[180px]">
                    {inc.potentialImpact}
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    {inc.status === 'New' ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAnalyzeIncident(inc.id);
                        }}
                        className="px-2.5 py-1 text-[11px] font-bold bg-slate-900 text-white rounded hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        Analyze
                      </button>
                    ) : (
                      <span className="text-[11px] font-medium text-slate-400 group-hover:text-blue-600 flex items-center justify-end">
                        View <ChevronRight className="w-3 h-3 ml-0.5" />
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
