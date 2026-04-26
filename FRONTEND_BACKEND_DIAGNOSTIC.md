# Frontend-Backend Connection Diagnostic & Fixes

## ✅ Issues Identified and Fixed

### 1. API URL Configuration
**Status:** ✅ VERIFIED
- Frontend API URL: `http://localhost:3000/api`
- Backend Server Port: `3000`
- Configuration is correct in `src/lib/api.ts`

### 2. Database Locking Issues
**Status:** ✅ FIXED
- **Problem:** SQLite database can be locked when SQLite Studio is open
- **Solution:** Added retry logic with exponential backoff in `api/routes/rendez-vous.js`
- **Implementation:**
  ```javascript
  async function executeWithRetry(dbOperation, maxRetries = 3, delayMs = 100) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await dbOperation();
      } catch (error) {
        if (error.message.includes('database is locked') && attempt < maxRetries) {
          console.log(`⏳ Database locked, retrying (${attempt}/${maxRetries})...`);
          await new Promise(resolve => setTimeout(resolve, delayMs * attempt));
        } else {
          throw error;
        }
      }
    }
  }
  ```

### 3. Request Payload Debugging
**Status:** ✅ ENHANCED
- **Added:** Deep logging in POST `/api/rendez-vous` route
- **Location:** `api/routes/rendez-vous.js` line ~50
- **Log Output:** Full JSON payload with all fields
  ```javascript
  console.log('🔍 RECEIVING DATA:', JSON.stringify(req.body, null, 2));
  ```

### 4. State Reset on API Errors
**Status:** ✅ FIXED
- **Problem:** Frontend could cache undefined state after 500 errors
- **Solution:** Force state reset in `src/lib/data-context.tsx`
- **Implementation:** Clear all arrays on error:
  ```typescript
  setCategories([]);
  setPatients([]);
  setRendezVous([]);
  ```

### 5. UI Guards Against Invalid Data
**Status:** ✅ IMPLEMENTED
- **Location:** `src/routes/rendez-vous.tsx` and `src/routes/configurations.categories.tsx`
- **Protection:** Early return with loading spinner if data is not an array
- **Prevents:** "Cannot read property 'length' of undefined" errors

## 🚀 Clean Restart Scripts

### Windows (restart-all.bat)
```batch
@echo off
echo Stopping all Node processes...
taskkill /F /IM node.exe 2>nul

echo Waiting for ports to be released...
timeout /t 2 /nobreak >nul

echo Starting API server on port 3000...
start "Dental API Server" cmd /k "cd api && npm start"
timeout /t 3 /nobreak >nul

echo Starting Frontend on port 5173...
start "Dental Frontend" cmd /k "npm run dev"
```

**Usage:** Double-click `restart-all.bat` or run from command prompt

### Linux/Mac (restart-all.sh)
```bash
#!/bin/bash
pkill -f node 2>/dev/null
sleep 2
cd api && npm start &
cd .. && npm run dev &
```

**Usage:** 
```bash
chmod +x restart-all.sh
./restart-all.sh
```

## 🔍 Debugging Checklist

### Before Starting
- [ ] Close SQLite Studio or any database viewer
- [ ] Kill all existing Node processes
- [ ] Clear browser cache (Ctrl+Shift+Delete)
- [ ] Check no other app is using port 3000 or 5173

### When Starting
1. **Start API First:**
   ```bash
   cd api
   npm start
   ```
   - Wait for: `🚀 Server running on http://localhost:3000`

2. **Start Frontend Second:**
   ```bash
   npm run dev
   ```
   - Wait for: `Local: http://localhost:5173`

3. **Check API Health:**
   - Open: http://localhost:3000/health
   - Should see: `{"status":"ok","timestamp":"..."}`

### If Errors Persist

#### Check Backend Logs
Look for these in the API terminal:
- `🔍 RECEIVING DATA:` - Shows incoming request payload
- `📝 Creating rendez-vous:` - Shows parsed data
- `✅ Rendez-vous created:` - Success
- `❌ Error creating rendez-vous:` - Failure with details

#### Check Frontend Console
Open browser DevTools (F12) and look for:
- `API Error [/rendez-vous]:` - Network or parsing errors
- `Failed to add appointment:` - Frontend error handling
- Network tab: Check if requests reach the backend (Status 200/500)

#### Common Issues

**Issue:** "Backend server is offline"
- **Cause:** API not running or wrong port
- **Fix:** Ensure API is running on port 3000

**Issue:** "database is locked"
- **Cause:** SQLite Studio or another process has the DB open
- **Fix:** Close all database viewers, retry logic will handle transient locks

**Issue:** "Something went wrong" / "Erreur"
- **Cause:** 500 error from backend
- **Fix:** Check backend logs for the actual error
- **Check:** Request payload matches database schema

**Issue:** "Cannot read property 'length' of undefined"
- **Cause:** API returned invalid data or failed
- **Fix:** UI guards now prevent this, but check API response

## 📊 Database Schema Verification

### rendez_vous Table Columns
```sql
id TEXT PRIMARY KEY
patient_id TEXT
patient_nom TEXT NOT NULL
nom TEXT
prenom TEXT
date TEXT NOT NULL
heure TEXT NOT NULL
motif TEXT NOT NULL
statut TEXT DEFAULT 'en attente'
telephone TEXT
age INTEGER
archived INTEGER DEFAULT 0
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

### Frontend → Backend Mapping
```javascript
Frontend Field    → Backend Column
-----------------------------------------
id                → id
patientId         → patient_id
patientNom        → patient_nom
nom               → nom
prenom            → prenom
date              → date
heure             → heure
motif             → motif
statut            → statut
telephone         → telephone
age               → age
```

## 🎯 Testing the Connection

### 1. Test API Directly
```bash
# Test health endpoint
curl http://localhost:3000/health

# Test GET appointments
curl http://localhost:3000/api/rendez-vous

# Test POST appointment
curl -X POST http://localhost:3000/api/rendez-vous \
  -H "Content-Type: application/json" \
  -d '{
    "id": "test-123",
    "patientNom": "Test Patient",
    "date": "2026-04-27",
    "heure": "10:00",
    "motif": "Consultation",
    "statut": "en attente"
  }'
```

### 2. Test Frontend
1. Open http://localhost:5173
2. Navigate to "Rendez-vous"
3. Click "Nouveau RDV"
4. Fill form and submit
5. Check both terminals for logs

## 📝 Next Steps if Issues Persist

1. **Capture Full Error:**
   - Backend terminal output
   - Frontend console errors
   - Network tab request/response

2. **Verify Data Flow:**
   - Check what frontend sends (Network tab → Payload)
   - Check what backend receives (console log)
   - Check what backend tries to insert (SQL log)

3. **Database Inspection:**
   - Close SQLite Studio
   - Use CLI: `sqlite3 api/dental-clinic.db "SELECT * FROM rendez_vous;"`

4. **Port Conflicts:**
   - Windows: `netstat -ano | findstr :3000`
   - Linux/Mac: `lsof -i :3000`

## 🔧 Emergency Reset

If everything fails:
```bash
# Stop all processes
taskkill /F /IM node.exe  # Windows
pkill -f node             # Linux/Mac

# Backup and reset database
cd api
copy dental-clinic.db dental-clinic.db.backup  # Windows
cp dental-clinic.db dental-clinic.db.backup    # Linux/Mac
node init-db.js

# Clean install
cd ..
rm -rf node_modules api/node_modules
npm install
cd api && npm install && cd ..

# Restart
./restart-all.bat  # Windows
./restart-all.sh   # Linux/Mac
```

## ✨ Summary of Changes

1. ✅ Added SQLite retry logic for database locking
2. ✅ Enhanced request logging in POST endpoint
3. ✅ Force state reset on API errors
4. ✅ Added UI guards in rendez-vous and categories pages
5. ✅ Created clean restart scripts for both platforms
6. ✅ Verified API URL configuration
7. ✅ Documented complete debugging workflow

All fixes are in place. Use the restart scripts to ensure clean startup.
