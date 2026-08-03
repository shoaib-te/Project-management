# Auth Fix TODO

## Steps

- [x] 1. Fix `frontend/src/context/Authcontext.jsx` (useAuth file)
  - Use `apiClient` in `refreshSession` so baseURL + Bearer token interceptor apply
  - Use relative `/api/auth/login` in `login` instead of hardcoded `http://localhost:3000`
- [x] 2. Fix `backend/src/controllers/User.controller.js`
  - Fix `session` handler to return `{ user: req.session }` (JWT payload: `{ userId, role, email }`)
- [x] 3. Fix `frontend/src/pages/Login.jsx`
  - Add missing `Navigate` import from `react-router-dom`
  - Wrap `login()` in try/catch/finally to handle errors and reset submit state
- [x] 4. Fix `frontend/src/components/Sidebar.jsx`
  - Import `apiClient` from `../lib/axios`
  - Fix auth import case to `Authcontext`
- [x] 5. Fix `frontend/src/App.jsx`
  - Fix `Login` import path case to `./pages/Login`
- [x] 6. Fix `frontend/src/pages/Landing.jsx`
  - Fix auth import case to `Authcontext`
- [ ] 7. Verify: build frontend + syntax check backend

