# Developer & Deployment Utilities Reference

This document explains the Zoho SSO authentication callbacks, frontend environment variables, and the local Dev Bypass flow.

## 1. Zoho SSO & Redirection Flows

When a user initiates authentication, the following sequence occurs:
1. The user clicks **Access Platform** on the Login screen (`/login`).
2. If `VITE_USE_MOCKS=false`, the frontend redirects the user to the backend SSO endpoint:
   ```
   GET http://localhost:8000/api/auth/login
   ```
3. The backend generates an OAuth state and redirects the browser to Zoho's login portal.
4. After Zoho authentication, Zoho redirects the user back to the backend callback endpoint with an authorization code:
   ```
   GET http://localhost:8000/api/auth/callback?code=CODE&state=STATE
   ```
5. The backend validates the credentials, issues a JWT token, and redirects the user back to the frontend application:
   ```
   307 Redirect -> http://localhost:5173/auth/callback?token=JWT_TOKEN
   ```
6. The frontend captures the `token` from the query string on the `/auth/callback` page, writes it to `localStorage.setItem('access_token', token)`, updates the Redux store state, and navigates the user to the main dashboard `/`.

### Action Required: Backend Redirection Configuration
To change where the backend redirects after Zoho authorization, update the following environment variable in the **backend's** `.env` file:
```env
FRONTEND_URL=http://localhost:5173
```
This forces the backend callback to route back to `http://localhost:5173/auth/callback?token=<jwt>`.

---

## 2. Developer Authentication Bypass (Dev Bypass)

To allow development and testing when the backend server is offline or when testing without Zoho accounts, a **Dev Bypass** flow is built into the login route.

### How it works:
- If `VITE_USE_MOCKS=true` (set in the frontend `.env` file), the Axios/Query layer runs in mockup mode.
- When the user clicks **Access Platform** on the login page, the frontend skips the external redirect.
- Instead, it immediately writes a mock JWT token to `localStorage`:
  ```typescript
  localStorage.setItem('access_token', 'dev-bypass-mock-jwt-token');
  ```
- It dispatches a mock action to set the current actor inside Redux:
  ```json
  {
    "id": "8c81977a-a47d-448c-9f28-4d44fd2ceec0",
    "email": "admin@erp.local",
    "roles": ["admin"],
    "name": "Admin User"
  }
  ```
- It redirects the user straight to the ATS dashboard, fully logged in.

### How to Toggle:
To switch between the live Zoho SSO redirect flow and the offline mock system, modify `VITE_USE_MOCKS` in [frontend/.env](file:///E:/Front%20End/New%20folder/frontend/.env):

```env
# Enable live backend integration & Zoho redirects:
VITE_USE_MOCKS=false

# Enable offline mock data & local bypass:
VITE_USE_MOCKS=true
```
