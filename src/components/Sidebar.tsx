import React from 'react';
import { 
  LayoutDashboard, 
  Inbox, 
  AlertTriangle, 
  Cpu, 
  BookOpen, 
  Sparkles
} from 'lucide-react';
import { ActiveView } from '../types';

interface SidebarProps {
  currentView: ActiveView;
  onNavigate: (view: ActiveView) => void;
  unreadEmailCount: number;
  openIncidentsCount: number;
  activeInvestigationsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  unreadEmailCount,
  openIncidentsCount,
  activeInvestigationsCount
}) => {
  const navItems = [
    {
      id: 'dashboard' as ActiveView,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'inbox' as ActiveView,
      label: 'Support Inbox',
      icon: Inbox,
      badge: unreadEmailCount > 0 ? unreadEmailCount : null
    },
    {
      id: 'incidents' as ActiveView,
      label: 'Incidents',
      icon: AlertTriangle,
      badge: openIncidentsCount > 0 ? openIncidentsCount : null
    },
    {
      id: 'investigations_list' as ActiveView,
      label: 'Investigations',
      icon: Cpu,
      badge: activeInvestigationsCount > 0 ? 'Active' : null,
      badgeColor: 'bg-amber-50 text-amber-700'
    },
    {
      id: 'knowledge_base' as ActiveView,
      label: 'Knowledge Base',
      icon: BookOpen,
      badge: null
    }
  ];

  return (
    <aside 
      id="aegis-sidebar"
      className="w-64 border-r border-gray-100 flex flex-col justify-between h-screen sticky top-0 select-none z-20 shrink-0 bg-white"
    >
      <div>
        {/* Logo & Header */}
        <div className="p-6 mb-2">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 bg-slate-900 rounded-sm flex items-center justify-center">
              <span className="text-white text-[10px] font-bold">A</span>
            </div>
            <h1 className="font-bold text-xl tracking-tight text-slate-900">AEGIS</h1>
          </div>
          <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">
            Autonomous Support Engineer
          </p>
        </div>

        {/* Navigation */}
        <nav className="px-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id || 
              (item.id === 'inbox' && currentView === 'email_detail') ||
              (item.id === 'investigations_list' && currentView === 'investigation');

            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors text-left ${
                  isActive
                    ? 'bg-slate-50 text-slate-900 font-semibold'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 cursor-pointer'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-slate-900' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== null && (
                  <span
                    className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-slate-200 text-slate-900'
                        : item.badgeColor || 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Autonomous Engine Policy Card */}
        <div className="px-4 mt-6">
          <div className="p-3 bg-slate-50 rounded border border-gray-100">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 mb-1">
              <span className="flex items-center">
                <Sparkles className="w-3 h-3 mr-1 text-slate-900" />
                Policy Engine
              </span>
              <span className="font-mono text-[9px] uppercase px-1.5 py-0.2 bg-white rounded border border-gray-200 text-blue-600">
                Active
              </span>
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed">
              Confidence &gt; 85% &amp; Low Risk triggers autonomous remediation.
            </p>
          </div>
        </div>
      </div>

      {/* Footer / System Status & User Profile */}
      <div className="p-6 border-t border-gray-100 bg-white">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-xs font-medium text-slate-600">System: Operational</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs text-slate-700">
            SE
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-900">Support Engineer</span>
            <span className="text-[10px] text-slate-400">Ops-Tier 3</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
