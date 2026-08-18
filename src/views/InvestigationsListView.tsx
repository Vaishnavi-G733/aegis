import React, { useState } from 'react';
import { Cpu, Search, ChevronRight } from 'lucide-react';
import { Incident } from '../types';
import { Badge } from '../components/Badge';

interface InvestigationsListViewProps {
  incidents: Incident[];
  onSelectInvestigation: (incidentId: string) => void;
}

export const InvestigationsListView: React.FC<InvestigationsListViewProps> = ({
  incidents,
  onSelectInvestigation
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [outcomeFilter, setOutcomeFilter] = useState<string>('ALL');

  const filtered = incidents.filter((inc) => {
    if (outcomeFilter !== 'ALL') {
      if (outcomeFilter === 'Resolved' && inc.status !== 'Resolved') return false;
      if (outcomeFilter === 'Escalated' && inc.status !== 'Escalated') return false;
      if (outcomeFilter === 'Active' && (inc.status === 'Resolved' || inc.status === 'Escalated')) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        inc.id.toLowerCase().includes(q) ||
        inc.issueTitle.toLowerCase().includes(q) ||
        inc.service.toLowerCase().includes(q) ||
        inc.investigation.rootCause.title.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div id="investigations-list-view" className="p-8 flex-1 bg-slate-50/50 min-h-full space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h3 className="text-2xl font-bold tracking-tight text-slate-900">Aegis Investigations</h3>
          <p className="text-sm text-slate-500">
            Operational telemetry and autonomous root-cause outcomes across enterprise incidents
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-slate-600 bg-white border border-gray-200 px-3 py-1.5 rounded">
          <span>Total runs: <strong>{incidents.length}</strong></span>
          <span>•</span>
          <span>Avg Duration: <strong>1m 48s</strong></span>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white border border-gray-200 rounded p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by root cause, service, incident ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded bg-slate-50 focus:bg-white focus:outline-none focus:border-slate-400 text-slate-900"
          />
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={outcomeFilter}
            onChange={(e) => setOutcomeFilter(e.target.value)}
            className="text-xs border border-gray-200 rounded px-2.5 py-1.5 bg-white text-slate-700 focus:outline-none"
          >
            <option value="ALL">All Outcomes</option>
            <option value="Active">Active / In-Progress</option>
            <option value="Resolved">Auto-Resolved</option>
            <option value="Escalated">Escalated</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-800">
            <thead className="bg-slate-50 border-b border-gray-100 text-slate-400 uppercase text-[10px] select-none">
              <tr>
                <th className="py-3 px-4 font-semibold w-28">Incident</th>
                <th className="py-3 px-4 font-semibold">Identified Root Cause</th>
                <th className="py-3 px-4 font-semibold w-28">Confidence</th>
                <th className="py-3 px-4 font-semibold w-32">Sources Checked</th>
                <th className="py-3 px-4 font-semibold w-40">Action</th>
                <th className="py-3 px-4 font-semibold w-28">Outcome</th>
                <th className="py-3 px-4 font-semibold w-28">Duration</th>
                <th className="py-3 px-4 font-semibold text-right w-20">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((inc) => {
                const completeSources = inc.investigation.sourcesChecked.filter(s => s.status === 'Complete').length;
                const totalSources = inc.investigation.sourcesChecked.length;

                return (
                  <tr
                    key={inc.id}
                    onClick={() => onSelectInvestigation(inc.id)}
                    className="hover:bg-slate-50 cursor-pointer transition-colors group"
                  >
                    {/* Incident */}
                    <td className="py-3 px-4 font-mono font-bold text-blue-600">
                      {inc.id}
                    </td>

                    {/* Root Cause */}
                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-medium text-slate-900 line-clamp-1">
                        {inc.investigation.rootCause.title}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        Service: {inc.service}
                      </div>
                    </td>

                    {/* Confidence */}
                    <td className="py-3 px-4">
                      <Badge type="confidence" value={inc.investigation.rootCause.confidence} />
                    </td>

                    {/* Sources Checked */}
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                      <span className="font-semibold text-slate-900">{completeSources}</span> / {totalSources} sources
                    </td>

                    {/* Action */}
                    <td className="py-3 px-4 text-slate-700 truncate max-w-[160px]">
                      {inc.investigation.recommendedAction.title}
                    </td>

                    {/* Outcome */}
                    <td className="py-3 px-4">
                      <Badge type="status" value={inc.status} />
                    </td>

                    {/* Investigation Time */}
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                      {inc.investigationTime || '2m 14s'}
                    </td>

                    {/* Details Link */}
                    <td className="py-3 px-4 text-right">
                      <span className="text-[11px] font-medium text-slate-400 group-hover:text-blue-600 flex items-center justify-end">
                        View <ChevronRight className="w-3 h-3 ml-0.5" />
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
