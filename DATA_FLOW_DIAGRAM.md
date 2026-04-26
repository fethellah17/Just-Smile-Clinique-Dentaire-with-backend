# Data Flow Diagram - Frontend to Backend

## 📊 Complete Request Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER ACTION                              │
│                  (Click "Nouveau RDV" button)                    │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND COMPONENT                            │
│                  src/routes/rendez-vous.tsx                      │
│                                                                  │
│  ✅ UI Guard: Check if rendezVous is array                      │
│  → If not: Show loading spinner                                 │
│  → If yes: Render form                                          │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    DATA CONTEXT LAYER                            │
│                  src/lib/data-context.tsx                        │
│                                                                  │
│  addRendezVous(rdvData) {                                       │
│    → Generate ID                                                │
│    → Call rendezVousApi.create()                                │
│    ✅ On Error: Force state reset (empty arrays)                │
│  }                                                              │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                       API CLIENT                                 │
│                     src/lib/api.ts                               │
│                                                                  │
│  POST http://localhost:3000/api/rendez-vous                     │
│  Headers: { Content-Type: application/json }                    │
│  Body: {                                                        │
│    id, patientNom, date, heure, motif,                         │
│    statut, telephone, age, ...                                  │
│  }                                                              │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTP POST
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND SERVER                              │
│                     api/server.js                                │
│                                                                  │
│  Express Server on Port 3000                                    │
│  → CORS enabled                                                 │
│  → JSON body parser                                             │
│  → Route: /api/rendez-vous → rendezVousRouter                  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    ROUTE HANDLER                                 │
│                api/routes/rendez-vous.js                         │
│                                                                  │
│  router.post('/', async (req, res) => {                        │
│    ✅ 1. Log incoming data:                                     │
│       console.log('🔍 RECEIVING DATA:', req.body)               │
│                                                                  │
│    ✅ 2. Validate required fields                               │
│       if (!date || !heure || !motif) return 400                │
│                                                                  │
│    ✅ 3. Execute with retry logic:                              │
│       await executeWithRetry(async () => {                      │
│         db.run(INSERT INTO rendez_vous ...)                     │
│       })                                                        │
│                                                                  │
│    ✅ 4. Return created record                                  │
│       res.status(201).json(newRdv)                              │
│  })                                                             │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    RETRY LOGIC                                   │
│                api/routes/rendez-vous.js                         │
│                                                                  │
│  async function executeWithRetry(dbOperation) {                 │
│    for (attempt = 1 to 3) {                                    │
│      try {                                                      │
│        return await dbOperation()                               │
│      } catch (error) {                                          │
│        ✅ if "database is locked" && attempt < 3:               │
│           → Wait (100ms * attempt)                              │
│           → Retry                                               │
│        else:                                                    │
│           → Throw error                                         │
│      }                                                          │
│    }                                                            │
│  }                                                              │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DATABASE                                    │
│                api/dental-clinic.db                              │
│                                                                  │
│  SQLite Database                                                │
│  Table: rendez_vous                                             │
│  Columns:                                                       │
│    - id (TEXT PRIMARY KEY)                                      │
│    - patient_id (TEXT)                                          │
│    - patient_nom (TEXT NOT NULL)                                │
│    - date (TEXT NOT NULL)                                       │
│    - heure (TEXT NOT NULL)                                      │
│    - motif (TEXT NOT NULL)                                      │
│    - statut (TEXT)                                              │
│    - telephone (TEXT)                                           │
│    - age (INTEGER)                                              │
│    - archived (INTEGER)                                         │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ Success
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    RESPONSE FLOW                                 │
│                                                                  │
│  Backend → Frontend:                                            │
│  Status: 201 Created                                            │
│  Body: {                                                        │
│    id, patientId, patientNom, date, heure,                     │
│    motif, statut, telephone, age, archived                      │
│  }                                                              │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    STATE UPDATE                                  │
│                src/lib/data-context.tsx                          │
│                                                                  │
│  setRendezVous([...rendezVous, newRdv])                        │
│  → UI automatically re-renders                                  │
│  → New appointment appears in list                              │
└─────────────────────────────────────────────────────────────────┘
```

## 🔍 Error Handling Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      ERROR SCENARIOS                             │
└─────────────────────────────────────────────────────────────────┘

Scenario 1: API Server Offline
─────────────────────────────
Frontend (api.ts)
  → fetch() fails
  → Catch block: console.error()
  → Throw error
  ↓
Data Context (data-context.tsx)
  → Catch error
  ✅ Force state reset:
     setCategories([])
     setPatients([])
     setRendezVous([])
  → setApiError("Backend server is offline")
  ↓
UI Component (rendez-vous.tsx)
  ✅ UI Guard: if (!rendezVous || !Array.isArray(rendezVous))
  → Show loading spinner
  → No crash, no undefined errors


Scenario 2: Database Locked
────────────────────────────
Backend (rendez-vous.js)
  → db.run() throws "database is locked"
  ↓
Retry Logic (executeWithRetry)
  ✅ Attempt 1: Wait 100ms, retry
  ✅ Attempt 2: Wait 200ms, retry
  ✅ Attempt 3: Wait 300ms, retry
  → If still fails: throw error
  ↓
Route Handler
  → Catch error
  → console.error()
  → res.status(500).json({ error, details })
  ↓
Frontend
  → Receives 500 error
  → Shows error toast
  → State remains consistent


Scenario 3: Invalid Data
─────────────────────────
Backend (rendez-vous.js)
  ✅ Log incoming data:
     console.log('🔍 RECEIVING DATA:', req.body)
  ↓
  ✅ Validate required fields:
     if (!date || !heure || !motif)
       → return 400 error
  ↓
Frontend
  → Receives 400 error
  → Shows validation error
  → User can correct and retry


Scenario 4: Cached Undefined State
───────────────────────────────────
Data Context (data-context.tsx)
  → API call fails
  ✅ Force state reset:
     setRendezVous([])  // Empty array, not undefined
  ↓
UI Component (rendez-vous.tsx)
  ✅ UI Guard: if (!rendezVous || !Array.isArray(rendezVous))
  → Show loading spinner
  → No "Cannot read property 'length'" error
```

## 🎯 Key Protection Points

```
┌─────────────────────────────────────────────────────────────────┐
│  Protection Layer 1: UI Guards                                  │
│  Location: src/routes/*.tsx                                     │
│  Purpose: Prevent rendering with invalid data                   │
│  ✅ Check: if (!data || !Array.isArray(data))                   │
└─────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  Protection Layer 2: State Reset                                │
│  Location: src/lib/data-context.tsx                             │
│  Purpose: Clear cached state on errors                          │
│  ✅ Action: Set empty arrays instead of undefined               │
└─────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  Protection Layer 3: Request Logging                            │
│  Location: api/routes/rendez-vous.js                            │
│  Purpose: Debug payload mismatches                              │
│  ✅ Log: console.log('🔍 RECEIVING DATA:', req.body)            │
└─────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  Protection Layer 4: Retry Logic                                │
│  Location: api/routes/rendez-vous.js                            │
│  Purpose: Handle transient database locks                       │
│  ✅ Retry: Up to 3 times with exponential backoff               │
└─────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  Protection Layer 5: Validation                                 │
│  Location: api/routes/rendez-vous.js                            │
│  Purpose: Ensure required fields are present                    │
│  ✅ Check: if (!date || !heure || !motif) return 400            │
└─────────────────────────────────────────────────────────────────┘
```

## 📝 Field Mapping Reference

```
Frontend Field    Backend Column    Database Column
─────────────────────────────────────────────────────
id                id                id
patientId         patientId         patient_id
patientNom        patientNom        patient_nom
nom               nom               nom
prenom            prenom            prenom
date              date              date
heure             heure             heure
motif             motif             motif
statut            statut            statut
telephone         telephone         telephone
age               age               age
archived          archived          archived
```

## 🚀 Startup Sequence

```
Step 1: Kill Old Processes
──────────────────────────
restart-all.bat/sh
  → taskkill /F /IM node.exe (Windows)
  → pkill -f node (Linux/Mac)
  → Wait 2 seconds

Step 2: Start API Server
─────────────────────────
cd api
npm start
  → Express server starts on port 3000
  → Database connection established
  → Routes registered
  → Console: "🚀 Server running on http://localhost:3000"

Step 3: Start Frontend
──────────────────────
npm run dev
  → Vite dev server starts on port 5173
  → React app loads
  → Data context initializes
  → Checks API health: GET /health

Step 4: Initial Data Load
──────────────────────────
Data Context (useEffect)
  → checkApiHealth()
  → categoryApi.getAll()
  → patientApi.getAll()
  → rendezVousApi.getAll()
  → setIsLoaded(true)

Step 5: Ready
─────────────
✅ API: http://localhost:3000
✅ Frontend: http://localhost:5173
✅ Data loaded
✅ UI rendered
```

## 🔧 Debugging Points

```
Point 1: Frontend Request
─────────────────────────
Browser DevTools → Network Tab
  → Look for: POST /api/rendez-vous
  → Check: Request Payload
  → Check: Response Status

Point 2: Backend Receipt
────────────────────────
Backend Terminal
  → Look for: "🔍 RECEIVING DATA: {...}"
  → Compare with frontend payload
  → Check all fields are present

Point 3: Database Operation
────────────────────────────
Backend Terminal
  → Look for: "📝 Creating rendez-vous: ..."
  → Look for: "⏳ Database locked, retrying..."
  → Look for: "✅ Rendez-vous created: ..."

Point 4: Frontend Update
────────────────────────
Browser DevTools → Console
  → No red errors
  → State updated
  → UI re-rendered
```

This diagram shows the complete data flow with all protection layers in place.
