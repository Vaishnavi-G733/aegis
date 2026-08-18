import React from 'react';
import { 
  ArrowLeft, 
  Cpu, 
  Sparkles, 
  CheckCircle2, 
  Tag
} from 'lucide-react';
import { SupportEmail, Incident } from '../types';
import { Badge } from '../components/Badge';

interface EmailDetailViewProps {
  email: SupportEmail;
  incident: Incident;
  onBack: () => void;
  onAnalyzeWithAegis: (incidentId: string) => void;
}

export const EmailDetailView: React.FC<EmailDetailViewProps> = ({
  email,
  incident,
  onBack,
  onAnalyzeWithAegis
}) => {
  return (
    <div id="email-detail-view" className="p-8 flex-1 bg-slate-50/50 min-h-full space-y-6 max-w-7xl mx-auto">
      {/* Top Breadcrumb / Back Button */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <button
          onClick={onBack}
          className="inline-flex items-center text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
          <span>Back to Support Inbox</span>
        </button>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400 font-mono">Email ID: {email.id}</span>
          <span className="text-slate-300">•</span>
          <span className="text-xs text-blue-600 font-mono font-bold">Linked: {incident.id}</span>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Original Email (7 Cols) */}
        <div className="lg:col-span-7 bg-white border border-gray-200 rounded flex flex-col justify-between">
          <div className="p-6 space-y-5">
            {/* Header info */}
            <div className="border-b border-gray-100 pb-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Subject
                  </span>
                  <h2 className="text-base font-bold text-slate-900 leading-snug">
                    {email.subject}
                  </h2>
                </div>
                <Badge type="priority" value={email.priority} />
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs pt-2">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">From:</span>
                  <span className="font-semibold text-slate-900">{email.sender}</span>
                  <span className="text-slate-400 block font-mono text-[11px]">{email.senderEmail}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Timestamp:</span>
                  <span className="text-slate-800 font-medium">{email.receivedAt} Today</span>
                  <span className="text-slate-500 block text-[11px]">{email.department}</span>
                </div>
              </div>
            </div>

            {/* Email Body */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Original Message Body
              </span>
              <div className="p-4 bg-slate-50 border border-gray-200 rounded text-xs text-slate-800 whitespace-pre-line font-mono leading-relaxed selection:bg-slate-200">
                {email.body}
              </div>
            </div>

            {/* Tags */}
            <div className="flex items-center space-x-1.5 flex-wrap">
              <Tag className="w-3.5 h-3.5 text-slate-400 mr-1" />
              {email.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-[10px] font-medium px-2 py-0.5 bg-slate-100 text-slate-600 rounded border border-gray-200"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Primary Action Footer */}
          <div className="p-5 border-t border-gray-100 bg-slate-50/50 flex items-center justify-between">
            <div className="flex items-center text-xs text-slate-500">
              <Sparkles className="w-4 h-4 mr-1.5 text-slate-700" />
              <span>Aegis Autonomous Engine Ready</span>
            </div>

            <button
              id="btn-analyze-with-aegis"
              onClick={() => onAnalyzeWithAegis(incident.id)}
              className="inline-flex items-center px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors cursor-pointer"
            >
              <Cpu className="w-4 h-4 mr-2 text-slate-200" />
              <span>Analyze with Aegis</span>
            </button>
          </div>
        </div>

        {/* Right Column: Incident Information & Auto-Extraction (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Incident Overview Card */}
          <div className="bg-white border border-gray-200 rounded p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Structured Record
                </span>
                <div className="text-sm font-bold font-mono text-blue-600">
                  {incident.id}
                </div>
              </div>
              <Badge type="status" value={incident.status} />
            </div>

            {/* Extracted Fields */}
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Identified Service</span>
                <span className="font-semibold text-slate-900 font-mono text-xs">
                  {incident.service}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Category</span>
                <span className="font-medium text-slate-800">
                  {incident.category}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Priority</span>
                  <div className="mt-0.5">
                    <Badge type="priority" value={incident.priority} />
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Current Status</span>
                  <span className="font-medium text-slate-800">
                    {incident.status}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Potential Business Impact</span>
                <span className="font-medium text-red-700 bg-red-50 px-2 py-1 rounded border border-red-100 block mt-0.5">
                  {incident.potentialImpact}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Designated Owner / Team</span>
                <span className="font-medium text-slate-800">
                  {incident.owner}
                </span>
              </div>
            </div>
          </div>

          {/* Autonomous Extraction Insights */}
          <div className="bg-white border border-gray-200 rounded p-4 text-xs space-y-2.5">
            <div className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-600 mr-1.5" />
              Autonomous Pre-Triage Checklist
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Upon clicking <strong>Analyze with Aegis</strong>, the platform will immediately parse telemetry indices, pull GitOps release manifests, cross-reference previous post-mortems, and execute deterministic root cause correlation.
            </p>
            <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>Target: prod-us-cluster</span>
              <span>SLA Clock: Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
