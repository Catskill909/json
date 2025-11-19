# Production Deployment Fix - Nov 18, 2025

## What Broke
The app completely failed in production with "Failed to fetch" errors. The proxy server was running correctly on port 3000, but the frontend couldn't connect to it.

## Root Cause
**Line 125 in `src/App.tsx`** was hardcoded:
```typescript
fetchUrl = `http://localhost:8010/proxy/${urlValue}`;
```

This worked in development but failed in production because:
- Development: Server runs on port 8010, frontend explicitly connects to `localhost:8010`
- Production: Server runs on port 3000 (via `process.env.PORT`), frontend needs relative paths

## The Fix

### 1. Created Environment Utilities (`src/utils/env.ts`)
```typescript
export const getProxyUrl = (targetUrl: string): string => {
  const proxyBase = isDevelopment() ? 'http://localhost:8010' : '';
  return `${proxyBase}/proxy/${targetUrl}`;
};
```

### 2. Updated App.tsx
```typescript
// OLD (broken in production)
if (useProxy && !urlValue.includes("localhost")) {
  fetchUrl = `http://localhost:8010/proxy/${urlValue}`;
}

// NEW (works everywhere)
if (useProxy && shouldUseProxy(urlValue)) {
  fetchUrl = getProxyUrl(urlValue);
}
```

### 3. Added Documentation
- **DEPLOYMENT.md**: Complete checklist and troubleshooting guide
- **README.md**: Added critical warning and pre-deployment testing steps
- **This file**: Summary of the fix

## Prevention Measures

### For Developers
1. **NEVER hardcode `localhost` URLs in frontend code**
2. **Always use environment detection** via `src/utils/env.ts`
3. **Test production builds locally** before deploying:
   ```bash
   npm run build
   npm start
   # Test at http://localhost:8010
   ```

### Pre-Deployment Checklist
```bash
# 1. Search for hardcoded URLs
grep -r "localhost:[0-9]" src/

# 2. Build locally
npm run build

# 3. Test production build
npm start
# Visit http://localhost:8010 and test proxy

# 4. Only then push to main
git push origin main
```

### Code Review Guidelines
- ❌ **REJECT**: Any PR with `http://localhost` in `src/` files
- ✅ **APPROVE**: Uses `getProxyUrl()` or relative paths
- ✅ **APPROVE**: Environment-aware code with proper detection

## Files Changed
1. `src/App.tsx` - Fixed proxy URL logic
2. `src/utils/env.ts` - NEW: Environment detection utilities
3. `DEPLOYMENT.md` - NEW: Comprehensive deployment guide
4. `README.md` - Added critical warnings and testing steps

## Verification
After Coolify redeploys:
1. Visit https://json.supersoul.top
2. Enter a URL to fetch (e.g., https://jsonplaceholder.typicode.com/todos/1)
3. Click fetch - should work without errors
4. Check browser console - no "Failed to fetch" errors

## Commit
```
commit 4f66fa3
Fix: Production deployment proxy URL issue
```

## Lessons Learned
1. **Always test production builds locally** - would have caught this immediately
2. **Environment detection is critical** - dev and prod are different
3. **Documentation prevents repeat issues** - DEPLOYMENT.md will save future pain
4. **Utility functions enforce consistency** - `getProxyUrl()` ensures correct usage everywhere

---

**Status**: ✅ Fixed, documented, and pushed to main. Coolify will auto-deploy.
