import React, { useState } from 'react';
import { X, Send, ShieldAlert, CheckCircle2, UserCheck, AlertTriangle } from 'lucide-react';
import { Incident } from '../types';

interface EscalationModalProps {
  incident: Incident;
  isOpen: boolean;
  onClose: () => void;
  onDispatchEscalation: (incidentId: string) => void;
}

export const EscalationModal: React.FC<EscalationModalProps> = ({
  incident,
  isOpen,
  onClose,
  onDispatchEscalation
}) => {
  const [selectedTeam, setSelectedTeam] = useState<string>(
    incident.investigation.escalationPackage?.assignedTeam || 'Database Engineering Team'
  );
  const [customNote, setCustomNote] = useState<string>('');

  if (!isOpen) return null;

  const escalation = incident.investigation.escalationPackage || {
    ticketId: 'DB-ESC-8492',
    assignedTeam: 'Database Engineering Team',
    summary: 'Lock contention identified on tbl_cash_rec_ledger requiring lock query kill and index rebuild.',
    businessImpact: '247 cash reconciliation reports delayed across 14 financial institutions.',
    hypotheses: [
      'Orphaned transaction from ungraceful worker termination',
      'Missing covering index on (tenant_id, batch_date, status)'
    ],
    checksCompleted: [
      'Application Logs analyzed (15 lock errors)',
      'GitOps configuration diff checked',
      'Historical incident INC-4821 compared'
    ],
    recommendedNextSteps: [
      'Run pg_stat_activity to identify PID blocking ledger table',
      'Execute pg_terminate_backend(pid) if query duration > 10m',
      'Review isolation level on batch insert'
    ]
  };

  const handleSend = () => {
    onDispatchEscalation(incident.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div 
        id="escalation-modal"
        className="bg-white border border-gray-300 rounded shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden text-slate-900"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-start justify-between bg-slate-50">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-slate-500 mb-1">
              <span className="font-bold text-blue-600">{incident.id}</span>
              <span>•</span>
              <span className="font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                Tier-3 Escalation Package
              </span>
            </div>
            <h2 className="text-base font-bold text-slate-900">
              Autonomous Escalation Dispatch
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Target Team & Ticket ID */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 border border-gray-200 rounded">
            <div>
              <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                Designated Engineering Team
              </label>
              <select
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
                className="w-full text-xs font-semibold bg-white border border-gray-300 rounded px-2.5 py-1.5 text-slate-900 focus:outline-none"
              >
                <option value="Database Engineering Team">Database Engineering Team</option>
                <option value="Core Platform Infrastructure">Core Platform Infrastructure</option>
                <option value="Payments & ATM Gateway SRE">Payments &amp; ATM Gateway SRE</option>
                <option value="Security Operations Center">Security Operations Center</option>
              </select>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                Generated Ticket Reference
              </span>
              <span className="font-mono font-bold text-blue-600 text-xs block py-1.5">
                {escalation.ticketId}
              </span>
            </div>
          </div>

          {/* Structured Summary */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Diagnostic Summary
            </span>
            <p className="p-3 bg-slate-50 border border-gray-200 rounded text-slate-800 leading-relaxed font-medium">
              {escalation.summary}
            </p>
          </div>

          {/* Business Impact */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Business &amp; SLA Impact
            </span>
            <div className="p-3 bg-red-50 text-red-800 border border-red-100 rounded font-medium">
              {escalation.businessImpact}
            </div>
          </div>

          {/* Hypotheses Formulated */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Formulated Hypotheses
            </span>
            <div className="space-y-1">
              {escalation.hypotheses.map((hypo, idx) => (
                <div key={idx} className="flex items-start space-x-2 text-slate-800 p-2 bg-white border border-gray-200 rounded">
                  <span className="font-mono text-slate-400 font-bold">{idx + 1}.</span>
                  <span>{hypo}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Next Steps */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Recommended Next Steps for Engineer
            </span>
            <div className="space-y-1">
              {escalation.recommendedNextSteps.map((step, idx) => (
                <div key={idx} className="flex items-start space-x-2 text-slate-800 p-2 bg-white border border-gray-200 rounded">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-600 shrink-0 mt-0.5" />
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Optional Engineer Note */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Add Operational Handover Note (Optional)
            </span>
            <textarea
              rows={2}
              placeholder="e.g., Escalated to on-call DB SRE. Verified no data loss on ledger."
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              className="w-full text-xs p-2.5 bg-slate-50 border border-gray-200 rounded focus:bg-white focus:outline-none focus:border-slate-400 text-slate-900"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-gray-200 bg-slate-50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-slate-700 bg-white border border-gray-300 rounded hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            id="btn-confirm-escalation"
            onClick={handleSend}
            className="inline-flex items-center px-4 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors cursor-pointer"
          >
            <Send className="w-3.5 h-3.5 mr-1.5" />
            <span>Dispatch to {selectedTeam.split(' ')[0]} SRE</span>
          </button>
        </div>
      </div>
    </div>
  );
};
