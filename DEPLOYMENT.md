# Deployment Guide & Checklist

## Critical Deployment Issue - Nov 18, 2025

### What Broke
The application failed in production because the frontend was hardcoded to use `http://localhost:8010/proxy/` for the proxy server. In production (Coolify), the server runs on port 3000, and the frontend needs to use relative paths to connect to the same server.

### Root Cause
- **Line 125 in `src/App.tsx`** had: `fetchUrl = 'http://localhost:8010/proxy/${urlValue}';`
- This worked in development but failed in production
- Production servers use `process.env.PORT` (typically 3000 in Coolify)
- Frontend must use relative paths (`/proxy/`) in production

### The Fix
```typescript
// Use relative path in production, absolute in development
const proxyBase = window.location.hostname === 'localhost' 
  ? 'http://localhost:8010' 
  : '';
fetchUrl = `${proxyBase}/proxy/${urlValue}`;
```

## Deployment Checklist

### Before Every Deployment

- [ ] **Test locally with `npm run dev`**
  - Verify proxy works at `http://localhost:8010/proxy/`
  - Test fetching external URLs
  
- [ ] **Test production build locally**
  ```bash
  npm run build
  npm start
  # Visit http://localhost:8010 and test proxy functionality
  ```

- [ ] **Check for hardcoded URLs**
  ```bash
  # Search for hardcoded localhost references
  grep -r "localhost:8010" src/
  grep -r "http://localhost" src/
  ```

- [ ] **Verify environment-aware code**
  - All API calls should use relative paths OR environment detection
  - No hardcoded ports in frontend code
  - Use `window.location.hostname` or environment variables

- [ ] **Review recent changes**
  ```bash
  git diff HEAD~5 src/
  ```

### Deployment Rules

1. **NEVER hardcode `localhost` URLs in frontend code**
   - Use relative paths: `/api/endpoint` not `http://localhost:8010/api/endpoint`
   - Or use environment detection: `window.location.hostname === 'localhost'`

2. **Backend port configuration**
   - Always use `process.env.PORT || DEFAULT_PORT`
   - Document the default port in README

3. **Test production builds locally**
   - Run `npm run build && npm start` before deploying
   - Test all network requests

4. **Document breaking changes**
   - Update this file when making infrastructure changes
   - Add comments explaining environment-specific code

## Environment Detection Pattern

Use this pattern for any environment-specific URLs:

```typescript
const getApiBase = () => {
  // Development: use explicit localhost with dev port
  if (window.location.hostname === 'localhost' || 
      window.location.hostname === '127.0.0.1') {
    return 'http://localhost:8010';
  }
  // Production: use relative paths (same origin)
  return '';
};

const apiUrl = `${getApiBase()}/api/endpoint`;
```

## Production Environment

### Coolify Configuration
- Server runs on port from `process.env.PORT` (typically 3000)
- Frontend served as static files from `/dist`
- All API calls go to same origin via relative paths
- Build process defined in `nixpacks.toml`

### Verification After Deployment
1. Check Coolify logs for "Server running on port X"
2. Visit the deployed URL
3. Test proxy functionality with external URL
4. Check browser console for errors

## Quick Recovery

If deployment breaks:

1. Check Coolify logs for the actual port
2. Search codebase for hardcoded URLs:
   ```bash
   grep -r "localhost:[0-9]" src/
   ```
3. Replace with relative paths or environment detection
4. Rebuild and redeploy

## Contact

If you encounter deployment issues, check:
1. This document first
2. Recent git commits for infrastructure changes
3. Browser console for specific error messages
