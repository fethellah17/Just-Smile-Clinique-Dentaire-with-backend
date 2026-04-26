# 🧪 Testing the Archive Fix

## Quick Test Guide

### Prerequisites
Make sure both servers are running:
```bash
# Terminal 1 - Backend
cd api
npm start

# Terminal 2 - Frontend
npm run dev
```

---

## Test Scenario 1: Appointments Stay Visible Until Archived

### Steps:
1. Navigate to "Rendez-vous" page
2. Create a new appointment for today
3. Click on the "En attente" badge to confirm it
4. **Expected:** The appointment changes to "Confirmé" but STAYS VISIBLE in the list
5. Refresh the page (F5)
6. **Expected:** The confirmed appointment is still visible (not auto-hidden)

### ✅ Success Criteria:
- Confirmed appointments remain visible
- Cancelled appointments remain visible
- No auto-hiding based on status

---

## Test Scenario 2: Manual Archiving Persists

### Steps:
1. Ensure you have at least one confirmed or cancelled appointment for a specific date
2. Click the "Archiver" button next to that date
3. **Expected:** A toast message "Journée archivée" appears
4. **Expected:** Only completed appointments (confirmé/annulé) are moved to archive
5. **Expected:** Pending appointments remain in the active list
6. Refresh the page (F5)
7. **Expected:** Archived appointments do NOT reappear in the main list

### ✅ Success Criteria:
- Archive button only appears when all appointments for a date are completed
- Only completed appointments are archived
- Pending appointments remain active
- Archive status persists after refresh

---

## Test Scenario 3: Historique Button Always Visible

### Steps:
1. Navigate to "Rendez-vous" page
2. **Expected:** "Historique" button is visible in the header (even if no archives exist)
3. If archives exist, the button shows count: "Historique (X)"
4. Click the "Historique" button
5. **Expected:** Archive section expands below the active appointments
6. Click "Masquer l'historique"
7. **Expected:** Archive section collapses

### ✅ Success Criteria:
- Historique button always visible in header
- Shows count when archives exist
- Toggles archive section visibility
- Archive section displays archived appointments grouped by date

---

## Test Scenario 4: Archive Only Completed Appointments

### Steps:
1. Create 3 appointments for the same date:
   - Appointment A: Mark as "Confirmé"
   - Appointment B: Mark as "Annulé"
   - Appointment C: Leave as "En attente"
2. Click "Archiver" for that date
3. **Expected:** Only A and B are archived
4. **Expected:** C remains in the active list
5. **Expected:** The "Archiver" button disappears for that date (because there's still a pending appointment)

### ✅ Success Criteria:
- Only confirmé and annulé appointments are archived
- Pending appointments remain active
- Archive button only shows when all appointments are completed

---

## Test Scenario 5: Database Persistence

### Backend Test:
```bash
cd api
node test-archive-persistence.js
```

### Expected Output:
```
✅ All tests passed!

📝 Summary:
  ✓ Archived column exists and works correctly
  ✓ Only completed appointments (confirmé/annulé) are archived
  ✓ Pending appointments remain active
  ✓ Archive status persists in database
  ✓ GET endpoint can filter by archived status
```

---

## Test Scenario 6: Check Current Database State

### View Current Appointments:
```bash
cd api
node check-appointments.js
```

This shows:
- Summary of appointments by date, status, and archive state
- Count of active vs archived appointments
- Breakdown by status (pending, confirmed, cancelled)

---

## Common Issues & Solutions

### Issue: Appointments still auto-hiding
**Solution:** Clear browser cache and refresh. The old frontend code might be cached.

### Issue: Archive button not appearing
**Solution:** Make sure all appointments for that date are either "confirmé" or "annulé". If any are "en attente", the button won't show.

### Issue: Archived appointments reappear after refresh
**Solution:** Check that the backend is running and the API call is successful. Check browser console for errors.

### Issue: Historique button not visible
**Solution:** Clear browser cache. The new code always shows the button.

---

## Verification Commands

### Check if backend is running:
```bash
curl http://localhost:3000/health
```

### Check appointments via API:
```bash
# Get all appointments
curl http://localhost:3000/api/rendez-vous

# Get only active appointments
curl http://localhost:3000/api/rendez-vous?archived=false

# Get only archived appointments
curl http://localhost:3000/api/rendez-vous?archived=true
```

### Archive a specific date:
```bash
curl -X PUT http://localhost:3000/api/rendez-vous/archive-day \
  -H "Content-Type: application/json" \
  -d '{"date":"2026-06-03"}'
```

---

## Expected Behavior Summary

| Action | Old Behavior | New Behavior |
|--------|-------------|--------------|
| Mark as Confirmé | Auto-hides immediately | Stays visible until archived |
| Mark as Annulé | Auto-hides immediately | Stays visible until archived |
| Click Archiver | Frontend only (temporary) | Saves to database (permanent) |
| Refresh page | Archived items reappear | Archived items stay archived |
| Historique button | Only shows if archives exist | Always visible in header |
| Archive pending | Would archive all | Only archives completed |

---

## 🎉 Success!

If all tests pass, the archive system is working correctly:
- ✅ No auto-hiding of appointments
- ✅ Manual archiving persists in database
- ✅ Historique button always accessible
- ✅ Only completed appointments can be archived
- ✅ Pending appointments remain active
