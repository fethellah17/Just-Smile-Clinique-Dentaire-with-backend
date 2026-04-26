# 🧪 Test Archive System - Quick Start

## 🚀 Quick Test (5 minutes)

### Step 1: Start the Application
```bash
# Terminal 1: Start backend
cd api
npm start

# Terminal 2: Start frontend
npm run dev
```

### Step 2: Create Test Appointments

1. Open browser: `http://localhost:5173/rendez-vous`
2. Click **"Nouveau RDV"**
3. Create 3 appointments for TODAY:
   - 09:00 - Patient Test A - Consultation
   - 10:00 - Patient Test B - Contrôle
   - 11:00 - Patient Test C - Urgence

### Step 3: Process Appointments

1. Click on **"En attente"** badge for first appointment
2. Click **"Confirmer"**
3. ✅ Verify: Appointment STAYS in list with "Confirmé" badge
4. Repeat for second appointment (Confirm)
5. For third appointment, click **"Rejeter"**
6. ✅ Verify: All 3 appointments still visible in main list

### Step 4: Archive the Date

1. ✅ Verify: **"Archiver"** button appears next to today's date
2. Click **"Archiver"**
3. ✅ Verify: All 3 appointments disappear from main list
4. ✅ Verify: **"Historique (3)"** button appears at top right

### Step 5: View Archive

1. Click **"Historique (3)"** button
2. ✅ Verify: Archive section expands
3. ✅ Verify: All 3 appointments visible in archive
4. ✅ Verify: Delete buttons are DISABLED
5. ✅ Verify: Status badges are NOT clickable

### Step 6: Test Persistence

1. Press **F5** to refresh page
2. ✅ Verify: Main list is empty (no active appointments)
3. Click **"Historique (3)"**
4. ✅ Verify: All 3 archived appointments still there
5. ✅ SUCCESS: Data persists after refresh!

## 🔬 Advanced Test (10 minutes)

### Test Mixed Status

1. Create 3 new appointments for TOMORROW
2. Confirm only 2 of them
3. Leave 1 as "En attente"
4. ✅ Verify: **"Archiver"** button does NOT appear
5. Confirm the last one
6. ✅ Verify: **"Archiver"** button NOW appears

### Test Protection

1. Archive tomorrow's appointments
2. View archive
3. Try to click delete button
4. ✅ Verify: Button is disabled
5. Try to click status badge
6. ✅ Verify: Nothing happens (read-only)

### Test Database Persistence

1. Stop backend server (Ctrl+C)
2. Restart backend server
3. Refresh frontend
4. ✅ Verify: Archived appointments still in archive
5. ✅ SUCCESS: Data persists after server restart!

## 🧪 Run Test Script

```bash
# Test database operations
node api/test-archive-flow.js
```

Expected output:
```
🧪 Testing Archive Flow
📋 Step 1: Current appointments in database
📋 Step 2: Active appointments (archived = 0)
📋 Step 3: Archived appointments (archived = 1)
📋 Step 4: Dates with archivable appointments
✅ Archive flow test complete!
```

## ✅ Success Criteria

| Test | Expected Result | Status |
|------|----------------|--------|
| Create appointment | Appears in main list | ⬜ |
| Confirm appointment | Stays in main list | ⬜ |
| Archive button visibility | Appears when all complete | ⬜ |
| Archive action | Moves to archive section | ⬜ |
| View archive | Shows in history section | ⬜ |
| Delete protection | Button disabled | ⬜ |
| Status protection | Badge not clickable | ⬜ |
| Refresh persistence | Data stays archived | ⬜ |
| Server restart | Data still persists | ⬜ |

## 🐛 Troubleshooting

### "Archiver" button not appearing
- Check: Are ALL appointments confirmed or cancelled?
- Check: Is there any "En attente" appointment?
- Solution: Complete all appointments first

### Appointments reappear after refresh
- Check: Is backend server running?
- Check: Browser console for errors
- Solution: Verify API connection

### Archive section not showing
- Check: Did you click "Historique" button?
- Check: Are there any archived appointments?
- Solution: Archive some appointments first

### Delete button not disabled
- Check: Are you in the archive section?
- Check: Is the appointment actually archived?
- Solution: Verify appointment has archived=true

## 📊 Test Data

### Sample Appointments
```javascript
// Use these for testing
{
  patientNom: "Test Patient A",
  date: "2024-01-15",
  heure: "09:00",
  motif: "Consultation",
  telephone: "0612345678",
  age: 35
}

{
  patientNom: "Test Patient B",
  date: "2024-01-15",
  heure: "10:00",
  motif: "Contrôle",
  telephone: "0623456789",
  age: 42
}

{
  patientNom: "Test Patient C",
  date: "2024-01-15",
  heure: "11:00",
  motif: "Urgence",
  telephone: "0634567890",
  age: 28
}
```

## 🎯 Quick Verification Commands

### Check database directly
```bash
# Open SQLite database
sqlite3 dental-clinic.db

# Check all appointments
SELECT id, date, heure, patient_nom, statut, archived FROM rendez_vous;

# Check active appointments
SELECT COUNT(*) FROM rendez_vous WHERE archived = 0;

# Check archived appointments
SELECT COUNT(*) FROM rendez_vous WHERE archived = 1;

# Exit
.quit
```

### Check API endpoints
```bash
# Get active appointments
curl http://localhost:3000/api/rendez-vous

# Get archived appointments
curl http://localhost:3000/api/rendez-vous?archived=true

# Archive a date (replace date)
curl -X PUT http://localhost:3000/api/rendez-vous/archive-day \
  -H "Content-Type: application/json" \
  -d '{"date":"2024-01-15"}'
```

## 📝 Test Report Template

```
Date: ___________
Tester: ___________

✅ PASSED / ❌ FAILED

1. Create appointments: ___
2. Confirm appointments: ___
3. Archive button appears: ___
4. Archive action works: ___
5. View archive: ___
6. Delete protection: ___
7. Status protection: ___
8. Refresh persistence: ___
9. Server restart persistence: ___

Notes:
_________________________________
_________________________________
_________________________________

Overall Status: ✅ PASS / ❌ FAIL
```

## 🎉 Success!

If all tests pass, the archive system is working correctly!

You can now:
- ✅ Use the system in production
- ✅ Train users with ARCHIVE_USER_GUIDE.md
- ✅ Monitor for any edge cases

---

**Ready to test?** Start with Step 1 above! 🚀
