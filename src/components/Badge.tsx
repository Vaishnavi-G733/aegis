import React from 'react';
import { Priority, IncidentStatus, EmailStatus, RiskLevel } from '../types';

interface BadgeProps {
  type: 'priority' | 'status' | 'email_status' | 'risk' | 'confidence' | 'source';
  value: string | number;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ type, value, className = '' }) => {
  if (type === 'priority') {
    const priority = value as Priority;
    switch (priority) {
      case 'Critical':
        return (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wider bg-red-50 text-red-700 border border-red-100 ${className}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1"></span>
            Critical
          </span>
        );
      case 'High':
        return (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wider bg-red-50 text-red-700 border border-red-100 ${className}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1"></span>
            High
          </span>
        );
      case 'Medium':
        return (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-100 ${className}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1"></span>
            Medium
          </span>
        );
      case 'Low':
      default:
        return (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wider bg-slate-100 text-slate-600 border border-gray-200 ${className}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-1"></span>
            Low
          </span>
        );
    }
  }

  if (type === 'status') {
    const status = value as IncidentStatus;
    switch (status) {
      case 'New':
        return (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-100 ${className}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1"></span>
            New
          </span>
        );
      case 'Investigating':
        return (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200 italic animate-pulse ${className}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1"></span>
            Investigating
          </span>
        );
      case 'Action Required':
        return (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200 ${className}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1"></span>
            Action Required
          </span>
        );
      case 'Remediating':
        return (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200 animate-pulse ${className}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1"></span>
            Remediating
          </span>
        );
      case 'Resolved':
        return (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wider bg-green-50 text-green-700 border border-green-200 ${className}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1"></span>
            Resolved
          </span>
        );
      case 'Escalated':
        return (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wider bg-slate-100 text-slate-600 border border-gray-200 ${className}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500 mr-1"></span>
            Escalated
          </span>
        );
      default:
        return (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wider bg-slate-100 text-slate-600 ${className}`}>
            {status}
          </span>
        );
    }
  }

  if (type === 'email_status') {
    const status = value as EmailStatus;
    switch (status) {
      case 'New':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-100">
            Unread
          </span>
        );
      case 'Investigating':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-100 italic">
            Investigating
          </span>
        );
      case 'Resolved':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wider bg-green-50 text-green-700 border border-green-100">
            Resolved
          </span>
        );
      case 'Escalated':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wider bg-slate-100 text-slate-600 border border-gray-200">
            Escalated
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wider bg-slate-100 text-slate-600">
            {status}
          </span>
        );
    }
  }

  if (type === 'risk') {
    const risk = value as RiskLevel;
    switch (risk) {
      case 'Low':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wider bg-green-50 text-green-700 border border-green-200">
            Low Risk
          </span>
        );
      case 'Medium':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
            Medium Risk
          </span>
        );
      case 'High':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wider bg-red-50 text-red-700 border border-red-200">
            High Risk
          </span>
        );
    }
  }

  if (type === 'confidence') {
    const conf = typeof value === 'number' ? value : parseInt(value, 10);
    const color = conf >= 85 ? 'text-green-700 bg-green-50 border-green-200' : conf >= 70 ? 'text-amber-700 bg-amber-50 border-amber-200' : 'text-slate-600 bg-slate-100 border-gray-200';
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded font-mono font-bold text-[10px] border ${color} ${className}`}>
        {conf}% confidence
      </span>
    );
  }

  if (type === 'source') {
    const status = value as string;
    if (status === 'Complete') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wider bg-green-50 text-green-700 border border-green-200">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1"></span>
          Complete
        </span>
      );
    }
    if (status === 'In Progress') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1"></span>
          Running
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wider bg-slate-100 text-slate-500 border border-gray-200">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-1"></span>
        Unavailable
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded font-medium text-xs bg-slate-100 text-slate-700 ${className}`}>
      {String(value)}
    </span>
  );
};
