import React, { useState } from 'react';
import { X, Send, Sparkles, AlertCircle } from 'lucide-react';
import { SupportEmail, Incident, Priority } from '../types';

interface SimulateEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInjectEmail: (email: SupportEmail, incident: Incident) => void;
}

export const SimulateEmailModal: React.FC<SimulateEmailModalProps> = ({
  isOpen,
  onClose,
  onInjectEmail
}) => {
  const [sender, setSender] = useState('Sarah Jenkins');
  const [senderEmail, setSenderEmail] = useState('s.jenkins@firstnational.com');
  const [department, setDepartment] = useState('Treasury Ops — First National Bank');
  const [subject, setSubject] = useState('Urgent: Card settlement reports stopped generating after 10:30 deploy');
  const [priority, setPriority] = useState<Priority>('High');
  const [body, setBody] = useState(
    'Hi Support Team,\n\nOur treasury desk noticed that the daily card settlement batch has stalled and no PDF reconciliation summaries have reached our sFTP drop since approximately 10:35 AM.\n\nPlease investigate as market close reconciliation requires these files within 45 minutes.\n\nThanks,\nSarah Jenkins'
  );

  if (!isOpen) return null;

  const handlePresetSelect = (type: 'etl' | 'atm' | 'db') => {
    if (type === 'etl') {
      setSender('Sarah Jenkins');
      setSenderEmail('s.jenkins@firstnational.com');
      setDepartment('Treasury Ops — First National Bank');
      setSubject('Cash reconciliation batch failed after morning maintenance');
      setPriority('High');
      setBody('Hi Team,\n\nThe automated cash reconciliation engine threw lock timeouts after the 10:31 release. 240+ branches are waiting on updated balance statements.\n\nRegards,\nSarah');
    } else if (type === 'atm') {
      setSender('David Rossi');
      setSenderEmail('drossi@metropolitanbank.org');
      setDepartment('ATM Fleet Management — Metro Bank');
      setSubject('ATM Switch Node 04 reporting 504 Gateway Timeouts');
      setPriority('Critical');
      setBody('Urgent: 80+ ATMs in the downtown metro sector are rejecting withdrawal transactions with switch timeout code 504. Socket pool appears exhausted.\n\nPlease recycle node 04 immediately.\n\nDavid');
    } else {
      setSender('Elena Rostova');
      setSenderEmail('e.rostova@apexinvestments.com');
      setDepartment('Clearing & Settlement — Apex');
      setSubject('DB Deadlock on ledger batch insertion');
      setPriority('High');
      setBody('Our morning settlement clearing run hit repeated PostgreSQL deadlock aborts on tbl_settlement_ledger. Need DB team to inspect lock graph and unblock pipeline.\n\nElena');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newEmailId = `EML-${randomSuffix}`;
    const newIncidentId = `INC-${randomSuffix}`;
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newEmail: SupportEmail = {
      id: newEmailId,
      sender,
      senderEmail,
      department,
      subject,
      preview: body.slice(0, 110) + '...',
      body,
      receivedAt: timeString,
      priority,
      status: 'New',
      linkedIncidentId: newIncidentId,
      tags: ['Simulated', 'Incoming', 'Triage']
    };

    const newIncident: Incident = {
      id: newIncidentId,
      emailId: newEmailId,
      service: subject.toLowerCase().includes('atm') ? 'ATM Gateway Switch' : subject.toLowerCase().includes('deadlock') ? 'PostgreSQL Cluster' : 'ETL Scheduler',
      issueTitle: subject,
      category: subject.toLowerCase().includes('deploy') ? 'Deployment Issue' : 'Runtime Exception',
      priority,
      status: 'New',
      owner: 'Autonomous Triage Queue',
      potentialImpact: 'Estimated ~120 pending transactions or reporting delays.',
      createdAt: timeString,
      updated: 'Just now',
      investigationTime: '1m 20s',
      investigation: {
        status: 'idle',
        investigationProgress: 0,
        actionType: 'auto_remediation',
        activitySteps: [
          { id: 's1', step: 'Parsed support email and extracted entities', timestamp: '10:45 AM', status: 'completed' },
          { id: 's2', step: `Identified target service: ${subject.toLowerCase().includes('atm') ? 'ATM Gateway Switch' : 'ETL Scheduler'}`, timestamp: '10:45 AM', status: 'completed' },
          { id: 's3', step: 'Searching application log indices', timestamp: '10:46 AM', status: 'completed', detail: 'Queried error indices for recent stack traces' },
          { id: 's4', step: 'Correlating deployment timestamps', timestamp: '10:46 AM', status: 'completed', detail: 'Found release v5.4.12' },
          { id: 's5', step: 'Root cause identified with 92% confidence', timestamp: '10:47 AM', status: 'completed' }
        ],
        timeline: [
          { time: '10:31 AM', title: 'Deployment completed', description: 'Release v5.4.12 applied to cluster.', type: 'deploy' },
          { time: '10:38 AM', title: 'First failure detected', description: 'Telemetry logged socket or lock timeout.', type: 'error' },
          { time: timeString, title: 'Support email ingested', description: `Received message from ${sender}.`, type: 'email' }
        ],
        rootCause: {
          title: `Configuration mismatch introduced in recent release`,
          confidence: 91,
          summary: `Telemetry indicates worker thread starvation caused by configuration timeout discrepancies.`
        },
        evidence: [
          { id: 'ev1', text: 'Error spike coincides with cluster rollout', source: 'Application Logs', category: 'Telemetry', verified: true },
          { id: 'ev2', text: 'Configuration diff shows timeout parameter increase', source: 'GitOps Manifests', category: 'Configuration', verified: true },
          { id: 'ev3', text: 'Historical match INC-4821 shares identical stack trace', source: 'Incident Index', category: 'Historical', verified: true }
        ],
        sourcesChecked: [
          { name: 'Application Logs', type: 'logs', status: 'Complete', itemsFound: 12, latencyMs: 230, details: '12 log anomalies found' },
          { name: 'Deployment History', type: 'deploy', status: 'Complete', itemsFound: 3, latencyMs: 140, details: 'v5.4.12 deployed' },
          { name: 'Configuration Repo', type: 'config', status: 'Complete', itemsFound: 1, latencyMs: 190, details: 'lock_timeout changed' },
          { name: 'Previous Incidents', type: 'history', status: 'Complete', itemsFound: 4, latencyMs: 310, details: 'INC-4821 matched' },
          { name: 'Knowledge Base', type: 'kb', status: 'Complete', itemsFound: 2, latencyMs: 160, details: 'Runbooks indexed' },
          { name: 'Infrastructure Metrics', type: 'metrics', status: 'Complete', itemsFound: 8, latencyMs: 280, details: 'CPU/Memory normal' }
        ],
        recommendedAction: {
          title: `Restart worker pool & flush transient lock table`,
          risk: 'Low',
          confidence: 93,
          expectedOutcome: 'Restores queue processing throughput and unblocks pending reports.',
          requiresApproval: false,
          remediationSteps: [
            'Validating action against safety boundary policies',
            'Flushing orphaned lock table',
            'Cycling scheduler worker pods',
            'Verifying healthcheck probes'
          ]
        }
      }
    };

    onInjectEmail(newEmail, newIncident);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div 
        id="simulate-email-modal"
        className="bg-white border border-gray-300 rounded shadow-xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden text-slate-900"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-start justify-between bg-slate-50">
          <div>
            <div className="flex items-center space-x-1.5 text-xs text-slate-500 font-medium mb-1">
              <Sparkles className="w-3.5 h-3.5 text-slate-900" />
              <span>Aegis Autonomous Simulation Lab</span>
            </div>
            <h2 className="text-base font-bold text-slate-900">
              Simulate Incoming Support Email
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Quick Presets */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Quick Test Scenarios
            </span>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => handlePresetSelect('etl')}
                className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 border border-gray-200 rounded text-slate-700 font-medium transition-colors cursor-pointer"
              >
                ETL Timeout (High)
              </button>
              <button
                type="button"
                onClick={() => handlePresetSelect('atm')}
                className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 border border-gray-200 rounded text-slate-700 font-medium transition-colors cursor-pointer"
              >
                ATM Switch 504 (Critical)
              </button>
              <button
                type="button"
                onClick={() => handlePresetSelect('db')}
                className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 border border-gray-200 rounded text-slate-700 font-medium transition-colors cursor-pointer"
              >
                DB Deadlock (Tier-3)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                Sender Full Name
              </label>
              <input
                type="text"
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                required
                className="w-full text-xs p-2 bg-slate-50 border border-gray-200 rounded focus:bg-white focus:outline-none focus:border-slate-400 text-slate-900"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                Sender Email
              </label>
              <input
                type="email"
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                required
                className="w-full text-xs p-2 bg-slate-50 border border-gray-200 rounded focus:bg-white focus:outline-none focus:border-slate-400 text-slate-900 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                Department / Institution
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                required
                className="w-full text-xs p-2 bg-slate-50 border border-gray-200 rounded focus:bg-white focus:outline-none focus:border-slate-400 text-slate-900"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full text-xs p-2 bg-slate-50 border border-gray-200 rounded focus:bg-white focus:outline-none focus:border-slate-400 text-slate-900"
              >
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
              Subject Line
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              className="w-full text-xs p-2 bg-slate-50 border border-gray-200 rounded focus:bg-white focus:outline-none focus:border-slate-400 text-slate-900 font-semibold"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
              Email Body Content
            </label>
            <textarea
              rows={5}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
              className="w-full text-xs p-2.5 bg-slate-50 border border-gray-200 rounded focus:bg-white focus:outline-none focus:border-slate-400 text-slate-900 font-mono leading-relaxed"
            />
          </div>

          {/* Footer actions */}
          <div className="pt-3 border-t border-gray-200 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-medium text-slate-700 bg-white border border-gray-300 rounded hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              id="btn-submit-simulate-email"
              type="submit"
              className="inline-flex items-center px-4 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5 mr-1.5" />
              <span>Ingest &amp; Trigger Triage</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
