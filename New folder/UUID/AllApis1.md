# All APIs — Part 1

## Module: Authentication

### Overview

The authentication module handles user identity through Zoho SSO OAuth 2.0. It issues JWTs that authenticate subsequent API requests. The module exists because the system delegates identity management to Zoho rather than maintaining its own user database.

**Why it exists:** All other modules depend on authenticated actor context. Without valid JWTs, no business operations can proceed. The auth module is the gatekeeper for the entire system.

**How it fits:** Every protected endpoint uses `get_current_actor` dependency which validates the JWT and returns an `Actor` object with `id`, `email`, `roles`, and `name`.

---

### Endpoint: `GET /api/auth/login`

#### Purpose

Redirects the user to Zoho's OAuth authorization page to begin the SSO login flow.

#### Business Context

This is the entry point for all authenticated users. It initiates the OAuth handshake that results in a JWT issuance. It must be called before any other protected endpoint.

#### Input

None (query parameters are generated server-side).

#### Processing

1. Validates that `ZOHO_CLIENT_ID` and `ZOHO_CLIENT_SECRET` are configured.
2. Generates a cryptographically random `state` parameter for CSRF protection.
3. Builds the Zoho authorization URL with `response_type=code`, `scope=openid+email+profile`, and `access_type=offline`.
4. Sets an `oauth_state` cookie (HTTP-only, 5-minute max age, SameSite=Lax).
5. Returns a 307 redirect to Zoho.

#### Output

HTTP 307 redirect to `https://accounts.zoho.in/oauth/v2/auth` (or configured `ZOHO_ACCOUNTS_BASE_URL`).

#### Error Scenarios

- `500 AUTH_SSO_NOT_CONFIGURED` — Zoho client credentials are missing from environment configuration.

---

### Endpoint: `GET /api/auth/callback`

#### Purpose

Handles the OAuth callback from Zoho, exchanges the authorization code for tokens, creates a JWT, and redirects back to the frontend.

#### Business Context

Called automatically by the browser after Zoho authentication completes. It is the critical handoff point between Zoho identity and the backend's session management.

#### Input

**Query Parameters:**
- `code` — Authorization code from Zoho.
- `state` — State parameter matching the cookie value.
- `error` — OAuth error code if authentication failed.

#### Processing

1. Validates `state` matches the `oauth_state` cookie.
2. Exchanges `code` for `access_token` and `refresh_token` at Zoho's token endpoint.
3. Fetches user profile from Zoho's `/oauth/v2/userinfo` endpoint.
4. Extracts `email` from the profile.
5. Validates email domain against `ZOHO_ORG_DOMAIN` (defaults to `erp.local`).
6. Assigns roles: `admin` for org domain users, `candidate` for external users.
7. Creates JWT payload with `sub`, `email`, `roles`, `name`, `exp` (1 hour).
8. Encodes JWT using `JWT_SECRET_KEY` and `JWT_ALGORITHM`.
9. Redirects to frontend callback URL with token as query parameter.
10. Deletes `oauth_state` cookie.

#### Output

HTTP 307 redirect to `http://localhost:3000/auth/callback?token=<jwt>` (or configured `FRONTEND_URL`).

#### Possible Next Steps

- Frontend stores JWT and includes it in `Authorization: Bearer <token>` header.
- User can now call any protected endpoint.

#### Error Scenarios

- `400 AUTH_OAUTH_INVALID` — Missing or invalid `code` or `state` parameter, or state mismatch.
- `400 AUTH_OAUTH_INVALID` — Token exchange failed or Zoho userinfo missing email.
- `403 AUTH_ORG_FORBIDDEN` — Email domain does not match configured org domain.

---

### Endpoint: `GET /api/auth/me`

#### Purpose

Returns the authenticated actor's identity and role information.

#### Business Context

Used by the frontend to display the current user's name, email, and roles after login. Also used by other services to verify token validity.

#### Input

**Headers:**
- `Authorization: Bearer <jwt>`

#### Output

```json
{
  "id": "8c81977a-a47d-448c-9f28-4d44fd2ceec0",
  "email": "admin@erp.local",
  "roles": ["admin"],
  "name": "Admin User"
}
```

#### Related APIs

- `GET /api/auth/login` — initiates authentication
- `GET /api/auth/callback` — completes authentication

---

## Module: Entities

### Overview

The entities module manages the dynamic entity catalog — the top-level containers for all configurable business objects. Every form, workflow, and permission rule attaches to an entity.

**Why it exists:** Entities provide the namespace and structure for all dynamic configuration. Without entities, there is no way to define what kind of data the system collects.

**Typical usage flow:** Create entity → add fields → build form layout → define workflow.

---

### Endpoint: `POST /api/entities`

#### Purpose

Creates a new entity definition that acts as a container for fields, layouts, workflows, and records.

#### Business Context

This is always the first step in setting up a new business process. The created entity ID is referenced by all subsequent configuration steps.

#### Input

**Request Body:**
```json
{
  "name": "job_requisition",
  "label": "Job Requisition Form",
  "module_id": null,
  "custom_fields": {
    "owner_module": "ats",
    "display_order": 10,
    "features": {
      "supports_amendment": true,
      "supports_workflow": true
    }
  },
  "schema_version": 1
}
```

**Request Body Fields:**
- `name` (required): Stable entity key. Lowercase, no spaces. Used in all API calls and record storage.
- `label` (required): Human-readable display name.
- `module_id` (optional): Optional module identifier for grouping.
- `custom_fields` (required): Extensible JSONB metadata. `owner_module` identifies which module owns this entity. `features.supports_workflow` enables workflow support. `features.supports_amendment` enables amend capability.
- `schema_version` (optional): Schema version number. Defaults to `1`.

#### Processing

1. Validates that `name` is not already in use (`ENTITY_NAME_EXISTS` error if duplicate).
2. Creates `EntityDefinition` row with `is_active = true`.
3. Sets `created_by` from authenticated actor.
4. Returns serialized entity.

#### Output

```json
{
  "id": "a1b2c3d4-1234-5678-9abc-def012345678",
  "name": "job_requisition",
  "label": "Job Requisition Form",
  "module_id": null,
  "custom_fields": {
    "owner_module": "ats",
    "display_order": 10,
    "features": {
      "supports_amendment": true,
      "supports_workflow": true
    }
  },
  "schema_version": 1,
  "is_active": true,
  "created_by": "8c81977a-a47d-448c-9f28-4d44fd2ceec0",
  "created_at": "2026-06-05T15:00:00+05:30",
  "updated_at": "2026-06-05T15:00:00+05:30"
}
```

#### Possible Next Steps

- Create field definitions: `POST /api/field-definitions` (using the returned `id` as `entity_id`).
- Create form layout: `POST /api/form-layouts`.
- Create workflow definition: `POST /api/workflow-definitions`.

#### Related APIs

- `GET /api/entities` — list all entities
- `GET /api/entities/{entity_id}` — fetch one entity
- `PUT /api/entities/{entity_id}` — update entity
- `DELETE /api/entities/{entity_id}` — soft-delete entity

#### Error Scenarios

- `409 ENTITY_NAME_EXISTS` — Entity name is already in use.
- `422 VALIDATION_INVALID_REQUEST` — Missing required fields (`name`, `label`).

---

### Endpoint: `GET /api/entities`

#### Purpose

Lists all active entity definitions with pagination.

#### Business Context

Used by admin screens and configuration UIs to browse available entity types.

#### Input

**Query Parameters:**
- `skip` (integer, default 0): Number of records to skip. Minimum 0.
- `limit` (integer, default 100, max 500): Maximum records to return.

#### Processing

Queries active (`is_active = true`) `EntityDefinition` rows ordered by creation time. Returns paginated results with total count.

#### Output

```json
{
  "data": [
    {
      "id": "a1b2c3d4-1234-5678-9abc-def012345678",
      "name": "job_requisition",
      "label": "Job Requisition Form",
      "is_active": true,
      "created_at": "2026-06-05T15:00:00+05:30",
      "updated_at": "2026-06-05T15:00:00+05:30"
    }
  ],
  "total": 1
}
```

#### Related APIs

- `POST /api/entities` — create entity
- `GET /api/entities/search` — search entities by name or label
- `GET /api/entities/{entity_id}` — fetch one entity

---

### Endpoint: `GET /api/entities/search`

#### Purpose

Searches entity definitions by name or label with optional pagination.

#### Business Context

Used by search/filter components in admin UIs. More efficient than fetching all entities when looking for a specific type.

#### Input

**Query Parameters:**
- `q` (string, required, min length 1): Search query matched against `name` and `label`.
- `skip` (integer, default 0): Pagination offset.
- `limit` (integer, default 100, max 500): Page size.

#### Processing

Performs case-insensitive search on `name` and `label` columns. Returns matching active entities with total count.

#### Output

Same shape as `GET /api/entities` — `{"data": [...], "total": N}`.

---

### Endpoint: `GET /api/entities/{entity_id}`

#### Purpose

Retrieves a single entity definition by its UUID.

#### Business Context

Used when loading entity details for editing or when referencing an entity in downstream API calls.

#### Input

**Path Parameters:**
- `entity_id` (UUID string): The entity definition ID.

#### Output

Returns the full `EntityDefinitionResponse` schema for the requested entity.

#### Error Scenarios

- `404 ENTITY_NOT_FOUND` — No active entity exists with the given ID.

---

### Endpoint: `PUT /api/entities/{entity_id}`

#### Purpose

Updates an existing entity definition (partial update — only provided fields are changed).

#### Business Context

Used to rename entities, update labels, or modify `custom_fields` metadata without recreating the entity.

#### Input

**Path Parameters:**
- `entity_id` (UUID string): The entity definition ID.

**Request Body (all fields optional):**
```json
{
  "name": "new_name",
  "label": "New Display Label",
  "module_id": "uuid-here",
  "custom_fields": {
    "owner_module": "ats",
    "features": {
      "supports_workflow": false
    }
  }
}
```

#### Processing

1. Filters out `None` values from the request body.
2. Applies updates to the entity row.
3. `updated_at` is automatically managed by SQLAlchemy `onupdate`.

#### Output

Returns the updated `EntityDefinitionResponse`.

#### Error Scenarios

- `404 ENTITY_NOT_FOUND` — No entity with the given ID.
- `409 ENTITY_NAME_EXISTS` — New name conflicts with another entity.

---

### Endpoint: `DELETE /api/entities/{entity_id}`

#### Purpose

Soft-deletes an entity by setting `is_active = false`.

#### Business Context

Used to decommission an entity type without losing historical data. Related fields, layouts, and records remain in the database but the entity is excluded from active queries.

#### Input

**Path Parameters:**
- `entity_id` (UUID string): The entity definition ID.

#### Processing

Sets `is_active = false` on the `EntityDefinition` row. No hard deletion.

#### Output

```json
{
  "data": {
    "id": "a1b2c3d4-1234-5678-9abc-def012345678",
    "deleted": true
  }
}
```

#### Error Scenarios

- `404 ENTITY_NOT_FOUND` — No entity with the given ID.

---

## Module: Field Definitions

### Overview

The field definitions module manages the individual fields (attributes) that compose an entity. Each field defines a data type, validation constraints, rendering hints, and optional enum values or default values.

**Why it exists:** Fields define the structure and data contract of every entity. Without fields, entities are empty containers with no schema.

**Typical usage flow:** Create entity → add fields (one API call per field) → build form layout referencing field names.

---

### Endpoint: `POST /api/field-definitions`

#### Purpose

Creates a new field definition attached to an entity.

#### Business Context

Called once per field during entity setup. The field's `name` becomes the key used in `entity_records.data` JSONB storage and in all API request bodies.

#### Input

**Request Body:**
```json
{
  "entity_id": "a1b2c3d4-1234-5678-9abc-def012345678",
  "name": "job_title",
  "label": "Job Title",
  "field_type": "text",
  "is_required": true,
  "is_system": false,
  "enum_values": null,
  "fk_entity": null,
  "constraints": {
    "max_length": 120
  },
  "placeholder": "e.g. DevOps Engineer",
  "help_text": "Enter the role title",
  "default_value": null,
  "validation_rules": []
}
```

**Request Body Fields:**
- `entity_id` (required): Links to the parent entity definition.
- `name` (required): Stable field key. Used in records data, rules, and APIs.
- `label` (required): Display label shown to users.
- `field_type` (required): One of `text`, `textarea`, `number`, `enum`, `boolean`, `date`, `email`, `phone`, `file`, `fk`.
- `is_required` (optional, default false): Whether the field must have a value on non-draft validation.
- `is_system` (optional, default false): System-managed field marker.
- `enum_values` (optional): For `enum` fields, an object with `options` array. Each option has `value` (stored) and `label` (displayed).
- `fk_entity` (optional): Target entity ID for foreign-key-like fields.
- `constraints` (optional): Validation/rendering constraints. Supports `min_length`, `max_length`, `regex`, `min`, `max`, `file.allowed_types`, `file.max_size_mb`.
- `placeholder` (optional): Form placeholder text.
- `help_text` (optional): Helper text below the field.
- `default_value` (optional): Default value for new records.
- `validation_rules` (optional): Array of additional rule objects. Each has `type` and type-specific keys. Supported types: `required`, `regex_match`, `min_value`.

#### Processing

1. Validates `entity_id` exists and is active.
2. Checks for duplicate `name` within the same entity (`FIELD_NAME_EXISTS` error).
3. Creates `FieldDefinition` row with `created_by` from actor.
4. Returns serialized field definition.

#### Output

```json
{
  "id": "f1a2b3c4-5678-90ab-cdef-012345678901",
  "entity_id": "a1b2c3d4-1234-5678-9abc-def012345678",
  "name": "job_title",
  "label": "Job Title",
  "field_type": "text",
  "is_required": true,
  "is_system": false,
  "enum_values": {},
  "fk_entity": null,
  "constraints": {
    "max_length": 120
  },
  "placeholder": "e.g. DevOps Engineer",
  "help_text": "Enter the role title",
  "default_value": null,
  "validation_rules": [],
  "created_by": "8c81977a-a47d-448c-9f28-4d44fd2ceec0",
  "created_at": "2026-06-05T15:00:00+05:30",
  "updated_at": "2026-06-05T15:00:00+05:30"
}
```

#### Possible Next Steps

- Add more fields: repeat `POST /api/field-definitions` for each additional field.
- Create form layout: `POST /api/form-layouts` (field `name` values must match exactly).

#### Related APIs

- `GET /api/field-definitions` — list fields for an entity
- `GET /api/field-definitions/search` — search fields
- `PUT /api/field-definitions/{field_id}` — update field
- `DELETE /api/field-definitions/{field_id}` — soft-delete field

#### Error Scenarios

- `404 RECORD_NOT_FOUND` — Entity ID does not exist.
- `409 FIELD_NAME_EXISTS` — Field name already exists within the same entity.

---

### Endpoint: `GET /api/field-definitions`

#### Purpose

Lists field definitions for a specific entity with pagination.

#### Business Context

Used by form renderers and admin screens to discover the fields available for an entity.

#### Input

**Query Parameters:**
- `entity_id` (UUID, optional): Filter by entity. When provided, only fields for this entity are returned.
- `skip` (integer, default 0): Pagination offset.
- `limit` (integer, default 100, max 500): Page size.

#### Processing

Queries active field definitions. If `entity_id` is provided, filters to that entity. Orders by creation time then name.

#### Output

```json
{
  "data": [
    {
      "id": "f1a2b3c4-5678-90ab-cdef-012345678901",
      "entity_id": "a1b2c3d4-1234-5678-9abc-def012345678",
      "name": "job_title",
      "label": "Job Title",
      "field_type": "text",
      "is_required": true,
      "is_system": false,
      "constraints": {"max_length": 120},
      "placeholder": "e.g. DevOps Engineer",
      "help_text": "Enter the role title",
      "default_value": null,
      "validation_rules": [],
      "created_at": "2026-06-05T15:00:00+05:30",
      "updated_at": "2026-06-05T15:00:00+05:30"
    }
  ],
  "total": 4
}
```

---

### Endpoint: `GET /api/field-definitions/search`

#### Purpose

Searches field definitions by name or label with optional entity filtering.

#### Business Context

Used by search components in admin UIs and form builders.

#### Input

**Query Parameters:**
- `q` (string, required, min length 1): Search query matched against `name` and `label`.
- `entity_id` (UUID, optional): Filter by entity.
- `skip` (integer, default 0): Pagination offset.
- `limit` (integer, default 100, max 500): Page size.

#### Output

Same shape as `GET /api/field-definitions` — `{"data": [...], "total": N}`.

---

### Endpoint: `GET /api/field-definitions/{field_id}`

#### Purpose

Retrieves a single field definition by UUID.

#### Business Context

Used when loading field details for editing or when resolving a specific field in a form layout.

#### Input

**Path Parameters:**
- `field_id` (UUID string): The field definition ID.

#### Output

Returns the full `FieldDefinitionResponse` for the requested field.

#### Error Scenarios

- `404 FIELD_NOT_FOUND` — No field with the given ID.

---

### Endpoint: `PUT /api/field-definitions/{field_id}`

#### Purpose

Updates a field definition (partial update).

#### Business Context

Used to modify field properties after creation — change labels, adjust constraints, toggle `is_required`, or update validation rules.

#### Input

**Path Parameters:**
- `field_id` (UUID string): The field definition ID.

**Request Body (all fields optional):**
```json
{
  "label": "Updated Job Title",
  "is_required": false,
  "constraints": {
    "max_length": 200
  },
  "placeholder": "Enter job title",
  "help_text": "Updated help text"
}
```

#### Processing

- `id`, `entity_id`, `name`, and `field_type` are immutable and cannot be changed.
- Filters out `None` values before applying.

#### Output

Returns the updated `FieldDefinitionResponse`.

#### Error Scenarios

- `404 FIELD_NOT_FOUND` — No field with the given ID.
- `409 FIELD_NAME_EXISTS` — Attempting to rename to a duplicate within the entity.

---

### Endpoint: `DELETE /api/field-definitions/{field_id}`

#### Purpose

Soft-deletes a field definition by setting `is_active = false`.

#### Business Context

Used to remove fields from active use without destroying historical data. The field's data remains in existing records.

#### Input

**Path Parameters:**
- `field_id` (UUID string): The field definition ID.

#### Output

```json
{
  "data": {
    "id": "f1a2b3c4-5678-90ab-cdef-012345678901",
    "deleted": true
  }
}
```

#### Error Scenarios

- `404 FIELD_NOT_FOUND` — No field with the given ID.

---
# All APIs — Part 2

## Module: Form Layouts

### Overview

The form layouts module manages the visual arrangement of entity fields into sections with column widths, field ordering, and action buttons. Each layout defines how a form looks when rendered by the frontend.

**Why it exists:** Without layouts, the form engine has no instructions for organizing fields into a user-friendly interface. Layouts control the visual presentation layer.

**Typical usage flow:** Create entity → add fields → create form layout (the layout references field `name` values from Step 2).

---

### Endpoint: `POST /api/form-layouts`

#### Purpose

Creates a new form layout definition for an entity.

#### Business Context

This is the visual design step in entity setup. The layout determines sections, field arrangement, button configuration, and whether the form enables workflow on submission.

#### Input

**Request Body:**
```json
{
  "entity_id": "a1b2c3d4-1234-5678-9abc-def012345678",
  "name": "default",
  "version": 1,
  "sections": [
    {
      "id": "job_details",
      "label": "Job Details",
      "columns": 2,
      "collapsible": false,
      "collapsed_by_default": false,
      "fields": [
        {"name": "job_title", "width": "half", "order": 0},
        {"name": "department", "width": "half", "order": 1},
        {"name": "headcount", "width": "quarter", "order": 2},
        {"name": "location", "width": "quarter", "order": 3}
      ]
    }
  ],
  "form_actions": [
    {
      "type": "form_action",
      "name": "save_draft",
      "label": "Save Draft",
      "variant": "secondary",
      "position": "top_right",
      "requires_confirm": false,
      "post_action": "stay"
    },
    {
      "type": "workflow_transition",
      "name": "submit",
      "label": "Submit for Approval",
      "variant": "primary",
      "position": "top_right",
      "requires_confirm": true,
      "confirm_message": "Submit this requisition for approval?"
    }
  ],
  "workflow_enabled": true
}
```

**Request Body Fields:**
- `entity_id` (required): Links layout to the entity definition.
- `name` (required, default "default"): Layout identifier. Use "default" unless multiple layouts are needed.
- `version` (optional, default 1): Layout version number.
- `sections` (required): Array of section objects. Each section has:
  - `id` (required): Unique section identifier.
  - `label` (required): Section heading shown to users.
  - `columns` (optional): Column count hint. `2` = fields can sit side by side.
  - `collapsible` (optional): Whether the section can be collapsed.
  - `collapsed_by_default` (optional): Whether the section starts collapsed.
  - `fields` (required): Array of field entries. Each entry is either a string (field name) or an object with:
    - `name` (required): Must match a `field_definitions.name` exactly.
    - `width` (optional): `full`, `half`, `third`, `quarter`.
    - `order` (optional): Integer position within the section.
- `form_actions` (required): Array of button/action descriptors. Each has:
  - `type` (required): `form_action` or `workflow_transition`.
  - `name` (required): Internal action identifier.
  - `label` (required): Button text shown to users.
  - `variant` (required): `primary`, `secondary`, `danger`, `ghost`, `warning`.
  - `position` (optional): Button placement hint.
  - `requires_confirm` (required): Whether a confirmation popup is shown.
  - `confirm_message` (optional): Confirmation dialog text.
- `workflow_enabled` (required): `true` = form starts a workflow when submitted.

#### Processing

1. Validates `entity_id` exists and is active.
2. Creates `FormLayout` row with `is_active = true`.
3. Auto-generates layout `id` and sets `created_at` timestamp.

#### Output

```json
{
  "id": "f1a2b3c4-5678-90ab-cdef-012345678901",
  "entity_id": "a1b2c3d4-1234-5678-9abc-def012345678",
  "name": "default",
  "version": 1,
  "sections": [...],
  "form_actions": [...],
  "workflow_enabled": true,
  "is_active": true,
  "created_at": "2026-06-05T15:00:00+05:30",
  "updated_at": "2026-06-05T15:00:00+05:30"
}
```

#### Possible Next Steps

- Add conditional rules: `POST /api/field-dependencies`.
- Define workflow: `POST /api/workflow-definitions`.
- Render form: `POST /api/form/render`.

#### Related APIs

- `GET /api/form-layouts` — list layouts for an entity
- `GET /api/form-layouts/{layout_id}` — fetch one layout
- `PUT /api/form-layouts/{layout_id}` — update layout
- `DELETE /api/form-layouts/{layout_id}` — soft-delete layout

---

### Endpoint: `GET /api/form-layouts`

#### Purpose

Lists all active form layouts for a specific entity.

#### Business Context

Used by form renderers to find the correct layout for an entity, and by admin screens to manage layout configurations.

#### Input

**Query Parameters:**
- `entity_id` (UUID string, required): Filter layouts by entity.

#### Processing

Queries active (`is_active = true`) `FormLayout` rows for the given `entity_id`.

#### Output

```json
[
  {
    "id": "f1a2b3c4-5678-90ab-cdef-012345678901",
    "entity_id": "a1b2c3d4-1234-5678-9abc-def012345678",
    "name": "default",
    "version": 1,
    "sections": [...],
    "form_actions": [...],
    "workflow_enabled": true,
    "is_active": true,
    "created_at": "2026-06-05T15:00:00+05:30",
    "updated_at": "2026-06-05T15:00:00+05:30"
  }
]
```

#### Error Scenarios

- Missing `entity_id` query parameter returns a 422 validation error.

---

### Endpoint: `GET /api/form-layouts/{layout_id}`

#### Purpose

Retrieves a single form layout by UUID.

#### Business Context

Used when loading a specific layout for editing or when the layout ID is known from a previous response.

#### Input

**Path Parameters:**
- `layout_id` (UUID string): The layout ID.

#### Output

Returns the full `FormLayoutResponse` for the requested layout.

#### Error Scenarios

- `404 LAYOUT_NOT_FOUND` — No layout with the given ID.

---

### Endpoint: `PUT /api/form-layouts/{layout_id}`

#### Purpose

Updates an existing form layout (partial update).

#### Business Context

Used to modify sections, actions, or `workflow_enabled` flag after creation.

#### Input

**Path Parameters:**
- `layout_id` (UUID string): The layout ID.

**Request Body (all fields optional):**
```json
{
  "sections": [...],
  "form_actions": [...],
  "workflow_enabled": false,
  "is_active": true
}
```

#### Processing

- Filters out unset fields from the request.
- Applies updates to the layout row.
- `updated_at` is auto-managed.

#### Output

Returns the updated `FormLayoutResponse`.

#### Error Scenarios

- `404 LAYOUT_NOT_FOUND` — No layout with the given ID.

---

### Endpoint: `DELETE /api/form-layouts/{layout_id}`

#### Purpose

Soft-deletes a form layout by setting `is_active = false`.

#### Business Context

Used to deactivate a layout without destroying it. The form engine ignores inactive layouts during rendering.

#### Input

**Path Parameters:**
- `layout_id` (UUID string): The layout ID.

#### Output

```json
{
  "success": true
}
```

#### Error Scenarios

- `404 LAYOUT_NOT_FOUND` — No layout with the given ID.

---

## Module: Field Dependencies

### Overview

The field dependencies module manages conditional rules that dynamically change field behavior (visibility, requirement, value) based on the values of other fields in the same form.

**Why it exists:** Static forms force users to see irrelevant fields. Conditional rules make forms adaptive — showing only relevant fields and enforcing context-specific validation.

**Typical usage flow:** Create entity → add fields → create form layout → add field dependencies (conditional rules).

---

### Endpoint: `POST /api/field-dependencies`

#### Purpose

Creates a conditional rule that changes a target field's behavior based on conditions evaluated against other field values.

#### Business Context

Conditional rules are the "smart" layer of the form system. They enable dynamic forms where field requirements change based on user input (e.g., "if department is Engineering, headcount becomes required").

#### Input

**Request Body:**
```json
{
  "entity_id": "a1b2c3d4-1234-5678-9abc-def012345678",
  "field_name": "headcount",
  "logic": "AND",
  "conditions": [
    {
      "field": "department",
      "operator": "equals",
      "value": "engineering"
    }
  ],
  "action": "require",
  "action_value": null
}
```

**Request Body Fields:**
- `entity_id` (required): Links the rule to the entity.
- `field_name` (required): The target field whose behavior changes. Must match a `field_definitions.name`.
- `logic` (optional, default "AND"): How conditions are combined. `AND` = all conditions must match. `OR` = any condition matches.
- `conditions` (required): Array of condition objects. Each has:
  - `field` (required): The source field to watch. Must match a `field_definitions.name`.
  - `operator` (required): Comparison operator.
  - `value` (required): The value to compare against. Type depends on the field type.
- `action` (required): What to do when conditions match.
- `action_value` (optional): Value payload for `set_value` action.

**Supported Operators:**
`equals`, `not_equals`, `in`, `gt`, `lt`, `exists`, `empty`.

**Supported Actions:**
| Action | Effect |
|---|---|
| `require` | Makes the field mandatory. |
| `optional` | Makes the field optional. |
| `show` | Makes a hidden field visible. |
| `hide` | Hides the field. |
| `read_only` | Makes the field non-editable. |
| `editable` | Makes a read-only field editable. |
| `set_value` | Sets the field to a specific value. |

#### Processing

1. Validates `entity_id` exists and is active.
2. Creates `FieldDependency` row.
3. Returns serialized dependency.

#### Output

```json
{
  "id": "d1e2f3a4-5678-90ab-cdef-012345678901",
  "entity_id": "a1b2c3d4-1234-5678-9abc-def012345678",
  "field_name": "headcount",
  "logic": "AND",
  "conditions": [
    {
      "field": "department",
      "operator": "equals",
      "value": "engineering"
    }
  ],
  "action": "require",
  "action_value": null,
  "created_at": "2026-06-05T15:00:00+05:30",
  "updated_at": "2026-06-05T15:00:00+05:30"
}
```

#### Possible Next Steps

- Add more dependencies: repeat `POST /api/field-dependencies`.
- Create workflow: `POST /api/workflow-definitions`.
- Render form: `POST /api/form/render` (dependencies are evaluated during render).

#### Related APIs

- `GET /api/field-dependencies` — list dependencies for an entity
- `GET /api/field-dependencies/{dep_id}` — fetch one dependency
- `PUT /api/field-dependencies/{dep_id}` — update dependency
- `DELETE /api/field-dependencies/{dep_id}` — soft-delete dependency

#### Error Scenarios

- `404 RECORD_NOT_FOUND` — Entity ID does not exist.

---

### Endpoint: `GET /api/field-dependencies`

#### Purpose

Lists all field dependency rules for a specific entity.

#### Business Context

Used by the form engine during rendering to load all conditional rules for an entity. Also used by admin screens to manage rules.

#### Input

**Query Parameters:**
- `entity_id` (UUID string, required): Filter dependencies by entity.

#### Processing

Queries all `FieldDependency` rows for the given `entity_id`.

#### Output

```json
[
  {
    "id": "d1e2f3a4-5678-90ab-cdef-012345678901",
    "entity_id": "a1b2c3d4-1234-5678-9abc-def012345678",
    "field_name": "headcount",
    "logic": "AND",
    "conditions": [...],
    "action": "require",
    "action_value": null,
    "created_at": "2026-06-05T15:00:00+05:30",
    "updated_at": "2026-06-05T15:00:00+05:30"
  }
]
```

#### Error Scenarios

- Missing `entity_id` query parameter returns a 422 validation error.

---

### Endpoint: `GET /api/field-dependencies/{dep_id}`

#### Purpose

Retrieves a single field dependency rule by UUID.

#### Input

**Path Parameters:**
- `dep_id` (UUID string): The dependency ID.

#### Output

Returns the full `FieldDependencyResponse`.

#### Error Scenarios

- `404 FIELD_DEPENDENCY_NOT_FOUND` — No dependency with the given ID.

---

### Endpoint: `PUT /api/field-dependencies/{dep_id}`

#### Purpose

Updates a field dependency rule (partial update).

#### Business Context

Used to modify conditions, actions, or logic after creation.

#### Input

**Path Parameters:**
- `dep_id` (UUID string): The dependency ID.

**Request Body (all fields optional):**
```json
{
  "logic": "OR",
  "conditions": [
    {
      "field": "department",
      "operator": "equals",
      "value": "engineering"
    },
    {
      "field": "department",
      "operator": "equals",
      "value": "infrastructure"
    }
  ],
  "action": "show",
  "action_value": null
}
```

#### Output

Returns the updated `FieldDependencyResponse`.

#### Error Scenarios

- `404 FIELD_DEPENDENCY_NOT_FOUND` — No dependency with the given ID.

---

### Endpoint: `DELETE /api/field-dependencies/{dep_id}`

#### Purpose

Soft-deletes a field dependency rule.

#### Business Context

Used to remove conditional rules without destroying historical data.

#### Input

**Path Parameters:**
- `dep_id` (UUID string): The dependency ID.

#### Output

```json
{
  "success": true
}
```

#### Error Scenarios

- `404 FIELD_DEPENDENCY_NOT_FOUND` — No dependency with the given ID.

---

## Module: Workflow Definitions

### Overview

The workflow definitions module manages the state machine blueprints — the complete approval chain configuration for an entity. Each definition lists all possible states, routing rules, and override configuration.

**Why it exists:** Workflows transform static data collection into dynamic approval processes. Without workflow definitions, forms are just data entry with no routing or approval logic.

**Important distinction:** `WorkflowDefinition` is the **setup/config** endpoint. The runtime execution endpoint is `POST /api/workflow/transition` (no `s`). The definition describes the map; the transition endpoint drives the car.

**Typical usage flow:** Create entity → add fields → create form layout → create workflow definition → create workflow transitions.

---

### Endpoint: `POST /api/workflow-definitions`

#### Purpose

Creates a new workflow state machine definition for an entity.

#### Business Context

This is the blueprint that defines every possible state a record can be in and how records are routed through those states. It is the central configuration for the approval chain.

#### Input

**Request Body:**
```json
{
  "entity_id": "a1b2c3d4-1234-5678-9abc-def012345678",
  "name": "job_requisition_approval",
  "initial_state": "draft",
  "states": [
    {
      "name": "draft",
      "label": "Draft",
      "color": "gray",
      "is_initial": true,
      "is_terminal": false,
      "locked_fields": []
    },
    {
      "name": "pending_hm",
      "label": "Pending HM Approval",
      "color": "yellow",
      "is_initial": false,
      "is_terminal": false,
      "locked_fields": ["*"]
    },
    {
      "name": "pending_director",
      "label": "Pending Director Approval",
      "color": "orange",
      "is_initial": false,
      "is_terminal": false,
      "locked_fields": ["*"]
    },
    {
      "name": "pending_founder",
      "label": "Pending Founder Approval",
      "color": "orange",
      "is_initial": false,
      "is_terminal": false,
      "locked_fields": ["*"]
    },
    {
      "name": "approved",
      "label": "Approved",
      "color": "green",
      "is_initial": false,
      "is_terminal": true,
      "locked_fields": ["*"]
    },
    {
      "name": "rejected",
      "label": "Rejected",
      "color": "red",
      "is_initial": false,
      "is_terminal": true,
      "locked_fields": ["*"]
    }
  ],
  "transitions": [],
  "routing_rules": [
    {
      "workflow_name": "job_requisition_approval",
      "conditions": [],
      "is_default": true
    }
  ],
  "override_config": {
    "allows_override": true,
    "approval_required": true,
    "approver_roles": ["admin", "super_admin"],
    "max_overrides_per_record": 3,
    "confirm_message": "This overrides the standard approval sequence. Admin approval required."
  }
}
```

**Request Body Fields:**
- `entity_id` (required): Links workflow to the entity.
- `name` (required): Workflow key. Used to identify this workflow in routing and transitions.
- `initial_state` (required): The state where new instances start (e.g., `draft`).
- `states` (required): Array of state descriptors. Each has:
  - `name` (required): State key used in transitions.
  - `label` (required): Display name.
  - `color` (optional): Badge color (`gray`, `yellow`, `orange`, `green`, `red`).
  - `is_initial` (required): `true` only for the starting state.
  - `is_terminal` (required): `true` for final states (no transitions out).
  - `locked_fields` (optional): `["*"]` locks all fields; `[]` keeps fields editable.
- `transitions` (optional): Array of embedded transition descriptors (same shape as `WorkflowTransition`).
- `routing_rules` (required): Array of rules to select this workflow. Each has:
  - `workflow_name` (required): The workflow to apply.
  - `conditions` (optional): Field-value conditions for variant selection.
  - `is_default` (required): `true` means this is the default workflow.
- `override_config` (required): Override behavior configuration. Each key is optional with defaults.

#### Processing

1. Validates `entity_id` exists and is active.
2. Creates `WorkflowDefinition` row with `is_active = true`, `version = 1`.
3. Sets `created_at` timestamp.

#### Output

```json
{
  "id": "w1a2b3c4-5678-90ab-cdef-012345678901",
  "entity_id": "a1b2c3d4-1234-5678-9abc-def012345678",
  "name": "job_requisition_approval",
  "version": 1,
  "is_active": true,
  "initial_state": "draft",
  "states": [...],
  "transitions": [],
  "routing_rules": [...],
  "override_config": {...},
  "created_at": "2026-06-05T15:00:00+05:30",
  "updated_at": "2026-06-05T15:00:00+05:30"
}
```

#### Possible Next Steps

- Create transitions: `POST /api/workflow-transitions` (using the returned `id` as `workflow_id`).
- Submit a form: `POST /api/form/submit` (the workflow will bind automatically if `workflow_enabled = true`).

#### Related APIs

- `GET /api/workflow-definitions` — list definitions for an entity
- `GET /api/workflow-definitions/{wf_id}` — fetch one definition
- `PUT /api/workflow-definitions/{wf_id}` — update definition
- `DELETE /api/workflow-definitions/{wf_id}` — soft-delete definition

#### Error Scenarios

- `404 WORKFLOW_DEFINITION_NOT_FOUND` — Entity ID does not exist (referenced during creation).

---

### Endpoint: `GET /api/workflow-definitions`

#### Purpose

Lists all active workflow definitions for a specific entity.

#### Business Context

Used by admin screens and workflow builders to browse available approval chains for an entity.

#### Input

**Query Parameters:**
- `entity_id` (UUID string, required): Filter by entity.

#### Processing

Queries active (`is_active = true`) `WorkflowDefinition` rows for the given `entity_id`.

#### Output

Array of `WorkflowDefinitionResponse` objects.

#### Error Scenarios

- Missing `entity_id` query parameter returns a 422 validation error.

---

### Endpoint: `GET /api/workflow-definitions/{wf_id}`

#### Purpose

Retrieves a single workflow definition by UUID, including all embedded states, transitions, routing rules, and override config.

#### Business Context

Used when loading a workflow definition for editing or when the definition ID is referenced by a workflow instance.

#### Input

**Path Parameters:**
- `wf_id` (UUID string): The workflow definition ID.

#### Output

Returns the full `WorkflowDefinitionResponse`.

#### Error Scenarios

- `404 WORKFLOW_DEFINITION_NOT_FOUND` — No workflow definition with the given ID.

---

### Endpoint: `PUT /api/workflow-definitions/{wf_id}`

#### Purpose

Updates an existing workflow definition (partial update).

#### Business Context

Used to modify states, routing rules, or override configuration after creation. Common changes include adding states to an existing approval chain or updating override permissions.

#### Input

**Path Parameters:**
- `wf_id` (UUID string): The workflow definition ID.

**Request Body (all fields optional):**
```json
{
  "name": "updated_workflow_name",
  "initial_state": "draft",
  "states": [...],
  "routing_rules": [...],
  "override_config": {...},
  "is_active": true
}
```

#### Processing

- Filters out unset fields.
- Applies updates to the workflow definition row.
- `updated_at` is auto-managed.

#### Output

Returns the updated `WorkflowDefinitionResponse`.

#### Error Scenarios

- `404 WORKFLOW_DEFINITION_NOT_FOUND` — No workflow definition with the given ID.

---

### Endpoint: `DELETE /api/workflow-definitions/{wf_id}`

#### Purpose

Soft-deletes a workflow definition by setting `is_active = false`.

#### Business Context

Used to deactivate a workflow. Existing running instances continue to completion under the old definition. New submissions will select a different active workflow via routing rules.

#### Input

**Path Parameters:**
- `wf_id` (UUID string): The workflow definition ID.

#### Output

```json
{
  "success": true
}
```

#### Error Scenarios

- `404 WORKFLOW_DEFINITION_NOT_FOUND` — No workflow definition with the given ID.

---
# All APIs — Part 3

## Module: Workflow Transitions

### Overview

The workflow transitions module manages the individual "arrows" between states in a workflow definition. Each transition defines who can execute it, what validators must pass, what side effects fire, and what buttons appear in the UI.

**Why it exists:** Transitions are the actionable steps in an approval chain. Without them, a workflow definition is just a list of states with no way to move between them.

**Important distinction:** `POST /api/workflow-transitions` (with `s`) is the **setup/configuration** endpoint. `POST /api/workflow/transition` (no `s`) is the **runtime execution** endpoint. They sound similar but serve opposite purposes:
- `/workflow-transitions` — adds an arrow to the state machine blueprint (called once during setup).
- `/workflow/transition` — moves a specific record along an existing arrow (called every time someone clicks an approval button).

---

### Endpoint: `POST /api/workflow-transitions`

#### Purpose

Creates a new transition (arrow) between two states in a workflow definition.

#### Business Context

Called once for each approval step during workflow setup. The transition's `name` is used later when calling the runtime execution endpoint.

#### Input

**Request Body:**
```json
{
  "workflow_id": "w1a2b3c4-5678-90ab-cdef-012345678901",
  "name": "hm_approve",
  "label": "Approve",
  "from_state": "pending_hm",
  "to_state": "pending_director",
  "allowed_roles": ["hm"],
  "triggers": [
    {
      "type": "user_action",
      "transition": "hm_approve"
    }
  ],
  "validators": [],
  "actions": [
    {
      "type": "notify",
      "template": "hm_approved",
      "to": ["ptc", "director"]
    },
    {
      "type": "assign_to",
      "to_role": "director"
    }
  ],
  "button_config": {
    "variant": "primary",
    "icon": "check",
    "position": "top_right"
  },
  "requires_confirm": false,
  "confirm_message": null,
  "is_override": false
}
```

**Request Body Fields:**
- `workflow_id` (required): Links transition to the parent workflow definition.
- `name` (required): Unique transition key. Used in runtime `transition_name` parameter.
- `label` (required): Display label for the button.
- `from_state` (required): Source state key. The engine rejects transitions if the record is not in this state.
- `to_state` (required): Target state key. Where the record moves after approval.
- `allowed_roles` (required): Array of canonical roles that can execute this transition.
- `triggers` (required): Array of trigger configurations. For user actions: `{"type": "user_action", "transition": "name"}`.
- `validators` (optional): Array of validator configurations. Empty `[]` means no additional checks beyond role and state.
- `actions` (optional): Array of side-effect action configurations. Supported types:
  - `notify`: `{"type": "notify", "template": "template_name", "to": ["role_or_email"]}`
  - `assign_to`: `{"type": "assign_to", "to_role": "role_name"}`
  - `update_field`: `{"type": "update_field", "field": "field_name", "value": "new_value"}`
  - `integration_trigger`: `{"type": "integration_trigger", "endpoint": "url", "payload": {}}`
- `button_config` (optional): Lightweight UI intent. Currently supports `variant` (primary, secondary, danger, ghost, warning). `icon` and `position` are documented but the current implementation only uses `variant`.
- `requires_confirm` (required): Whether to show a confirmation popup before executing.
- `confirm_message` (optional): Confirmation dialog text.
- `is_override` (required): Whether this is an override/force-approval transition.

#### Processing

1. Validates `workflow_id` exists and is active.
2. Creates `WorkflowTransition` row.
3. Returns serialized transition.

#### Output

```json
{
  "id": "t1a2b3c4-5678-90ab-cdef-012345678901",
  "workflow_id": "w1a2b3c4-5678-90ab-cdef-012345678901",
  "name": "hm_approve",
  "label": "Approve",
  "from_state": "pending_hm",
  "to_state": "pending_director",
  "allowed_roles": ["hm"],
  "triggers": [{"type": "user_action", "transition": "hm_approve"}],
  "validators": [],
  "actions": [
    {"type": "notify", "template": "hm_approved", "to": ["ptc", "director"]},
    {"type": "assign_to", "to_role": "director"}
  ],
  "button_config": {"variant": "primary", "icon": "check", "position": "top_right"},
  "requires_confirm": false,
  "confirm_message": null,
  "is_override": false,
  "is_active": true
}
```

#### Possible Next Steps

- Create more transitions for the same workflow: repeat `POST /api/workflow-transitions`.
- Execute transition at runtime: `POST /api/workflow/transition` with `transition_name = "hm_approve"`.

#### Related APIs

- `GET /api/workflow-transitions` — list transitions for a workflow
- `GET /api/workflow-transitions/{transition_id}` — fetch one transition
- `PUT /api/workflow-transitions/{transition_id}` — update transition
- `POST /api/workflow/transition` — **runtime execution** of a transition

#### Error Scenarios

- `404 WORKFLOW_DEFINITION_NOT_FOUND` — Workflow ID does not exist.

---

### Endpoint: `GET /api/workflow-transitions`

#### Purpose

Lists all transitions for a specific workflow definition.

#### Business Context

Used by workflow builders and admin screens to view and manage the approval steps for a workflow.

#### Input

**Query Parameters:**
- `workflow_id` (UUID string, required): Filter transitions by workflow.

#### Processing

Queries all `WorkflowTransition` rows for the given `workflow_id`.

#### Output

```json
[
  {
    "id": "t1a2b3c4-5678-90ab-cdef-012345678901",
    "workflow_id": "w1a2b3c4-5678-90ab-cdef-012345678901",
    "name": "hm_approve",
    "label": "Approve",
    "from_state": "pending_hm",
    "to_state": "pending_director",
    "allowed_roles": ["hm"],
    "triggers": [...],
    "validators": [],
    "actions": [...],
    "button_config": {"variant": "primary"},
    "requires_confirm": false,
    "confirm_message": null,
    "is_override": false,
    "is_active": true
  }
]
```

#### Error Scenarios

- Missing `workflow_id` query parameter returns a 422 validation error.

---

### Endpoint: `GET /api/workflow-transitions/{transition_id}`

#### Purpose

Retrieves a single transition by UUID.

#### Input

**Path Parameters:**
- `transition_id` (UUID string): The transition ID.

#### Output

Returns the full `WorkflowTransitionResponse`.

#### Error Scenarios

- `404 WORKFLOW_TRANSITION_NOT_FOUND` — No transition with the given ID.

---

### Endpoint: `PUT /api/workflow-transitions/{transition_id}`

#### Purpose

Updates a transition definition (partial update).

#### Business Context

Used to modify transition properties after creation — change allowed roles, add validators, update actions, or toggle override status.

#### Input

**Path Parameters:**
- `transition_id` (UUID string): The transition ID.

**Request Body (all fields optional):**
```json
{
  "allowed_roles": ["hm", "director"],
  "validators": [
    {"type": "requires_field", "field": "screening_score"}
  ],
  "actions": [...],
  "button_config": {"variant": "primary"},
  "requires_confirm": true,
  "confirm_message": "Are you sure?"
}
```

#### Processing

- `name`, `from_state`, `to_state`, and `workflow_id` are core identity and cannot be changed.
- Filters out unset fields before applying.

#### Output

Returns the updated `WorkflowTransitionResponse`.

#### Error Scenarios

- `404 WORKFLOW_TRANSITION_NOT_FOUND` — No transition with the given ID.

---

### Endpoint: `DELETE /api/workflow-transitions/{transition_id}`

#### Purpose

Soft-deletes a transition definition.

#### Business Context

Used to deactivate a transition without destroying it. The workflow engine will no longer consider deleted transitions during execution.

#### Input

**Path Parameters:**
- `transition_id` (UUID string): The transition ID.

#### Output

```json
{
  "success": true
}
```

#### Error Scenarios

- `404 WORKFLOW_TRANSITION_NOT_FOUND` — No transition with the given ID.

---

## Module: Form Engine (Runtime)

### Overview

The form engine runtime endpoints operate on live form data — rendering, drafting, submitting, amending, and cancelling records. These endpoints do not create configuration; they operate on records using the configuration created through the setup APIs.

**Why it exists:** The setup APIs define what forms look like. The runtime APIs are what users actually interact with when filling out, submitting, and tracking forms.

---

### Endpoint: `POST /api/form/render`

#### Purpose

Returns the fully resolved form schema for rendering by the frontend.

#### Business Context

Called whenever the frontend needs to display a form — on initial load, when editing an existing record, or when viewing a submitted record. The response includes field definitions, layout, permission masks, evaluated dependencies, and workflow context.

#### Input

**Request Body:**
```json
{
  "entity_name": "job_requisition",
  "mode": "create",
  "record_id": null,
  "layout_name": "default"
}
```

**Request Body Fields:**
- `entity_name` (required): The entity definition name.
- `mode` (required): `create` (new record), `edit` (existing draft), `view` (read-only).
- `record_id` (optional): Existing record ID for edit/view modes. `null` for create mode.
- `layout_name` (optional, default "default"): Which layout to use.

#### Processing

1. `FormEngine.render_form_response()` is called.
2. `EntityBuilder` loads the entity schema (fields, types, constraints).
3. `FormLayoutService` loads the active layout for the entity.
4. `FieldDependencyService` loads all conditional rules.
5. For each field:
   - Apply permission mask (read/write access from `PermissionEngine`).
   - Evaluate field dependencies against current record data.
   - Determine final `visible`, `required`, `editable`, and `value` properties.
6. If a workflow instance exists for the record, `WorkflowEngine.get_workflow_context()` provides current state, available transitions, and locked fields.
7. Assemble and return the complete form response.

#### Output (Create Mode)

```json
{
  "entity_name": "job_requisition",
  "mode": "create",
  "form_status": null,
  "sections": [
    {
      "id": "job_details",
      "label": "Job Details",
      "columns": 2,
      "collapsible": false,
      "collapsed_by_default": false,
      "fields": [
        {
          "name": "job_title",
          "type": "text",
          "label": "Job Title",
          "required": true,
          "visible": true,
          "editable": true,
          "constraints": {"max_length": 120},
          "placeholder": "e.g. DevOps Engineer",
          "help_text": "Enter the role title",
          "value": null
        },
        {
          "name": "department",
          "type": "enum",
          "label": "Department",
          "required": true,
          "visible": true,
          "editable": true,
          "enum_values": {
            "options": [
              {"value": "engineering", "label": "Engineering"},
              {"value": "infrastructure", "label": "Infrastructure"}
            ]
          },
          "value": null
        }
      ]
    }
  ],
  "workflow": null,
  "actions": [
    {"type": "form_action", "name": "save_draft", "label": "Save Draft"},
    {"type": "form_action", "name": "submit", "label": "Submit for Approval"}
  ],
  "amendment_number": 0,
  "root_record_id": null,
  "inherited_sections": []
}
```

**Response fields for submitted records with workflow:**
- `form_status`: `submitted`, `amended`, or `cancelled`.
- `workflow`: Object with `current_state`, `state_label`, `state_color`, `is_terminal`, `available_transitions`, and `state_locked_fields`.
- `available_transitions`: Array of transition buttons the current user can execute.
- `state_locked_fields`: `["*"]` means all fields are read-only.

#### Possible Next Steps

- Save draft: `POST /api/form/save-draft`.
- Submit form: `POST /api/form/submit`.
- Check workflow context: `POST /api/workflow/context`.

#### Related APIs

- `POST /api/form/save-draft` — save partial data
- `POST /api/form/submit` — submit for approval
- `POST /api/form/amend` — create amendment
- `POST /api/workflow/context` — get workflow state

#### Error Scenarios

- `401 AUTH_TOKEN_MISSING` — No authentication token provided.
- `404 ENTITY_NOT_FOUND` — Entity name does not exist.
- `404 LAYOUT_NOT_FOUND` — No active layout exists for the entity.

---

### Endpoint: `POST /api/form/save-draft`

#### Purpose

Saves partial form data as a draft record without submitting for approval.

#### Business Context

Users can save work-in-progress and return later. Draft saves create or update `EntityRecord` and `FormRecord` rows with `form_status = draft`.

#### Input

**Request Body:**
```json
{
  "entity_name": "job_requisition",
  "record_id": null,
  "form_data": {
    "job_title": "DevOps Engineer",
    "department": "engineering",
    "headcount": 2,
    "location": "Bengaluru"
  },
  "layout_name": "default"
}
```

**Request Body Fields:**
- `entity_name` (required): The entity definition name.
- `record_id` (optional): Existing record ID to update. `null` creates a new draft.
- `form_data` (required): Key-value pairs of field names and their values. Only changed fields needed for updates.
- `layout_name` (optional, default "default"): Layout to use for validation context.

#### Processing

1. `FormEngine.save_draft()` is called.
2. If `record_id` is null:
   - `RecordService.create_entity_record()` creates a new `EntityRecord`.
   - `FormEngine.on_record_created()` creates a new `FormRecord` with `form_status = draft`.
3. If `record_id` is provided:
   - `RecordService.update_record()` updates the existing `EntityRecord.data`.
   - Existing `FormRecord` is updated.
4. Draft validation is lenient — missing required fields do not cause errors (only non-draft validation enforces them).

#### Output

```json
{
  "success": true,
  "record_id": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
  "form_status": "draft",
  "message": "Draft saved"
}
```

#### Possible Next Steps

- Continue editing: call `POST /api/form/save-draft` again with the returned `record_id`.
- Submit: `POST /api/form/submit` with the `record_id`.

#### Related APIs

- `POST /api/form/render` — load form structure
- `POST /api/form/submit` — submit for approval

#### Error Scenarios

- `422 VALIDATION_INVALID_REQUEST` — Invalid `form_data` shape or entity/layout not found.
- `403 PERMISSION_DENIED` — Actor lacks `create` or `write` permission on the entity.

---

### Endpoint: `POST /api/form/submit`

#### Purpose

Validates and submits a completed form for approval.

#### Business Context

This is the official submission action. It validates all required fields, freezes the form data, creates a `FormRecord` with `form_status = submitted`, and optionally binds a workflow instance.

#### Input

**Request Body:**
```json
{
  "entity_name": "job_requisition",
  "record_id": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
  "form_data": {
    "job_title": "DevOps Engineer",
    "department": "engineering",
    "headcount": 2,
    "location": "Bengaluru"
  },
  "layout_name": "default",
  "trigger_source": "user_action",
  "timestamp": "2026-06-05T15:00:00+00:00"
}
```

**Request Body Fields:**
- `entity_name` (required): The entity definition name.
- `record_id` (required): The draft record ID returned by save-draft.
- `form_data` (required): Final form values.
- `layout_name` (optional, default "default"): Layout to use.
- `trigger_source` (optional, default "user_action"): Source of the submission.
- `timestamp` (optional): Event timestamp. Defaults to current UTC time.

#### Processing

1. `FormEngine.submit_form()` validates all required fields and constraints.
2. `RecordService.update_record()` persists final data.
3. `FormRecord.form_status` changes from `draft` to `submitted`.
4. If the layout has `workflow_enabled = true`:
   - `WorkflowEngine.bind_workflow_on_submission()` selects a workflow via routing rules.
   - Creates `WorkflowInstance` at `initial_state` (e.g., `draft`).
   - Writes initial workflow history.
5. All form fields become read-only — `state_locked_fields: ["*"]`.
6. If workflow bind fails, the entire transaction rolls back and `form_status` reverts to `draft`.

#### Output

```json
{
  "success": true,
  "record_id": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
  "form_status": "submitted",
  "workflow_instance_id": "iii-1111-2222-3333-444444444444",
  "initial_workflow_state": "draft",
  "available_transitions": [],
  "message": "Submitted"
}
```

**Note:** `available_transitions` is empty after submit because the record is in the `draft` workflow state. No transitions are valid from `draft` — an explicit "submit for approval" transition must be called first.

#### Possible Next Steps

- Start workflow: `POST /api/workflow/transition` with `transition_name = "submit_for_approval"`.
- Check status: `POST /api/workflow/context`.

#### Related APIs

- `POST /api/form/save-draft` — save as draft first
- `POST /api/workflow/transition` — execute first workflow transition
- `POST /api/workflow/context` — check current workflow state

#### Error Scenarios

- `422 VALIDATION_INVALID_REQUEST` — Required fields missing or validation constraints violated.
- `422 WORKFLOW_INVALID_TRANSITION` — Workflow bind failed (transaction rolled back).
- `403 PERMISSION_DENIED` — Actor lacks `submit` or `write` permission.

---

### Endpoint: `POST /api/form/amend`

#### Purpose

Creates an amendment draft from a submitted form, allowing corrections or updates.

#### Business Context

When a submitted record needs changes (e.g., rejected and needs revision), the amend operation creates a new draft version. The original record is marked `amended`, and a new `EntityRecord` + `FormRecord` pair is created for the amended version.

#### Input

**Request Body:**
```json
{
  "entity_name": "job_requisition",
  "record_id": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
}
```

**Request Body Fields:**
- `entity_name` (required): The entity definition name.
- `record_id` (required): The submitted record ID to amend.

#### Processing

1. Validates the original record is in `submitted` status.
2. `RecordService.create_entity_record()` creates a new record prefilled from the original data.
3. `FormEngine.amend_form()`:
   - Marks original `FormRecord` as `amended`.
   - Creates new `FormRecord` with `form_status = draft`, linked to the new entity record.
   - Sets `amended_from_id` to the original `FormRecord.id`.
   - Sets `root_record_id` to the original entity record ID.
   - Increments `amendment_number`.

#### Output

```json
{
  "success": true,
  "new_record_id": "cccccccc-cccc-cccc-cccc-cccccccccccc",
  "form_status": "draft",
  "amended_from_id": "11111111-1111-1111-1111-111111111111",
  "root_record_id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
  "amendment_number": 1,
  "message": "Amendment created"
}
```

#### Possible Next Steps

- Edit the new draft: `POST /api/form/save-draft` with `new_record_id`.
- Resubmit: `POST /api/form/submit` with `new_record_id`.
- View amendment chain: Query `form_records` by `root_record_id`.

#### Related APIs

- `POST /api/form/save-draft` — edit the new amendment draft
- `POST /api/form/submit` — resubmit the amended record

#### Error Scenarios

- `422 VALIDATION_INVALID_REQUEST` — Original record is not in `submitted` status or does not exist.

---

### Endpoint: `POST /api/form/cancel`

#### Purpose

Cancels a form record before it continues through the lifecycle.

#### Business Context

Used to abandon a draft or submitted record. Cancellation is terminal — the record cannot be edited or transitioned after cancellation.

#### Input

**Request Body:**
```json
{
  "entity_name": "job_requisition",
  "record_id": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
}
```

**Request Body Fields:**
- `entity_name` (required): The entity definition name.
- `record_id` (required): The record ID to cancel.

#### Processing

1. Validates the record exists and is in a cancellable state (`draft` or `submitted`).
2. Updates `FormRecord.form_status` to `cancelled`.
3. Records the `cancelled_at` timestamp.

#### Output

```json
{
  "success": true,
  "record_id": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
  "form_status": "cancelled",
  "message": "Form cancelled"
}
```

#### Possible Next Steps

- None — cancellation is terminal. Create a new record if needed.

#### Related APIs

- `POST /api/form/amend` — alternative to cancellation for submitted records

#### Error Scenarios

- `422 VALIDATION_INVALID_REQUEST` — Record does not exist or is already in a terminal state.

---
# All APIs — Part 4

## Module: Workflow Engine (Runtime)

### Overview

The workflow engine runtime endpoints operate on live workflow instances — binding workflows to records, querying current state, executing transitions, and viewing history. These are called during the approval process, not during setup.

**Why it exists:** Setup APIs create the state machine blueprint. Runtime APIs are what users and systems interact with when records actually move through approval chains.

**Typical usage flow:** Submit form → bind workflow → execute transitions → check context → view history.

---

### Endpoint: `POST /api/workflow/bind`

#### Purpose

Creates a workflow instance for a submitted record, starting the approval process.

#### Business Context

Called automatically by `FormEngine` during form submission when `workflow_enabled = true`. Can also be called directly if a workflow needs to be bound to an existing submitted record.

#### Input

**Request Body:**
```json
{
  "entity_name": "job_requisition",
  "record_id": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
  "root_record_id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
  "amended_from_id": null,
  "actor": {
    "id": "8c81977a-a47d-448c-9f28-4d44fd2ceec0",
    "email": "admin@erp.local",
    "roles": ["admin"],
    "name": "Admin User"
  },
  "form_data": {
    "job_title": "DevOps Engineer",
    "department": "engineering"
  },
  "trigger_source": "form_submit",
  "timestamp": "2026-06-05T15:00:00+00:00"
}
```

**Request Body Fields:**
- `entity_name` (required): The entity definition name.
- `record_id` (required): The submitted entity record ID.
- `root_record_id` (required): The root record ID across amendments.
- `amended_from_id` (optional): Prior record ID if this is an amendment.
- `actor` (required): Authenticated actor context with `id`, `email`, `roles`, `name`.
- `form_data` (required): The submitted form data.
- `trigger_source` (optional): Source of the bind event.
- `timestamp` (optional): Event timestamp.

#### Processing

1. `WorkflowEngine.bind_workflow_on_submission()` is called.
2. Evaluates `routing_rules` to select the active workflow definition.
3. Creates `WorkflowInstance` with:
   - `workflow_id` = selected definition's ID
   - `workflow_version` = definition's current version
   - `entity_name`, `record_id`, `root_record_id`
   - `current_state` = `initial_state` from the definition
   - `started_at` = current timestamp
4. Writes initial `workflow_history` entry.
5. Returns instance details with available transitions.

#### Output

```json
{
  "success": true,
  "workflow_instance_id": "iii-1111-2222-3333-444444444444",
  "workflow_id": "w1a2b3c4-5678-90ab-cdef-012345678901",
  "workflow_version": 1,
  "entity_name": "job_requisition",
  "record_id": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
  "root_record_id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
  "amended_from_id": null,
  "current_state": "draft",
  "previous_state": null,
  "started_at": "2026-06-05T15:00:00+00:00",
  "updated_at": "2026-06-05T15:00:00+00:00",
  "completed_at": null,
  "available_transitions": [],
  "state_locked_fields": ["*"]
}
```

#### Possible Next Steps

- Execute first transition: `POST /api/workflow/transition` with `transition_name = "submit_for_approval"`.

#### Related APIs

- `POST /api/form/submit` — typically triggers bind automatically
- `POST /api/workflow/context` — check instance state
- `POST /api/workflow/transition` — execute transitions

#### Error Scenarios

- `422 WORKFLOW_INVALID_TRANSITION` — No routing rule matches or workflow definition is inactive.

---

### Endpoint: `POST /api/workflow/context`

#### Purpose

Returns the current workflow state, available transitions, and locked fields for a record.

#### Business Context

Called by the frontend whenever a record page loads. The response determines which buttons to show and what state badge to display.

#### Input

**Request Body:**
```json
{
  "entity_name": "job_requisition",
  "record_id": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
}
```

**Request Body Fields:**
- `entity_name` (required): The entity definition name.
- `record_id` (required): The entity record ID.

#### Processing

1. `WorkflowEngine.get_workflow_context()` loads the active `WorkflowInstance` for the record.
2. Determines the current state label and color from the workflow definition's `states` array.
3. Finds all transitions where `from_state` matches the current state.
4. For each candidate transition, checks if the actor has one of the `allowed_roles`.
5. Assembles available transitions with button configuration.
6. Determines `locked_fields` for the current state.

#### Output

```json
{
  "current_state": "pending_hm",
  "state_label": "Pending HM Approval",
  "state_color": "yellow",
  "is_terminal": false,
  "available_transitions": [
    {
      "name": "hm_approve",
      "label": "Approve",
      "variant": "primary",
      "position": "top_right",
      "requires_confirm": false,
      "is_override": false
    },
    {
      "name": "reject",
      "label": "Reject",
      "variant": "danger",
      "position": "top_right",
      "requires_confirm": true,
      "confirm_message": "Are you sure you want to reject this requisition?",
      "is_override": false
    }
  ],
  "state_locked_fields": ["*"]
}
```

**Response fields:**
- `current_state`: The workflow state key.
- `state_label`: Human-readable state name.
- `state_color`: Badge color (`gray`, `yellow`, `orange`, `green`, `red`).
- `is_terminal`: `true` when in a final state (no more transitions).
- `available_transitions`: Array of transition buttons the current user can execute. Empty array means no available actions.
- `state_locked_fields`: `["*"]` means all form fields are read-only.

#### Possible Next Steps

- Execute a transition: `POST /api/workflow/transition` with one of the `available_transitions` names.

#### Related APIs

- `POST /api/form/render` — form render also includes workflow context
- `POST /api/workflow/transition` — execute a transition
- `GET /api/workflow/instance/{entity_name}/{record_id}` — full instance details

#### Error Scenarios

- `404 WORKFLOW_INSTANCE_NOT_FOUND` — No workflow instance exists for the record (record may not be submitted or workflow was not enabled).

---

### Endpoint: `POST /api/workflow/transition`

#### Purpose

Executes a workflow state transition for a record — the runtime endpoint that moves records through approval chains.

#### Business Context

Called when an authorized user clicks an approval button. This is the most critical runtime endpoint — it performs the full TCA pipeline: trigger validation, condition evaluation, state transition, and async side-effect dispatch.

#### Input

**Request Body:**
```json
{
  "entity_name": "job_requisition",
  "record_id": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
  "transition_name": "hm_approve",
  "actor": {
    "id": "8c81977a-a47d-448c-9f28-4d44fd2ceec0",
    "email": "hm@erp.local",
    "roles": ["hm"],
    "name": "Hiring Manager"
  },
  "form_data": {
    "job_title": "DevOps Engineer",
    "department": "engineering",
    "headcount": 2,
    "location": "Bengaluru"
  },
  "trigger_source": "user_action",
  "comment": "Looks good, approving.",
  "timestamp": "2026-06-05T15:00:00+00:00"
}
```

**Request Body Fields:**
- `entity_name` (required): The entity definition name.
- `record_id` (required): The entity record ID.
- `transition_name` (required): Must match a `name` from the workflow's transitions.
- `actor` (required): Authenticated actor context.
- `form_data` (required): Current form data (used for validator evaluation).
- `trigger_source` (optional, default "user_action"): Source of the trigger.
- `comment` (optional): Optional comment from the actor.
- `timestamp` (optional): Event timestamp.

#### Processing

The full TCA pipeline:

1. Load active `WorkflowInstance` for the record.
2. Find matching `WorkflowTransition` where `from_state` matches `instance.current_state` and `name` matches `transition_name`.
3. **Idempotency check:** Query `workflow_history` for existing entry with matching `(instance_id, idempotency_key)`. Reject if found.
4. **Role check:** Verify actor has at least one role in `allowed_roles`.
5. **Permission check:** Call `PermissionEngine.evaluate("transition")` for record-level access.
6. **Validator evaluation:**
   - `requires_field`: Check field is present in `form_data`.
   - `field_value`: Check field matches expected value.
   - `min_value`/`max_value`: Check numeric bounds.
   - `regex_match`: Check pattern match.
   - `expiry_check`: Check date is not expired.
   - `role_check`: Verify actor has required roles.
   - `no_open_children`: Check no open related records.
7. **Override handling:** If `is_override` transition, create or evaluate `WorkflowOverrideRequest`.
8. **State update:** `instance.current_state = to_state`; `instance.previous_state = from_state`. `db.flush()` to persist state before dispatch.
9. **Action dispatch:** For each action in the transition, call `execute_workflow_action.delay(payload)` to Celery.
10. **History log:** Append `WorkflowHistory` row with full transition details.
11. **Audit log:** `AuditEngine.log_event()` records the transition event.
12. `db.commit()`.

#### Output (Success)

```json
{
  "success": true,
  "new_state": "pending_director",
  "previous_state": "pending_hm",
  "available_transitions": [
    {
      "name": "director_approve",
      "label": "Approve",
      "variant": "primary",
      "position": "top_right",
      "requires_confirm": false,
      "is_override": false
    },
    {
      "name": "reject",
      "label": "Reject",
      "variant": "danger",
      "position": "top_right",
      "requires_confirm": true,
      "confirm_message": "Are you sure you want to reject this requisition?",
      "is_override": false
    }
  ],
  "state_locked_fields": ["*"],
  "errors": [],
  "workflow_instance_id": "iii-1111-2222-3333-444444444444"
}
```

#### Output (Failure)

```json
{
  "success": false,
  "new_state": null,
  "previous_state": "pending_hm",
  "available_transitions": [],
  "state_locked_fields": ["*"],
  "errors": [
    {
      "field": null,
      "message": "Role check failed: actor does not have any of the required roles [director]",
      "code": "WORKFLOW_TRANSITION_ROLE_DENIED",
      "context": {
        "entity_name": "job_requisition",
        "record_id": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
        "transition_name": "hm_approve",
        "current_state": "pending_hm"
      }
    }
  ]
}
```

#### Possible Next Steps

- Execute next transition: call again with the next `available_transitions` name.
- Check context: `POST /api/workflow/context`.
- View history: `GET /api/workflow/history/{instance_id}`.

#### Related APIs

- `POST /api/workflow/context` — check available transitions
- `GET /api/workflow/history/{instance_id}` — view audit trail
- `GET /api/workflow/instance/{entity_name}/{record_id}` — full instance details

#### Error Scenarios

- `404 WORKFLOW_INSTANCE_NOT_FOUND` — No workflow instance exists for the record.
- `404 WORKFLOW_TRANSITION_NOT_FOUND` — No transition matches the current state and name.
- `422 WORKFLOW_INVALID_TRANSITION` — Record is not in the expected `from_state`.
- `403 WORKFLOW_TRANSITION_ROLE_DENIED` — Actor lacks required `allowed_roles`.
- `403 WORKFLOW_RECORD_PERMISSION_DENIED` — Actor lacks record-level transition permission.
- `422 WORKFLOW_REQUIRED_FIELD_MISSING` — Validator required field is missing.
- `422 WORKFLOW_FIELD_VALUE_MISMATCH` — Validator field value does not match.
- `422 WORKFLOW_FIELD_BELOW_MINIMUM` — Numeric value below minimum.
- `422 WORKFLOW_FIELD_ABOVE_MAXIMUM` — Numeric value above maximum.
- `422 WORKFLOW_FIELD_PATTERN_MISMATCH` — Value does not match regex.
- `422 WORKFLOW_FIELD_EXPIRED` — Date field has expired.

---

### Endpoint: `GET /api/workflow/instance/{entity_name}/{record_id}`

#### Purpose

Retrieves full details of a workflow instance for a specific record.

#### Business Context

Used by admin screens and detail views to inspect the complete state of a running or completed workflow instance.

#### Input

**Path Parameters:**
- `entity_name` (string): The entity definition name.
- `record_id` (UUID string): The entity record ID.

#### Output

```json
{
  "id": "iii-1111-2222-3333-444444444444",
  "workflow_id": "w1a2b3c4-5678-90ab-cdef-012345678901",
  "workflow_version": 1,
  "entity_name": "job_requisition",
  "record_id": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
  "root_record_id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
  "amended_from_id": null,
  "current_state": "pending_director",
  "previous_state": "pending_hm",
  "started_at": "2026-06-05T15:00:00+00:00",
  "updated_at": "2026-06-05T15:30:00+00:00",
  "completed_at": null,
  "is_terminal": false
}
```

**Response fields:**
- `is_terminal`: `true` when `completed_at` is set (record reached a terminal state like `approved` or `rejected`).

#### Related APIs

- `POST /api/workflow/context` — get current state and available transitions
- `GET /api/workflow/history/{instance_id}` — view transition history

#### Error Scenarios

- `404 WORKFLOW_INSTANCE_NOT_FOUND` — No workflow instance exists for the record.

---

### Endpoint: `GET /api/workflow/history/{instance_id}`

#### Purpose

Returns the complete transition history (audit trail) for a workflow instance.

#### Business Context

Used for compliance, tracking, and debugging. Shows every action taken on a record — who approved what, when, and whether it was an override.

#### Input

**Path Parameters:**
- `instance_id` (UUID string): The workflow instance ID.

#### Output

```json
[
  {
    "id": "h1",
    "transition_name": "submit_for_approval",
    "from_state": "draft",
    "to_state": "pending_hm",
    "actor_id": "8c81977a-a47d-448c-9f28-4d44fd2ceec0",
    "actor_role": "ptc",
    "trigger_source": "user_action",
    "is_override": false,
    "override_approved_by": null,
    "timestamp": "2026-06-03T07:35:00+00:00",
    "comment": null
  },
  {
    "id": "h2",
    "transition_name": "hm_approve",
    "from_state": "pending_hm",
    "to_state": "pending_director",
    "actor_id": "8c81977a-a47d-448c-9f28-4d44fd2ceec0",
    "actor_role": "hm",
    "trigger_source": "user_action",
    "is_override": false,
    "override_approved_by": null,
    "timestamp": "2026-06-03T08:00:00+00:00",
    "comment": "Looks good, approving."
  },
  {
    "id": "h3",
    "transition_name": "director_approve",
    "from_state": "pending_director",
    "to_state": "pending_founder",
    "actor_id": "8c81977a-a47d-448c-9f28-4d44fd2ceec0",
    "actor_role": "director",
    "trigger_source": "user_action",
    "is_override": false,
    "override_approved_by": null,
    "timestamp": "2026-06-03T08:30:00+00:00",
    "comment": null
  },
  {
    "id": "h4",
    "transition_name": "founder_approve",
    "from_state": "pending_founder",
    "to_state": "approved",
    "actor_id": "8c81977a-a47d-448c-9f28-4d44fd2ceec0",
    "actor_role": "founder",
    "trigger_source": "user_action",
    "is_override": false,
    "override_approved_by": null,
    "timestamp": "2026-06-03T09:00:00+00:00",
    "comment": null
  }
]
```

**History entries are ordered by `timestamp` ascending and are immutable — no updates or deletions after creation.**

#### Related APIs

- `POST /api/workflow/transition` — executes transitions that create history entries
- `GET /api/workflow/instance/{entity_name}/{record_id}` — get instance details

#### Error Scenarios

- The endpoint does not return 404 for empty history — it returns an empty array `[]`. This allows callers to distinguish "no history yet" from "instance not found".

---
# All APIs — Part 5

## Module: Permissions

### Overview

The permissions module provides CRUD operations for two permission concepts: `RolePermission` (entity-level action/scope rules) and `PermissionAssignment` (record-level role grants). Both are enforced by `PermissionEngine` at runtime.

**Why it exists:** Without a managed permission system, access control would require hardcoded checks scattered across every endpoint. The permission module centralizes all access rules in database-backed tables.

**Typical usage flow:** Create role permission rules → create permission assignments for specific records → permissions are evaluated automatically on form render and workflow transitions.

---

### Endpoint: `POST /api/permissions/role-rules`

#### Purpose

Creates a role-permission rule granting a role an action on an entity with a specific scope.

#### Business Context

Role rules are the foundation of the permission system. They define what each role can do at the entity level. For example: "HM can read job requisitions with assigned scope" or "PTC can create candidates with own scope."

#### Input

**Request Body:**
```json
{
  "role": "hm",
  "entity_name": "job_requisition",
  "action": "read",
  "scope": "assigned",
  "is_active": true
}
```

**Request Body Fields:**
- `role` (required): Canonical role string (e.g., `admin`, `hm`, `ptc`, `director`, `founder`, `candidate`).
- `entity_name` (required): Entity definition name the rule applies to. Use `"all"` for global rules.
- `action` (required): One of `read`, `create`, `write`, `delete`, `submit`, `transition`, `assign`, `comment`, `upload`, `export`.
- `scope` (optional, default "own"): One of `all`, `own`, `assigned`, `team`, `department`, `location`.
- `is_active` (optional, default true): Whether the rule is active.

#### Processing

1. Validates `role` is a recognized canonical role.
2. Validates `action` is in the supported set.
3. Validates `scope` is a valid scope type.
4. Checks for unique constraint violation `(role, entity_name, action)`.
5. Creates `RolePermission` row.

#### Output

```json
{
  "id": "rp1a2b3c4-5678-90ab-cdef-012345678901",
  "role": "hm",
  "entity_name": "job_requisition",
  "action": "read",
  "scope": "assigned",
  "is_active": true,
  "created_at": "2026-06-05T15:00:00+05:30",
  "updated_at": "2026-06-05T15:00:00+05:30"
}
```

#### Possible Next Steps

- Create permission assignments for specific records: `POST /api/permissions/assignments`.
- Test permissions: call a protected endpoint and observe access control behavior.

#### Related APIs

- `GET /api/permissions/role-rules` — list role rules
- `PUT /api/permissions/role-rules/{permission_id}` — update rule
- `DELETE /api/permissions/role-rules/{permission_id}` — soft-delete rule
- `POST /api/permissions/assignments` — create record-level assignment

#### Error Scenarios

- `409` — Unique constraint violation on `(role, entity_name, action)`.

---

### Endpoint: `GET /api/permissions/role-rules`

#### Purpose

Lists role-permission rules with optional filtering.

#### Business Context

Used by admin screens to browse and manage the permission rule catalog.

#### Input

**Query Parameters:**
- `role` (string, optional): Filter by role.
- `entity_name` (string, optional): Filter by entity.
- `action` (string, optional): Filter by action.
- `is_active` (boolean, optional): Filter by active status.

#### Output

Array of `RolePermissionResponse` objects.

#### Related APIs

- `POST /api/permissions/role-rules` — create rule
- `GET /api/permissions/role-rules/{permission_id}` — fetch one rule

---

### Endpoint: `GET /api/permissions/role-rules/{permission_id}`

#### Purpose

Retrieves a single role-permission rule by UUID.

#### Input

**Path Parameters:**
- `permission_id` (UUID string): The rule ID.

#### Output

Returns the full `RolePermissionResponse`.

#### Error Scenarios

- `404` — Rule not found (error code `PERMISSION_RULE_NOT_FOUND` from `errors.py`).

---

### Endpoint: `PUT /api/permissions/role-rules/{permission_id}`

#### Purpose

Updates a role-permission rule (partial update).

#### Business Context

Used to modify scope, toggle active status, or change action after creation.

#### Input

**Path Parameters:**
- `permission_id` (UUID string): The rule ID.

**Request Body (all fields optional):**
```json
{
  "scope": "all",
  "is_active": false
}
```

#### Output

Returns the updated `RolePermissionResponse`.

#### Error Scenarios

- `404` — Rule not found.

---

### Endpoint: `DELETE /api/permissions/role-rules/{permission_id}`

#### Purpose

Soft-deletes a role-permission rule by setting `is_active = false`.

#### Input

**Path Parameters:**
- `permission_id` (UUID string): The rule ID.

#### Output

```json
{
  "success": true,
  "soft_deleted": true
}
```

---

### Endpoint: `POST /api/permissions/assignments`

#### Purpose

Creates a record-level permission assignment — granting a user an effective role on a specific entity record.

#### Business Context

Assignments enable `assigned`-scoped permissions. For example, when a record is assigned to a hiring manager, an assignment row gives that user the `hm` role on that specific record, enabling access that would otherwise be denied.

#### Input

**Request Body:**
```json
{
  "entity_name": "job_requisition",
  "record_id": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
  "user_id": "8c81977a-a47d-448c-9f28-4d44fd2ceec0",
  "role": "hm",
  "is_active": true
}
```

**Request Body Fields:**
- `entity_name` (required): Entity definition name.
- `record_id` (required): The entity record ID.
- `user_id` (required): The user receiving the role assignment.
- `role` (required): Canonical role being assigned.
- `is_active` (optional, default true): Whether the assignment is active.

#### Processing

1. Validates inputs.
2. Creates `PermissionAssignment` row with `assigned_by` from the actor.
3. Enforces unique constraint on `(entity_name, record_id, user_id, role)`.

#### Output

```json
{
  "id": "pa1a2b3c4-5678-90ab-cdef-012345678901",
  "entity_name": "job_requisition",
  "record_id": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
  "user_id": "8c81977a-a47d-448c-9f28-4d44fd2ceec0",
  "role": "hm",
  "assigned_by": "8c81977a-a47d-448c-9f28-4d44fd2ceec0",
  "is_active": true,
  "created_at": "2026-06-05T15:00:00+05:30",
  "updated_at": "2026-06-05T15:00:00+05:30"
}
```

#### Possible Next Steps

- The assigned user now has `assigned`-scoped access to the record. They can read/write/transition based on matching `RolePermission` rules.
- Verify access: call a protected endpoint as the assigned user.

#### Related APIs

- `GET /api/permissions/assignments` — list assignments
- `PUT /api/permissions/assignments/{assignment_id}` — update assignment
- `DELETE /api/permissions/assignments/{assignment_id}` — soft-delete assignment

#### Error Scenarios

- `409` — Unique constraint violation on `(entity_name, record_id, user_id, role)`.

---

### Endpoint: `GET /api/permissions/assignments`

#### Purpose

Lists permission assignments with optional filtering.

#### Input

**Query Parameters:**
- `entity_name` (string, optional): Filter by entity.
- `record_id` (UUID string, optional): Filter by record.
- `user_id` (UUID string, optional): Filter by user.
- `is_active` (boolean, optional): Filter by active status.

#### Output

Array of `PermissionAssignmentResponse` objects.

---

### Endpoint: `GET /api/permissions/assignments/{assignment_id}`

#### Purpose

Retrieves a single permission assignment by UUID.

#### Input

**Path Parameters:**
- `assignment_id` (UUID string): The assignment ID.

#### Error Scenarios

- `404` — Assignment not found (error code `PERMISSION_ASSIGNMENT_NOT_FOUND`).

---

### Endpoint: `PUT /api/permissions/assignments/{assignment_id}`

#### Purpose

Updates a permission assignment (partial update).

#### Input

**Path Parameters:**
- `assignment_id` (UUID string): The assignment ID.

**Request Body (all fields optional):**
```json
{
  "role": "director",
  "is_active": false
}
```

#### Output

Returns the updated `PermissionAssignmentResponse`.

---

### Endpoint: `DELETE /api/permissions/assignments/{assignment_id}`

#### Purpose

Soft-deletes a permission assignment.

#### Output

```json
{
  "success": true,
  "soft_deleted": true
}
```

---

## Module: Notification Templates

### Overview

The notification templates module manages versioned email templates used by workflow actions. Templates are rendered with context data and dispatched through the notification engine.

**Why it exists:** Notification content must be editable without code changes. Versioning ensures template changes are auditable and previous versions can be referenced.

---

### Endpoint: `POST /api/notification-templates`

#### Purpose

Creates a new notification template.

#### Business Context

Templates are referenced by name in workflow transition actions. Creating a template defines the subject and body content that will be sent when that transition executes.

#### Input

**Request Body:**
```json
{
  "name": "hm_approved",
  "channel": "email",
  "subject": "Requisition Approved by HM",
  "body_text": "Hello {ptc_name}, the requisition {job_title} has been approved by {hm_name} and is now with the Director.",
  "version": 1,
  "is_active": true,
  "created_by": "8c81977a-a47d-448c-9f28-4d44fd2ceec0"
}
```

**Request Body Fields:**
- `name` (required): Template key. Referenced by name in workflow actions.
- `channel` (optional, default "email"): Delivery channel.
- `subject` (optional): Renderable subject template. Supports `{placeholder}` syntax.
- `body_text` (required): Renderable body template.
- `version` (optional, default 1): Template version.
- `is_active` (optional, default true): Whether the template is active.
- `created_by` (optional): Creator actor ID.

#### Processing

1. Validates `name` is unique.
2. Creates `NotificationTemplate` row.
3. Snapshot is saved to `NotificationTemplateHistory`.

#### Output

```json
{
  "id": "nt1a2b3c4-5678-90ab-cdef-012345678901",
  "name": "hm_approved",
  "channel": "email",
  "subject": "Requisition Approved by HM",
  "body_text": "Hello {ptc_name}, ...",
  "version": 1,
  "is_active": true,
  "created_by": "8c81977a-a47d-448c-9f28-4d44fd2ceec0",
  "created_at": "2026-06-05T15:00:00+05:30"
}
```

#### Related APIs

- `GET /api/notification-templates` — list templates
- `PUT /api/notification-templates/{template_id}` — update template (creates history snapshot)
- `GET /api/notification-templates/{template_id}/history` — view version history

---

### Endpoint: `GET /api/notification-templates`

#### Purpose

Lists notification templates with optional filtering.

#### Input

**Query Parameters:**
- `name` (string, optional): Filter by template name.
- `channel` (string, optional): Filter by channel.
- `is_active` (boolean, optional): Filter by active status.

#### Output

Array of `NotificationTemplateResponse` objects.

---

### Endpoint: `GET /api/notification-templates/{template_id}`

#### Purpose

Retrieves a single notification template by UUID.

#### Error Scenarios

- `404` — Template not found (references `NOTIFICATION_TEMPLATE_NOT_FOUND` from `errors.py`).

---

### Endpoint: `PUT /api/notification-templates/{template_id}`

#### Purpose

Updates a notification template. On update, the current state is snapshotted into `NotificationTemplateHistory` before applying changes.

#### Input

**Path Parameters:**
- `template_id` (UUID string): The template ID.

**Request Body (all fields optional):**
```json
{
  "subject": "Updated Subject",
  "body_text": "Updated body content",
  "is_active": true
}
```

#### Processing

1. Snapshots current template state to `NotificationTemplateHistory`.
2. Increments `version`.
3. Applies updates.
4. Sets `changed_by` from actor.

#### Output

Returns the updated `NotificationTemplateResponse`.

---

### Endpoint: `DELETE /api/notification-templates/{template_id}`

#### Purpose

Soft-deletes a notification template by setting `is_active = false`.

#### Output

```json
{
  "success": true
}
```

---

### Endpoint: `GET /api/notification-templates/{template_id}/history`

#### Purpose

Returns the version history snapshots for a notification template.

#### Business Context

Used to audit template changes and restore previous versions if needed.

#### Input

**Path Parameters:**
- `template_id` (UUID string): The template ID.

#### Output

```json
[
  {
    "id": "h1a2b3c4-5678-90ab-cdef-012345678901",
    "template_id": "nt1a2b3c4-5678-90ab-cdef-012345678901",
    "version": 1,
    "snapshot": {
      "name": "hm_approved",
      "channel": "email",
      "subject": "Original Subject",
      "body_text": "Original body",
      "version": 1,
      "is_active": true
    },
    "changed_by": "8c81977a-a47d-448c-9f28-4d44fd2ceec0",
    "changed_at": "2026-06-05T15:00:00+05:30",
    "change_reason": null
  }
]
```

---

## Module: File Upload

### Overview

The upload module provides a single endpoint for file uploads, storing files in MinIO object storage and returning object keys and temporary access URLs.

**Why it exists:** Forms and records need to support file attachments (resumes, documents, images). MinIO provides scalable, durable object storage separate from the database.

---

### Endpoint: `POST /api/upload`

#### Purpose

Uploads a file to MinIO object storage and returns the object key and temporary URL.

#### Business Context

Called when users attach files to forms. The returned `object_key` is stored in `entity_records.data` (e.g., `resume_url: "s3://ats-resumes/abc123.pdf"`). The frontend uses the URL for preview or download.

#### Input

**Headers:**
- `Authorization: Bearer <jwt>` (required)

**Form Data:**
- `file` (required): The file to upload. Maximum size: 10 MB.

#### Processing

1. Validates file size ≤ 10 MB.
2. Extracts file extension from filename.
3. Generates object key: `uploads/{uuid}.{ext}`.
4. Uploads file to MinIO via `MinIOClient.upload_file()`.
5. Returns object key and temporary URL.

#### Output

```json
{
  "object_key": "uploads/abc123-def456-789.pdf",
  "url": "http://minio:9000/erp-uploads/uploads/abc123-def456-789.pdf"
}
```

#### Possible Next Steps

- Store `object_key` in entity record data: `POST /api/form/save-draft` with the key in `form_data`.
- Reference the key in ATS candidate records as `resume_url`.

#### Related APIs

- `POST /api/form/save-draft` — store uploaded file reference in record data

#### Error Scenarios

- `400 VALIDATION_INVALID_REQUEST` — File exceeds 10 MB limit.
- `502 EXTERNAL_SERVICE_ERROR` — MinIO upload failed (connection error, bucket not found, etc.).

---

## Module: Email

### Overview

The email module provides a direct API for sending emails through Zoho Mail. It is used by the notification engine for direct email recipients and can be called directly for ad-hoc email sending.

**Why it exists:** Workflow notifications require actual email delivery. The email module provides the Zoho Mail integration layer that the notification engine uses.

---

### Endpoint: `POST /api/email/send`

#### Purpose

Queues an email for delivery through Zoho Mail.

#### Business Context

Supports both direct API-triggered sends and workflow-triggered notifications. The email is dispatched asynchronously via Celery to avoid blocking the request cycle.

#### Input

**Request Body:**
```json
{
  "to": ["recipient@example.com"],
  "cc": ["manager@example.com"],
  "bcc": ["audit@example.com"],
  "subject": "Welcome to the ERP",
  "body": "Hello, this is your notification."
}
```

**Request Body Fields:**
- `to` (required): Array of recipient email addresses. At least one required.
- `cc` (optional): Array of CC recipient email addresses.
- `bcc` (optional): Array of BCC recipient email addresses.
- `subject` (required): Email subject line.
- `body` (required): Email body content (plain text).

#### Processing

1. Validates required fields (`to`, `subject`, `body`).
2. Queues email task via Celery: `send_email_task.delay(...)`.
3. Returns Celery task ID as `message_id`.

#### Output

```json
{
  "success": true,
  "message": "Email queued successfully",
  "provider": "zoho",
  "message_id": "celery-task-uuid-here"
}
```

#### Possible Next Steps

- Check notification logs: query `notification_log` table for delivery status.
- Use in workflow actions: configure a workflow transition with `{"type": "notify", "template": "..."}` for template-based sending.

#### Related APIs

- `GET /api/notification-templates` — manage templates for workflow notifications
- `POST /api/workflow/transition` — workflow transitions can trigger notifications

#### Error Scenarios

- `502` — Celery task queue failed or Zoho Mail provider error.

---

## Module: Zoho People

### Overview

The Zoho People module integrates with the Zoho People HRIS system to sync employee master data and provide active employee dropdown options.

**Why it exists:** Employee data (names, departments, designations, reporting lines) is maintained in Zoho People. The ERP needs this data for assignment targets, dropdowns, and role resolution.

---

### Endpoint: `POST /api/zoho-people/employees/sync`

#### Purpose

Fetches employees from Zoho People and upserts them into the `employee_master` table.

#### Business Context

This is the data sync endpoint. It is typically called by an external scheduler (since no internal scheduler exists yet) to keep employee master data fresh. It requires `admin`, `super_admin`, or `system` actor roles.

#### Input

**Headers:**
- `Authorization: Bearer <jwt>` (required)

#### Processing

1. Validates actor has allowed role (`admin`, `super_admin`, `system`).
2. Refreshes Zoho OAuth access token from `ZOHO_PEOPLE_REFRESH_TOKEN`.
3. Fetches employees page by page from Zoho People API.
4. Upserts each employee into `employee_master` using lookup order: `employee_id` → `email_id` → `zoho_id` → `zuid`.
5. Updates `is_active` based on Zoho employee status.
6. Preserves complete Zoho payload in `zoho_raw` JSONB.
7. Returns sync summary.

#### Output

```json
{
  "success": true,
  "fetched": 150,
  "created": 120,
  "updated": 30,
  "skipped": 0,
  "errors": []
}
```

#### Error Scenarios

- `403` — Actor does not have `admin`, `super_admin`, or `system` role.
- `503 ZOHO_NOT_CONFIGURED` — Zoho People credentials are missing.
- `502` — Zoho API request failed (auth, rate limit, bad request, etc.).

---

### Endpoint: `GET /api/zoho-people/employees/options`

#### Purpose

Returns active employees for dropdown-style selectors.

#### Business Context

Used by form fields (e.g., hiring manager dropdown) and assignment UIs to show available employees.

#### Input

**Query Parameters:**
- `q` (string, optional): Search query matched against name, email, employee ID, designation, or department.
- `limit` (integer, default 100, min 1, max 500): Maximum results to return.

#### Processing

1. Queries `EmployeeMaster` where `is_active = true`.
2. If `q` is provided, filters by `full_name`, `email_id`, `employee_id`, `designation`, or `department` using case-insensitive LIKE.
3. Orders by `full_name` ascending (nulls last), then `employee_id` ascending.
4. Returns limited results.

#### Output

```json
[
  {
    "id": "em1a2b3c4-5678-90ab-cdef-012345678901",
    "employee_id": "EMP001",
    "email_id": "john.doe@company.com",
    "full_name": "John Doe",
    "designation": "Senior Engineer",
    "department": "Engineering",
    "location_name": "Bengaluru"
  }
]
```

#### Possible Next Steps

- Use employee ID or email in `assign_to` workflow actions.
- Reference in form fields as foreign-key-like values.

#### Related APIs

- `POST /api/zoho-people/employees/sync` — refresh employee data from Zoho

---

## Module: Records

### Overview

The records module provides a generic endpoint for creating entity records from JSON payloads. It is the lowest-level persistence API for dynamic entities.

**Why it exists:** While `FormEngine` manages the full form lifecycle (draft, submit, amend), the records endpoint provides direct JSON record creation for programmatic or integration use cases.

---

### Endpoint: `POST /api/entity/{entity_name}/records`

#### Purpose

Creates a generic entity record from a JSON payload.

#### Business Context

Used for direct record creation outside the form lifecycle. The payload keys must match active `field_definitions.name` values for the entity. This endpoint validates required fields and enforces `idempotency_key` via header.

#### Input

**Path Parameters:**
- `entity_name` (string): The entity definition name.

**Headers:**
- `Idempotency-Key` (string, required): Idempotency key for preventing duplicate record creation.

**Request Body:**
```json
{
  "full_name": "Aarav Mehta",
  "email": "aarav.mehta@example.com",
  "phone": "+91-9876543210",
  "is_fresher": false,
  "years_experience": 4,
  "current_company": "OrbitWorks",
  "job_id": "JOB-2026-014",
  "resume_url": "s3://ats-resumes/aarav-mehta.pdf"
}
```

**Request Body Fields:**
- Keys must match `field_definitions.name` values for the entity.
- System keys `id`, `uuid`, `record_id` are rejected.
- Email uniqueness is enforced within the entity.

#### Processing

1. Validates actor has `create` permission on the entity (via `PermissionEngine`).
2. Validates required fields are present via `EntityBuilder` schema.
3. Checks email uniqueness if `email` is present.
4. Creates `EntityRecord` via `RecordService.create_record()`.
5. Writes `record_created` audit event.

#### Output

```json
{
  "data": {
    "id": "63cbcb3a-82dc-4c2e-9d33-32d8b994b31f"
  }
}
```

#### Possible Next Steps

- Create form record: `POST /api/form/save-draft` with the record ID.
- Update record: `POST /api/entity/{entity_name}/records` with idempotency key.

#### Related APIs

- `POST /api/form/save-draft` — full form lifecycle with draft support
- `POST /api/form/submit` — submit with workflow binding

#### Error Scenarios

- `403 PERMISSION_DENIED` — Actor lacks `create` permission on the entity.
- `422 VALIDATION_INVALID_REQUEST` — Required fields missing or validation constraints violated.
- `409 RECORD_EMAIL_NOT_UNIQUE` — Email already belongs to another record for the same entity.
- `422 RECORD_EMAIL_IMMUTABLE` — Attempting to change an existing record's email.

---

## Module: Upload (File Upload)

Refer to `POST /api/upload` in the Upload section above.

---

## Module: Email

Refer to `POST /api/email/send` in the Email section above.

---

## Module: Zoho People

Refer to `POST /api/zoho-people/employees/sync` and `GET /api/zoho-people/employees/options` in the Zoho People section above.

---

## Module: Health

### Overview

The health module provides lightweight endpoints for application health checks and root information.

---

### Endpoint: `GET /api/health`

#### Purpose

Returns the application health status.

#### Business Context

Used by orchestrators (Docker, Kubernetes), load balancers, and monitoring systems to verify the FastAPI process is running.

#### Input

None.

#### Output

```json
{
  "status": "ok"
}
```

#### Related APIs

- `GET /api/` — root endpoint with API info

---

### Endpoint: `GET /api/`

#### Purpose

Returns the root API information.

#### Output

```json
{
  "message": "Aerospace ERP API",
  "docs": "/docs"
}
```

---

## Module: ATS (Applicant Tracking System)

### Overview

The ATS module provides domain-specific endpoints for candidate and job requisition management. It demonstrates the framework's capabilities for building complete business workflows on top of the shared engine layer.

**Why it exists:** The ATS module is the reference implementation showing how a domain module should be structured. It covers the full hiring workflow from requisition creation through candidate screening and hiring.

---

### Endpoint: `GET /api/ats/candidates`

#### Purpose

Lists candidate records with pagination and permission filtering.

#### Business Context

Used by hiring managers and recruiters to browse the candidate pool. Returns only records the actor has permission to read.

#### Input

**Query Parameters:**
- `skip` (integer, default 0): Pagination offset.
- `limit` (integer, default 100, max 500): Page size.

#### Output

```json
{
  "data": [
    {
      "id": "63cbcb3a-82dc-4c2e-9d33-32d8b994b31f",
      "full_name": "Aarav Mehta",
      "email": "aarav.mehta@example.com",
      "phone": "+91-9876543210",
      "is_fresher": false,
      "years_experience": 4,
      "current_company": "OrbitWorks",
      "job_id": "JOB-2026-014",
      "resume_url": "s3://ats-resumes/aarav-mehta.pdf",
      "workflow_state": "new"
    }
  ],
  "total": 1
}
```

---

### Endpoint: `GET /api/ats/candidates/{record_id}`

#### Purpose

Retrieves a single candidate record by ID.

#### Input

**Path Parameters:**
- `record_id` (UUID string): The candidate record ID.

#### Output

Returns the serialized candidate record.

#### Error Scenarios

- `404` — Record not found.
- `403` — Permission denied to read this candidate.

---

### Endpoint: `POST /api/ats/candidates`

#### Purpose

Creates a new candidate record.

#### Business Context

Used when a candidate applies for a position. The record is created through the ATS module, which delegates to `RecordService` and `FormEngine` for persistence.

#### Input

**Request Body:**
```json
{
  "full_name": "Aarav Mehta",
  "email": "aarav.mehta@example.com",
  "phone": "+91-9876543210",
  "is_fresher": false,
  "years_experience": 4,
  "current_company": "OrbitWorks",
  "job_id": "JOB-2026-014",
  "resume_url": "s3://ats-resumes/aarav-mehta.pdf"
}
```

#### Processing

1. Validates `create` permission on `candidates` entity.
2. Persists record via `RecordService`.
3. Seeds `workflow_state: "new"` for legacy compatibility.

#### Output

```json
{
  "data": {
    "id": "63cbcb3a-82dc-4c2e-9d33-32d8b994b31f"
  }
}
```

---

### Endpoint: `PUT /api/ats/candidates/{record_id}`

#### Purpose

Updates an existing candidate record.

#### Input

**Path Parameters:**
- `record_id` (UUID string): The candidate record ID.

**Request Body:** Partial update JSON matching candidate field definitions.

#### Error Scenarios

- `422 RECORD_EMAIL_IMMUTABLE` — Attempting to change the candidate's email.

---

### Endpoint: `POST /api/ats/job-requisitions`

#### Purpose

Creates a new job requisition record.

#### Business Context

Used by PTC (Partner Team Coordinator) to create hiring requests. Job requisitions follow the workflow approval chain defined in the ATS module.

#### Input

**Request Body:**
```json
{
  "title": "Senior Backend Engineer",
  "department": "Engineering",
  "location": "Bengaluru",
  "job_level": "senior",
  "headcount": 2,
  "hiring_manager_id": "8c81977a-a47d-448c-9f28-4d44fd2ceec0",
  "target_start_date": "2026-07-01"
}
```

#### Output

```json
{
  "data": {
    "id": "jr1a2b3c4-5678-90ab-cdef-012345678901"
  }
}
```

---

### Endpoint: `PUT /api/ats/job-requisitions/{record_id}/transition`

#### Purpose

Executes a legacy ATS transition on a job requisition.

#### Business Context

Provides a simplified transition API for ATS-specific workflow steps, translating legacy transition names to the workflow engine's transition names.

#### Input

**Path Parameters:**
- `record_id` (UUID string): The job requisition record ID.

**Request Body:**
```json
{
  "transition": "hm_approve",
  "comment": "Approving this requisition"
}
```

---

### Endpoint: `POST /api/ats/job-requisitions/{record_id}/assign-hm`

#### Purpose

Assigns a hiring manager to a job requisition.

#### Business Context

Called when a job requisition needs to be assigned to an HM for review. Creates a `PermissionAssignment` granting the selected user the `hm` role on the record.

#### Input

**Path Parameters:**
- `record_id` (UUID string): The job requisition record ID.

**Request Body:**
```json
{
  "hm_id": "8c81977a-a47d-448c-9f28-4d44fd2ceec0"
}
```

#### Processing

1. Creates `PermissionAssignment` with `entity_name = "job_requisitions"`, `role = "hm"`.
2. The assigned user can now execute HM transitions on this record.

---
