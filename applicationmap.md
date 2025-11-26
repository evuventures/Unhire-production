# Application Map – Unhire Platform (MERN + Node Cron)

## Context
This project is already partially implemented using the **MERN stack** (MongoDB, Express, React, Node.js) with **Node Cron** handling scheduled background jobs (like 3-hour project timers).  
Copilot should continue from the existing structure — keeping consistent code style, folder organization, naming conventions, and theming.

---

## Core Roles

### 1. Client
- Signs up / logs in via existing auth system.
- Can **create projects** with fields:
  - title, description, category, budget, reference files.
- On project creation:
  - Status = `open`
  - Node Cron schedules a **3-hour job** to handle deadline.
  - Experts in matching category get notified (real-time or via dashboard refresh).
- Can view their projects in dashboard.
- When draft is received:
  - Client can **accept** (pay + close project) or **reject** (auto-reassign to new expert).
- Max retries: **3 experts / 9 hours** total.

### 2. Expert
- Applies via onboarding form (already planned or partial schema exists):
  - Fields: name, email, resume, LinkedIn, GitHub, portfolio, category.
- After admin approval, becomes `active_expert`.
- Dashboard shows **available projects** filtered by their category.
- Can **claim** a project → first to claim gets assigned.
  - Sets `assigned_expert` + `assigned_at`.
  - Starts a new 3-hour countdown via Cron job.
- Can **submit draft** before 3 hours via `/api/projects/:id/submit`.
  - Upload link / text content stored in MongoDB (`drafts` collection).
- If fails to submit → auto timeout → penalty + reassignment.

### 3. Admin
- Reviews expert applications.
- Approves, rejects, or rates experts.
- Can override penalties, deadlines, or project status manually.
- Manages disputes.
- Has access to admin dashboard analytics.

---

## Project Flow (with Node Cron integration)

1. **Client posts project**
   - Save to DB with `status: "open"`, `attempts_count: 0`.
   - Start **3-hour Node Cron job** → `project_deadline_job`.

2. **Expert claims project**
   - Update status → `in_progress`.
   - Save expert ID and `assigned_at` timestamp.
   - Schedule new **3-hour Cron** (`expert_submission_job`).

3. **Expert submits draft**
   - Mark project as `submitted`.
   - Cancel current cron job.
   - Notify client for review.

4. **Client review**
   - Accept → `completed`, trigger payment.
   - Reject → increment `attempts_count`, assign next expert, re-initiate 3-hour cron.
   - After 3 failed cycles (9 hours total) → status `expired`.

5. **Node Cron Jobs**
   - `project_deadline_job`: triggers if no expert claims in 3 hours → expire project.
   - `expert_submission_job`: triggers after 3 hours → timeout expert, reassign next expert, apply penalty.

---

## Project Statuses

| Status | Description |
|---------|-------------|
| `open` | Waiting for expert to claim |
| `in_progress` | Expert assigned, 3-hour timer running |
| `submitted` | Expert submitted draft, waiting for client |
| `review` | Client reviewing draft |
| `accepted` | Client approved and paid |
| `rejected` | Client rejected draft |
| `timeout` | Expert missed deadline |
| `completed` | Project done successfully |
| `expired` | Failed after 3 cycles (9 hours) |

---

## Database Collections (MongoDB)

### `users`
- `{ _id, name, email, role, passwordHash, createdAt, updatedAt }`

### `experts`
- `{ _id, userId, linkedin, github, resumeUrl, category, rating, penaltyCount, status }`

### `projects`
- `{ _id, clientId, title, category, description, budget, status, assignedExpert, attemptsCount, createdAt, updatedAt, deadline }`

### `drafts`
- `{ _id, projectId, expertId, contentUrl, submittedAt, status }`

### `transactions`
- `{ _id, projectId, clientId, expertId, amount, status, createdAt }`

---

## Backend API Routes (Express)

### Auth
- `POST /api/auth/signup`
- `POST /api/auth/login`

### Client
- `POST /api/projects` – Create new project
- `GET /api/projects/:id` – Get project details
- `POST /api/projects/:id/review` – Client accepts/rejects draft

### Expert
- `GET /api/projects/available` – List open projects by category
- `POST /api/projects/:id/claim` – Claim project
- `POST /api/projects/:id/submit` – Submit draft

### Admin
- `GET /api/experts/pending` – Pending approvals
- `POST /api/experts/:id/approve` – Approve expert
- `POST /api/experts/:id/reject` – Reject expert
- `GET /api/dashboard/analytics` – Metrics

---

## Node Cron Jobs (Backend)

- `projectDeadlineCheck`: runs every 5 min  
  → finds `open` projects older than 3 hours → mark `expired`.
- `expertDeadlineCheck`: runs every 5 min  
  → finds `in_progress` projects past 3 hours → mark `timeout`, penalize expert, reassign next one.
- `sendReminderNotifications`: optional (send 30 min before deadline).

*(Existing cron job setup should remain — add new ones to the same scheduler.)*

---

## Frontend (React)
Keep consistent design system:
- Dashboard pages:
  - `/client/dashboard`
  - `/expert/dashboard`
  - `/admin/dashboard`
- Reuse existing UI components (cards, tables, countdown timers).
- Add **real-time timer indicators** using `socket.io-client` or `setInterval` + project deadlines.
- Theming: maintain existing color palette and typography.

---

## Payment Flow
1. Client funds project on creation (escrow logic stub if not implemented yet).
2. On client acceptance → payment released to expert.
3. On rejection after 3 attempts → refund client.

*(If payments not integrated yet, use mock transactions collection.)*

---

## Key Rules Recap
- Each expert has 3 hours to deliver draft.
- If timeout → penalty and auto-reassign.
- Max 3 attempts (9 hours total).
- First expert to claim gets project.
- Client can review, accept, or reject drafts.
- Admin manages onboarding and disputes.

---

---

**Theme:** Continue in existing **MERN + Cron** architecture, minimal dependencies, consistent folder structure, and maintain current styling.  
**Goal:** Enable full Unhire 3-hour expert workflow end-to-end.

---

**File:** `applicationmap.md`  
**Project:** Unhire  
**Status:** Active development (MERN continuation)
