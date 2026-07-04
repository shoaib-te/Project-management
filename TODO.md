# TODO - Fix login

- [x] Fix frontend login UI: replace `frontend/src/pages/login.jsx` with real login (email/password), call backend, store token, redirect.
- [ ] Ensure frontend route path matches existing router (`/log-in`).
- [x] Verify expected backend endpoint: use `/api/auth/login` with POST `{email, password}`.
- [ ] Update token storage + simple auth gate if app already expects it.


