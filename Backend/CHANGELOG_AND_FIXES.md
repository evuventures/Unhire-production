# CHANGELOG AND FIXES

## Expert Review & Reassignment System

**Date:** 2026-02-07  
**Branch:** `BE-expert-review-reassignment-system`  
**Author:** Qamber

---

## ✅ What Changes Were Made

### Overview
Implemented a complete draft review workflow system enabling:
- Experts to submit drafts for claimed projects
- Clients to approve or reject submitted drafts
- Automatic expert reassignment upon rejection
- Project expiration after 3 failed attempts
- In-app notification system for all state changes

---

## 📁 New Files Created

| File | Purpose |
|------|---------|
| `models/notification.model.js` | MongoDB schema for in-app notifications with fields: `userId`, `type`, `message`, `projectId`, `read`, `createdAt` |
| `services/notification.service.js` | CRUD operations for notifications: create, getUserNotifications, getUnreadCount, markAsRead, markAllAsRead |
| `services/review.service.js` | Core business logic for draft approval/rejection with auto-reassignment |
| `controllers/review.controller.js` | HTTP handlers for `POST /review` and `GET /draft-status` endpoints |
| `controllers/notification.controller.js` | HTTP handlers for notification retrieval and read status updates |
| `routes/notification.routes.js` | Express routes for notification API endpoints |

---

## 🎯 Why Each Change Was Necessary

### `models/project.model.js`
**Changes:**
```javascript
+ draftStatus: { type: String, enum: ["pending_review", "accepted", "rejected", null] }
+ attemptsCount: { type: Number, default: 0 }
+ rejectedExperts: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
```
**Reason:** The existing schema only tracked if a draft was submitted (`draftSubmitted`), but had no way to track:
- The review status of the draft (pending/approved/rejected)
- How many reassignment attempts occurred
- Which experts had already failed/timed out (to prevent reassigning to the same expert)

---

### `services/expert.service.js`
**Changes:**
- Added import for `createNotification`
- Added notification trigger in `claimProjectService()` when expert claims project
- Added `draftStatus = "pending_review"` in `submitDraftService()`
- Added notification trigger to client when draft is submitted

**Reason:** 
- Experts need to be notified when they claim a project (confirmation + timer reminder)
- Clients need to know when a draft is ready for review
- `draftStatus` needed to be set to enable the review workflow

---

### `services/project.service.js`
**Changes:**
- Complete rewrite of `markExpiredProjectsService()` to handle:
  - Finding projects past 3-hour submission deadline
  - Adding timed-out expert to `rejectedExperts` array
  - Incrementing `attemptsCount`
  - Auto-reassigning to next available expert (by rating)
  - Expiring project after 3 failed attempts
- Added `autoReassignTimedOutProject()` helper function

**Reason:** 
- Original implementation only marked projects as "unassigned" without proper reassignment logic
- No tracking of failed attempts or prevention of reassignment to same expert
- No notifications were sent on timeout events

---

### `routes/project.routes.js`
**Changes:**
```javascript
+ import { reviewDraft, getDraftStatus } from "../controllers/review.controller.js";
+ router.get("/:id/draft-status", protect, getDraftStatus);
+ router.post("/:id/review", protect, authorizeRoles("client"), reviewDraft);
```
**Reason:** New endpoints were required for clients to review drafts and for all users to check draft status.

---

### `cron/projectMonitor.js`
**Changes:**
- Added try/catch for error handling
- Updated to handle new return format `{ reassignedCount, expiredCount }`
- Added startup log message

**Reason:** 
- Original cron had no error handling - failures would crash silently
- Return format changed from simple count to object with breakdown
- Startup confirmation helps with debugging

---

### `index.js`
**Changes:**
```javascript
+ import notificationRoutes from "./routes/notification.routes.js";
+ app.use("/api/notifications", notificationRoutes);
```
**Reason:** New notification routes needed to be registered with Express.

---

## 🔧 Issues Found and Fixed

### 1. Race Condition Prevention (Existing - Verified Working)
**File:** `services/expert.service.js` - `claimProjectService()`  
**Status:** Already correctly implemented using `findOneAndUpdate` with atomic conditions.  
**No fix needed.**

### 2. Missing Draft Status Field
**File:** `services/expert.service.js` - `submitDraftService()`  
**Issue:** Draft was submitted but `draftStatus` was never set, making review flow impossible.  
**Fix:** Added `project.draftStatus = "pending_review"` before saving.

### 3. Incorrect Timeout Query
**File:** `services/project.service.js` - `markExpiredProjectsService()`  
**Issue:** Original query looked for `status: "active"` but assigned projects have `status: "in_progress"`.  
**Fix:** Changed query to `status: "in_progress"` and added `assignedAt` check.

---

## 🐛 Bugs or Logic Errors

### 1. Potential ObjectId Comparison Issue
**File:** `services/review.service.js` - Line 67  
**Code:**
```javascript
if (rejectedExpertId && !project.rejectedExperts.includes(rejectedExpertId))
```
**Issue:** Comparing ObjectId with `includes()` may fail due to reference comparison.  
**Recommendation:** Use `.some()` with `.toString()` comparison:
```javascript
if (rejectedExpertId && !project.rejectedExperts.some(id => id.toString() === rejectedExpertId.toString()))
```
**Severity:** Low - Mongoose typically handles this, but explicit conversion is safer.

### 2. Client Notification ID Extraction
**File:** `services/expert.service.js` - `submitDraftService()`  
**Code:**
```javascript
project.clientId._id || project.clientId
```
**Issue:** After `populate()`, `clientId` is an object; before populate, it's an ObjectId. This handles both cases correctly.  
**No issue found.**

---

## 🔐 Security Vulnerabilities or Risky Patterns

### 1. Authorization Check - Properly Implemented
**File:** `routes/project.routes.js`  
**Code:**
```javascript
router.post("/:id/review", protect, authorizeRoles("client"), reviewDraft);
```
**Status:** Correctly requires authentication AND client role. ✅

### 2. Ownership Verification - Properly Implemented
**File:** `services/review.service.js`  
**Code:**
```javascript
const project = await Project.findOne({
    _id: projectId,
    clientId: clientId, // Verifies ownership
    ...
});
```
**Status:** Correctly verifies the client owns the project before allowing review. ✅

### 3. Notification Access Control
**File:** `services/notification.service.js` - `markAsRead()`  
**Code:**
```javascript
const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, userId }, // Verifies ownership
    ...
});
```
**Status:** Users can only mark their own notifications as read. ✅

**No security vulnerabilities found.**

---

## ⚡ Performance or Maintainability Improvements

### 1. Database Index Recommendation
**File:** `models/notification.model.js`  
**Current:**
```javascript
userId: { ..., index: true }
```
**Status:** Index on `userId` is correctly set for fast lookups. ✅

**Recommendation:** Consider compound index for common query pattern:
```javascript
notificationSchema.index({ userId: 1, createdAt: -1 });
```

### 2. Expert Selection Query Optimization
**File:** `services/review.service.js` - `autoReassignProject()`  
**Current:**
```javascript
const availableExperts = await User.find(query)
    .select("_id name email skills rating")
    .sort({ rating: -1 });
```
**Improvement Applied:** Uses `.select()` to limit returned fields and `.sort()` for consistent ordering. ✅

### 3. Cron Job Error Handling
**File:** `cron/projectMonitor.js`  
**Previous:** No error handling - unhandled promise rejection could crash the process.  
**Fixed:** Added try/catch wrapper:
```javascript
try {
    const result = await markExpiredProjectsService();
    ...
} catch (err) {
    console.error("[CRON] Error in project monitor:", err.message);
}
```

---

## 📋 Summary

| Category | Count |
|----------|-------|
| New Files Created | 6 |
| Files Modified | 6 |
| Bugs Fixed | 2 |
| Security Issues | 0 |
| Performance Improvements | 1 |
| Recommendations | 2 |

---

## 🧪 Testing Recommendations

1. **Unit Tests Needed:**
   - `review.service.js` - approveDraftService, rejectDraftService
   - `notification.service.js` - all CRUD operations

2. **Integration Tests Needed:**
   - Full approve flow: claim → submit → approve
   - Full reject flow: claim → submit → reject → reassign
   - Max attempts expiration: 3 rejections → expired

3. **Edge Cases to Test:**
   - Reject when no other experts available

---

## Client Review UI & Auth Fixes
**Date:** 2026-02-07
**Changes:**
- Created `ClientProjectDetailsPage.tsx` for clients to view project details and review drafts (Approve/Reject).
- Added route `/client/project/:id` in `App.tsx`.
- Implemented authenticated user redirection in `LoginPage.tsx` and `SignupPage.tsx` to prevent duplicate logins.

---

## Codebase Analysis & Optimizations
**Date:** 2026-02-07
**Action:** Detailed review of backend files for security, performance, and best practices.

### 🔒 Security Fixes
- **ObjectId Comparison:** Fixed potential bug in `review.service.js` and `project.service.js` where checking `includes()` on an array of ObjectIds could fail. 
  - *Fix:* Changed to use `some()` with explicit `.toString()` conversion.

### ⚡ Performance Optimizations
- **Project Model:** Added compound indexes to support frequent query patterns:
  - `{ assignedExpert: 1, status: 1 }` (Expert dashboard queries)
  - `{ status: 1, assignedAt: 1, draftSubmitted: 1 }` (Cron job timeout monitor)
  - `{ clientId: 1, status: 1 }` (Client dashboard queries)
- **Notification Model:** Added compound index `{ userId: 1, createdAt: -1 }` to optimize fetching user notifications sorted by time.


### ✅ Best Practices
- **Frontend Code Quality:** Fixed TypeScript errors and removed unused imports in `ClientProjectDetailsPage.tsx`.

---

## Email Notification System
**Date:** 2026-02-07
**Action:** Implemented email notifications using `nodemailer`.

### 📧 New Features
- **Email Service:** Created `services/email.service.js` to handle email sending with templates.
- **Workflow Integration:**
  - **Project Assignment:** Emails sent to experts when assigned/reassigned (`expert.service.js`, `review.service.js`, `project.service.js`).
  - **Draft Submission:** Emails sent to clients when experts submit drafts (`expert.service.js`).
  - **Draft Decision:** Emails sent to experts upon approval/rejection (`review.service.js`).
  - **Project Expiration:** Emails sent to clients if a project expires after max attempts (`project.service.js`, `review.service.js`).

> [!NOTE]
> SMTP credentials (`SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`) must be added to `.env` for emails to be sent. Code gracefully falls back to console logs if credentials are missing.

---

## Codebase Audit & Patch — Date Validation, Email Reliability, Security & Code Quality
**Date:** 2026-02-10  
**Author:** Qamber  

---

### 🎯 Summary
Comprehensive audit and patch addressing date validation enforcement, email service reliability, critical runtime bugs, security vulnerabilities, and code quality improvements across 14 existing files.

---

### 🔧 Date Validation Bug — Fixed

| Layer | File | Fix |
|-------|------|-----|
| **UI** | `PostProjectPage.tsx` | Added `min={todayStr}` attribute on deadline date input + client-side validation before submit |
| **Controller** | `project.controller.js` | Added server-side check: `parsedDeadline < today` → returns 400 with clear message |
| **Schema** | `project.model.js` | Added Mongoose `validate` function on `deadline` field — rejects dates before today on new documents |

---

### 📧 Email Service — Overhauled

**File:** `email.service.js`

| Improvement | Details |
|------------|---------|
| **Retry logic** | 3 attempts with exponential backoff (1s → 2s → 4s) |
| **Timeouts** | `connectionTimeout: 10s`, `socketTimeout: 15s` |
| **Lazy init** | Transporter only created when `SMTP_USER`/`SMTP_PASS` exist — avoids crash on missing config |
| **Startup verify** | `verifyTransporter()` called on boot, logs SMTP reachability status |
| **Non-blocking** | All email calls across services changed to fire-and-forget (`.catch(...)`) |
| **Auto-secure** | Port 465 auto-detects `secure: true` |

**Files with non-blocking email changes:**
- `expert.service.js` — `claimProjectService`, `submitDraftService`
- `review.service.js` — `approveDraftService`, `rejectDraftService`, `autoReassignProject`
- `project.service.js` — `markExpiredProjectsService`, `autoReassignTimedOutProject`

---

### 🐛 Critical Bug Fixes

| Bug | File | Issue | Fix |
|-----|------|-------|-----|
| **ObjectId passed as email recipient** | `review.service.js` line 45 | `sendDraftApprovalEmail(project.assignedExpert, project)` received an un-populated ObjectId instead of expert object — would crash or send blank emails | Now fetches expert with `User.findById()` before emailing |
| **Timer uses wrong field** | `project.service.js` line 160 | `getProjectStatusService()` calculated remaining time from `createdAt` but the 3-hour timer starts at `assignedAt` | Changed to use `assignedAt`; returns zeros when project is not `in_progress` |
| **Skills required for all roles** | `user.model.js` | `skills: { required: true }` blocked client registration since clients have no skills | Changed to `default: []` |
| **Null-user ghost token** | `auth.middleware.js` | If user was deleted after token was issued, `req.user` would be null causing crashes | Added null check → returns 401 |

---

### 🔐 Security Fixes

| Fix | File | Details |
|-----|------|---------|
| **Input validation** | `auth.controller.js` | Added email regex validation, password min-length (6), required field checks for login/signup |
| **Input sanitization** | `project.controller.js` | String fields (`title`, `description`, etc.) are `.trim()`'d before persistence |
| **Error handling** | `profile.controller.js` | Added try/catch — previously unhandled rejections crashed the server |
| **Error handling** | `admin.controller.js` | Added try/catch — same issue |
| **Ghost token guard** | `auth.middleware.js` | Returns 401 when token references a deleted user |

---

### ✅ Code Quality & Config

| Change | File | Details |
|--------|------|---------|
| **Removed unused imports** | `PostProjectPage.tsx` | `PlusCircle`, `CheckCircle2`, `AnimatePresence` |
| **Removed unused state** | `PostProjectPage.tsx` | `step`, `setStep` |
| **Removed console.log** | `project.controller.js` | Gemini recommendation log removed for production |
| **Config documentation** | `.env.example` | Added all env vars: `SMTP_*`, `GEMINI_API_KEY`, `FRONTEND_URL`, `ALLOWED_ORIGINS` |
| **Startup verification** | `index.js` | Calls `verifyTransporter()` after MongoDB connects |
| **ID consistency** | `profile.controller.js` | Fixed `req.user._id` → `req.user.id` |

---

### 🧪 How to Test

**Date validation:**
```bash
# Should return 400
curl -X POST http://localhost:5000/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"title":"Test","description":"test","budgetType":"fixed","deadline":"2020-01-01"}'
```

**Email service:**
- Without SMTP vars → logs `[EMAIL MOCK]`, no crash
- With invalid SMTP → logs `[EMAIL ERROR]` with retries, API responses succeed
- With valid SMTP → logs `[EMAIL SENT]` after successful delivery

**Auth validation:**
```bash
# Should return 400
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{}'
```

---

### 📋 Files Modified (14 total)

| File | Changes |
|------|---------|
| `models/project.model.js` | Schema deadline validator |
| `models/user.model.js` | skills: required → default |
| `services/email.service.js` | Full rewrite: retry, timeouts, lazy init, verify |
| `services/expert.service.js` | Non-blocking email calls |
| `services/review.service.js` | ObjectId fix + non-blocking emails |
| `services/project.service.js` | Timer fix + non-blocking emails |
| `controllers/project.controller.js` | Date validation + input sanitization |
| `controllers/auth.controller.js` | Input validation (email, password) |
| `controllers/profile.controller.js` | Try/catch + ID consistency |
| `controllers/admin.controller.js` | Try/catch error handling |
| `middleware/auth.middleware.js` | Null-user guard |
| `index.js` | Email transporter verification on startup |
| `.env.example` | All env vars documented |
| `PostProjectPage.tsx` | min-date, client validation, cleanup |

---

## Email Service Migration — Nodemailer → Resend
**Date:** 2026-02-11  
**Author:** Qamber  

---

### 🎯 Summary
Migrated the email service from `nodemailer` (SMTP-based) to **Resend** (API-based) for more reliable, modern email delivery without needing SMTP credentials.

---

### 🔄 What Changed

| Change | Details |
|--------|---------|
| **Replaced dependency** | Removed `nodemailer`, installed `resend` |
| **Rewrote email service** | `email.service.js` now uses the Resend SDK instead of SMTP transport |
| **Updated env vars** | Replaced `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` with `RESEND_API_KEY` and `RESEND_FROM_EMAIL` |
| **Kept same API** | All exported functions unchanged — zero impact on consuming services |

---

### 📁 Files Modified (4 total)

| File | Changes |
|------|---------|
| `services/email.service.js` | Full rewrite: nodemailer → Resend SDK, same exports preserved |
| `package.json` | Removed `nodemailer`, added `resend` |
| `.env` | Added `RESEND_API_KEY`, `RESEND_FROM_EMAIL` |
| `.env.example` | Replaced SMTP vars with Resend vars |

---

### 📧 Configuration

```env
RESEND_API_KEY=re_xxxxx          # Your Resend API key
RESEND_FROM_EMAIL=Unhire <noreply@yourdomain.com>  # Requires verified domain
```

> [!NOTE]
> The default sender is `onboarding@resend.dev` (Resend test address — can only send to your account email). Verify a custom domain at https://resend.com/domains to send to any recipient.

---

### 🧪 How to Test

**Without API key** → logs `[EMAIL MOCK]`, no crash  
**With API key** → logs `[EMAIL SENT]` after successful delivery  
**With invalid key** → logs `[EMAIL ERROR]` with retries, API responses still succeed  

---

## Authentication System Overhaul & Security Hardening
**Date:** 2026-02-11
**Author:** Qamber

---

### 🎯 Summary
Complete refactoring of the authentication system to implement industry best practices, including secure cookies for JWT storage, strict input validation, 2FA, rate limiting, and centralized frontend auth state.

---

### 🔒 Security & Architecture Changes

| Feature | Implementation Details |
|---------|------------------------|
| **Secure Cookies** | Replaced `localStorage` with `httpOnly` cookies for JWT tokens. Prevents XSS attacks. |
| **Middleware Validation** | Replaced manual validation with strict **Joi Schema Validation** (`middleware/validate.js`). |
| **Frontend Auth Context** | Created `AuthContext.tsx` and centralized `apiClient` (Axios) to handle auth state and errors globally. |
| **Rate Limiting** | Added `express-rate-limit` to login, signup, and reset-password routes. |
| **2FA & Password Reset** | Implemented email-based Two-Factor Authentication (Login) and Password Reset flow. |

---

### 🐛 Fixes & Improvements

| Area | Fix |
|------|-----|
| **HTTP 400 Errors** | Fixed 400 errors in Signup/Reset Password by ensuring strict payload validation on the backend. |
| **HTTP 401 Loop** | Fixed session loss issues by automating token attachment via cookies. |
| **Notification Bug** | Fixed `SettingsPage.tsx` bug where sliders interfered with each other (moved component outside parent). |
| **Project Timeout** | Fixed logic to properly expire projects after 3 hours and track expert rejections. |

---

### 📁 Files Modified
- `Backend/index.js` (Added helmet, cookie-parser, error middleware)
- `Backend/controllers/auth.controller.js` (Rewritten for cookies & validation)
- `Backend/routes/auth.routes.js` (Added validation & rate limiters)
- `Frontend/src/context/AuthContext.tsx` (New global auth provider)
- `Frontend/src/api/client.ts` (New axios client)
- `Frontend/src/pages/LoginPage.tsx` (Rewritten for 2FA flow)
- `Frontend/src/pages/SignupPage.tsx` (Using new AuthContext)
