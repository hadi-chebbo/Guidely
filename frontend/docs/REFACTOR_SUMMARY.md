# Frontend Auth System Refactor — Backend API Contract Alignment

**Date:** April 27, 2026  
**Status:** ✅ COMPLETED  
**TypeScript Compilation:** ✅ PASSING

---

## Executive Summary

The frontend authentication system has been refactored to match the Laravel backend API contract **exactly**, while keeping all UI components unchanged. Mock implementation remains functional but now returns data in the exact backend response format.

**When real API goes live:** Only `authService.ts` needs modification. All other files remain compatible.

---

## What Changed

### 1. Frontend Services Layer (`frontend/services/authService.ts`)

#### Types Added/Updated

**RegisterData Interface** — Flexible input format
- Accepts **both** frontend format: `firstName`, `lastName`, `preferredLanguage`
- Accepts **both** backend format: `name`, `preferred_language`, `password_confirmation`
- Maintains backward compatibility with form page

```typescript
export interface RegisterData {
  firstName?: string;              // Form sends this
  lastName?: string;               // Form sends this
  name?: string;                   // Backend format (alternative)
  email: string;
  password: string;
  password_confirmation?: string;  // Backend format
  school?: string;
  grade?: string;
  preferredLanguage?: string;      // Form sends this
  preferred_language?: string;     // Backend format
  phone?: string;
  interests?: string[];            // Not sent to backend
}
```

**BackendRegisterRequest Interface** — Exact backend request format
```typescript
interface BackendRegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone?: string;
  school?: string;
  grade?: string;
  preferred_language?: string;
}
```

**BackendRegisterResponse Interface** — Exact backend response format
```typescript
export interface BackendRegisterResponse {
  message: string;
  data: {
    user: User;                    // Full user object with id, name, email
    token: string;                 // Bearer token
    token_type: string;            // "Bearer"
  };
}
```

#### Data Transformation Function

New `transformToBackendRequest()` function handles:
- Combines `firstName + lastName` → single `name` field
- Converts camelCase `preferredLanguage` → snake_case `preferred_language`
- Auto-fills `password_confirmation` with password value if not provided
- Validates all required fields before transformation
- Throws `APIError` if validation fails

#### Updated register() Function

**Before:**
```typescript
// Accepted old format, returned old format
export const register = async (data: RegisterData): Promise<RegisterResponse>
```

**After:**
```typescript
// Transforms old format to backend format, returns backend response
export const register = async (data: RegisterData): Promise<BackendRegisterResponse>
```

**Behavior:**
- Accepts form data (firstName, lastName, etc.)
- Transforms to backend format (name, preferred_language, etc.)
- Validates all input
- Returns response in exact backend format
- Mock behavior preserved but response structure aligned with backend

#### Fixed buildMockUser() Call

Updated `checkAuth()` to pass all 3 required arguments:
```typescript
// Before: buildMockUser('demo@mock.local', role)  ❌ ERROR
// After:  buildMockUser('Demo User', 'demo@mock.local', role)  ✅ OK
```

---

### 2. State Management (`frontend/app/contexts/AuthContext.tsx`)

#### Updated register() Method

**Removed:**
- `response.success` field checks (not in backend response format)
- Generic `RegisterResponse` type dependency

**Added:**
- Validation of `response.data.user` existence
- Validation of `response.data.token` existence
- Token storage in `auth_token` cookie for future API calls
- User state update from `response.data.user`
- `isAuthenticated` flag set to `true`

**Code Example:**
```typescript
const register = async (data: authService.RegisterData) => {
  try {
    const response = await authService.register(data);

    // Validate backend response structure
    if (!response.data || !response.data.user || !response.data.token) {
      throw new Error('Invalid server response structure');
    }

    // Extract from backend response
    const user = response.data.user;
    const token = response.data.token;

    // Store token for API calls
    document.cookie = `auth_token=${encodeURIComponent(token)}; path=/; max-age=${60*60*24}; sameSite=Lax`;

    // Update auth state
    setState({
      user,
      isAuthenticated: true,
      loading: false,
    });
  } catch (error) {
    // Error handling...
  }
};
```

---

### 3. UI Components

**Status:** ✅ **UNCHANGED**

- Form page (`frontend/app/(auth)/register/page.tsx`) — No changes required
- Form still collects `firstName`, `lastName`, `preferredLanguage`
- Form still redirects to `/verify-email` on success
- Error display still works via `setServerError` state
- Validation schemas (`registerStep1Schema`, `registerStep2Schema`) — No changes

---

## Backend API Contract

### POST /api/v1/auth/register

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "password_confirmation": "string",
  "phone": "string (optional)",
  "school": "string (optional)",
  "grade": "string (optional)",
  "preferred_language": "string (optional)"
}
```

**Response (201 Created):**
```json
{
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 123,
      "name": "John Doe",
      "email": "john@example.com"
    },
    "token": "Bearer_token_here",
    "token_type": "Bearer"
  }
}
```

---

## Migration Path (When Real API Goes Live)

### Current Implementation (Mock)
```typescript
export const register = async (data: RegisterData): Promise<BackendRegisterResponse> => {
  await simulateNetworkDelay(1500);
  const backendRequest = transformToBackendRequest(data);
  // ... validation ...
  return {
    message: 'User registered successfully',
    data: {
      user: mockUser,
      token: mockToken,
      token_type: 'Bearer',
    },
  };
};
```

### Real API Implementation (Single Change)
```typescript
export const register = async (data: RegisterData): Promise<BackendRegisterResponse> => {
  const backendRequest = transformToBackendRequest(data);
  
  const response = await fetch('/api/v1/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(backendRequest),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new APIError(error.message, response.status, error.code);
  }
  
  return response.json();
};
```

**What stays the same:**
- ✅ `AuthContext.tsx` — No changes needed
- ✅ Form page — No changes needed
- ✅ `RegisterData` type — No changes needed
- ✅ `transformToBackendRequest()` utility — Stays as-is
- ✅ Error handling — No changes needed

---

## Data Flow (After Refactor)

```
Registration Form (frontend/app/(auth)/register/page.tsx)
    │
    │ Submits: { firstName, lastName, email, password, preferredLanguage, ... }
    ▼
useAuth().register(data)
    │
    ▼
authService.register(data)
    │
    ├─ transformToBackendRequest(data)
    │  └─ Returns: { name, email, password, password_confirmation, preferred_language, ... }
    │
    ├─ Validate input
    │
    ├─ Mock: Return mocked backend response
    │  └─ { message: "...", data: { user, token, token_type } }
    │
    └─ Future: Call real API
       └─ fetch('/api/v1/auth/register')
          └─ { message: "...", data: { user, token, token_type } }
    │
    ▼
AuthContext updates:
    ├─ setState({ user, isAuthenticated: true, loading: false })
    ├─ Store token in auth_token cookie
    └─ Return to form page
    │
    ▼
Form Page:
    ├─ Catch error → Display via setServerError
    └─ On success → router.push('/verify-email')
```

---

## Compatibility Checklist

| Requirement | Status | Notes |
|---|---|---|
| Backend request format exact match | ✅ | `transformToBackendRequest()` ensures it |
| Backend response format exact match | ✅ | `BackendRegisterResponse` type defined |
| Form page unchanged | ✅ | Still sends `firstName`, `lastName`, etc. |
| UI components unchanged | ✅ | No form/page modifications |
| Backward compatibility | ✅ | `RegisterData` accepts both formats |
| TypeScript compilation | ✅ | No errors (`npx tsc --noEmit`) |
| Token properly stored | ✅ | Saved in `auth_token` cookie |
| User state updated | ✅ | From `response.data.user` |
| Error handling maintained | ✅ | Still throws APIError, caught by form |
| Future API swap minimal | ✅ | Only `register()` function needs update |

---

## Testing Recommendations

### Manual Test (Current Mock)
1. Navigate to `/register`
2. Fill out all 3 steps
3. Verify redirect to `/verify-email`
4. Check browser cookies for `auth_token`
5. Verify console shows registration response with correct structure

### Backend Integration Test
```typescript
// Add to frontend test suite
it('sends registration request in exact backend format', async () => {
  const data = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    password: 'password123',
    preferredLanguage: 'en',
  };
  
  const response = await authService.register(data);
  
  expect(response).toHaveProperty('message');
  expect(response.data).toHaveProperty('user');
  expect(response.data).toHaveProperty('token');
  expect(response.data).toHaveProperty('token_type');
});
```

---

## Files Modified

| File | Changes |
|---|---|
| `frontend/services/authService.ts` | ✅ Updated types, transformation, register() function |
| `frontend/app/contexts/AuthContext.tsx` | ✅ Updated register() method for new response format |
| `frontend/app/(auth)/register/page.tsx` | ✅ **No changes** |
| Other components | ✅ **No changes** |

---

## Summary

✅ **Frontend authentication system now matches Laravel backend API contract 1:1**

✅ **All UI components remain unchanged and functional**

✅ **Mock implementation ready for production API swap**

✅ **Future API integration requires only `authService.register()` update**

✅ **Token properly stored and managed**

✅ **User state correctly populated from backend response**

✅ **TypeScript compilation passing**
