import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Cpu, 
  ArrowUpRight, 
  Play, 
  Filter, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  RotateCcw
} from 'lucide-react';
import { Incident, AegisActivityItem, ActiveView } from '../types';
import { Badge } from '../components/Badge';

interface DashboardViewProps {
  incidents: Incident[];
  activityLogs: AegisActivityItem[];
  onSelectIncident: (incidentId: string) => void;
  onNavigate: (view: ActiveView) => void;
  onAnalyzeIncident: (incidentId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  incidents,
  activityLogs,
  onSelectIncident,
  onNavigate,
  onAnalyzeIncident
}) => {
  const [filterPriority, setFilterPriority] = useState<string>('ALL');

  const openIncidents = incidents.filter((i) => i.status !== 'Resolved').length;
  const resolvedToday = incidents.filter((i) => i.status === 'Resolved').length + 15;
  const escalatedCount = incidents.filter((i) => i.status === 'Escalated').length + 4;
  const automationRate = 71;

  const filteredIncidents = incidents.filter((i) => {
    if (filterPriority !== 'ALL' && i.priority !== filterPriority) return false;
    return true;
  });

  const heroIncident = incidents.find((i) => i.id === 'INC-1042') || incidents[0];

  return (
    <div id="dashboard-view" className="p-8 flex-1 bg-slate-50/50 min-h-full space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="mb-2">
        <h3 className="text-2xl font-bold tracking-tight text-slate-900">Support Operations</h3>
        <p className="text-sm text-slate-500">Monitor active incidents and real-time Aegis investigations</p>
      </div>

      {/* KPI Cards (4 Columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Metric 1 */}
        <div className="bg-white border border-gray-200 p-4 rounded">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Open Incidents</p>
          <p className="text-2xl font-bold text-slate-900">{openIncidents > 0 ? openIncidents : 24}</p>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-gray-200 p-4 rounded">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Resolved Today</p>
          <p className="text-2xl font-bold text-green-600">{resolvedToday}</p>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-gray-200 p-4 rounded">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Escalated</p>
          <p className="text-2xl font-bold text-red-600">{escalatedCount}</p>
        </div>

        {/* Metric 4 */}
        <div className="bg-white border border-gray-200 p-4 rounded">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Automation Rate</p>
          <p className="text-2xl font-bold text-blue-600">{automationRate}%</p>
        </div>
      </div>

      {/* Main Split Row: Active Incidents (flex-[2]) & Aegis Intelligence (flex-1) */}
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Left: Active Incidents Table */}
        <div className="flex-[2] bg-white border border-gray-200 rounded flex flex-col">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Incidents</h4>
            <div className="flex items-center gap-3">
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="text-[11px] border border-gray-200 rounded px-2 py-1 bg-white text-slate-600 focus:outline-none"
              >
                <option value="ALL">All Priorities</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
              <button 
                onClick={() => onNavigate('incidents')}
                className="text-[10px] text-blue-600 font-medium hover:underline cursor-pointer"
              >
                View All
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-gray-100 text-slate-400 uppercase text-[10px]">
                  <th className="py-3 px-4 font-semibold">Incident</th>
                  <th className="py-3 px-4 font-semibold">Issue</th>
                  <th className="py-3 px-4 font-semibold">Service</th>
                  <th className="py-3 px-4 font-semibold">Priority</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Action / Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-slate-800">
                {filteredIncidents.map((inc) => (
                  <tr
                    key={inc.id}
                    onClick={() => onSelectIncident(inc.id)}
                    className="hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    {/* ID */}
                    <td className="py-3 px-4 font-mono font-bold text-blue-600">
                      {inc.id}
                    </td>

                    {/* Issue */}
                    <td className="py-3 px-4 font-medium text-slate-900 max-w-[200px] truncate">
                      {inc.issueTitle}
                    </td>

                    {/* Service */}
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                      {inc.service}
                    </td>

                    {/* Priority */}
                    <td className="py-3 px-4">
                      <Badge type="priority" value={inc.priority} />
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <Badge type="status" value={inc.status} />
                    </td>

                    {/* Updated / Action */}
                    <td className="py-3 px-4 text-right">
                      {inc.status === 'New' ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onAnalyzeIncident(inc.id);
                          }}
                          className="px-2 py-0.5 text-[10px] font-bold text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors"
                        >
                          Analyze
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400">{inc.updated}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Aegis Intelligence Widget */}
        <div className="flex-1 bg-white border border-gray-200 rounded flex flex-col justify-between">
          <div>
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Aegis Intelligence</h4>
              <span className="text-[10px] font-mono text-blue-600 font-semibold bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                Live
              </span>
            </div>

            <div className="p-5 flex flex-col space-y-4">
              {/* Target Incident Box */}
              <div className="p-3 bg-blue-50/50 rounded border border-blue-100">
                <p className="text-[10px] text-blue-600 font-bold mb-1 uppercase tracking-tighter">
                  Current Investigation: {heroIncident.id}
                </p>
                <p className="text-xs font-bold text-slate-900 leading-tight">
                  Service: {heroIncident.service}
                </p>
              </div>

              {/* Progress Steps Checklist */}
              <div className="space-y-3.5 flex-1 pr-1">
                {heroIncident.investigation.activitySteps.slice(0, 4).map((step, idx) => {
                  const isLast = idx === 3;
                  return (
                    <div key={step.id} className="flex items-start gap-3 text-xs">
                      {isLast && heroIncident.status === 'Investigating' ? (
                        <div className="w-4 h-4 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5 animate-pulse">
                          <span className="text-[9px] font-bold">...</span>
                        </div>
                      ) : (
                        <div className="w-4 h-4 rounded-full bg-green-50 text-green-600 flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-[8px] font-bold">✓</span>
                        </div>
                      )}
                      <div className="flex flex-col min-w-0">
                        <span className={`text-[11px] ${isLast && heroIncident.status === 'Investigating' ? 'font-bold text-blue-600' : 'font-medium text-slate-800'}`}>
                          {step.step}
                        </span>
                        <span className="text-[9px] text-slate-400 font-mono">{step.timestamp || '10:43 AM'}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Probability Match Section */}
              <div className="pt-3 border-t border-gray-50">
                <div className="bg-slate-50 p-3 rounded flex flex-col space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Probability Match</span>
                    <span className="text-[10px] font-bold text-blue-600 uppercase">
                      {heroIncident.investigation.rootCause.confidence}%
                    </span>
                  </div>
                  <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 transition-all duration-500" 
                      style={{ width: `${heroIncident.investigation.rootCause.confidence}%` }}
                    ></div>
                  </div>
                  <p className="text-[10px] text-slate-500 italic">
                    {heroIncident.investigation.rootCause.title}
                  </p>
                </div>

                <button 
                  id="btn-open-hero-investigation"
                  onClick={() => onSelectIncident(heroIncident.id)}
                  className="w-full mt-4 bg-slate-900 text-white text-xs font-bold py-2 rounded border border-slate-900 hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Open Investigation
                </button>
              </div>
            </div>
          </div>

          {/* Activity Stream summary */}
          <div className="p-4 border-t border-gray-100 bg-slate-50/40 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Recent telemetry event</span>
            <span className="font-mono text-[10px] text-slate-400">{activityLogs[0]?.timestamp || 'Just now'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
