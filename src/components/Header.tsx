import React, { useState } from 'react';
import { Search, Bell, Plus, RefreshCw, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { ActiveView } from '../types';

interface HeaderProps {
  currentView: ActiveView;
  pageTitle: string;
  breadcrumb?: string;
  onSearch: (query: string) => void;
  onOpenSimulateModal: () => void;
  onResetData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  pageTitle,
  breadcrumb = 'Support Operations',
  onSearch,
  onOpenSimulateModal,
  onResetData
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    {
      id: 'n1',
      title: 'INC-1042 Root Cause Identified',
      time: '2m ago',
      unread: true,
      type: 'success'
    },
    {
      id: 'n2',
      title: 'INC-1043 Requires Human Approval',
      time: '14m ago',
      unread: true,
      type: 'warning'
    },
    {
      id: 'n3',
      title: 'INC-1051 Escalation Package Created',
      time: '19m ago',
      unread: false,
      type: 'info'
    }
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <header 
      id="aegis-header"
      className="h-14 border-b border-gray-100 flex items-center justify-between px-8 bg-white sticky top-0 z-10 select-none shrink-0"
    >
      {/* Left: Breadcrumb */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-slate-400">{breadcrumb}</span>
        <span className="text-slate-300">/</span>
        <h2 className="text-sm font-semibold text-slate-900">{pageTitle}</h2>
      </div>

      {/* Right: Search, Simulate Action, Notifications, Reset */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative">
          <div className="h-8 w-64 bg-slate-50 border border-gray-200 rounded px-3 flex items-center">
            <Search className="w-3.5 h-3.5 text-slate-400 mr-2 shrink-0 pointer-events-none" />
            <input
              id="global-search-input"
              type="text"
              placeholder="Search incidents, logs, documentation..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full text-[11px] bg-transparent text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  onSearch('');
                }}
                className="text-slate-400 hover:text-slate-600 ml-1"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Simulate New Email */}
        <button
          id="btn-simulate-email"
          onClick={onOpenSimulateModal}
          className="h-8 px-2.5 bg-white hover:bg-slate-50 border border-gray-200 rounded text-xs font-medium text-slate-700 flex items-center gap-1 transition-colors cursor-pointer"
          title="Simulate incoming customer support email"
        >
          <Plus className="w-3.5 h-3.5 text-slate-500" />
          <span>Simulate Email</span>
        </button>

        {/* Reset State Button */}
        <button
          id="btn-reset-data"
          onClick={onResetData}
          className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded transition-colors cursor-pointer"
          title="Reset demo data"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            id="btn-notifications"
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded transition-colors cursor-pointer relative"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded shadow-md z-30 py-2 text-xs">
              <div className="px-3 py-1.5 border-b border-gray-100 flex items-center justify-between font-medium text-slate-700">
                <span>Autonomous Alerts</span>
                <span className="text-[10px] text-slate-400">Live Stream</span>
              </div>
              <div className="divide-y divide-gray-50 max-h-60 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="p-3 hover:bg-slate-50 flex items-start space-x-2">
                    {n.type === 'success' && <CheckCircle2 className="w-3.5 h-3.5 text-green-600 mt-0.5 shrink-0" />}
                    {n.type === 'warning' && <AlertCircle className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />}
                    {n.type === 'info' && <AlertCircle className="w-3.5 h-3.5 text-slate-500 mt-0.5 shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-slate-900">{n.title}</div>
                      <div className="text-[10px] text-slate-400">{n.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
