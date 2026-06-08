# Frontend Migration Plan - Part 2: Folder Structure & Production Readiness

## 5. Detailed Folder Restructuring

### 5.1 Current vs Target Structure

| Current | Target |
|---------|--------|
| `src/app/App.tsx` | `src/app/App.tsx` (simplified) |
| `src/app/components/*.tsx` | `src/modules/ats/components/*.tsx` |
| `src/Data/*.tsx` | `src/modules/ats/api/mockData.ts` |
| N/A | `src/shared/api/client.ts` |
| N/A | `src/shared/store/` |

### 5.2 Component Migration Matrix

| Component | Current Location | New Location | Notes |
|-----------|-----------------|--------------|-------|
| App.tsx | src/app/App.tsx | src/app/App.tsx | Split into providers + routes |
| KanbanBoard | src/app/components | modules/ats/components | Requires API integration |
| ListView | src/app/components | modules/ats/components | Requires API integration |
| CandidateCard | src/app/components | modules/ats/components | Pure presentational - reusable |
| CandidateDetailModal → CandidateProfile | src/app/components | modules/ats/components | Rename for clarity |
| DashboardPage | src/app/components | modules/ats/components | Rename to Dashboard |
| InterviewsPage | src/app/components | modules/ats/components | Requires API integration |
| RolesView | src/app/components | modules/ats/components | Pure presentational |
| SettingsPage | src/app/components | modules/ats/components | Settings integration per frontend.md |
| RequisitionPage | src/app/components/Purchase | modules/purchase/components | Move to purchase module |
| RequisitionWorkspace | src/app/components/Purchase | modules/purchase/components | Move to purchase module |

---

## 6. Production Readiness Checklist

### 6.1 Authentication (REQUIRED)
- [ ] Zoho SSO redirect handler
- [ ] JWT token storage and refresh
- [ ] Axios interceptor for Bearer tokens
- [ ] Protected route wrapper
- [ ] Auth context/provider setup

### 6.2 State Management
- [ ] Redux Toolkit store configuration
- [ ] Auth slice with user state
- [ ] ATS module slices (candidates, jobs)
- [ ] API integration with React Query
- [ ] Optimistic updates for mutations

### 6.3 UI Components
- [ ] Loading skeletons for all API views
- [ ] Empty states with illustrations
- [ ] Error boundaries and error pages
- [ ] Toast notifications (sonner)
- [ ] Form validation with proper error messages

### 6.4 API Layer
- [ ] Axios client with base URL from env
- [ ] Request/response interceptors
- [ ] Error handling middleware
- [ ] React Query hooks for each entity
- [ ] Pagination support

### 6.5 Code Quality
- [ ] ESLint configuration
- [ ] Prettier formatting
- [ ] TypeScript strict mode configuration
- [ ] Component prop types with interfaces
- [ ] Unit tests structure

### 6.6 Build & Deploy
- [ ] Docker configuration (frontend service in docker-compose.yml)
- [ ] Environment variable handling
- [ ] Production build optimization

---

## 7. Prioritized Implementation Roadmap

### Phase 1: Foundation (Week 1)
**Goal**: Set up project structure with authentication
1. Configure Redux Toolkit store
2. Create API client with Axios
3. Implement Zoho SSO authentication flow
4. Set up React Router with protected routes
5. Create shared UI components (button, modal, table)

### Phase 2: ATS Module - Core (Week 2)
**Goal**: Migrate ATS views with API integration
1. Create candidates Redux slice
2. Build API hooks for candidates endpoint
3. Migrate DashboardPage with loading states
4. Migrate InterviewsPage with API integration
5. Implement proper error handling

### Phase 3: ATS Module - Pipeline (Week 3)
**Goal**: Full candidate pipeline functionality
1. Migrate KanbanBoard with API mutations
2. Migrate ListView with API integration
3. Connect CandidateProfile to backend
4. Implement workflow transition API calls
5. Add optimistic updates

### Phase 4: ATS Module - Settings (Week 4)
**Goal**: Admin configuration as per frontend.md
1. Implement entity management UI
2. Build field definitions interface
3. Create form layout builder
4. Add workflow configuration screens
5. Permission management UI

### Phase 5: Purchase Module (Week 5)
**Goal**: Migrate purchase module
1. Move RequisitionPage to purchase module
2. Move RequisitionWorkspace to purchase module
3. Add API integration for purchase workflows
4. Create purchase-specific components

### Phase 6: Production Hardening (Week 6)
**Goal**: Production-ready application
1. Add comprehensive loading states
2. Implement error boundaries
3. Add toast notifications
4. Performance optimization
5. Final testing and bug fixes

---

## 8. Settings Module Integration (Admin Configuration)

### 8.1 Entity Management
**Endpoint**: `POST /api/entities`
```typescript
// UI Requirements:
// - Entity name input (text)
// - Label input (text)
// - Module selector dropdown
// - Features toggle (workflow, amendment)
```

### 8.2 Field Definitions
**Endpoint**: `POST /api/field-definitions`
```typescript
// UI Requirements:
// - Field type selector (text, textarea, number, enum, boolean, date, email, phone, file, fk)
// - Required toggle
// - Constraints editor (max_length, min, max)
// - Placeholder and help text inputs
```

### 8.3 Form Layouts
**Endpoint**: `POST /api/form-layouts`
```typescript
// UI Requirements:
// - Section builder (drag-drop field arrangement)
// - Column width selector (full, half, third, quarter)
// - Action button configuration
```

### 8.4 Workflow Definitions
**Endpoint**: `POST /api/workflow-definitions`
```typescript
// UI Requirements:
// - State machine visualizer
// - State color picker (gray, yellow, orange, green, red)
// - Terminal/initial state toggles
// - Routing rules configuration
```

---

## 9. API Integration Strategy

### 9.1 Base API Configuration
```typescript
// src/shared/api/client.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
});

// Request interceptor for auth
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### 9.2 React Query Integration
```typescript
// src/shared/api/queryKeys.ts
export const queryKeys = {
  candidates: (filters: Record<string, unknown>) => ['candidates', filters],
  jobs: (filters: Record<string, unknown>) => ['jobs', filters],
  interviews: (filters: Record<string, unknown>) => ['interviews', filters],
  entity: (name: string) => ['entity', name],
  workflow: (recordId: string) => ['workflow', recordId],
};
```

### 9.3 Loading States Pattern
All API-driven components will follow this pattern:
1. Show skeleton loaders while fetching
2. Show empty state illustration if no data
3. Show error message if fetch fails
4. Show retry button on error

---

## 10. Risks & Mitigation

| Risk | Mitigation |
|------|------------|
| Missing backend endpoints | Document assumptions, use mock data as fallback |
| Zoho SSO complexity | Test with dev mode auto-admin creation |
| State management learning curve | Start with simple slices, expand gradually |
| UI regression | Maintain exact Tailwind classes, visual QA |
| Performance with large candidate lists | Implement virtual scrolling for Kanban/list |