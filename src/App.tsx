/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  INITIAL_INCIDENTS, 
  INITIAL_EMAILS, 
  INITIAL_KNOWLEDGE_ARTICLES, 
  INITIAL_ACTIVITY 
} from './data/mockData';
import { 
  Incident, 
  SupportEmail, 
  KnowledgeArticle, 
  AegisActivityItem, 
  ActiveView 
} from './types';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ToastContainer, ToastMessage } from './components/Toast';
import { SimulateEmailModal } from './components/SimulateEmailModal';

import { DashboardView } from './views/DashboardView';
import { SupportInboxView } from './views/SupportInboxView';
import { EmailDetailView } from './views/EmailDetailView';
import { InvestigationView } from './views/InvestigationView';
import { InvestigationsListView } from './views/InvestigationsListView';
import { IncidentsView } from './views/IncidentsView';
import { KnowledgeBaseView } from './views/KnowledgeBaseView';

export default function App() {
  const [incidents, setIncidents] = useState<Incident[]>(INITIAL_INCIDENTS);
  const [emails, setEmails] = useState<SupportEmail[]>(INITIAL_EMAILS);
  const [activityLogs, setActivityLogs] = useState<AegisActivityItem[]>(INITIAL_ACTIVITY);
  const [knowledgeArticles] = useState<KnowledgeArticle[]>(INITIAL_KNOWLEDGE_ARTICLES);

  const [currentView, setCurrentView] = useState<ActiveView>('dashboard');
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>('INC-1042');
  const [selectedEmailId, setSelectedEmailId] = useState<string>('EML-8901');

  const [isSimulateModalOpen, setIsSimulateModalOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Toast Helper
  const showToast = (type: 'success' | 'warning' | 'info' | 'error', title: string, message?: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Reset to initial state
  const handleResetData = () => {
    setIncidents(INITIAL_INCIDENTS);
    setEmails(INITIAL_EMAILS);
    setActivityLogs(INITIAL_ACTIVITY);
    setCurrentView('dashboard');
    showToast('info', 'Demo State Reset', 'Restored initial mock incidents and support inbox.');
  };

  // View Navigation
  const handleNavigate = (view: ActiveView) => {
    setCurrentView(view);
  };

  // Select an Incident to view in Investigation
  const handleSelectIncident = (incidentId: string) => {
    setSelectedIncidentId(incidentId);
    setCurrentView('investigation');
  };

  // Select an Email to view in Detail
  const handleSelectEmail = (emailId: string) => {
    setSelectedEmailId(emailId);
    const linkedEmail = emails.find((e) => e.id === emailId);
    if (linkedEmail) {
      setSelectedIncidentId(linkedEmail.linkedIncidentId);
    }
    setCurrentView('email_detail');
  };

  // Trigger "Analyze with Aegis"
  const handleAnalyzeIncident = (incidentId: string) => {
    setSelectedIncidentId(incidentId);
    
    // Update status to Investigating if New
    setIncidents((prev) =>
      prev.map((inc) => {
        if (inc.id === incidentId && inc.status === 'New') {
          return {
            ...inc,
            status: 'Investigating',
            investigation: {
              ...inc.investigation,
              status: 'completed',
              investigationProgress: 100,
              activitySteps: inc.investigation.activitySteps.map((s) => ({ ...s, status: 'completed' })),
              sourcesChecked: inc.investigation.sourcesChecked.map((src) => ({ ...src, status: 'Complete', itemsFound: 4, latencyMs: 240 }))
            }
          };
        }
        return inc;
      })
    );

    // Add activity log
    const inc = incidents.find((i) => i.id === incidentId);
    if (inc) {
      setActivityLogs((prev) => [
        {
          id: `act-${Date.now()}`,
          incidentId: inc.id,
          incidentTitle: inc.issueTitle,
          action: `Aegis autonomous investigation initiated for ${inc.service}`,
          timestamp: 'Just now',
          type: 'investigation'
        },
        ...prev
      ]);
    }

    setCurrentView('investigation');
    showToast('info', 'Investigation Started', `Aegis is diagnosing root cause for ${incidentId}...`);
  };

  // Execute Auto-Remediation
  const handleExecuteRemediation = (incidentId: string) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setIncidents((prev) =>
      prev.map((inc) => {
        if (inc.id === incidentId) {
          return {
            ...inc,
            status: 'Resolved',
            updated: 'Just now',
            investigation: {
              ...inc.investigation,
              status: 'resolved',
              resolutionDetails: {
                resolvedAt: `Today, ${timeStr}`,
                remediationExecuted: inc.investigation.recommendedAction.title,
                verificationPoints: [
                  'Service healthcheck probe responding HTTP 200 OK',
                  'Orphaned worker lock table flushed & sanitized',
                  'Downstream reconciliation jobs processing at 145/min',
                  'Resolution signature logged for autonomous matching'
                ],
                remediationDuration: inc.investigationTime || '2m 14s',
                resolvedBy: 'Aegis Autonomous Engine'
              }
            }
          };
        }
        return inc;
      })
    );

    // Update corresponding email status
    const linkedInc = incidents.find((i) => i.id === incidentId);
    if (linkedInc) {
      setEmails((prev) =>
        prev.map((e) => (e.id === linkedInc.emailId ? { ...e, status: 'Resolved' } : e))
      );

      // Add to activity log
      setActivityLogs((prev) => [
        {
          id: `act-${Date.now()}`,
          incidentId: linkedInc.id,
          incidentTitle: linkedInc.issueTitle,
          action: `Remediation executed & verified: ${linkedInc.investigation.recommendedAction.title}`,
          timestamp: 'Just now',
          type: 'remediation'
        },
        ...prev
      ]);
    }

    showToast('success', 'Incident Resolved', `${incidentId} verified healthy and resolution recorded.`);
  };

  // Approve and Execute Remediation (Human Approval flow)
  const handleApproveRemediation = (incidentId: string) => {
    handleExecuteRemediation(incidentId);
    showToast('success', 'Approved & Executed', `Human approval recorded for ${incidentId}. Service recycled.`);
  };

  // Escalate to Engineering Team
  const handleEscalateToTeam = (incidentId: string) => {
    const inc = incidents.find((i) => i.id === incidentId);
    const assignedTeam = inc?.investigation.escalationPackage?.assignedTeam || inc?.owner || 'Database Engineering Team';

    setIncidents((prev) =>
      prev.map((i) => {
        if (i.id === incidentId) {
          return {
            ...i,
            status: 'Escalated',
            updated: 'Just now',
            investigation: {
              ...i.investigation,
              status: 'escalated'
            }
          };
        }
        return i;
      })
    );

    if (inc) {
      setEmails((prev) =>
        prev.map((e) => (e.id === inc.emailId ? { ...e, status: 'Escalated' } : e))
      );

      setActivityLogs((prev) => [
        {
          id: `act-${Date.now()}`,
          incidentId: inc.id,
          incidentTitle: inc.issueTitle,
          action: `Escalation package dispatched to ${assignedTeam}`,
          timestamp: 'Just now',
          type: 'escalation'
        },
        ...prev
      ]);
    }

    showToast('warning', 'Escalation Dispatched', `Diagnostics & ticket transferred to ${assignedTeam}.`);
  };

  // Inject New Simulated Email
  const handleInjectEmail = (newEmail: SupportEmail, newIncident: Incident) => {
    setEmails((prev) => [newEmail, ...prev]);
    setIncidents((prev) => [newIncident, ...prev]);
    setSelectedEmailId(newEmail.id);
    setSelectedIncidentId(newIncident.id);

    setActivityLogs((prev) => [
      {
        id: `act-${Date.now()}`,
        incidentId: newIncident.id,
        incidentTitle: newIncident.issueTitle,
        action: `Support email ingested from ${newEmail.sender}`,
        timestamp: 'Just now',
        type: 'alert'
      },
      ...prev
    ]);

    setCurrentView('inbox');
    showToast('info', 'New Support Email Received', `Ingested "${newEmail.subject}" from ${newEmail.sender}`);
  };

  // Active items lookup
  const selectedIncident = incidents.find((i) => i.id === selectedIncidentId) || incidents[0];
  const selectedEmail = emails.find((e) => e.id === selectedEmailId) || emails[0];

  const unreadEmailCount = emails.filter((e) => e.status === 'New').length;
  const openIncidentsCount = incidents.filter((i) => i.status !== 'Resolved').length;
  const activeInvestigationsCount = incidents.filter((i) => i.status === 'Investigating' || i.status === 'Action Required').length;

  // Header Title & Breadcrumb Helper
  const getHeaderDetails = () => {
    switch (currentView) {
      case 'dashboard':
        return { title: 'Support Operations', breadcrumb: 'AEGIS / Console' };
      case 'inbox':
        return { title: 'Support Inbox', breadcrumb: 'AEGIS / Ingestion' };
      case 'email_detail':
        return { title: `Support Email — ${selectedEmail?.sender || 'Detail'}`, breadcrumb: `AEGIS / Inbox / ${selectedEmail?.id}` };
      case 'incidents':
        return { title: 'Incidents Directory', breadcrumb: 'AEGIS / Operations' };
      case 'investigation':
        return { title: `Investigation — ${selectedIncident?.id}`, breadcrumb: `AEGIS / Root Cause Analysis / ${selectedIncident?.id}` };
      case 'investigations_list':
        return { title: 'Investigations Log', breadcrumb: 'AEGIS / Analytics' };
      case 'knowledge_base':
        return { title: 'Knowledge Base & Runbooks', breadcrumb: 'AEGIS / Knowledge Retrieval' };
      default:
        return { title: 'Support Operations', breadcrumb: 'AEGIS' };
    }
  };

  const { title: pageTitle, breadcrumb } = getHeaderDetails();

  return (
    <div className="min-h-screen bg-white text-slate-900 flex font-sans antialiased">
      {/* Left Persistent Sidebar */}
      <Sidebar
        currentView={currentView}
        onNavigate={handleNavigate}
        unreadEmailCount={unreadEmailCount}
        openIncidentsCount={openIncidentsCount}
        activeInvestigationsCount={activeInvestigationsCount}
      />

      {/* Main App Container */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Top Header */}
        <Header
          currentView={currentView}
          pageTitle={pageTitle}
          breadcrumb={breadcrumb}
          onSearch={(q) => {
            if (q.trim() && currentView === 'dashboard') {
              setCurrentView('incidents');
            }
          }}
          onOpenSimulateModal={() => setIsSimulateModalOpen(true)}
          onResetData={handleResetData}
        />

        {/* Dynamic Main View */}
        <main className="flex-1 pb-16">
          {currentView === 'dashboard' && (
            <DashboardView
              incidents={incidents}
              activityLogs={activityLogs}
              onSelectIncident={handleSelectIncident}
              onNavigate={handleNavigate}
              onAnalyzeIncident={handleAnalyzeIncident}
            />
          )}

          {currentView === 'inbox' && (
            <SupportInboxView
              emails={emails}
              onSelectEmail={handleSelectEmail}
              onAnalyzeEmail={(emailId) => {
                handleSelectEmail(emailId);
                const em = emails.find((e) => e.id === emailId);
                if (em) {
                  handleAnalyzeIncident(em.linkedIncidentId);
                }
              }}
            />
          )}

          {currentView === 'email_detail' && (
            <EmailDetailView
              email={selectedEmail}
              incident={selectedIncident}
              onBack={() => setCurrentView('inbox')}
              onAnalyzeWithAegis={handleAnalyzeIncident}
            />
          )}

          {currentView === 'investigation' && (
            <InvestigationView
              incident={selectedIncident}
              onBack={() => setCurrentView('dashboard')}
              onExecuteRemediation={handleExecuteRemediation}
              onApproveRemediation={handleApproveRemediation}
              onEscalateToTeam={handleEscalateToTeam}
            />
          )}

          {currentView === 'investigations_list' && (
            <InvestigationsListView
              incidents={incidents}
              onSelectInvestigation={handleSelectIncident}
            />
          )}

          {currentView === 'incidents' && (
            <IncidentsView
              incidents={incidents}
              onSelectIncident={handleSelectIncident}
              onAnalyzeIncident={handleAnalyzeIncident}
            />
          )}

          {currentView === 'knowledge_base' && (
            <KnowledgeBaseView
              articles={knowledgeArticles}
              onSelectIncident={handleSelectIncident}
            />
          )}
        </main>
      </div>

      {/* Global Modals & Notifications */}
      <SimulateEmailModal
        isOpen={isSimulateModalOpen}
        onClose={() => setIsSimulateModalOpen(false)}
        onInjectEmail={handleInjectEmail}
      />

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
