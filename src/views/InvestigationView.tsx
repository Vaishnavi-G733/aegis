import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Cpu, 
  CheckCircle2, 
  Clock, 
  Play, 
  Check, 
  ShieldCheck, 
  ShieldAlert, 
  FileText, 
  RotateCcw,
  Sparkles,
  AlertCircle,
  Activity,
  Send
} from 'lucide-react';
import { Incident } from '../types';
import { Badge } from '../components/Badge';
import { EvidenceModal } from '../components/EvidenceModal';
import { EscalationModal } from '../components/EscalationModal';

interface InvestigationViewProps {
  incident: Incident;
  onBack: () => void;
  onExecuteRemediation: (incidentId: string) => void;
  onApproveRemediation: (incidentId: string) => void;
  onEscalateToTeam: (incidentId: string) => void;
}

export const InvestigationView: React.FC<InvestigationViewProps> = ({
  incident,
  onBack,
  onExecuteRemediation,
  onApproveRemediation,
  onEscalateToTeam
}) => {
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);
  const [isEscalationModalOpen, setIsEscalationModalOpen] = useState(false);
  
  // Execution Simulation State
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionStepIndex, setExecutionStepIndex] = useState(0);

  const investigation = incident.investigation;
  const isResolved = incident.status === 'Resolved';
  const isEscalated = incident.status === 'Escalated';
  const isActionRequired = incident.status === 'Action Required';

  const executionStepsList = investigation.recommendedAction.remediationSteps || [
    'Validating action against safety boundary policies',
    'Executing target remediation commands',
    'Checking service health & heartbeat probe',
    'Monitoring error rate and downstream throughput'
  ];

  const handleStartRemediation = () => {
    setIsExecuting(true);
    setExecutionStepIndex(0);

    const interval = setInterval(() => {
      setExecutionStepIndex((prev) => {
        if (prev >= executionStepsList.length - 1) {
          clearInterval(interval);
          setTimeout(() => {
            setIsExecuting(false);
            onExecuteRemediation(incident.id);
          }, 600);
          return prev;
        }
        return prev + 1;
      });
    }, 700);
  };

  const handleApprove = () => {
    setIsExecuting(true);
    setExecutionStepIndex(0);

    const interval = setInterval(() => {
      setExecutionStepIndex((prev) => {
        if (prev >= executionStepsList.length - 1) {
          clearInterval(interval);
          setTimeout(() => {
            setIsExecuting(false);
            onApproveRemediation(incident.id);
          }, 600);
          return prev;
        }
        return prev + 1;
      });
    }, 700);
  };

  return (
    <div id="investigation-view" className="p-8 flex-1 bg-slate-50/50 min-h-full space-y-6 max-w-7xl mx-auto">
      {/* Top Header & Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-gray-200 pb-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-1 text-slate-500 hover:text-slate-900 rounded hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs font-bold text-blue-600">
                {incident.id}
              </span>
              <span className="text-slate-300">•</span>
              <h1 className="text-base font-bold text-slate-900">
                Aegis Investigation — {incident.issueTitle}
              </h1>
            </div>
            <div className="flex items-center space-x-3 text-xs text-slate-500 mt-0.5">
              <span>Service: <strong className="text-slate-700 font-mono">{incident.service}</strong></span>
              <span>•</span>
              <span>Priority: <Badge type="priority" value={incident.priority} /></span>
              <span>•</span>
              <span>Investigation Time: <span className="font-mono text-slate-700">{incident.investigationTime || '2m 14s'}</span></span>
            </div>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center space-x-2">
          <div className="text-xs text-slate-400 font-medium">Status:</div>
          <Badge type="status" value={incident.status} className="text-xs px-3 py-1 font-semibold" />
        </div>
      </div>

      {/* RESOLVED BANNER (If incident has been resolved) */}
      {isResolved && (
        <div className="p-4 bg-green-50/80 border border-green-200 rounded text-slate-900 space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-5 h-5 rounded-full bg-green-600 text-white flex items-center justify-center">
                <Check className="w-3.5 h-3.5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-green-950">
                  Incident Resolved &amp; Verified
                </h3>
                <p className="text-xs text-green-800">
                  {investigation.resolutionDetails?.remediationExecuted || `${incident.service} restarted and lock queues normalized.`}
                </p>
              </div>
            </div>
            <span className="text-[11px] font-mono text-green-700 font-bold px-2 py-0.5 bg-green-100/80 rounded border border-green-300">
              Resolved in {investigation.resolutionDetails?.remediationDuration || incident.investigationTime || '1m 45s'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-2 border-t border-green-200 text-xs">
            {(investigation.resolutionDetails?.verificationPoints || [
              'Service healthy & responsive',
              'Queued jobs processed without error',
              'Error rate normalized to 0.0%',
              'Reports updating successfully'
            ]).map((point, i) => (
              <div key={i} className="flex items-center space-x-1.5 text-green-900 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-600 shrink-0" />
                <span>{point}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Investigation Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Investigation Activity & Timeline (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* 1. Investigation Activity Steps */}
          <div className="bg-white border border-gray-200 rounded p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-slate-800" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Investigation Activity
                </h2>
              </div>
              <span className="text-[10px] font-mono text-green-700 bg-green-50 px-1.5 py-0.5 rounded border border-green-200">
                100% Complete
              </span>
            </div>

            <div className="space-y-3">
              {investigation.activitySteps.map((step) => (
                <div 
                  key={step.id}
                  className="flex items-start space-x-2.5 text-xs group"
                >
                  <div className="w-4 h-4 rounded-full bg-green-50 text-green-600 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[8px] font-bold">✓</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between">
                      <span className="font-medium text-slate-900 leading-tight">
                        {step.step}
                      </span>
                      {step.timestamp && (
                        <span className="text-[10px] text-slate-400 font-mono shrink-0 ml-2">
                          {step.timestamp}
                        </span>
                      )}
                    </div>
                    {step.detail && (
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-snug font-mono">
                        {step.detail}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Investigation Timeline */}
          <div className="bg-white border border-gray-200 rounded p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-slate-800" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Investigation Timeline
                </h2>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Chronology</span>
            </div>

            <div className="relative pl-5 border-l border-gray-200 space-y-4 text-xs ml-2">
              {investigation.timeline.map((event, idx) => (
                <div key={idx} className="relative group">
                  {/* Dot indicator */}
                  <span 
                    className={`absolute -left-[25px] top-1 w-2.5 h-2.5 rounded-full border-2 bg-white ${
                      event.type === 'error'
                        ? 'border-red-600 bg-red-50'
                        : event.type === 'deploy'
                        ? 'border-blue-600 bg-blue-50'
                        : event.type === 'config'
                        ? 'border-amber-500 bg-amber-50'
                        : event.type === 'resolution'
                        ? 'border-green-600 bg-green-50'
                        : 'border-slate-700'
                    }`}
                  ></span>

                  <div className="flex items-baseline space-x-2">
                    <span className="font-mono text-[11px] font-semibold text-slate-900">
                      {event.time}
                    </span>
                    <span className="font-medium text-slate-800">
                      {event.title}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                    {event.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Root Cause, Evidence Sources, Recommended Action (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">

          {/* 3. Root Cause Analysis Section */}
          <div className="bg-white border border-gray-200 rounded p-6 space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-gray-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Deterministic Diagnosis
                </span>
                <h2 className="text-base font-bold text-slate-900 mt-0.5">
                  Root Cause Analysis
                </h2>
              </div>

              {/* Confidence Gauge */}
              <div className="text-right">
                <div className="text-[10px] font-bold uppercase text-slate-400 mb-0.5">Aegis Confidence</div>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-slate-100 rounded-full h-1.5 border border-gray-200 overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        investigation.rootCause.confidence >= 85 
                          ? 'bg-blue-600' 
                          : investigation.rootCause.confidence >= 70 
                          ? 'bg-amber-500' 
                          : 'bg-slate-600'
                      }`}
                      style={{ width: `${investigation.rootCause.confidence}%` }}
                    ></div>
                  </div>
                  <span className="font-mono font-bold text-xs text-blue-600">
                    {investigation.rootCause.confidence}%
                  </span>
                </div>
              </div>
            </div>

            {/* Primary Conclusion Box */}
            <div className="p-4 bg-slate-50 border border-gray-200 rounded space-y-2">
              <div className="flex items-center space-x-2 text-xs font-semibold text-slate-900">
                <span className="w-2 h-2 rounded-full bg-slate-900"></span>
                <span className="text-slate-500 font-medium">Primary Conclusion:</span>
                <span className="text-slate-900 font-bold">{investigation.rootCause.title}</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                {investigation.rootCause.summary}
              </p>
            </div>

            {/* Granular Evidence Rows */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Corroborating Evidence</span>
                <button
                  id="btn-view-evidence"
                  onClick={() => setIsEvidenceModalOpen(true)}
                  className="text-blue-600 hover:underline flex items-center text-xs font-medium cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 mr-1 text-blue-600" />
                  View Raw Evidence Details
                </button>
              </div>

              <div className="space-y-1.5">
                {investigation.evidence.map((ev) => (
                  <div 
                    key={ev.id}
                    className="p-2.5 bg-white border border-gray-200 rounded flex items-start space-x-2.5 text-xs text-slate-800"
                  >
                    <div className="w-4 h-4 rounded-full bg-green-50 text-green-600 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-[8px] font-bold">✓</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-slate-900">{ev.text}</div>
                      <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-mono mt-0.5">
                        <span>Source: {ev.source}</span>
                        <span>•</span>
                        <span>Category: {ev.category}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 4. Evidence Sources Section */}
          <div className="bg-white border border-gray-200 rounded p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Evidence Sources Checked
                </h3>
                <p className="text-[11px] text-slate-500">
                  Telemetry, repositories, and databases inspected by Aegis
                </p>
              </div>
              <span className="text-xs font-mono text-slate-400">
                {investigation.sourcesChecked.filter(s => s.status === 'Complete').length} of {investigation.sourcesChecked.length} online
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {investigation.sourcesChecked.map((source, i) => (
                <div 
                  key={i}
                  onClick={() => setIsEvidenceModalOpen(true)}
                  className="p-3 border border-gray-200 rounded bg-white hover:bg-slate-50 transition-colors cursor-pointer space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-slate-900 truncate">
                      {source.name}
                    </span>
                    <Badge type="source" value={source.status} />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1">
                    <span>{source.itemsFound} items found</span>
                    {source.latencyMs > 0 && <span>{source.latencyMs}ms</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 5. Recommended Action / Remediation Workflow Section */}
          <div className="bg-white border border-gray-200 rounded p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-slate-900" />
                <h2 className="text-sm font-bold text-slate-900">
                  Recommended Action
                </h2>
              </div>
              <div className="flex items-center space-x-2">
                <Badge type="risk" value={investigation.recommendedAction.risk} />
                <Badge type="confidence" value={investigation.recommendedAction.confidence} />
              </div>
            </div>

            {/* Recommendation summary card */}
            <div className="space-y-2">
              <div className="text-sm font-bold text-slate-900">
                {investigation.recommendedAction.title}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {investigation.recommendedAction.expectedOutcome}
              </p>
            </div>

            {/* LIVE REMEDIATION SIMULATION DISPLAY */}
            {isExecuting ? (
              <div className="p-4 bg-slate-900 text-white rounded space-y-3 text-xs font-mono">
                <div className="flex items-center justify-between text-slate-300 pb-2 border-b border-slate-800">
                  <span className="flex items-center">
                    <RotateCcw className="w-3.5 h-3.5 animate-spin mr-2 text-white" />
                    Executing Autonomous Remediation...
                  </span>
                  <span>Step {executionStepIndex + 1} of {executionStepsList.length}</span>
                </div>

                <div className="space-y-1.5 pt-1">
                  {executionStepsList.map((step, idx) => (
                    <div 
                      key={idx}
                      className={`flex items-center space-x-2 ${
                        idx < executionStepIndex
                          ? 'text-green-400'
                          : idx === executionStepIndex
                          ? 'text-white font-bold animate-pulse'
                          : 'text-slate-500'
                      }`}
                    >
                      {idx < executionStepIndex ? (
                        <Check className="w-3.5 h-3.5 text-green-400" />
                      ) : idx === executionStepIndex ? (
                        <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-slate-700"></span>
                      )}
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : isResolved ? (
              <div className="p-4 bg-slate-50 border border-gray-200 rounded text-xs text-slate-600 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span className="font-semibold text-slate-900">Remediation Completed &amp; Verified</span>
                </div>
                <span className="font-mono text-[11px] text-slate-400">Recorded in Incident Index</span>
              </div>
            ) : isEscalated ? (
              /* ESCALATION STATE */
              <div className="p-4 bg-amber-50/70 border border-amber-200 rounded space-y-3 text-xs">
                <div className="flex items-start space-x-2.5">
                  <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-amber-900">
                      Human Intervention Required
                    </h4>
                    <p className="text-amber-800 text-[11px] mt-0.5">
                      Confidence score (64%) is below the autonomous threshold (85%) or involves high financial risk. Aegis will not automatically modify production.
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-amber-200">
                  <span className="text-amber-900 font-medium">
                    Recommended Team: <strong>{investigation.escalationPackage?.assignedTeam || incident.owner}</strong>
                  </span>
                  <button
                    id="btn-view-escalation-pkg"
                    onClick={() => setIsEscalationModalOpen(true)}
                    className="inline-flex items-center px-3 py-1.5 bg-slate-900 text-white rounded text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5 mr-1.5" />
                    <span>View / Send Escalation Package</span>
                  </button>
                </div>
              </div>
            ) : isActionRequired || investigation.recommendedAction.requiresApproval ? (
              /* HUMAN APPROVAL REQUIRED STATE */
              <div className="p-4 bg-slate-50 border border-gray-300 rounded space-y-3 text-xs">
                <div className="flex items-start space-x-2.5">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-slate-900">
                      Human Approval Required
                    </h4>
                    <p className="text-slate-600 text-[11px] mt-0.5">
                      {investigation.recommendedAction.approvalReason || 'This action may affect active production workloads.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-2 pt-2 border-t border-gray-200">
                  <button
                    onClick={() => setIsEvidenceModalOpen(true)}
                    className="px-3 py-1.5 text-xs text-slate-700 bg-white border border-gray-300 rounded hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    Investigate Further
                  </button>
                  <button
                    id="btn-approve-execute"
                    onClick={handleApprove}
                    className="px-3.5 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors flex items-center cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 mr-1.5 text-slate-300" />
                    <span>Approve &amp; Execute Fix</span>
                  </button>
                </div>
              </div>
            ) : (
              /* STANDARD AUTO-REMEDIATION STATE */
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <span className="text-xs text-slate-500 flex items-center">
                  <Sparkles className="w-3.5 h-3.5 mr-1.5 text-slate-700" />
                  Safe autonomous remediation verified
                </span>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsEscalationModalOpen(true)}
                    className="px-3 py-1.5 text-xs text-slate-700 bg-white border border-gray-300 rounded hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    Request Escalation
                  </button>
                  <button
                    id="btn-execute-fix"
                    onClick={handleStartRemediation}
                    className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors flex items-center cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 mr-1.5 text-green-400" />
                    <span>Execute Fix</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODALS */}
      <EvidenceModal
        incident={incident}
        isOpen={isEvidenceModalOpen}
        onClose={() => setIsEvidenceModalOpen(false)}
      />

      <EscalationModal
        incident={incident}
        isOpen={isEscalationModalOpen}
        onClose={() => setIsEscalationModalOpen(false)}
        onDispatchEscalation={onEscalateToTeam}
      />
    </div>
  );
};
