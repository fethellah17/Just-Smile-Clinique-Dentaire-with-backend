# 🛡️ Testing Archive Protection & Manual Archiving

## Overview
This test verifies that:
1. ✅ "Tout Archiver" button only appears when ALL appointments are completed
2. ✅ Archived records are read-only (delete button disabled)
3. ✅ Medical records are protected in the Historique section
4. ✅ Appointments persist correctly after archiving

---

## Test Scenario 1: "Tout Archiver" Button Visibility

### Setup:
Create 3 appointments for the same date (e.g., June 3, 2026):
- Appointment A: Status "En attente"
- Appointment B: Status "Confirmé"
- Appointment C: Status "Annulé"

### Test Steps:
1. Navigate to "Rendez-vous" page
2. Look for the "Tout Archiver" button next to the date

### Expected Result:
❌ **Button should NOT be visible** because Appointment A is still "En attente"

### Action:
3. Click on Appointment A's "En attente" badge
4. Confirm or reject the appointment

### Expected Result:
✅ **Button should NOW be visible** because all appointments are completed

---

## Test Scenario 2: Manual Archiving

### Setup:
Continue from Scenario 1 with all appointments completed

### Test Steps:
1. Click the "Tout Archiver" button
2. Observe the toast notification
3. Check that completed appointments disappear from the main list
4. Refresh the page (F5)

### Expected Results:
- ✅ Toast message: "Journée archivée"
- ✅ Only completed appointments (confirmé/annulé) are archived
- ✅ If any appointment was still pending, it remains in the active list
- ✅ After refresh, archived appointments do NOT reappear in main list

---

## Test Scenario 3: Protected History Records

### Setup:
Archive some appointments using "Tout Archiver"

### Test Steps:
1. Click the "Historique" button in the header
2. Expand the archive section
3. Locate an archived appointment
4. Try to hover over the delete button (trash icon)

### Expected Results:
- ✅ Delete button is grayed out (disabled)
- ✅ Cursor shows "not-allowed" icon
- ✅ Tooltip shows: "Les enregistrements archivés ne peuvent pas être supprimés (protection des dossiers médicaux)"
- ✅ Clicking the button does nothing
- ✅ Status badges are read-only (not clickable)

---

## Test Scenario 4: Mixed Status Archiving

### Setup:
Create 4 appointments for the same date:
- Appointment A: "En attente"
- Appointment B: "Confirmé"
- Appointment C: "Annulé"
- Appointment D: "Confirmé"

### Test Steps:
1. Confirm Appointment A (changes to "Confirmé")
2. Verify "Tout Archiver" button appears
3. Click "Tout Archiver"
4. Check the results

### Expected Results:
- ✅ Appointments B, C, D, and A are all archived
- ✅ All 4 appointments move to Historique
- ✅ Main list shows "Aucun rendez-vous en attente"

---

## Test Scenario 5: Partial Archiving Protection

### Setup:
Create 3 appointments for the same date:
- Appointment A: "En attente"
- Appointment B: "Confirmé"
- Appointment C: "Annulé"

### Test Steps:
1. Do NOT confirm Appointment A (leave it as "En attente")
2. Look for "Tout Archiver" button

### Expected Results:
- ❌ "Tout Archiver" button should NOT appear
- ✅ Appointment A remains visible with "En attente" badge
- ✅ Appointments B and C remain visible (not auto-archived)
- ✅ User must manually confirm or reject A before archiving

---

## Test Scenario 6: Database Persistence

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

## Test Scenario 7: UI Verification

### Visual Checks:

#### Active Appointments Section:
```
┌─────────────────────────────────────────────────────┐
│ 📅 Mardi 3 juin 2026    [+Ajouter] [Tout Archiver] │
├─────────────────────────────────────────────────────┤
│ 09:00  Patient A  Consultation  [Confirmé]    [🗑️]  │
│ 10:00  Patient B  Contrôle     [Annulé]      [🗑️]  │
└─────────────────────────────────────────────────────┘
```
- ✅ "Tout Archiver" button visible (all completed)
- ✅ Delete buttons enabled (active records)

#### Historique Section:
```
┌─────────────────────────────────────────────────────┐
│ 📅 Lundi 26 mai 2026                                │
├─────────────────────────────────────────────────────┤
│ 09:00  Patient C  Extraction   [Confirmé]    [🗑️]  │ ← Disabled
│ 10:00  Patient D  Détartrage   [Annulé]      [🗑️]  │ ← Disabled
└─────────────────────────────────────────────────────┘
```
- ✅ Delete buttons disabled (archived records)
- ✅ Status badges read-only
- ✅ Slightly faded appearance (opacity-75)

---

## Test Scenario 8: API Endpoint Verification

### Test Archive Endpoint:
```bash
# Archive completed appointments for a specific date
curl -X PUT http://localhost:3000/api/rendez-vous/archive-day \
  -H "Content-Type: application/json" \
  -d '{"date":"2026-06-03"}'
```

### Expected Response:
```json
{
  "message": "Appointments archived successfully",
  "count": 2,
  "date": "2026-06-03"
}
```

### Verify in Database:
```bash
cd api
node check-appointments.js
```

### Expected Output:
```
Date       | Status       | Archived | Count
-----------|--------------|----------|------
2026-06-03 | confirmé     | Yes      | 1
2026-06-03 | annulé       | Yes      | 1
2026-06-03 | en attente   | No       | 0
```

---

## Common Issues & Solutions

### Issue: "Tout Archiver" button appears when there are pending appointments
**Solution:** Check the `canArchiveDate` function in `src/lib/appointment-utils.ts`. It should return false if any appointment has status "en attente".

### Issue: Delete button still enabled in Historique
**Solution:** Verify the archived appointments section has `disabled` attribute on the delete button.

### Issue: Archived appointments can be modified
**Solution:** Ensure status badges in Historique are not clickable (no onClick handler).

### Issue: Pending appointments get archived
**Solution:** Check the backend endpoint `/archive-day` - it should only archive appointments with status IN ('confirmé', 'annulé').

---

## Security & Data Integrity Checks

### Medical Records Protection:
- ✅ Archived records cannot be deleted
- ✅ Archived records cannot be modified
- ✅ Archive status persists in database
- ✅ No accidental data loss

### User Control:
- ✅ Manual archiving only (no auto-archiving)
- ✅ Clear visual feedback (button visibility)
- ✅ Toast notifications for actions
- ✅ Confirmation before destructive actions

### Data Consistency:
- ✅ Archive status synced between frontend and backend
- ✅ Page refresh maintains state
- ✅ Database transactions are atomic
- ✅ No orphaned records

---

## Success Criteria

All tests must pass:
- [ ] "Tout Archiver" only shows when all appointments completed
- [ ] Archived records have disabled delete button
- [ ] Status badges in Historique are read-only
- [ ] Archive persists after page refresh
- [ ] Only completed appointments are archived
- [ ] Pending appointments remain active
- [ ] Backend tests pass
- [ ] No console errors
- [ ] Medical records protected

---

## 🎉 Completion

If all tests pass, the archive protection system is working correctly:
- ✅ Manual archiving with full user control
- ✅ Protected medical records in Historique
- ✅ Smart button visibility based on appointment status
- ✅ Persistent and reliable data storage
- ✅ Clear visual feedback and user experience
