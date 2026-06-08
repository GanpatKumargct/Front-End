# Frontend Migration Plan - Part 1: Assessment & Architecture

## 1. Current Architecture Assessment

### 1.1 Figma Code Structure Analysis
The current Figma code (`Design ATS Tool`) is a single-page React application with all logic contained in a single `App.tsx` file (1002 lines). Key observations:

| Aspect | Current State |
|--------|---------------|
| **Architecture** | Monolithic App.tsx with inline state management |
| **Components** | All in `src/app/components/` - no separation by module |
| **State Management** | React `useState` only - no Redux/Zustand |
| **Routing** | Conditional rendering with `appView` and `activeTab` state |
| **Data Layer** | Static mock data in `src/Data/` files |
| **Styling** | Tailwind CSS with custom theme variables |
| **Auth** | No authentication - hardcoded "Access Platform" button |

### 1.2 Key Components in Figma Code
- `App.tsx` - Main application with all routing logic
- `KanbanBoard.tsx` - Drag-and-drop candidate pipeline
- `ListView.tsx` - Tabular candidate view
- `CandidateCard.tsx` - Individual candidate card for Kanban
- `CandidateDetailModal.tsx` - Candidate detail sidebar
- `DashboardPage.tsx` - Recruitment metrics dashboard
- `InterviewsPage.tsx` - Interview scheduling/management
- `RolesView.tsx` - Department roles listing
- `SettingsPage.tsx` - Settings configuration
- `RequisitionPage.tsx`, `RequisitionWorkspace.tsx` - Purchase module
- Various modal components (StageTransitionModal, NewJobModal, etc.)

### 1.3 Backend Integration Points (from `/backend/docs`)
The backend is a FastAPI application with:
- **Base URL**: `http://localhost:8000` (from `.env` `VITE_BASE_URL`)
- **Authentication**: Zoho SSO OAuth 2.0 flow
- **Key Modules**: Entity, Field Definition, Form Layouts, Field Dependencies, Workflow, Permissions, Notifications, Files, Records
- **Two databases**: Operational PostgreSQL + Monitoring PostgreSQL

### 1.4 Technical Debt & Issues
1. **No authentication flow** - Hardcoded access, needs Zoho SSO integration
2. **Single file architecture** - Not scalable for production
3. **No API layer** - All mock data, never fetches from backend
4. **No error/loading states** - UI has no async state handling
5. **No route separation** - Everything in one file
6. **No component reusability** - Components not shared across modules
7. **Inline styles** - Some inline styles mixed with Tailwind

---

## 2. Proposed Architecture

### 2.1 Folder Structure
```
frontend/
├── public/
│   └── assets/           # Static assets, favicons
├── src/
│   ├── app/
│   │   ├── routes.ts       # React Router v7 lazy-loaded routes
│   │   ├── store.ts        # Redux Toolkit store configuration
│   │   ├── providers.tsx   # QueryClient, Theme, Auth providers
│   │   └── App.tsx         # Root component
│   │
│   ├── modules/            # Feature modules (parallel to backend)
│   │   ├── ats/
│   │   │   ├── api/        # API integration points
│   │   │   │   ├── candidates.ts
│   │   │   │   ├── jobs.ts
│   │   │   │   ├── requisitions.ts
│   │   │   │   └── interviews.ts
│   │   │   ├── components/ # Module-specific components
│   │   │   │   ├── KanbanBoard.tsx
│   │   │   │   ├── ListView.tsx
│   │   │   │   ├── CandidateCard.tsx
│   │   │   │   ├── CandidateProfile.tsx
│   │   │   │   ├── Dashboard.tsx
│   │   │   │   ├── Interviews.tsx
│   │   │   │   └── RequisitionWorkspace.tsx
│   │   │   ├── hooks/      # Module-specific hooks
│   │   │   │   └── useATS.ts
│   │   │   └── index.ts    # Barrel export
│   │   ├── purchase/
│   │   └── hrms/           # Future module placeholder
│   │
│   ├── shared/             # Reusable across entire app
│   │   ├── api/
│   │   │   ├── client.ts   # Axios instance with interceptors
│   │   │   └── queryKeys.ts
│   │   ├── components/
│   │   │   ├── ui/         # shadcn/ui components
│   │   │   ├── layout/     # Sidebar, Navbar, DashboardLayout
│   │   │   └── data/       # Table, DataGrid components
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── usePermissions.ts
│   │   │   └── useFormEngine.ts
│   │   ├── utils/
│   │   ├── constants/
│   │   └── theme/
│   │
│   ├── assets/
│   │   ├── images/
│   │   ├── icons/
│   │   └── logos/
│   ├── main.tsx
│   └── index.css
├── .env                  # Environment variables
├── .env.example
├── vite.config.ts
├── tailwind.config.ts
├── eslint.config.js
├── prettier.config.js
└── package.json
```

### 2.2 State Management Strategy
- **Redux Toolkit**: Global state for auth, themes, module selection
- **React Query (TanStack)**: Server state for API data, caching, loading states
- **Local useState**: Component-specific UI state (modals, filters)

### 2.3 Authentication Architecture
```typescript
// Flow:
// 1. User clicks "Access Platform" -> redirect to /api/auth/login
// 2. Zoho OAuth -> callback with JWT token
// 3. Store token in localStorage
// 4. Axios interceptor adds Bearer token to all requests
// 5. Protected routes check for valid token
```

---

## 3. Backend Integration Plan

### 3.1 Environment Configuration
```env
# .env
VITE_BASE_URL=http://localhost:8000
VITE_API_BASE_URL=/api
VITE_FRONTEND_URL=http://localhost:5173
```

### 3.2 API Integration Points (ATS Module)
Based on `frontend.md` and `API_REFERENCE.md`:

| Component | Endpoint | Method | Purpose |
|-----------|----------|--------|---------|
| Auth | `/api/auth/login` | GET | Redirect to Zoho SSO |
| Auth | `/api/auth/me` | GET | Get current user |
| Candidates | `/api/entity/candidates/records` | POST/GET | CRUD operations |
| Jobs | `/api/entity/jobs/records` | POST/GET | Job requisitions |
| Interviews | `/api/entity/interviews/records` | POST/GET | Interview scheduling |
| Form Render | `/api/form/render` | POST | Dynamic form loading |
| Workflows | `/api/workflow/context` | POST | Get workflow state |

### 3.3 Data Transformation
- Convert mock data structures to match backend API responses
- Add loading, error, and empty states to all API-driven views
- Implement proper error handling with toast notifications

---

## 4. Module-Specific Refactoring (ATS Focus)

### 4.1 Candidate Flow
- Move candidate state to Redux slice
- Create API hooks for candidate CRUD
- Implement proper loading skeletons
- Add error boundaries

### 4.2 Kanban Board
- Refactor to use Redux for state updates
- Connect to backend API for status transitions
- Add optimistic updates for smooth UX

### 4.3 Dashboard
- Replace mock data with API calls
- Add loading states for metrics
- Implement proper empty state handling