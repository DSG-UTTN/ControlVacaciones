# 📘 VacationControl Project Documentation

## 🚀 Deployment Guide

### Option 1: Vercel (Recommended)
Vercel is the optimal platform for Vue/Vite applications.

**Step-by-Step:**
1.  **Login:** Go to [vercel.com](https://vercel.com) and login with GitHub.
2.  **Import:** Click "Add New" > "Project" and select the `ControlVacaciones` repository.
3.  **Configure:** Vercel automatically detects Vite. **Do not deploy yet.**
4.  **Environment Variables:** Go to the "Environment Variables" section and add the following keys (values from your local `.env`):
    *   `VITE_FIREBASE_API_KEY`
    *   `VITE_FIREBASE_AUTH_DOMAIN`
    *   `VITE_FIREBASE_DATABASE_URL`
    *   `VITE_FIREBASE_PROJECT_ID`
    *   `VITE_FIREBASE_STORAGE_BUCKET`
    *   `VITE_FIREBASE_MESSAGING_SENDER_ID`
    *   `VITE_FIREBASE_APP_ID`
    *   `VITE_ADMIN_USERNAME`
    *   `VITE_ADMIN_PASSWORD`
5.  **Deploy:** Click "Deploy".
6.  **Post-Deployment Updates:** If you need to add variables later, go to Settings > Environment Variables, add them, and then go to Deployments > Redeploy to apply changes.

### Option 2: Netlify
Netlify is a robust alternative with excellent free tier support.

**Step-by-Step:**
1.  **Login:** Go to [netlify.com](https://www.netlify.com/) and login with GitHub.
2.  **Import:** Click "Add new site" > "Import an existing project" > "GitHub".
3.  **Select:** Choose `ControlVacaciones`.
4.  **Configure:** Netlify detects `npm run build` and `dist` folder.
5.  **Environment Variables:** Click "Add environment variables" and input the same keys/values as above.
6.  **Deploy:** Click "Deploy site".
7.  **Redirects:** The project includes a `public/_redirects` file to handle SPA routing (History Mode), ensuring refreshing pages works correctly.

---

## 🛡️ Security Principles Implemented

### 1. Environment Variable Isolation
**Principle:** Never hardcode sensitive credentials in source code.
**Implementation:** We moved all Firebase configuration and Admin credentials to `.env` files. These files are excluded from version control via `.gitignore`.

**Code Snippet (`src/firebase.js`):**
```javascript
// BEFORE (Insecure)
// apiKey: 'AIzaSyAPI1QxgFpBaUTQCu4XHB5sHmc6cKfBEPc'

// AFTER (Secure)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  // ...
}
```

**Benefits:**
*   Prevents secrets from leaking in public repositories.
*   Allows different configurations for different environments (Development vs. Production).

### 2. Git History Cleansing
**Principle:** A clean history prevents "time-travel" attacks where hackers look at old commits to find secrets.
**Implementation:** We updated `.gitignore` and cleared the git cache to ensure no sensitive files remain in the history.

**Code Snippet (`.gitignore`):**
```gitignore
# Environment Variables
.env
.env.*
!.env.example
```

### 3. Client-Side Authentication (Basic)
**Principle:** Verify identity before granting access to UI routes.
**Implementation:** We use Vue Router navigation guards (implied logic in `App.vue` and `LoginView.vue`) and LocalStorage for session persistence.

**Considerations for Future:**
*   **Current:** Simple username/password check on client.
*   **Improvement:** Implement **Firebase Authentication** (Server-side validation) to prevent users from bypassing client-side checks by manually editing LocalStorage or using console commands.

---

## 🌐 API & Request Architecture

### Architecture Type: **Serverless / BaaS (Backend-as-a-Service)**
This application does not use a traditional REST API backend (like Express or Django) managed by us. Instead, it uses **Firebase Realtime Database**.

### Protocol: **WebSockets & HTTP (REST-like)**
*   **Primary Communication:** The Firebase SDK (`firebase/database`) primarily uses **WebSockets** to maintain a live, bi-directional connection to the database. This allows for real-time updates (if implemented) and low-latency data synchronization.
*   **Fallback:** If WebSockets are unavailable, it falls back to **HTTP Long-Polling**.

### Request Types
Although we use the SDK, the underlying operations map to standard REST methods:

| Operation | SDK Method | Equivalent REST Verb | Description |
| :--- | :--- | :--- | :--- |
| **Read Data** | `get(ref)` / `onValue` | `GET` | Fetches vacation/employee data. |
| **Write Data** | `set(ref)` | `PUT` | Overwrites data at a specific path. |
| **Update Data** | `update(ref)` | `PATCH` | Updates specific keys at a path. |
| **Delete Data** | `remove(ref)` | `DELETE` | Removes data. |

### API Endpoints (Internal)
The "endpoints" are paths in the JSON tree structure of the NoSQL database:
*   `https://vacaciones-app-db0dd-default-rtdb.firebaseio.com/` (Root)
*   Specific data nodes would be accessed via references, e.g., `db.ref('users')`.

### SOAP?
**No.** This project does not use SOAP (Simple Object Access Protocol). SOAP is an older, XML-based protocol typically used in enterprise legacy systems. Modern web applications like this prefer JSON-based REST or WebSocket communication for performance and ease of use with JavaScript.
