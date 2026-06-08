# 💝 TDC Matchmaker — The Date Crew Internal Tool

A full-stack matchmaker dashboard built for The Date Crew's internal team to manage clients, view biodata, run a matching algorithm, and generate AI-powered introduction emails.

---

## 🔐 Demo Login Credentials

| Name | Email | Password | Role |
|------|-------|----------|------|
| Priya Sharma | priya@thedatecrew.com | matchmaker123 | Senior Matchmaker (10 clients) |
| Arjun Mehta | arjun@thedatecrew.com | matchmaker123 | Matchmaker (5 clients) |

---

## 🚀 Running Locally

### Prerequisites
- Node.js v18+
- OpenAI API Key (get one at platform.openai.com)

### Backend Setup
```bash
cd backend
cp .env.example .env          # Copy environment file
# Edit .env and add your OpenAI API key
npm install
npm run dev                   # Starts on http://localhost:5000
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev                   # Starts on http://localhost:5173
```

Open http://localhost:5173 in your browser.

---

## 📁 Project Structure

```
tdc-matchmaker/
│
├── backend/
│   ├── src/
│   │   ├── index.js              ← Server entry point
│   │   ├── models/
│   │   │   ├── user.model.js     ← Matchmaker accounts
│   │   │   ├── customer.model.js ← TDC client profiles (15)
│   │   │   └── matchPool.model.js← 100+ matching profiles
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── customer.controller.js
│   │   │   ├── match.controller.js
│   │   │   └── ai.controller.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── customer.routes.js
│   │   │   ├── match.routes.js
│   │   │   └── ai.routes.js
│   │   ├── middleware/
│   │   │   └── auth.middleware.js ← JWT cookie verification
│   │   └── services/
│   │       └── matching.service.js ← Core scoring algorithm
│   └── .env.example
│
└── frontend/
    └── src/
        ├── App.jsx               ← Router setup
        ├── context/
        │   └── AuthContext.jsx   ← Global user state
        ├── services/             ← API call functions
        ├── pages/
        │   ├── LoginPage.jsx
        │   ├── DashboardPage.jsx
        │   ├── CustomerDetailPage.jsx
        │   └── MatchesPage.jsx
        └── components/
            ├── layout/           ← Sidebar, PageLayout
            ├── dashboard/        ← CustomerCard, StatsBar
            ├── customer/         ← ProfileSection, NotesEditor
            ├── match/            ← MatchCard
            └── ui/               ← StatusBadge, Spinner, MatchScoreBadge
```

---

## 🧠 Tech Stack & Why

| Layer | Tech | Reason |
|-------|------|--------|
| Frontend | React + Vite | Fast dev server, modern React with hooks |
| Styling | Tailwind CSS | Utility-first, rapid clean UI |
| Routing | React Router v6 | Declarative nested routes |
| HTTP | Axios | Cleaner API calls than fetch, interceptors |
| Auth | JWT + HTTP-only Cookies | Secure, prevents XSS attacks |
| Backend | Node.js + Express | Lightweight REST API |
| AI | OpenAI GPT-3.5 | Personalized intro emails |
| Notifications | react-hot-toast | Beautiful non-intrusive toasts |

---

## ⚙️ Matching Algorithm

### For Male Customers
Matches against female profiles using these weighted criteria:

| Criteria | Max Score | Logic |
|----------|-----------|-------|
| Age | 20 | Female 2-5 years younger = full score |
| Height | 15 | Male should be taller by 10-25cm |
| Income | 15 | Female earns same or less |
| Kids preference | 20 | Exact match = 20, flexible = 12 |
| Religion | 10 | Same religion preferred |
| Diet | 10 | Diet compatibility |
| Languages | 10 | Shared languages |
| Relocation | 10 | Compatible relocation plans |

Total max = 110, normalized to 0-100.

### For Female Customers
Matches against male profiles with thoughtful value-based logic:

| Criteria | Max Score | Logic |
|----------|-----------|-------|
| Education tier | 15 | IIT/IIM/PhD = 15, Masters = 10, Bachelors = 5 |
| Income | 15 | Male earns equal or more |
| Kids | 20 | Preference alignment |
| Religion | 10 | Same religion |
| Diet | 10 | Compatibility |
| Languages | 10 | Shared languages |
| Relocation | 10 | Aligned preferences |
| Pets | 5 | Bonus: pets match |
| Family type | 5 | Bonus: family type match |

### Match Labels
- **High Potential** (80-100): Strong match on most criteria
- **Good Match** (60-79): Solid compatibility
- **Possible Match** (40-59): Some alignment
- **Low Compatibility** (<40): Mismatched on key factors

---

## 🤖 AI Integration (OpenAI)

Two AI-powered features:

### 1. Personalized Intro Email
- **Endpoint**: `POST /api/ai/intro`
- **Model**: GPT-3.5-turbo
- **Prompt**: Sends both profiles to GPT, asks for a warm 3-4 sentence matchmaker intro
- **Fallback**: If OpenAI is unavailable, a template intro is returned
- **Used in**: MatchCard → "AI Intro" button

### 2. Match Explanation
- **Endpoint**: `POST /api/ai/explain`
- **Model**: GPT-3.5-turbo
- **Output**: 2-3 sentence human-readable compatibility explanation

---

## 🔐 Authentication Flow

1. Matchmaker submits email + password to `POST /api/auth/login`
2. Backend verifies credentials, creates JWT token
3. JWT stored in **HTTP-only cookie** (not localStorage — more secure!)
4. Every subsequent request automatically sends the cookie
5. `auth.middleware.js` verifies the JWT on all protected routes
6. On logout: cookie is cleared via `POST /api/auth/logout`

---

## 📝 Assumptions Made

1. **No database** — all data is stored in JavaScript arrays (models). In production, this would be MongoDB/PostgreSQL.
2. **Passwords stored as plain text** — for demo only. Production must use bcrypt hashing.
3. **Mock email sending** — "Send Match" logs to console. Production uses Nodemailer/SendGrid.
4. **Static matchmaker accounts** — real app would have admin panel to create/manage accounts.
5. **Profile photos** — set to null; real app would use Cloudinary for image uploads.
6. **Indian matrimonial context** — fields like Manglik, Gotra, Caste are included as they are standard in Indian matchmaking apps like Shaadi.com and Jeevansathi.

---

## 📮 Submission

**Email**: tech@thedatecrew.com  
**Subject**: Full Stack Developer Internship - [Your Name] - Assignment
