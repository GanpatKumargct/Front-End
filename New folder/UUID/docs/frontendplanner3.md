# Frontend Migration Plan - Part 3: Admin Settings Proposal

## 11. Admin Configuration (Settings Module)

### 11.1 Settings Module Structure
Based on `frontend.md`, the admin dashboard requires the following routes under settings:

```
src/modules/ats/pages/admin/
├── EntityManagement/
│   ├── EntityList.tsx      - Show all entities
│   ├── EntityCreate.tsx    - Create/edit entity
│   └── EntityView.tsx      - View entity details
├── FieldDefinitions/
│   ├── FieldList.tsx       - List fields for entity
│   └── FieldCreate.tsx     - Create field form
├── FormLayouts/
│   ├── LayoutList.tsx      - List layouts
│   └── LayoutBuilder.tsx   - Drag-drop form designer
├── FieldDependencies/
│   ├── DependencyList.tsx  - List conditional rules
│   └── DependencyEditor.tsx - Create/edit rule
├── Workflows/
│   ├── WorkflowList.tsx    - List workflows
│   ├── WorkflowEditor.tsx  - State machine designer
│   └── TransitionEditor.tsx - Edit transitions
├── Notifications/
│   └── TemplateList.tsx    - List templates
└── Permissions/
    ├── RoleRules.tsx       - Manage role rules
    └── Assignments.tsx     - Manage record assignments
```

### 11.2 Current SettingsPage Analysis
The current `SettingsPage.tsx` has 6 tabs:
1. **Recruiters & Team** - Currently shows mock recruiter data
2. **Departments** - Currently shows department cards
3. **Hiring Workflows** - Currently shows 3 hardcoded workflows
4. **Notifications** - Currently shows 6 notification toggles
5. **Automation** - Currently shows 4 automation toggles
6. **Permissions & Roles** - Currently shows 4 hardcoded roles

### 11.3 Proposed Admin API Integration

#### Entity Management API Flow
```typescript
// GET /api/entities?skip=0&limit=100
// POST /api/entities { name, label, custom_fields }
// PUT /api/entities/{entity_id}
// DELETE /api/entities/{entity_id}

// UI: EntityTable with columns
// - Name, Label, Status, Created At, Actions
// - Actions: Edit, Delete, View Fields
```

#### Field Definition API Flow
```typescript
// GET /api/field-definitions?entity_id={uuid}
// POST /api/field-definitions { entity_id, name, label, field_type, ... }
// Supported field types: text, textarea, number, enum, boolean, date, email, phone, file, fk
```

#### Form Layout API Flow
```typescript
// GET /api/form-layouts?entity_id={uuid}
// POST /api/form-layouts { entity_id, name, sections, form_actions, workflow_enabled }

// Sections structure:
// { id, label, columns, fields: [{ name, width, order }] }
```

#### Workflow API Flow
```typescript
// GET /api/workflow-definitions?entity_id={uuid}
// POST /api/workflow-definitions { entity_id, name, initial_state, states, routing_rules }

// States: { name, label, color, is_initial, is_terminal, locked_fields }
// Transitions: { workflow_id, name, label, from_state, to_state, allowed_roles, actions }
```

---

## 12. API Endpoints Reference Summary

### 12.1 Authentication Endpoints
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/login` | GET | Redirect to Zoho SSO |
| `/api/auth/callback` | GET | Handle OAuth callback, returns JWT |
| `/api/auth/me` | GET | Get current user info |

### 12.2 ATS Business Endpoints (from API_REFERENCE.md)
| Endpoint | Method | Entity |
|----------|--------|--------|
| `/api/entity/candidates/records` | POST/GET | Candidates |
| `/api/entity/jobs/records` | POST/GET | Jobs |
| `/api/entity/interviews/records` | POST/GET | Interviews |
| `/api/form/render` | POST | Form rendering |
| `/api/form/save-draft` | POST | Save draft |
| `/api/form/submit` | POST | Submit form |
| `/api/workflow/bind` | POST | Bind workflow to record |
| `/api/workflow/context` | POST | Get workflow state |
| `/api/workflow/transition` | POST | Execute transition |

### 12.3 Admin Configuration Endpoints
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/entities` | POST | Create entity |
| `/api/entities` | GET | List entities |
| `/api/field-definitions` | POST | Create field |
| `/api/field-definitions` | GET | List fields |
| `/api/form-layouts` | POST | Create layout |
| `/api/form-layouts` | GET | List layouts |
| `/api/field-dependencies` | POST | Create dependency |
| `/api/field-dependencies` | GET | List dependencies |
| `/api/workflow-definitions` | POST | Create workflow |
| `/api/workflow-definitions` | GET | List workflows |
| `/api/workflow-transitions` | POST | Create transition |
| `/api/workflow-transitions` | GET | List transitions |
| `/api/permissions/role-rules` | POST | Create role rule |
| `/api/permissions/assignments` | POST | Create assignment |
| `/api/notification-templates` | POST | Create template |

---

## 13. File Upload Integration (from frontend.md)

### 13.1 Single Upload Flow
```typescript
// Step 1: Get presigned URL
// POST /api/files/presigned-url
// { filename, mime_type, size_bytes, module_name: "ats", entity_type, entity_id?, record_id?, attachment_context }

// Step 2: Upload directly to MinIO (PUT to presigned_url)

// Step 3: Confirm upload
// POST /api/files/confirm
// { object_key, original_filename, mime_type, size_bytes }
```

### 13.2 Multipart Upload (for files > threshold)
```typescript
// POST /api/files/multipart/init
// { filename, mime_type, part_count, module_name, entity_type }

// POST /api/files/multipart/complete
// { object_key, upload_id, parts: [{ part_number, etag }] }
```

---

## 14. Environment Variables Required

```env
# .env
VITE_BASE_URL=http://localhost:8000
VITE_API_BASE_URL=/api
VITE_FRONTEND_URL=http://localhost:5173

# For Zoho SSO (handled by backend, but frontend may need for redirects)
VITE_AUTH_REDIRECT_URI=/auth/callback
```

---

## 15. Implementation Sequence for Settings

### Priority Order for Settings Implementation:
1. **Entity Management** - Foundation for all other config
2. **Field Definitions** - Required before form layouts
3. **Form Layouts** - Required for form rendering
4. **Field Dependencies** - Conditional logic
5. **Workflow Definitions + Transitions** - Approval flows
6. **Notification Templates** - Email notifications
7. **Permission Rules + Assignments** - RBAC

> **Note**: Settings UI should follow the component structure guide in `frontend.md` lines 288-316.

---

## 16. Key Design Preservation Rules

Per requirements:
1. **Do NOT change visual design** - All colors, spacing, typography remain as-is
2. **Do NOT remove Tailwind classes** - Preserve exact utility classes
3. **Rename design-tool conventions**:
   - `Frame123` → meaningful component names
   - `Group44` → meaningful component names
   - `Rectangle8` → meaningful component names
4. **Preserve all animations/transitions** - Use exact transition classes