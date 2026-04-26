# 🧪 Test Data Persistence - Quick Guide

## Start the System

### Terminal 1 - Backend:
```bash
cd api
npm start
```

### Terminal 2 - Frontend:
```bash
npm run dev
```

## Test 1: Add a Patient

1. Open frontend in browser
2. Go to "Patients" page
3. Click "Ajouter Patient"
4. Fill in:
   - Nom: "Test"
   - Prénom: "Patient"
   - Age: 30
   - Téléphone: "0123456789"
5. Click "Ajouter"
6. ✅ Patient appears in list
7. **Press F5 to refresh**
8. ✅ Patient still there (saved in database!)

## Test 2: Add an Appointment

1. Go to "Rendez-vous" page
2. Click "Prendre RDV"
3. Fill in:
   - Date: Today
   - Heure: "10:00"
   - Motif: "Consultation"
4. Click "Ajouter"
5. ✅ Appointment appears in list
6. **Press F5 to refresh**
7. ✅ Appointment still there (saved in database!)

## Test 3: Delete Data

1. Click delete button on the test patient
2. Confirm deletion
3. ✅ Patient removed from list
4. **Press F5 to refresh**
5. ✅ Patient still deleted (database updated!)

## Test 4: Backend Offline

1. Stop the backend server (Ctrl+C in Terminal 1)
2. Refresh frontend
3. ✅ See red error banner: "Backend server is offline"
4. Start backend again: `npm start`
5. Refresh frontend
6. ✅ Error banner gone, data loads

## Test 5: Dashboard Counters

1. Go to Dashboard
2. Note the counters (Total Patients, Today's Appointments, etc.)
3. Add a new patient
4. Go back to Dashboard
5. ✅ Total Patients counter increased
6. Add an appointment for today
7. Go back to Dashboard
8. ✅ Today's Appointments counter increased

## Verify Database

Check the SQLite database directly:

```bash
cd api
sqlite3 dental-clinic.db

# View patients
SELECT * FROM patients;

# View appointments
SELECT * FROM rendez_vous;

# View counts
SELECT COUNT(*) FROM patients;
SELECT COUNT(*) FROM rendez_vous;

# Exit
.quit
```

## Expected Results

✅ All data persists after browser refresh
✅ Dashboard shows real-time counts
✅ Error notification if backend offline
✅ All CRUD operations work
✅ Data visible in SQLite database

## Troubleshooting

**Error: "Backend server is offline"**
- Make sure backend is running: `cd api && npm start`
- Check http://localhost:3000/health

**Data not persisting:**
- Check backend terminal for errors
- Verify database file exists: `api/dental-clinic.db`
- Check browser console for API errors

**Empty lists:**
- This is normal if database is clean
- Add some test data
- Refresh to verify persistence
