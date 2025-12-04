# VacationControl: Technical Documentation & Deployment Guide
**Date:** December 2, 2025
**Project:** VacationControl System
**Version:** 1.0.0

---

## 📋 Table of Contents
1.  [Executive Summary](#executive-summary)
2.  [Deployment Guide](#deployment-guide)
    *   [Vercel Deployment](#vercel-deployment)
    *   [Netlify Deployment](#netlify-deployment)
3.  [Security Architecture](#security-architecture)
    *   [Environment Isolation](#environment-isolation)
    *   [Form Validation & Input Sanitization](#form-validation--input-sanitization)
    *   [Error Handling & Information Hiding](#error-handling--information-hiding)
4.  [API & Data Architecture](#api--data-architecture)

---

## 1. Executive Summary <a name="executive-summary"></a>
VacationControl is a Single Page Application (SPA) built with **Vue 3** and **Vite**, utilizing **Firebase Realtime Database** for backend services. It manages employee vacation requests, tracking status (pending, approved, rejected) and providing an administrative dashboard.

The system emphasizes security through client-side validation, environment variable isolation, and secure error handling practices.

---

## 2. Deployment Guide <a name="deployment-guide"></a>

### Vercel Deployment (Recommended) <a name="vercel-deployment"></a>
Vercel provides native support for Vite applications with zero configuration.

**Prerequisites:**
*   GitHub Repository with the project code.
*   Vercel Account.

**Steps:**
1.  **Import Project:**
    *   Log in to Vercel.
    *   Click "Add New" -> "Project".
    *   Select `ControlVacaciones` from your GitHub list.

2.  **Build Configuration:**
    *   Framework Preset: `Vite` (Detected automatically).
    *   Root Directory: `./`
    *   Build Command: `npm run build`
    *   Output Directory: `dist`

3.  **Environment Variables (Critical):**
    *   Navigate to the "Environment Variables" section.
    *   Add the following key-value pairs (sourced from your local `.env`):
        *   `VITE_FIREBASE_API_KEY`
        *   `VITE_FIREBASE_AUTH_DOMAIN`
        *   `VITE_FIREBASE_DATABASE_URL`
        *   `VITE_FIREBASE_PROJECT_ID`
        *   `VITE_FIREBASE_STORAGE_BUCKET`
        *   `VITE_FIREBASE_MESSAGING_SENDER_ID`
        *   `VITE_FIREBASE_APP_ID`
        *   `VITE_ADMIN_USERNAME`
        *   `VITE_ADMIN_PASSWORD`

4.  **Deploy:** Click "Deploy".

### Netlify Deployment <a name="netlify-deployment"></a>
Netlify is a strong alternative. A `_redirects` file is included in `public/` to handle SPA routing.

**Steps:**
1.  **Import Site:**
    *   Log in to Netlify.
    *   "Add new site" -> "Import an existing project" -> "GitHub".
    *   Select `ControlVacaciones`.

2.  **Build Settings:**
    *   Build command: `npm run build`
    *   Publish directory: `dist`

3.  **Environment Variables:**
    *   Click "Show advanced" or "Environment variables".
    *   Enter the same keys and values as listed in the Vercel section.

4.  **Deploy:** Click "Deploy site".

---

## 3. Security Architecture <a name="security-architecture"></a>

### Environment Isolation <a name="environment-isolation"></a>
**Principle:** Separation of configuration from code.
**Implementation:**
*   Sensitive keys (API Keys, Admin Credentials) are stored in `.env` files.
*   `.env` files are strictly excluded from version control via `.gitignore`.
*   Code accesses these values via `import.meta.env`, ensuring no secrets are hardcoded.

### Form Validation & Input Sanitization <a name="form-validation--input-sanitization"></a>
**Principle:** "Never trust user input."
**Implementation:**
The application implements rigorous client-side validation before sending data to Firebase.

**Code Example (`src/views/VacacionesView.vue`):**
```javascript
// 1. Trim whitespace to prevent empty strings masquerading as content
if (!empleado.value.trim() || !inicio.value || !fin.value) {
  errorMsg.value = 'Por favor completa todos los campos obligatorios.'
  return
}

// 2. Logical Date Validation
const startDate = new Date(inicio.value)
const endDate = new Date(fin.value)
const today = new Date()

if (startDate < today) {
  errorMsg.value = 'La fecha de inicio no puede ser en el pasado.'
  return
}

if (endDate <= startDate) {
  errorMsg.value = 'La fecha de fin debe ser posterior a la fecha de inicio.'
  return
}

// 3. Length Constraints (Buffer Overflow Protection / Spam Prevention)
if (motivo.value.length > 500) {
  errorMsg.value = 'El motivo es demasiado largo (máx 500 caracteres).'
  return
}
```

### Error Handling & Information Hiding <a name="error-handling--information-hiding"></a>
**Principle:** Reveal detailed errors to developers, but generic errors to users (Security by Obscurity for internal details).
**Implementation:**
When a database operation fails, the system catches the specific error (which might contain database paths or internal IDs) and logs it to the console, but displays a sanitized message to the user.

**Code Example:**
```javascript
.catch((err) => {
  // INTERNAL: Log full error for debugging
  console.error('Firebase Write Error:', err)
  
  // EXTERNAL: Generic message for the user
  errorMsg.value = 'Ocurrió un error al procesar tu solicitud. Intenta más tarde.'
})
```
**Benefit:** This prevents attackers from learning about the database structure or specific failure reasons (e.g., "Permission Denied at /users/admin") which could aid in further attacks.

---

## 4. API & Data Architecture <a name="api--data-architecture"></a>

### Architecture Style
**Serverless / Backend-as-a-Service (BaaS)**
*   **Provider:** Firebase Realtime Database.
*   **Protocol:** WebSockets (primary) with HTTP Long-Polling fallback.
*   **Format:** JSON.

### Request Methods (REST Equivalent)
The application uses the Firebase SDK, which maps to standard REST operations:

| Action | SDK Method | REST Verb | Description |
| :--- | :--- | :--- | :--- |
| **Fetch Requests** | `onValue()` | `GET` | Subscribes to real-time updates at `/vacaciones`. |
| **Create Request** | `push()` + `set()` | `POST` / `PUT` | Generates a unique ID and saves data. |
| **Update Status** | `update()` | `PATCH` | Modifies specific fields (e.g., `status`). |
| **Delete Request** | `remove()` | `DELETE` | Removes a record. |

### Data Model (JSON)
```json
{
  "vacaciones": {
    "-OCj29s...": {
      "id": "-OCj29s...",
      "empleado": "Juan Perez",
      "fecha_inicio": "2025-12-10",
      "fecha_fin": "2025-12-15",
      "motivo": "Vacaciones familiares",
      "estado": "pendiente",
      "timestamp": 1733190000000
    }
  }
}
```
