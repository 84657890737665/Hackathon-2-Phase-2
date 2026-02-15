# Data Model: Taskflow Enterprise Features

**Feature**: [Link to spec.md](./spec.md)
**Created**: 2026-02-14
**Status**: Draft

## Entity Relationship Diagram (Conceptual)

```
[User] 1----* [Task] *----1 [Project]
  |                 |
  |                 *----* [TaskCompletion]
  |                              |
  *----* [PerformanceMetric]     *----* [AuditLog]
  |                              |
  *----* [Achievement]           *----* [AIInsight]
  |
  *----* [EnterpriseProfile]
  
[Organization] 1----* [User]
     |
     *----* [AuditLog]
     *----* [EnterpriseTier]
```

## Entity Definitions

### User (Extended)
Represents an authenticated user with enterprise capabilities

```sql
Table: users
- id: INTEGER PRIMARY KEY
- email: VARCHAR(255) UNIQUE NOT NULL
- hashed_password: VARCHAR(255) NOT NULL
- first_name: VARCHAR(100)
- last_name: VARCHAR(100)
- company: VARCHAR(255)  -- New field for enterprise users
- role: VARCHAR(100) DEFAULT 'member'  -- 'admin', 'editor', 'viewer'
- department: VARCHAR(100)
- hire_date: DATE
- created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- updated_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- last_login_at: TIMESTAMP
- is_active: BOOLEAN DEFAULT TRUE
- permissions_json: JSONB  -- Role-based permissions
```

### Task (Enhanced)
Represents a work item with AI-enhanced properties

```sql
Table: tasks
- id: INTEGER PRIMARY KEY
- user_id: INTEGER FOREIGN KEY REFERENCES users(id)
- title: VARCHAR(255) NOT NULL
- description: TEXT
- completed: BOOLEAN DEFAULT FALSE
- completed_at: TIMESTAMP NULL
- due_date: TIMESTAMP NULL
- priority_score: DECIMAL(5,2) DEFAULT 0.00  -- AI-calculated priority
- predicted_completion: TIMESTAMP NULL  -- AI prediction
- complexity_score: INTEGER DEFAULT 1  -- 1-5 scale
- estimated_hours: DECIMAL(4,2) DEFAULT 1.00
- actual_hours: DECIMAL(4,2) DEFAULT 0.00
- project_id: INTEGER FOREIGN KEY REFERENCES projects(id) NULL
- parent_task_id: INTEGER FOREIGN KEY REFERENCES tasks(id) NULL
- created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- updated_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- completed_by_user_id: INTEGER FOREIGN KEY REFERENCES users(id) NULL
```

### PerformanceMetric
Stores meaningful performance measurements for users and teams

```sql
Table: performance_metrics
- id: INTEGER PRIMARY KEY
- user_id: INTEGER FOREIGN KEY REFERENCES users(id)
- metric_type: VARCHAR(50) NOT NULL  -- 'execution_velocity', 'deadline_reliability', 'focus_consistency', 'collaboration_efficiency'
- metric_value: DECIMAL(8,2) NOT NULL
- calculated_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- period_start: DATE NOT NULL  -- Start of measurement period
- period_end: DATE NOT NULL    -- End of measurement period
- trend_direction: VARCHAR(10) DEFAULT 'neutral'  -- 'up', 'down', 'neutral'
- benchmark_percentile: INTEGER  -- How this compares to similar users
- organization_id: INTEGER FOREIGN KEY REFERENCES organizations(id) NULL
```

### AuditLog
Complete audit trail for enterprise compliance

```sql
Table: audit_logs
- id: INTEGER PRIMARY KEY
- user_id: INTEGER FOREIGN KEY REFERENCES users(id)
- organization_id: INTEGER FOREIGN KEY REFERENCES organizations(id)
- action_type: VARCHAR(50) NOT NULL  -- 'task_created', 'task_updated', 'task_deleted', 'user_added', etc.
- entity_type: VARCHAR(50) NOT NULL  -- 'task', 'user', 'project', 'setting'
- entity_id: INTEGER NOT NULL
- old_values_json: JSONB  -- Previous state before change
- new_values_json: JSONB  -- New state after change
- ip_address: VARCHAR(45)  -- IPv4 or IPv6
- user_agent: TEXT
- timestamp: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- session_id: VARCHAR(255)
- metadata_json: JSONB  -- Additional context
```

### AIInsight
Stores AI-generated insights and recommendations

```sql
Table: ai_insights
- id: INTEGER PRIMARY KEY
- user_id: INTEGER FOREIGN KEY REFERENCES users(id) NULL  -- NULL for organization-level insights
- organization_id: INTEGER FOREIGN KEY REFERENCES organizations(id)
- insight_type: VARCHAR(50) NOT NULL  -- 'bottleneck_prediction', 'optimization_suggestion', 'risk_assessment'
- insight_data_json: JSONB NOT NULL  -- The actual insight content
- priority_level: INTEGER DEFAULT 3  -- 1-5 scale, 5 highest priority
- created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- resolved_at: TIMESTAMP NULL
- resolved_by_user_id: INTEGER FOREIGN KEY REFERENCES users(id) NULL
- is_actionable: BOOLEAN DEFAULT TRUE
- impact_score: DECIMAL(5,2) DEFAULT 0.00  -- Estimated impact of following recommendation
```

### Organization
Enterprise account structure

```sql
Table: organizations
- id: INTEGER PRIMARY KEY
- name: VARCHAR(255) NOT NULL
- domain: VARCHAR(255) UNIQUE  -- For SSO
- industry: VARCHAR(100)
- size: VARCHAR(20)  -- '1-10', '11-50', '51-200', '201-1000', '1000+'
- created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- updated_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- billing_contact_email: VARCHAR(255)
- technical_contact_email: VARCHAR(255)
- compliance_requirements_json: JSONB  -- Specific compliance needs
- sso_config_json: JSONB  -- SSO configuration
- enterprise_tier_id: INTEGER FOREIGN KEY REFERENCES enterprise_tiers(id) NULL
```

### EnterpriseTier
Pricing tier definitions

```sql
Table: enterprise_tiers
- id: INTEGER PRIMARY KEY
- name: VARCHAR(50) NOT NULL  -- 'free', 'pro', 'team', 'enterprise'
- display_name: VARCHAR(100) NOT NULL
- description: TEXT
- monthly_price_cents: INTEGER  -- Price in cents
- max_users: INTEGER  -- NULL for unlimited
- max_storage_gb: INTEGER
- features_json: JSONB  -- List of available features
- created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- updated_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- is_active: BOOLEAN DEFAULT TRUE
```

### Subscription
Billing and subscription management

```sql
Table: subscriptions
- id: INTEGER PRIMARY KEY
- organization_id: INTEGER FOREIGN KEY REFERENCES organizations(id)
- enterprise_tier_id: INTEGER FOREIGN KEY REFERENCES enterprise_tiers(id)
- stripe_subscription_id: VARCHAR(255) UNIQUE  -- Stripe subscription ID
- status: VARCHAR(20) DEFAULT 'active'  -- 'active', 'trialing', 'past_due', 'canceled', 'unpaid'
- current_period_start: TIMESTAMP
- current_period_end: TIMESTAMP
- trial_ends_at: TIMESTAMP NULL
- created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- updated_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- canceled_at: TIMESTAMP NULL
- cancellation_reason: VARCHAR(255) NULL
```

## Relationships

### User Relationships
- One-to-Many: User → Tasks (user creates tasks)
- One-to-Many: User → PerformanceMetrics (user's metrics)
- One-to-Many: User → AuditLogs (user's actions logged)
- Many-to-One: User → Organization (user belongs to org)

### Task Relationships
- Many-to-One: Task → User (task assigned to user)
- Many-to-One: Task → Project (task belongs to project)
- One-to-Many: Task → TaskCompletions (task completion history)
- Self-Referencing: Task → Task (parent-child task relationships)

### Organization Relationships
- One-to-Many: Organization → Users (organization has users)
- One-to-Many: Organization → AuditLogs (org audit trail)
- One-to-Many: Organization → AIInsights (org insights)
- One-to-One: Organization → EnterpriseTier (org's tier)
- One-to-One: Organization → Subscription (org's billing)

## Indexes for Performance

### Critical Indexes
- `CREATE INDEX idx_tasks_user_id_completed ON tasks(user_id, completed);`
- `CREATE INDEX idx_performance_metrics_user_period ON performance_metrics(user_id, period_start, period_end);`
- `CREATE INDEX idx_audit_logs_org_timestamp ON audit_logs(organization_id, timestamp DESC);`
- `CREATE INDEX idx_ai_insights_org_priority ON ai_insights(organization_id, priority_level DESC);`
- `CREATE INDEX idx_users_organization_role ON users(organization_id, role);`

### Query Optimization Indexes
- `CREATE INDEX idx_tasks_due_date ON tasks(due_date) WHERE completed = FALSE;`
- `CREATE INDEX idx_tasks_priority_score ON tasks(priority_score DESC);`
- `CREATE INDEX idx_performance_metrics_type_date ON performance_metrics(metric_type, calculated_at DESC);`
- `CREATE INDEX idx_subscriptions_status_period ON subscriptions(status, current_period_end);`

## Data Migration Strategy

### From Current Schema
1. Preserve existing user and task data
2. Add new columns to existing tables with appropriate defaults
3. Create new tables for enterprise features
4. Migrate existing "points" to baseline performance metrics
5. Generate initial audit logs for existing data

### Migration Steps
1. **Backup**: Full database backup before migration
2. **Schema Update**: Add new columns and tables
3. **Data Migration**: Transform existing data to new structure
4. **Index Creation**: Add performance indexes
5. **Validation**: Verify data integrity and relationships
6. **Cleanup**: Remove deprecated fields after validation

## Security Considerations

### Data Classification
- **Public**: User profile names, avatars
- **Internal**: Task titles, descriptions, completion status
- **Confidential**: Performance metrics, audit logs, AI insights
- **Restricted**: Authentication tokens, billing information

### Access Controls
- Row-level security for organization data isolation
- Column-level security for sensitive fields
- Encrypted storage for authentication tokens
- Audit trail for all data access

## Compliance Requirements

### GDPR/Privacy
- Right to data portability for all user data
- Right to deletion with data retention policies
- Consent management for data processing
- Privacy by design in all new features

### Enterprise Standards
- SOC 2 Type II compliance readiness
- Data residency options
- Third-party security assessments
- Regular penetration testing

## Performance Benchmarks

### Query Performance Targets
- User dashboard: <200ms
- Task list: <150ms for 100 tasks
- Performance metrics: <300ms
- Audit logs: <500ms for 1000 entries
- AI insights: <1000ms for full analysis

### Storage Requirements
- Individual user data: <100MB per user
- Organization data: <10GB per organization
- Audit logs: 7-year retention policy
- Performance metrics: 5-year retention policy