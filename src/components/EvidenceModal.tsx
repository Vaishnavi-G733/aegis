import React, { useState } from 'react';
import { X, FileText, GitBranch, Database, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { Incident } from '../types';

interface EvidenceModalProps {
  incident: Incident;
  isOpen: boolean;
  onClose: () => void;
}

export const EvidenceModal: React.FC<EvidenceModalProps> = ({
  incident,
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'logs' | 'config' | 'deploy' | 'historical'>('logs');

  if (!isOpen) return null;

  const logs = incident.investigation.evidenceData?.logs || [
    '2026-08-18 10:39:12 [ERROR] [ETLWorker-3] java.sql.SQLTimeoutException: Timeout waiting for lock',
    '2026-08-18 10:39:15 [ERROR] [ETLWorker-4] Lock wait timeout exceeded: lock table: tbl_cash_rec_ledger',
    '2026-08-18 10:41:02 [FATAL] [ETLWorker-1] Batch job cash_rec_eod failed after 3 retries. Reason: ORPHAN_LOCK_DETECTED'
  ];

  const configDiff = incident.investigation.evidenceData?.configDiff || [
    '--- /etc/etl-scheduler/config.yaml (release 5.4.11)',
    '+++ /etc/etl-scheduler/config.yaml (release 5.4.12)',
    '@@ -18,4 +18,4 @@',
    ' max_concurrent_workers: 16',
    '-lock_timeout_seconds: 30',
    '+lock_timeout_seconds: 300 # Mismatch: Causes downstream workers to deadlock during peak'
  ];

  const deploy = incident.investigation.evidenceData?.deployment || {
    commit: 'b78a9c1',
    author: 'cd-pipeline@atleos.internal',
    version: 'v5.4.12',
    timestamp: 'Today, 10:31 AM',
    changelog: 'Refactor ETL batch locking mechanics and concurrency throttles.'
  };

  const historical = incident.investigation.evidenceData?.historicalIncidents || [
    {
      id: 'INC-4821',
      date: '2026-06-12',
      service: 'ETL Scheduler',
      cause: 'Configuration lock timeout increased to 300s causing worker starvation',
      resolution: 'Reverted lock timeout to 30s and recycled scheduler pods',
      similarityScore: 96
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div 
        id="evidence-modal"
        className="bg-white border border-gray-300 rounded shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden text-slate-900"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-start justify-between bg-slate-50">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-slate-500 mb-1">
              <span className="font-bold text-blue-600">{incident.id}</span>
              <span>•</span>
              <span>Autonomous Evidence Vault</span>
            </div>
            <h2 className="text-base font-bold text-slate-900">
              Raw Corroborating Evidence &amp; Artifacts
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-gray-200 bg-slate-50/50 px-6 space-x-6 text-xs select-none">
          <button
            onClick={() => setActiveTab('logs')}
            className={`py-3 font-semibold border-b-2 transition-colors flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'logs'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Application Logs ({logs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('config')}
            className={`py-3 font-semibold border-b-2 transition-colors flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'config'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Configuration Diff</span>
          </button>

          <button
            onClick={() => setActiveTab('deploy')}
            className={`py-3 font-semibold border-b-2 transition-colors flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'deploy'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>Deployment Release</span>
          </button>

          <button
            onClick={() => setActiveTab('historical')}
            className={`py-3 font-semibold border-b-2 transition-colors flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'historical'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Historical Incidents ({historical.length})</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh] text-xs">
          {activeTab === 'logs' && (
            <div className="space-y-2">
              <div className="text-[11px] text-slate-500 font-mono flex items-center justify-between pb-1">
                <span>Queried Index: elastic-prod-cluster-01 [10:30 - 10:45]</span>
                <span>Matches: {logs.length} error lines</span>
              </div>
              <div className="p-4 bg-slate-950 text-slate-200 rounded font-mono text-[11px] space-y-1.5 leading-relaxed overflow-x-auto selection:bg-slate-800">
                {logs.map((line, idx) => (
                  <div 
                    key={idx} 
                    className={line.includes('FATAL') || line.includes('ERROR') ? 'text-red-400' : 'text-slate-300'}
                  >
                    {line}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'config' && (
            <div className="space-y-3">
              <div className="text-[11px] text-slate-500">
                GitOps config comparison between <strong>Release 5.4.11</strong> and <strong>Release 5.4.12</strong>:
              </div>
              <div className="p-4 bg-slate-950 text-slate-200 rounded font-mono text-[11px] space-y-1 leading-relaxed overflow-x-auto">
                {configDiff.map((line, idx) => (
                  <div
                    key={idx}
                    className={
                      line.startsWith('+') && !line.startsWith('+++')
                        ? 'text-green-400 bg-green-950/40 px-1 py-0.5 rounded'
                        : line.startsWith('-') && !line.startsWith('---')
                        ? 'text-red-400 bg-red-950/40 px-1 py-0.5 rounded'
                        : 'text-slate-400'
                    }
                  >
                    {line}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'deploy' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 border border-gray-200 rounded space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Version / Tag</span>
                    <span className="font-mono font-bold text-slate-900 text-sm">{deploy.version}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Commit Hash</span>
                    <span className="font-mono text-blue-600 font-bold text-sm">{deploy.commit}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Deployed At</span>
                    <span className="text-slate-800 font-medium">{deploy.timestamp}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Deployed By</span>
                    <span className="font-mono text-slate-600">{deploy.author}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-200">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block mb-1">Changelog Summary</span>
                  <p className="text-xs text-slate-700 font-mono bg-white p-2.5 rounded border border-gray-200">
                    {deploy.changelog}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'historical' && (
            <div className="space-y-3">
              <div className="text-[11px] text-slate-500">
                Vector semantic correlation identified previous incidents with similar telemetry signatures:
              </div>

              {historical.map((h, i) => (
                <div key={i} className="p-4 bg-white border border-gray-200 rounded space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-blue-600">{h.id}</span>
                    <span className="text-[10px] font-mono font-bold bg-green-50 text-green-700 px-2 py-0.5 rounded border border-green-200">
                      {h.similarityScore}% Match
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-slate-900">
                    Previous Cause: {h.cause}
                  </div>
                  <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded border border-gray-200">
                    <strong>Recorded Fix:</strong> {h.resolution}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-slate-700 bg-white border border-gray-300 rounded hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Close Evidence Viewer
          </button>
        </div>
      </div>
    </div>
  );
};
