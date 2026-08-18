import { Incident, SupportEmail, KnowledgeArticle, AegisActivityItem } from '../types';

export const INITIAL_INCIDENTS: Incident[] = [
  {
    id: 'INC-1042',
    issueTitle: 'Cash reconciliation failure',
    service: 'ETL Scheduler',
    category: 'Deployment & Data Sync',
    priority: 'High',
    status: 'Investigating',
    owner: 'Cash Management',
    updated: '2 min ago',
    createdAt: '10:45 AM',
    potentialImpact: '247 reports delayed',
    emailId: 'EML-8901',
    investigationTime: '2m 14s',
    investigation: {
      status: 'completed',
      investigationProgress: 100,
      activitySteps: [
        { id: '1', step: 'Parsed support email', status: 'completed', timestamp: '10:45:02 AM', detail: 'Extracted: ETL failure, cash reconciliation missing data, post-release' },
        { id: '2', step: 'Identified affected service: ETL Scheduler', status: 'completed', timestamp: '10:45:08 AM', detail: 'Mapped to service registry cluster `prod-us-etl-scheduler-04`' },
        { id: '3', step: 'Classified priority: High', status: 'completed', timestamp: '10:45:11 AM', detail: 'SLA threshold breach detected for financial reconciliation' },
        { id: '4', step: 'Searching application logs', status: 'completed', timestamp: '10:45:19 AM', detail: 'Queried 85,000 log events in past 60 minutes' },
        { id: '5', step: 'Found 15 ETL failures', status: 'completed', timestamp: '10:45:26 AM', detail: 'ErrorCode: ERR_DB_LOCK_TIMEOUT on table `daily_cash_ledger_partition`' },
        { id: '6', step: 'Checking deployment history', status: 'completed', timestamp: '10:45:34 AM', detail: 'Found deployment 5.4.12 released today at 10:31 AM by ReleaseBot' },
        { id: '7', step: 'Comparing configuration', status: 'completed', timestamp: '10:45:42 AM', detail: 'Detected parameter drift in `etl-worker-v5.4.12.yaml`' },
        { id: '8', step: 'Searching previous incidents', status: 'completed', timestamp: '10:45:51 AM', detail: 'Matched incident repository vectors' },
        { id: '9', step: 'Similar incident INC-4821 found', status: 'completed', timestamp: '10:45:58 AM', detail: '94% cosine similarity on lock acquisition timeout pattern' },
        { id: '10', step: 'Correlating evidence', status: 'completed', timestamp: '10:46:04 AM', detail: '4 deterministic correlation vectors aligned' },
        { id: '11', step: 'Root cause identified', status: 'completed', timestamp: '10:46:12 AM', detail: 'Configuration mismatch introduced in release 5.4.12' }
      ],
      timeline: [
        { time: '10:31 AM', title: 'Deployment 5.4.12 completed', description: 'ETL Scheduler deployment rollout to production cluster nodes', type: 'deploy' },
        { time: '10:37 AM', title: 'Configuration activated', description: 'Updated batch chunk size parameter applied across workers', type: 'config' },
        { time: '10:39 AM', title: 'First ETL failure detected', description: 'Job #84912 failed with ERR_DB_LOCK_TIMEOUT', type: 'error' },
        { time: '10:42 AM', title: 'Error spike detected', description: '15 sequential batch lock failures registered across Cash Operations', type: 'error' },
        { time: '10:45 AM', title: 'Support email received', description: 'Cash Operations reported missing reconciliation data', type: 'email' },
        { time: '10:46 AM', title: 'Similar historical incident identified', description: 'Aegis linked failure signature with INC-4821', type: 'system' }
      ],
      rootCause: {
        title: 'Configuration mismatch introduced in release 5.4.12',
        confidence: 91,
        summary: 'Release 5.4.12 increased `batch_chunk_size` from 5,000 to 50,000 without increasing Postgres lock acquisition timeout (`lock_timeout_ms: 3000`). This causes workers to hold table partition locks excessively, resulting in deadlocked worker threads in the ETL Scheduler queue.',
        hypotheses: [
          { name: 'Chunk size parameter mismatch', likelihood: 91, reason: 'Log traces show thread contention immediately following v5.4.12 configuration rollout.' },
          { name: 'Database network latency spike', likelihood: 7, reason: 'Database cluster telemetry shows normal ping latencies (<1.2ms).' },
          { name: 'Upstream data corruption', likelihood: 2, reason: 'Input transaction payload checksums pass schema validation.' }
        ]
      },
      evidence: [
        { id: 'ev-1', text: 'ETL failures began 8 minutes after deployment', category: 'Temporal Correlation', source: 'Deployment & Error logs', verified: true, rawSnippet: '2026-08-18 10:39:14.204 [etl-worker-02] ERROR c.n.e.SchedulerJob - Task id=84912 aborted: lock acquisition exceeded 3000ms' },
        { id: 'ev-2', text: 'Configuration changed in release 5.4.12', category: 'Config Drift', source: 'GitOps Repository', verified: true, rawSnippet: '- batch_chunk_size: 5000\n+ batch_chunk_size: 50000\n  lock_timeout_ms: 3000' },
        { id: 'ev-3', text: '15 failed ETL jobs detected', category: 'Metric Telemetry', source: 'Application Logs', verified: true, rawSnippet: 'Count(ERR_DB_LOCK_TIMEOUT) = 15 between 10:39:00 and 10:45:00 UTC' },
        { id: 'ev-4', text: 'Historical incident INC-4821 had the same failure pattern', category: 'Knowledge Base & History', source: 'Incident Archive', verified: true, rawSnippet: 'INC-4821 (May 14, 2025): Resolved by resetting worker lock table and restarting scheduler with fallback chunk size' }
      ],
      sourcesChecked: [
        { name: 'Application Logs', status: 'Complete', itemsFound: 15, latencyMs: 340, details: 'Queried `prod-etl-scheduler-*` index', type: 'logs' },
        { name: 'Deployment History', status: 'Complete', itemsFound: 3, latencyMs: 180, details: 'Retrieved v5.4.12 release tag metadata', type: 'deploy' },
        { name: 'Configuration', status: 'Complete', itemsFound: 1, latencyMs: 220, details: 'Compared `etl-worker.yaml` diff', type: 'config' },
        { name: 'Previous Incidents', status: 'Complete', itemsFound: 4, latencyMs: 510, details: 'Vector query matched INC-4821', type: 'history' },
        { name: 'Knowledge Base', status: 'Complete', itemsFound: 2, latencyMs: 290, details: 'Found KB-0041 (ETL Deadlock Recovery)', type: 'kb' },
        { name: 'Monitoring', status: 'Unavailable', itemsFound: 0, latencyMs: 0, details: 'APM Prometheus agent endpoint timed out (non-blocking)', type: 'metrics' }
      ],
      actionType: 'auto_remediation',
      recommendedAction: {
        title: 'Restart ETL Scheduler',
        risk: 'Low',
        confidence: 94,
        expectedOutcome: 'Resume queued reconciliation jobs and restore report generation with safe fallback batch parameters.',
        requiresApproval: false,
        remediationSteps: [
          'Validating action against safety boundaries',
          'Flushing corrupted lock table `etl_scheduler_locks`',
          'Restarting ETL Scheduler service pods',
          'Checking service health & heartbeat endpoint',
          'Checking job queue ingestion rate',
          'Monitoring error rate and report output'
        ]
      },
      rawArtifacts: {
        logs: [
          '2026-08-18 10:31:02.110 [deploy-runner] Deployment 5.4.12 rollout initiated by ReleaseBot',
          '2026-08-18 10:37:44.821 [config-mgr] Applied updated config map: etl-worker-v5.4.12.yaml',
          '2026-08-18 10:39:14.204 [etl-worker-02] ERROR c.n.e.SchedulerJob - Task id=84912 aborted: lock acquisition exceeded 3000ms',
          '2026-08-18 10:40:01.002 [etl-worker-01] ERROR c.n.e.SchedulerJob - Task id=84913 lock contention timeout on daily_cash_ledger',
          '2026-08-18 10:41:22.918 [etl-worker-04] WARN c.n.e.WorkerPool - 4 workers stalled waiting on table partition locks',
          '2026-08-18 10:44:59.431 [etl-scheduler] FATAL c.n.e.QueueManager - Job queue backlog exceeded SLA (15 unhandled tasks)'
        ],
        configDiff: {
          file: 'deploy/helm/etl-scheduler/values-prod.yaml',
          previous: 'etl:\n  batch_chunk_size: 5000\n  worker_concurrency: 8\n  lock_timeout_ms: 3000\n  retry_backoff_sec: 15',
          current: 'etl:\n  batch_chunk_size: 50000  # <--- CRITICAL DRIFT\n  worker_concurrency: 8\n  lock_timeout_ms: 3000\n  retry_backoff_sec: 15'
        },
        deployment: {
          version: '5.4.12',
          deployedAt: 'Today, 10:31 AM',
          author: 'ci-bot@internal.ncr-atleos.com',
          commitHash: '7f92a41d (Merge PR #1428: Optimize reconciliation batch throughput)',
          changelog: [
            'feat(etl): increase batch processing chunk size to 50k for Q3 volume',
            'fix(api): update healthcheck endpoint response format',
            'chore: bump base alpine container image'
          ]
        },
        historicalIncident: {
          id: 'INC-4821',
          title: 'Cash reconciliation batch timeout after chunk parameter tweak',
          date: 'May 14, 2025',
          resolution: 'Service restarted with automated lock flush; fallback chunk size 5,000 restored. Reconciliation resumed normally within 3 minutes.',
          similarityScore: '94% match'
        }
      }
    }
  },
  {
    id: 'INC-1043',
    issueTitle: 'ATM transaction timeout',
    service: 'Transaction API',
    category: 'Payments Platform',
    priority: 'High',
    status: 'Action Required',
    owner: 'Payments Platform',
    updated: '14 min ago',
    createdAt: '10:31 AM',
    potentialImpact: 'Intermittent timeouts on 120 West Coast ATM terminals',
    emailId: 'EML-8902',
    investigationTime: '1m 48s',
    investigation: {
      status: 'completed',
      investigationProgress: 100,
      activitySteps: [
        { id: '1', step: 'Parsed support email', status: 'completed', timestamp: '10:31:05 AM', detail: 'Identified ATM dispense timeout reports' },
        { id: '2', step: 'Identified affected service: Transaction API', status: 'completed', timestamp: '10:31:12 AM', detail: 'Mapped to service gateway `edge-atm-tx-gw-uswest`' },
        { id: '3', step: 'Classified priority: High', status: 'completed', timestamp: '10:31:16 AM', detail: 'Financial transaction completion impacted' },
        { id: '4', step: 'Searching application logs', status: 'completed', timestamp: '10:31:24 AM', detail: 'Found socket hang-up on TCP pool to upstream switch' },
        { id: '5', step: 'Checking connection pool metrics', status: 'completed', timestamp: '10:31:35 AM', detail: 'Connection pool saturation reached 98.4%' },
        { id: '6', step: 'Correlating evidence', status: 'completed', timestamp: '10:31:48 AM', detail: 'Identified zombie TCP sockets holding connection slots' },
        { id: '7', step: 'Root cause identified', status: 'completed', timestamp: '10:31:59 AM', detail: 'Upstream gateway socket leak in Region US-West' }
      ],
      timeline: [
        { time: '10:15 AM', title: 'Upstream switch route flap', description: 'Network switch flap triggered ungraceful TCP termination', type: 'system' },
        { time: '10:22 AM', title: 'Connection pool accumulation', description: 'Transaction API pool filled with orphaned CLOSE_WAIT sockets', type: 'error' },
        { time: '10:28 AM', title: 'ATM terminals timeout', description: 'New dispense authorizations timed out (>15,000ms)', type: 'error' },
        { time: '10:31 AM', title: 'Support email received', description: 'ATM Operations alerted engineering', type: 'email' }
      ],
      rootCause: {
        title: 'TCP socket pool exhaustion on US-West ATM Gateway',
        confidence: 88,
        summary: 'A network route flap at 10:15 AM left 450 orphaned TCP connections in CLOSE_WAIT state. As a result, the active connection pool reached max capacity (500/500), forcing subsequent ATM dispense authorization calls to time out.',
        hypotheses: [
          { name: 'Gateway socket pool exhaustion', likelihood: 88, reason: 'Socket stats show 450 CLOSE_WAIT handles that failed keep-alive pruning.' },
          { name: 'Core banking backend outage', likelihood: 9, reason: 'Direct backend healthchecks in US-East are 100% responding.' },
          { name: 'ATM firmware bug', likelihood: 3, reason: 'Affected terminals span 6 distinct hardware and firmware revisions.' }
        ]
      },
      evidence: [
        { id: 'ev-201', text: '450 orphaned connections stuck in CLOSE_WAIT', category: 'Socket Telemetry', source: 'Gateway Netstat', verified: true, rawSnippet: 'tcp 450 0 10.240.12.88:8443 10.12.0.4:443 CLOSE_WAIT' },
        { id: 'ev-202', text: 'Response latency spiked from 120ms to 15,200ms', category: 'Latency Metric', source: 'Edge Metrics', verified: true, rawSnippet: 'p99_latency_ms: 15240 (threshold: 800ms)' },
        { id: 'ev-203', text: 'Healthcheck endpoint returning 503 Service Unavailable', category: 'Health Probes', source: 'Kubelet Probe', verified: true, rawSnippet: 'Liveness probe failed: HTTP 503 on /health/pool' }
      ],
      sourcesChecked: [
        { name: 'Application Logs', status: 'Complete', itemsFound: 8, latencyMs: 280, details: 'Analyzed ATM gateway pod logs', type: 'logs' },
        { name: 'Deployment History', status: 'Complete', itemsFound: 0, latencyMs: 110, details: 'No deployments in past 48 hours', type: 'deploy' },
        { name: 'Configuration', status: 'Complete', itemsFound: 2, latencyMs: 140, details: 'Verified keepalive timeouts', type: 'config' },
        { name: 'Previous Incidents', status: 'Complete', itemsFound: 1, latencyMs: 310, details: 'Matched INC-3910 socket leak', type: 'history' },
        { name: 'Knowledge Base', status: 'Complete', itemsFound: 1, latencyMs: 210, details: 'Found KB-0012 (ATM Gateway Recovery)', type: 'kb' },
        { name: 'Monitoring', status: 'Complete', itemsFound: 4, latencyMs: 190, details: 'Prometheus socket pool metrics verified', type: 'metrics' }
      ],
      actionType: 'approval_required',
      recommendedAction: {
        title: 'Drain & Recycle ATM Gateway Pods',
        risk: 'Medium',
        confidence: 88,
        expectedOutcome: 'Gracefully drain active terminal sessions, recycle pod connection pool, and re-establish fresh TCP connections to core switch.',
        requiresApproval: true,
        approvalReason: 'This action may affect active production workloads and terminate in-flight terminal handshakes for approximately 4-8 seconds during pod rollover.',
        remediationSteps: [
          'Trigger connection drain on `edge-atm-tx-gw-uswest`',
          'Route new traffic to standby gateway cluster `edge-atm-tx-gw-secondary`',
          'Recycle and restart US-West gateway pods',
          'Validate TCP connection pool health (<15% utilization)',
          'Restore primary traffic distribution',
          'Verify terminal dispense latency drops below 200ms'
        ]
      }
    }
  },
  {
    id: 'INC-1051',
    issueTitle: 'Core ledger settlement deadlocks',
    service: 'Database Cluster',
    category: 'Database Infrastructure',
    priority: 'Critical',
    status: 'Escalated',
    owner: 'Database Engineering Team',
    updated: '8 min ago',
    createdAt: '10:18 AM',
    potentialImpact: 'Multi-region settlement pipeline halted; potential financial discrepancy',
    emailId: 'EML-8903',
    investigationTime: '3m 05s',
    investigation: {
      status: 'escalated',
      investigationProgress: 100,
      activitySteps: [
        { id: '1', step: 'Parsed support email', status: 'completed', timestamp: '10:18:02 AM', detail: 'Received high-priority alert regarding ledger settlement deadlock' },
        { id: '2', step: 'Identified affected service: Database Cluster', status: 'completed', timestamp: '10:18:07 AM', detail: 'Cluster: `db-ledger-primary-aurora`' },
        { id: '3', step: 'Classified priority: Critical', status: 'completed', timestamp: '10:18:10 AM', detail: 'Direct impact on regulatory settlement accounting' },
        { id: '4', step: 'Searching database engine logs', status: 'completed', timestamp: '10:18:25 AM', detail: 'Found recurring deadlock graph across 3 write transactions' },
        { id: '5', step: 'Evaluating autonomous remediation safety', status: 'completed', timestamp: '10:18:40 AM', detail: 'Confidence score (64%) below automated threshold (85%)' },
        { id: '6', step: 'Human intervention required', status: 'completed', timestamp: '10:18:55 AM', detail: 'Conflicting evidence between index corruption vs uncommitted write lock' },
        { id: '7', step: 'Created escalation package', status: 'completed', timestamp: '10:19:10 AM', detail: 'Assembled full diagnostic bundle for Database Engineering' }
      ],
      timeline: [
        { time: '10:05 AM', title: 'Batch settlement run initiated', description: 'Automated 10:00 AM settlement batch #9921 started', type: 'system' },
        { time: '10:12 AM', title: 'First transaction deadlock', description: 'Transaction #49021 aborted by PostgreSQL deadlock detector', type: 'error' },
        { time: '10:15 AM', title: 'Replication lag increased', description: 'Replica lag jumped to 420 seconds', type: 'error' },
        { time: '10:18 AM', title: 'Support email received', description: 'Core Treasury Team reported settlement failure', type: 'email' },
        { time: '10:19 AM', title: 'Aegis escalated to DB Engineering', description: 'Confidence 64% - Automated execution halted to protect ledger integrity', type: 'system' }
      ],
      rootCause: {
        title: 'Database connection pool exhaustion and conflicting transaction locks',
        confidence: 64,
        summary: 'Aegis found conflicting diagnostic evidence between a circular deadlock on `ledger_entries_partition_2026_q3` and an unindexed foreign key lock on `account_balances`. Because automated recovery poses data integrity risks, human engineering intervention is required.',
        hypotheses: [
          { name: 'Circular foreign key deadlock', likelihood: 64, reason: 'Deadlock graph indicates simultaneous updates on `account_balances` in opposing lock order.' },
          { name: 'Disk I/O stall on primary storage volume', likelihood: 24, reason: 'EBS volume burst balance dropped to 18% during peak sync.' },
          { name: 'Replication stream corruption', likelihood: 12, reason: 'WAL sender threads show elevated catchup times.' }
        ]
      },
      evidence: [
        { id: 'ev-301', text: 'Deadlock detected: Process 4122 waits on ExclusiveLock on tuple (48,12)', category: 'DB Engine Log', source: 'Aurora Postgres Engine Log', verified: true, rawSnippet: 'DETAIL: Process 4122 waits for ExclusiveLock on tuple (48,12) of relation 16402; blocked by process 4129.' },
        { id: 'ev-302', text: 'Conflicting evidence: I/O latency spike coincided with lock graph', category: 'Storage Metric', source: 'CloudWatch I/O', verified: true, rawSnippet: 'ReadLatency spiked to 45ms (normal < 2ms) at 10:12:00 UTC' },
        { id: 'ev-303', text: 'Safety boundary breached: Financial ledger risk', category: 'Policy Guardrail', source: 'Aegis Policy Engine', verified: true, rawSnippet: 'RULE_BLOCK_AUTO_REMEDIATION: Action involves irreversible ledger state modification' }
      ],
      sourcesChecked: [
        { name: 'Application Logs', status: 'Complete', itemsFound: 24, latencyMs: 410, details: 'Searched core banking ledger logs', type: 'logs' },
        { name: 'Deployment History', status: 'Complete', itemsFound: 0, latencyMs: 120, details: 'No active deployment in progress', type: 'deploy' },
        { name: 'Configuration', status: 'Complete', itemsFound: 1, latencyMs: 190, details: 'Checked `postgresql.conf` lock timeouts', type: 'config' },
        { name: 'Previous Incidents', status: 'Complete', itemsFound: 2, latencyMs: 480, details: 'Matched INC-2109 and INC-3140', type: 'history' },
        { name: 'Knowledge Base', status: 'Complete', itemsFound: 1, latencyMs: 250, details: 'Found KB-0089 (Postgres Deadlock Resolution)', type: 'kb' },
        { name: 'Monitoring', status: 'Complete', itemsFound: 6, latencyMs: 330, details: 'Aurora performance insights collected', type: 'metrics' }
      ],
      actionType: 'escalation_required',
      recommendedAction: {
        title: 'Escalate to Database Engineering',
        risk: 'High',
        confidence: 64,
        expectedOutcome: 'Database administrators manually terminate blocking PID 4129, inspect transaction isolation levels, and resume batch.',
        requiresApproval: true,
        approvalReason: 'Aegis found conflicting evidence and will not automatically modify production financial databases.',
        remediationSteps: [
          'Generate comprehensive diagnostic package',
          'Notify Database Engineering on-call via PagerDuty',
          'Post live incident snapshot to #eng-database-incidents',
          'Hold downstream settlement queue to prevent cascading deadlocks'
        ]
      },
      escalationPackage: {
        summary: 'Automated settlement batch stalled due to Postgres deadlocks on ledger partition tables. High risk of ledger inconsistency prevents auto-remediation.',
        businessImpact: '247 merchant daily reconciliation batches delayed ($4.2M value). Regulatory SLA window closes in 45 minutes.',
        assignedTeam: 'Database Engineering Team',
        confidence: 64,
        rootCauseHypothesis: 'Database connection pool exhaustion and conflicting transaction locks on `account_balances`.',
        recommendedNextSteps: [
          'Review active lock graph in pg_stat_activity for PID 4129 & 4122.',
          'Execute targeted `pg_cancel_backend(4129)` if transaction is unrecoverable.',
          'Verify index on `account_balances(account_id, currency_code)`.',
          'Trigger manual retry of batch #9921 after lock clear.'
        ],
        slackChannel: '#eng-database-incidents',
        pagerDutyService: 'Database Platform Primary',
        ticketId: 'DB-ESC-8492'
      }
    }
  },
  {
    id: 'INC-1044',
    issueTitle: 'Settlement report delayed',
    service: 'Reporting Service',
    category: 'Reporting Team',
    priority: 'Low',
    status: 'Resolved',
    owner: 'Reporting Team',
    updated: '31 min ago',
    createdAt: '09:50 AM',
    potentialImpact: 'PDF report generation queued for 38 regional branches',
    emailId: 'EML-8904',
    investigationTime: '1m 12s',
    investigation: {
      status: 'resolved',
      investigationProgress: 100,
      activitySteps: [
        { id: '1', step: 'Parsed support email', status: 'completed', timestamp: '09:50:02 AM', detail: 'Identified delayed PDF reports' },
        { id: '2', step: 'Identified affected service: Reporting Service', status: 'completed', timestamp: '09:50:06 AM', detail: 'Service: `report-worker-pdf-us`' },
        { id: '3', step: 'Found memory leak in PDF headless renderer', status: 'completed', timestamp: '09:50:18 AM', detail: 'Container heap size 99.8%' },
        { id: '4', step: 'Root cause identified', status: 'completed', timestamp: '09:50:35 AM', detail: 'Chromium headless render pool memory saturation' },
        { id: '5', step: 'Executed auto-remediation', status: 'completed', timestamp: '09:51:00 AM', detail: 'Recycled worker pool & flushed font cache' },
        { id: '6', step: 'Incident resolved and verified', status: 'completed', timestamp: '09:51:12 AM', detail: 'All 38 queued reports generated successfully' }
      ],
      timeline: [
        { time: '09:30 AM', title: 'Chromium pool heap threshold exceeded', description: 'Heap memory usage climbed past 2GB limit', type: 'error' },
        { time: '09:50 AM', title: 'Support email received', description: 'Branch Operations inquired about missing PDFs', type: 'email' },
        { time: '09:51 AM', title: 'Aegis executed auto-remediation', description: 'Recycled renderer pool and cleared temporary PDF render cache', type: 'system' },
        { time: '09:52 AM', title: 'Incident Resolved', description: 'Job queue drained to 0 in 48 seconds', type: 'resolution' }
      ],
      rootCause: {
        title: 'Headless browser renderer memory saturation in PDF worker pool',
        confidence: 96,
        summary: 'A long-running PDF batch job failed to release font caches, resulting in V8 engine heap exhaustion across worker pods.',
        hypotheses: [
          { name: 'Renderer heap leak', likelihood: 96, reason: 'Container heap metric flatlined at 2048MB with 100% CPU lock.' }
        ]
      },
      evidence: [
        { id: 'ev-401', text: 'V8 Javascript heap out of memory error in worker logs', category: 'Runtime Log', source: 'Reporting Logs', verified: true, rawSnippet: 'FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory' }
      ],
      sourcesChecked: [
        { name: 'Application Logs', status: 'Complete', itemsFound: 12, latencyMs: 210, details: 'Parsed worker stdout', type: 'logs' },
        { name: 'Deployment History', status: 'Complete', itemsFound: 0, latencyMs: 90, details: 'No recent deploys', type: 'deploy' },
        { name: 'Configuration', status: 'Complete', itemsFound: 1, latencyMs: 110, details: 'Checked memory limits', type: 'config' },
        { name: 'Previous Incidents', status: 'Complete', itemsFound: 3, latencyMs: 290, details: 'Matched INC-1290', type: 'history' },
        { name: 'Knowledge Base', status: 'Complete', itemsFound: 1, latencyMs: 140, details: 'KB-0022 PDF Worker Guide', type: 'kb' },
        { name: 'Monitoring', status: 'Complete', itemsFound: 2, latencyMs: 170, details: 'Datadog heap metrics retrieved', type: 'metrics' }
      ],
      actionType: 'auto_remediation',
      recommendedAction: {
        title: 'Recycle PDF Worker Pods & Clear Cache',
        risk: 'Low',
        confidence: 96,
        expectedOutcome: 'Reclaim heap memory, clear corrupted render cache, and replay 38 queued report jobs.',
        requiresApproval: false,
        remediationSteps: [
          'Restart worker pods',
          'Flush `/tmp/render-cache`',
          'Verify queue throughput'
        ]
      },
      resolutionDetails: {
        resolvedAt: 'Today, 09:52 AM',
        remediationExecuted: 'Recycled PDF Worker Pods & Clear Cache',
        verificationPoints: [
          'Worker heap memory normalized to 140MB (<10% threshold)',
          'All 38 delayed regional branch PDFs generated without error',
          'Delivery webhook returned HTTP 200 OK for all recipients',
          'Resolution logged in Aegis historical index for future matching'
        ],
        remediationDuration: '1m 12s',
        resolvedBy: 'Aegis Autonomous Engine'
      }
    }
  },
  {
    id: 'INC-1045',
    issueTitle: 'Terminal heartbeat latency spike',
    service: 'IoT Ingestion Proxy',
    category: 'Network & Ingestion',
    priority: 'Low',
    status: 'New',
    owner: 'Terminal Operations',
    updated: '45 min ago',
    createdAt: '09:20 AM',
    potentialImpact: 'Heartbeat delay on 400 Fleet 4 ATM terminals',
    emailId: 'EML-8905',
    investigationTime: 'Pending',
    investigation: {
      status: 'idle',
      investigationProgress: 0,
      activitySteps: [
        { id: '1', step: 'Parsed support email', status: 'pending', timestamp: '09:20:00 AM', detail: 'Received ticket from Fleet Operations' },
        { id: '2', step: 'Identified affected service: IoT Ingestion Proxy', status: 'pending', timestamp: 'Pending', detail: 'Service mapping queued' },
        { id: '3', step: 'Searching application logs', status: 'pending', timestamp: 'Pending' },
        { id: '4', step: 'Checking DNS resolution latency', status: 'pending', timestamp: 'Pending' },
        { id: '5', step: 'Root cause analysis', status: 'pending', timestamp: 'Pending' }
      ],
      timeline: [
        { time: '09:15 AM', title: 'Heartbeat response jitter detected', description: 'Average response time rose from 45ms to 380ms', type: 'system' },
        { time: '09:20 AM', title: 'Support email received', description: 'Fleet Operations noticed status indicator flickering', type: 'email' }
      ],
      rootCause: {
        title: 'Pending Investigation',
        confidence: 0,
        summary: 'Investigation not yet initialized. Click "Analyze with Aegis" to run autonomous investigation.'
      },
      evidence: [],
      sourcesChecked: [
        { name: 'Application Logs', status: 'In Progress', itemsFound: 0, latencyMs: 0, details: 'Awaiting triage', type: 'logs' },
        { name: 'Deployment History', status: 'In Progress', itemsFound: 0, latencyMs: 0, details: 'Awaiting triage', type: 'deploy' },
        { name: 'Configuration', status: 'In Progress', itemsFound: 0, latencyMs: 0, details: 'Awaiting triage', type: 'config' },
        { name: 'Previous Incidents', status: 'In Progress', itemsFound: 0, latencyMs: 0, details: 'Awaiting triage', type: 'history' },
        { name: 'Knowledge Base', status: 'In Progress', itemsFound: 0, latencyMs: 0, details: 'Awaiting triage', type: 'kb' },
        { name: 'Monitoring', status: 'In Progress', itemsFound: 0, latencyMs: 0, details: 'Awaiting triage', type: 'metrics' }
      ],
      actionType: 'auto_remediation',
      recommendedAction: {
        title: 'Analyze Terminal DNS Caches',
        risk: 'Low',
        confidence: 75,
        expectedOutcome: 'Triage proxy DNS cache expiry and flush stale NS records.',
        requiresApproval: false,
        remediationSteps: ['Run diagnostic query', 'Inspect proxy logs']
      }
    }
  }
];

export const INITIAL_EMAILS: SupportEmail[] = [
  {
    id: 'EML-8901',
    sender: 'Cash Operations',
    senderEmail: 'support@customer.com',
    department: 'Cash Management & Reconciliation',
    subject: 'Cash reconciliation reports stopped updating after yesterday\'s release',
    preview: 'Cash reconciliation reports have stopped updating since yesterday\'s release. Multiple locations are reporting that today\'s reconciliation data is missing.',
    body: `Hello Support Team,

Cash reconciliation reports have stopped updating since yesterday's release. Multiple branch and regional locations are reporting that today's reconciliation data is missing.

Key details:
- Affected Service: Daily Cash Balancing & Ledger Reconciliation
- Scope: 247 scheduled automated reports failed to deliver this morning
- Impact: Regional branch managers cannot reconcile opening vault balances

We noticed this started around 10:38 AM right after the scheduled maintenance window. Please investigate with high priority as morning audit deadlines are approaching.

Regards,
Sarah Jenkins
Director of Cash Operations — Western Division
support@customer.com`,
    receivedAt: '10:42 AM',
    priority: 'High',
    status: 'Investigating',
    linkedIncidentId: 'INC-1042',
    tags: ['Reconciliation', 'ETL', 'Release-5.4.12', 'Urgent']
  },
  {
    id: 'EML-8902',
    sender: 'ATM Operations',
    senderEmail: 'atm-ops@partnerbank.com',
    department: 'Terminal Management',
    subject: 'Transactions timing out intermittently across West Coast terminals',
    preview: 'We are observing elevated transaction timeouts and delayed dispense signals on roughly 120 ATMs in the Seattle and Portland districts.',
    body: `Support Engineering,

We are observing elevated transaction timeouts and delayed dispense signals on roughly 120 ATMs in the Seattle and Portland districts starting at 10:28 AM.

Customer transactions are hanging on "Authorizing with Bank..." and eventually timing out after 15 seconds. Terminals are failing back to offline mode.

Please review the ATM Transaction Gateway connections.

Regards,
David Chen
ATM Operations Lead
atm-ops@partnerbank.com`,
    receivedAt: '10:31 AM',
    priority: 'High',
    status: 'New',
    linkedIncidentId: 'INC-1043',
    tags: ['ATM', 'Gateway', 'Timeout', 'WestCoast']
  },
  {
    id: 'EML-8903',
    sender: 'Core Treasury Operations',
    senderEmail: 'treasury-settlement@enterprise.ncr-atleos.com',
    department: 'Treasury & Settlement',
    subject: 'CRITICAL: Settlement batch #9921 deadlocked on database cluster',
    preview: 'The 10:00 AM settlement batch failed to acquire locks and was aborted by PostgreSQL deadlock detector. Escalation required.',
    body: `Engineering Emergency Response,

The 10:00 AM automated settlement batch (#9921) has completely stalled. Database engine logs report recurring transaction deadlocks on the core partition table.

Business impact is critical: $4.2M in merchant disbursements are queued and replication lag is escalating.

Please have Database Engineering inspect immediately.

Sincerely,
Michael Rossi
Head of Treasury Operations
treasury-settlement@enterprise.ncr-atleos.com`,
    receivedAt: '10:18 AM',
    priority: 'Critical',
    status: 'Escalated',
    linkedIncidentId: 'INC-1051',
    tags: ['Deadlock', 'Database', 'Settlement', 'Critical']
  },
  {
    id: 'EML-8904',
    sender: 'Merchant Operations',
    senderEmail: 'merchants@partnernetwork.com',
    department: 'Merchant Reporting',
    subject: 'Settlement report PDF generation delayed for 38 locations',
    preview: 'Branch managers have not received their daily morning PDF settlement exports. The dashboard shows jobs stuck in queued status.',
    body: `Hi Support,

Daily PDF settlement reports for 38 regional branch accounts have been delayed past the 09:30 AM SLA.

The reporting portal shows jobs stuck in "Processing" state. Please look into the reporting worker pool.

Thank you,
Elena Rostova
Merchant Operations Specialist`,
    receivedAt: '09:50 AM',
    priority: 'Low',
    status: 'Resolved',
    linkedIncidentId: 'INC-1044',
    tags: ['Reporting', 'PDF', 'SLA']
  },
  {
    id: 'EML-8905',
    sender: 'IoT Fleet Operations',
    senderEmail: 'fleet-telemetry@ncr-atleos.com',
    department: 'Hardware Telemetry',
    subject: 'Terminal heartbeat intermittent latency spike across Fleet 4',
    preview: 'Telemetry ingestion proxy is reporting delayed heartbeat acknowledgements across 400 terminals in district 4.',
    body: `Team,

We are seeing periodic latency spikes on heartbeat pings from Fleet 4 terminals. While no customer transactions are blocked yet, health checks are showing amber status.

Could you please verify the ingestion proxy DNS resolution status?

Thanks,
Marcus Vance
IoT Fleet Supervisor`,
    receivedAt: '09:20 AM',
    priority: 'Low',
    status: 'New',
    linkedIncidentId: 'INC-1045',
    tags: ['IoT', 'Heartbeat', 'Fleet4']
  }
];

export const INITIAL_KNOWLEDGE_ARTICLES: KnowledgeArticle[] = [
  {
    id: 'KB-0041',
    title: 'ETL Scheduler Deadlock & Partition Lock Recovery',
    category: 'ETL & Data Pipelines',
    lastUpdated: 'Aug 12, 2026',
    readTime: '4 min read',
    tags: ['ETL', 'Lock Timeout', 'Postgres', 'Reconciliation'],
    summary: 'Standard operating procedure for resolving ERR_DB_LOCK_TIMEOUT and lock contention on daily cash ledger partition tables.',
    content: `### Problem Overview
When ETL worker concurrency or \`batch_chunk_size\` is configured disproportionately higher than the PostgreSQL database \`lock_timeout_ms\`, multiple concurrent workers attempt to acquire ExclusiveLock on identical partition date boundaries.

### Diagnostic Symptoms
- Logs exhibit \`ERR_DB_LOCK_TIMEOUT\` after 3000ms.
- Table \`daily_cash_ledger_partition\` shows orphaned transaction locks in \`pg_locks\`.
- Downstream reconciliation jobs queue up without making forward progress.

### Recommended Autonomous Remediation
1. **Validate Queue Safety**: Ensure no uncommitted two-phase commit transactions are present.
2. **Flush Stuck Lock Table**: Execute \`TRUNCATE TABLE etl_scheduler_locks;\` to clear stale coordinator tokens.
3. **Recycle Worker Pods**: Issue a rolling restart to reset local worker in-memory chunk queues to fallback parameter (5,000 items).
4. **Health Verification**: Monitor \`/health/etl-queue\` for 60 seconds to verify drain rate > 120 jobs/min.

### Related Post-Mortems
- INC-4821 (May 2025): Resolved by resetting worker lock table and applying fallback chunk size.`,
    relatedIncidents: ['INC-1042', 'INC-4821']
  },
  {
    id: 'KB-0012',
    title: 'ATM Gateway Connection Pool Exhaustion & Recovery',
    category: 'ATM & Terminal Operations',
    lastUpdated: 'Jul 28, 2026',
    readTime: '5 min read',
    tags: ['ATM', 'TCP Sockets', 'Gateway', 'Connection Pool'],
    summary: 'Runbook for clearing orphaned CLOSE_WAIT sockets on Edge ATM Transaction Gateways during upstream network flaps.',
    content: `### Problem Overview
Transient route flaps between the edge gateway and banking switch can cause TCP connections to enter an orphaned \`CLOSE_WAIT\` socket state. When the connection pool reaches maximum capacity (500 connections), new ATM terminal authorizations fail with 15-second timeouts.

### Human Approval Policy
Because draining active gateway pods can affect in-flight transactions, this remediation requires explicit support engineer authorization.

### Remediation Protocol
1. Shift edge routing to secondary gateway cluster \`edge-atm-tx-gw-secondary\`.
2. Drain active connections with a 5-second graceful window.
3. Recycle primary gateway pods.
4. Verify TCP connection utilization drops below 15%.
5. Restore traffic distribution.`,
    relatedIncidents: ['INC-1043', 'INC-3910']
  },
  {
    id: 'KB-0089',
    title: 'Database Deadlock & Circular Lock Graph Triage',
    category: 'Core Database',
    lastUpdated: 'Jun 19, 2026',
    readTime: '6 min read',
    tags: ['Database', 'Postgres', 'Deadlock', 'Aurora'],
    summary: 'Guidelines for escalating and diagnosing circular transaction deadlocks on high-throughput ledger databases.',
    content: `### Guardrail Policy: Human Intervention Required
Aegis autonomous engine strictly prohibits automatic modification of production financial ledger databases when confidence is below 85% or when conflicting diagnostic vectors exist.

### Escalation Package Generation
Aegis automatically collates:
1. Full PostgreSQL deadlock graph with PIDs and blocked SQL statements.
2. CloudWatch I/O and storage burst balance graphs.
3. WAL replication lag metrics.
4. Business impact and affected merchant count.

### DBA Next Steps
- Review \`pg_stat_activity\` for long-running transactions (>120s).
- Evaluate transaction isolation level (\`READ COMMITTED\` vs \`SERIALIZABLE\`).
- Inspect missing foreign key indexes.`,
    relatedIncidents: ['INC-1051', 'INC-2109', 'INC-3140']
  },
  {
    id: 'KB-0022',
    title: 'Reporting Worker PDF Render Pool Memory Leak SOP',
    category: 'Batch Reporting',
    lastUpdated: 'Aug 02, 2026',
    readTime: '3 min read',
    tags: ['Reporting', 'V8 Heap', 'PDF', 'Memory'],
    summary: 'Automatic remediation procedure for headless browser renderer heap saturation in reporting worker pools.',
    content: `### Problem Overview
Large batch PDF exports containing high-resolution raster assets can cause Chromium headless renderer instances to retain font memory buffers.

### Automated Remediation Flow
1. Check queued jobs in Redis queue \`reports:batch:v1\`.
2. Terminate stalled Chromium renderer child processes.
3. Clean \`/tmp/render-cache\` storage volume.
4. Restart reporting worker container.
5. Replay queued PDF generation requests.`,
    relatedIncidents: ['INC-1044', 'INC-1290']
  },
  {
    id: 'KB-0095',
    title: 'Deployment Rollback & Configuration Drift Verification',
    category: 'Deployments & Rollbacks',
    lastUpdated: 'Jul 15, 2026',
    readTime: '4 min read',
    tags: ['Deployment', 'GitOps', 'Config Drift', 'Kubernetes'],
    summary: 'Process for detecting parameter drift in Helm release charts and performing automated rollback.',
    content: `### Configuration Drift Detection
Aegis compares active Kubernetes ConfigMaps against previous Git commit trees to identify parameter mismatches (e.g. batch chunk sizing, connection pool limits, timeout thresholds) introduced during recent CI/CD deployments.`,
    relatedIncidents: ['INC-1042']
  }
];

export const INITIAL_ACTIVITY: AegisActivityItem[] = [
  {
    id: 'act-1',
    incidentId: 'INC-1042',
    incidentTitle: 'Cash reconciliation failure',
    action: 'Root cause identified: Configuration mismatch in release 5.4.12 (91% confidence)',
    timestamp: '2 min ago',
    type: 'root_cause'
  },
  {
    id: 'act-2',
    incidentId: 'INC-1042',
    incidentTitle: 'Cash reconciliation failure',
    action: 'Correlated failure pattern with historical incident INC-4821',
    timestamp: '3 min ago',
    type: 'investigation'
  },
  {
    id: 'act-3',
    incidentId: 'INC-1043',
    incidentTitle: 'ATM transaction timeout',
    action: 'Human approval requested for gateway pod drain action',
    timestamp: '14 min ago',
    type: 'alert'
  },
  {
    id: 'act-4',
    incidentId: 'INC-1051',
    incidentTitle: 'Core ledger settlement deadlocks',
    action: 'Escalation package generated for Database Engineering Team',
    timestamp: '19 min ago',
    type: 'escalation'
  },
  {
    id: 'act-5',
    incidentId: 'INC-1044',
    incidentTitle: 'Settlement report delayed',
    action: 'Auto-remediation executed: Recycled PDF worker pool (Resolved in 1m 12s)',
    timestamp: '31 min ago',
    type: 'remediation'
  }
];
