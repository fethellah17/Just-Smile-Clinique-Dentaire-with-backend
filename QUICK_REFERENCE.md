# 🚀 Quick Reference - Data Persistence

## Start Everything

```bash
# Terminal 1 - Backend
cd api
npm start

# Terminal 2 - Frontend  
npm run dev
```

## What's Different Now

### BEFORE (localStorage):
- Data lost on browser refresh
- No real database
- Temporary storage only

### AFTER (SQLite + API):
- ✅ Data persists forever
- ✅ Real database (dental-clinic.db)
- ✅ Survives browser refresh
- ✅ Professional backend API

## Test It Works

1. Add a patient
2. **Press F5**
3. ✅ Patient still there!

## API Endpoints

```
Patients:
  GET    /api/patients
  POST   /api/patients
  PUT    /api/patients/:id
  DELETE /api/patients/:id

Appointments:
  GET    /api/rendez-vous
  POST   /api/rendez-vous
  PUT    /api/rendez-vous/:id
  DELETE /api/rendez-vous/:id

Dashboard:
  GET    /api/rendez-vous/stats/dashboard

Categories:
  GET    /api/categories
  POST   /api/categories
  PUT    /api/categories/:id
  DELETE /api/categories/:id
```

## Error Handling

If you see a red banner:
- Backend is offline
- Start it: `cd api && npm start`

## Database Location

`api/dental-clinic.db`

View it:
```bash
cd api
sqlite3 dental-clinic.db
SELECT * FROM patients;
.quit
```

## Clean Database

Remove all categories:
```bash
cd api
node clean-categories.js
```

## Files Changed

**Backend (NEW):**
- api/routes/patients.js
- api/routes/rendez-vous.js

**Frontend (UPDATED):**
- src/lib/api.ts
- src/lib/data-context.tsx
- src/components/ApiErrorNotification.tsx (NEW)

## Success Checklist

✅ Backend starts without errors
✅ Frontend connects to backend
✅ Can add patient
✅ Patient survives F5 refresh
✅ Can add appointment
✅ Appointment survives F5 refresh
✅ Dashboard shows real counts
✅ Error banner if backend offline

## Documentation

- `FULL_DATA_PERSISTENCE.md` - Complete guide
- `TEST_DATA_PERSISTENCE.md` - Testing steps
- `PERSISTENCE_COMPLETE.md` - Summary
- `QUICK_REFERENCE.md` - This file
