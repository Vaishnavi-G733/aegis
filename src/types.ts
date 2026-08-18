export type Priority = 'Critical' | 'High' | 'Medium' | 'Low';

export type IncidentStatus = 
  | 'New'
  | 'Investigating'
  | 'Action Required'
  | 'Remediating'
  | 'Resolved'
  | 'Escalated';

export type EmailStatus = 'New' | 'Analyzed' | 'Investigating' | 'Resolved' | 'Escalated';

export type RiskLevel = 'Low' | 'Medium' | 'High';

export type ActionType = 'auto_remediation' | 'approval_required' | 'escalation_required';

export interface ActivityStep {
  id: string;
  step: string;
  status: 'completed' | 'in_progress' | 'pending';
  timestamp: string;
  detail?: string;
}

export interface TimelineEvent {
  time: string;
  title: string;
  description: string;
  type: 'deploy' | 'config' | 'error' | 'email' | 'system' | 'resolution';
}

export interface EvidenceItem {
  id: string;
  text: string;
  category: string;
  source: string;
  verified: boolean;
  rawSnippet?: string;
  meta?: Record<string, string>;
}

export interface EvidenceSource {
  name: string;
  status: 'Complete' | 'In Progress' | 'Unavailable' | 'Error';
  itemsFound: number;
  latencyMs: number;
  details: string;
  type: 'logs' | 'deploy' | 'config' | 'history' | 'kb' | 'metrics';
}

export interface RecommendedAction {
  title: string;
  risk: RiskLevel;
  confidence: number;
  expectedOutcome: string;
  requiresApproval: boolean;
  approvalReason?: string;
  remediationSteps: string[];
}

export interface EscalationPackage {
  summary: string;
  businessImpact: string;
  assignedTeam: string;
  confidence: number;
  rootCauseHypothesis: string;
  recommendedNextSteps: string[];
  slackChannel: string;
  pagerDutyService: string;
  ticketId: string;
}

export interface ResolutionDetails {
  resolvedAt: string;
  remediationExecuted: string;
  verificationPoints: string[];
  remediationDuration: string;
  resolvedBy: string;
}

export interface InvestigationData {
  status: 'idle' | 'investigating' | 'completed' | 'remediating' | 'resolved' | 'escalated';
  investigationProgress: number; // 0 to 100
  activitySteps: ActivityStep[];
  timeline: TimelineEvent[];
  rootCause: {
    title: string;
    confidence: number;
    summary: string;
    hypotheses?: Array<{ name: string; likelihood: number; reason: string }>;
  };
  evidence: EvidenceItem[];
  sourcesChecked: EvidenceSource[];
  actionType: ActionType;
  recommendedAction: RecommendedAction;
  escalationPackage?: EscalationPackage;
  executionSteps?: Array<{ step: string; status: 'completed' | 'running' | 'pending'; timestamp?: string }>;
  resolutionDetails?: ResolutionDetails;
  rawArtifacts?: {
    logs?: string[];
    configDiff?: {
      file: string;
      previous: string;
      current: string;
    };
    deployment?: {
      version: string;
      deployedAt: string;
      author: string;
      commitHash: string;
      changelog: string[];
    };
    historicalIncident?: {
      id: string;
      title: string;
      date: string;
      resolution: string;
      similarityScore: string;
    };
  };
}

export interface Incident {
  id: string;
  issueTitle: string;
  service: string;
  category: string;
  priority: Priority;
  status: IncidentStatus;
  owner: string;
  updated: string;
  createdAt: string;
  potentialImpact: string;
  emailId: string;
  investigationTime?: string;
  investigation: InvestigationData;
}

export interface SupportEmail {
  id: string;
  sender: string;
  senderEmail: string;
  department: string;
  subject: string;
  preview: string;
  body: string;
  receivedAt: string;
  priority: Priority;
  status: EmailStatus;
  linkedIncidentId: string;
  tags: string[];
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  category: string;
  lastUpdated: string;
  readTime: string;
  tags: string[];
  summary: string;
  content: string;
  relatedIncidents: string[];
}

export interface AegisActivityItem {
  id: string;
  incidentId: string;
  incidentTitle: string;
  action: string;
  timestamp: string;
  type: 'investigation' | 'root_cause' | 'remediation' | 'escalation' | 'alert';
}

export type ActiveView = 
  | 'dashboard'
  | 'inbox'
  | 'email_detail'
  | 'incidents'
  | 'investigation'
  | 'investigations_list'
  | 'knowledge_base';
