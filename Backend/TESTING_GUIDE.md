# 🧪 Testing Guide - Expert Review & Reassignment System

## Prerequisites

1. **Backend running** on `http://localhost:5000`
2. **MongoDB connected** (check terminal for "✅ MongoDB connected")
3. **Postman** or **curl** installed (for API testing)

---

## Step 1: Get Authentication Tokens

You need JWT tokens for a **Client** and an **Expert** user.

### Option A: Use existing users
If you have existing users, login to get tokens:

```bash
# Login as Client
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "client@example.com", "password": "yourpassword"}'

# Login as Expert  
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "expert@example.com", "password": "yourpassword"}'
```

### Option B: Register new users
```bash
# Register Client
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Client", "email": "testclient@test.com", "password": "Test123!", "role": "client", "skills": []}'

# Register Expert
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Expert", "email": "testexpert@test.com", "password": "Test123!", "role": "expert", "skills": ["JavaScript", "React"]}'
```

**Save the tokens** from the response!

---

## Step 2: Create a Project (as Client)

```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_CLIENT_TOKEN" \
  -d '{
    "title": "Test Project for Review System",
    "description": "Testing the expert review workflow",
    "budgetType": "fixed",
    "budgetAmount": 500,
    "deadline": "2026-02-15T00:00:00Z",
    "category": "Web Development"
  }'
```

**Save the project `_id`** from the response!

---

## Step 3: Expert Claims the Project

```bash
curl -X POST http://localhost:5000/api/expert/claim/PROJECT_ID_HERE \
  -H "Authorization: Bearer YOUR_EXPERT_TOKEN"
```

**Expected Response:**
```json
{
  "message": "Project claimed successfully",
  "project": { "status": "in_progress", ... }
}
```

**✅ Verify:** Check expert's notifications:
```bash
curl http://localhost:5000/api/notifications \
  -H "Authorization: Bearer YOUR_EXPERT_TOKEN"
```
Should show: `"type": "project_assigned"`

---

## Step 4: Expert Submits Draft

```bash
curl -X POST http://localhost:5000/api/expert/submit/PROJECT_ID_HERE \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_EXPERT_TOKEN" \
  -d '{
    "content": "Here is my draft work for the project",
    "url": "https://github.com/example/draft"
  }'
```

**Expected Response:**
```json
{
  "message": "Draft submitted successfully",
  "project": { "status": "submitted", "draftStatus": "pending_review", ... }
}
```

**✅ Verify:** Check client's notifications:
```bash
curl http://localhost:5000/api/notifications \
  -H "Authorization: Bearer YOUR_CLIENT_TOKEN"
```
Should show: `"type": "draft_submitted"`

---

## Step 5: Check Draft Status

```bash
curl http://localhost:5000/api/projects/PROJECT_ID_HERE/draft-status \
  -H "Authorization: Bearer YOUR_CLIENT_TOKEN"
```

**Expected Response:**
```json
{
  "status": "submitted",
  "draftStatus": "pending_review",
  "draftContent": "Here is my draft work...",
  "draftUrl": "https://github.com/example/draft"
}
```

---

## Step 6: Test APPROVE Flow (Happy Path)

```bash
curl -X POST http://localhost:5000/api/projects/PROJECT_ID_HERE/review \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_CLIENT_TOKEN" \
  -d '{"action": "approve"}'
```

**Expected Response:**
```json
{
  "message": "Draft approved successfully. Project is now complete.",
  "project": { "status": "completed", "draftStatus": "accepted" }
}
```

**✅ Verify:** Check expert's notifications for approval:
```bash
curl http://localhost:5000/api/notifications \
  -H "Authorization: Bearer YOUR_EXPERT_TOKEN"
```
Should show: `"type": "draft_approved"`

---

## Step 7: Test REJECT Flow (needs new project)

Create another project and repeat steps 2-4, then:

```bash
curl -X POST http://localhost:5000/api/projects/NEW_PROJECT_ID/review \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_CLIENT_TOKEN" \
  -d '{"action": "reject", "reason": "Needs more detail and examples"}'
```

**Expected Response (if other experts exist):**
```json
{
  "message": "Draft rejected. Project reassigned to a new expert.",
  "reassigned": true,
  "newExpert": { "name": "...", "email": "..." }
}
```

**Expected Response (if no other experts):**
```json
{
  "message": "Draft rejected. No available experts to reassign. Project is now open for claims.",
  "noExpertsAvailable": true
}
```

---

## Step 8: Test Max Attempts Expiration

1. Create a project
2. Have Expert 1 claim → submit → client rejects (attempt 1)
3. Have Expert 2 claim → submit → client rejects (attempt 2)  
4. Have Expert 3 claim → submit → client rejects (attempt 3)

After 3rd rejection:
```json
{
  "message": "Draft rejected. Project has expired after maximum attempts.",
  "expired": true
}
```

Project status will be `"expired"`

---

## Step 9: Test Notification Read Status

```bash
# Mark single notification as read
curl -X PUT http://localhost:5000/api/notifications/NOTIFICATION_ID/read \
  -H "Authorization: Bearer YOUR_TOKEN"

# Mark all as read
curl -X PUT http://localhost:5000/api/notifications/read-all \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🎯 Quick Verification Checklist

| Test | Expected Result | ✅ |
|------|-----------------|---|
| Expert claims project | Status → `in_progress`, notification created | ☐ |
| Expert submits draft | Status → `submitted`, draftStatus → `pending_review` | ☐ |
| Client sees draft | Draft content/URL visible | ☐ |
| Client approves | Status → `completed`, draftStatus → `accepted` | ☐ |
| Client rejects | Auto-reassignment OR no experts available | ☐ |
| 3 rejections | Project → `expired` | ☐ |
| Notifications appear | All state changes trigger notifications | ☐ |
| Mark notification read | Read status updates | ☐ |

---

## 🐛 Troubleshooting

**"Not authorized" error:**
- Check your token is correct and not expired
- Ensure you're using the right role (client for review, expert for submit)

**"Project not found" error:**
- Verify the project ID is correct
- Check if project status allows the action (can't review if not submitted)

**No notifications appearing:**
- Check if the notification was created in MongoDB
- Run: `db.notifications.find()` in MongoDB shell

**Server crashes:**
- Check terminal for error messages
- Verify MongoDB connection string in `.env`

---

## 📅 Testing: Date Validation (2026-02-10 Patch)

### Test 1: Past deadline rejected by API

```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_CLIENT_TOKEN" \
  -d '{"title":"Test","description":"test","budgetType":"fixed","budgetAmount":100,"deadline":"2020-01-01","category":"Web Development"}'
```

**Expected:** `400 { "message": "Deadline cannot be in the past. Please select today or a future date." }`

### Test 2: Valid future deadline accepted

```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_CLIENT_TOKEN" \
  -d '{"title":"Valid Project","description":"testing","budgetType":"fixed","budgetAmount":100,"deadline":"2027-06-01","category":"Web Development"}'
```

**Expected:** `201` success

### Test 3: Frontend date picker

1. Navigate to `/post-project`
2. Click the "Deadline Date" input field
3. **Verify:** Past dates should be greyed out / unselectable

---

## ✉️ Testing: Email Service (2026-02-10 Patch)

### Test 1: No SMTP credentials (graceful fallback)

1. Remove or comment out `SMTP_USER` and `SMTP_PASS` from `.env`
2. Start the server: `npm run dev`
3. **Verify terminal shows:** `[EMAIL] SMTP not configured — emails will be mocked to console.`
4. Trigger any email-sending action (e.g., expert claims project)
5. **Verify terminal shows:** `[EMAIL MOCK] To: ... | Subject: ...`
6. **Verify:** API response returns successfully (not blocked by email)

### Test 2: Invalid SMTP credentials (retry + graceful failure)

1. Set `SMTP_USER=invalid` and `SMTP_PASS=invalid` in `.env`
2. Start the server
3. **Verify terminal shows:** `[EMAIL] SMTP verification failed: ...`
4. Trigger an email action
5. **Verify terminal shows:** 3 retry attempts with `[EMAIL RETRY]` messages
6. **Verify:** API response still returns successfully

### Test 3: Valid SMTP credentials

1. Set valid Gmail App Password credentials in `.env`
2. Start the server
3. **Verify terminal shows:** `[EMAIL] SMTP transporter verified ✅`
4. Trigger email actions → verify emails arrive

---

## 🔐 Testing: Auth & Security (2026-02-10 Patch)

### Test 1: Empty login body

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Expected:** `400 { "message": "Email and password are required" }`

### Test 2: Invalid email format

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"notanemail","password":"Test123!"}'
```

**Expected:** `400 { "message": "Invalid email format" }`

### Test 3: Short password on signup

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"ab","role":"client"}'
```

**Expected:** `400 { "message": "Password must be at least 6 characters" }`

### Test 4: Deleted user token (ghost token)

1. Create a user and get their token
2. Delete the user from MongoDB: `db.users.deleteOne({email: "test@test.com"})`
3. Use their old token:

```bash
curl http://localhost:5000/api/profile \
  -H "Authorization: Bearer OLD_TOKEN"
```

**Expected:** `401 { "message": "User no longer exists" }`

### Test 5: Client signup without skills

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Client User","email":"client@test.com","password":"Test123!","role":"client"}'
```

**Expected:** `201` success (previously failed due to `skills: required`)

---

## 🎯 Extended Verification Checklist (2026-02-10 Patch)

| Test | Expected Result | ✅ |
|------|-----------------|---|
| Past deadline via API | 400 error | ☐ |
| Future deadline via API | 201 success | ☐ |
| Date picker blocks past dates | Grey/disabled | ☐ |
| No SMTP → mock fallback | Console logs, no crash | ☐ |
| Invalid SMTP → retries | 3 attempts logged, API works | ☐ |
| Empty login body | 400 validation error | ☐ |
| Invalid email format | 400 validation error | ☐ |
| Short password | 400 validation error | ☐ |
| Ghost token | 401 response | ☐ |
| Client signup (no skills) | 201 success | ☐ |
| Project status timer | Uses `assignedAt`, not `createdAt` | ☐ |
| Draft approval email | Sends without ObjectId crash | ☐ |
