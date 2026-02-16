# Jut-Jan Ops Portal Agent Team

Purpose: This file defines the project-specific agent team, their responsibilities, and how work should flow.

## Team
- Tech Lead (TL): Owns architecture decisions, approves major changes, and resolves cross-cutting concerns.
- Frontend Engineer (FE): Builds UI, integrates APIs, maintains component quality, and ensures responsiveness.
- Platform/Backend Engineer (BE): Owns server/API contracts, data modeling, and integration stability.
- DevOps/Release (DO): Owns CI/CD, environments, secrets, and deployment readiness.
- QA/Automation (QA): Owns test strategy, regression coverage, and release validation.
- Security/Compliance (SEC): Reviews auth, data handling, and security posture.
- Product/PM (PM): Owns requirements, acceptance criteria, and prioritization.
- Design (UX): Owns UX consistency, accessibility, and visual polish.

## Role-Based Module Ownership
System Owner (SaaS Admin):
- Merchant Management: BE (API/RLS), FE (tables/forms), QA (bulk flows)
- Store Management: BE (relationships), FE (filters/details), QA (edge cases)
- User/Membership Control: BE (membership queries), FE (audit UI), SEC (access review)
- System Dashboard: BE (metrics endpoints), FE (charts), QA (data correctness)
- Billing/Subscription (future): PM (scope), BE (integrations), FE (billing UI)

Store Owner / Manager:
- Dashboard (Daily Summary): BE (views/rpc), FE (summary cards), QA (date filters)
- Document Control: BE (locking, history), FE (filters/status), SEC (role gates)
- Master Data (Items/Expense Categories/PO Rules): BE (CRUD/RLS), FE (forms), QA (validation)
- Store Members: BE (invites/roles), FE (role management), SEC (privilege checks)

## Permissions & Menu Mapping
System Owner:
- Merchants: list/create/update/activate/deactivate
- Stores: list/create/update/soft delete, view store members
- Users: view memberships, suspend/reactivate, audit store memberships
- Dashboard: metrics + doc counts
- Billing (future): plan usage, upgrade/downgrade, payment history

Store Owner/Manager:
- Dashboard: v_daily_summary, doc status, alerts
- Documents: history, filters (date/group/status), lock/unlock, soft delete
- Master Data: items, expense categories, PO rules
- Store Members: invite, role change, suspend/remove

Store Staff:
- Read-only access where applicable (no lock/unlock, no role changes)

## Working Agreements
- All changes must include clear acceptance criteria and a rollback plan when touching infrastructure or auth.
- Default branch for integration is `develop`. Release merges into `main` only after QA sign-off.
- Prefer small, reviewable PRs with scoped changes.
- Tests are required for critical user flows and any bug fix.

## Definition of Done
- Code compiles and lint passes.
- Tests updated and passing for impacted areas.
- UX reviewed for accessibility basics (keyboard, contrast, focus states).
- Security considerations documented when auth/data access changes.

## Communication
- Use issue/PR templates to capture scope, risks, and validation steps.
- TL provides final approval for major changes or cross-cutting refactors.
