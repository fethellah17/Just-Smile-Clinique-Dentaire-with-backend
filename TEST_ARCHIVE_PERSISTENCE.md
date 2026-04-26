# Test: Archive Persistence

## Quick Test Steps

### Prerequisites
1. Backend server running: `cd api && npm start`
2. Frontend running: `npm run dev`
3. Browser open at `http://localhost:5173`

### Test Scenario: Archive Appointments

#### Step 1: Create Test Appointment
1. Navigate to "Rendez-vous" page
2. Click "Nouveau RDV" button
3. Fill in the form:
   - Nom: Test
   - Prénom: Archive
   - Téléphone: 0123456789 (optional)
   - Âge: 30 (optional)
   - Catégorie: Select any category
   - Date: Today's date
   - Heure: 14:00
4. Click "Ajouter RDV"
5. ✅ Verify: Appointment appears in the list

#### Step 2: Archive the Date
1. Find the date card with your test appointment
2. Click the "Archiver" button on the date card
3. ✅ Verify: Toast message "Journée archivée" appears
4. ✅ Verify: Appointments for that date disappear from main list
5. Click "Voir l'historique des rendez-vous"
6. ✅ Verify: Archived appointments appear in the Historique section

#### Step 3: Test Persistence (Critical!)
1. Press F5 to refresh the page
2. ✅ Verify: Archived appointments DO NOT reappear in main list
3. ✅ Verify: "Archiver" button does NOT show for that date
4. Click "Voir l'historique des rendez-vous"
5. ✅ Verify: Archived appointments are still in Historique

#### Step 4: Verify Database
Open the database directly to confirm:
```bash
cd api
sqlite3 dental-clinic.db
```

Run this query:
```sql
SELECT id, patient_nom, date, archived 
FROM rendez_vous 
WHERE patient_nom LIKE '%Archive%';
```

✅ Expected: `archived` column should be `1` for your test appointment

Exit sqlite:
```sql
.exit
```

#### Step 5: Clean Up
1. In the Historique section, find your test appointment
2. Click the trash icon to delete it
3. ✅ Verify: Appointment is removed

## Expected Backend Logs

When you click "Archiver", you should see in the backend console:

```
📦 Archiving appointments for date: 2026-04-26
✅ Archived 1 appointments for 2026-04-26
```

## Expected Frontend Behavior

### Before Archive:
- Appointment visible in main list
- "Archiver" button visible on date card
- Status badge shows "En attente" or "Confirmé"

### After Archive:
- Appointment removed from main list
- Date card removed if no more appointments
- Toast: "Journée archivée"
- Appointment visible in Historique (when expanded)

### After Refresh (F5):
- Appointment stays in Historique
- Does NOT reappear in main list
- "Archiver" button does NOT reappear

## Troubleshooting

### Issue: Appointments reappear after refresh
**Cause:** Backend server not running or API call failed

**Fix:**
1. Check backend console for errors
2. Verify backend is running on port 3000
3. Check browser console for API errors
4. Verify database file exists: `api/dental-clinic.db`

### Issue: "Failed to archive" error
**Cause:** Database locked or connection issue

**Fix:**
1. Stop all processes accessing the database
2. Restart backend server
3. Try again

### Issue: Archive button doesn't appear
**Cause:** Not all appointments for that date are processed

**Fix:**
1. Ensure all appointments are either "confirmé" or "annulé"
2. "En attente" appointments prevent archiving
3. Process or cancel pending appointments first

## API Endpoint Details

### Archive by Date
```
PATCH /api/rendez-vous/archive-by-date
Content-Type: application/json

Body:
{
  "date": "2026-04-26"
}

Response (Success):
{
  "message": "Appointments archived successfully",
  "count": 3
}

Response (Error):
{
  "error": "Failed to archive appointments"
}
```

## Database Query Reference

### View all appointments with archive status:
```sql
SELECT id, patient_nom, date, heure, archived 
FROM rendez_vous 
ORDER BY date DESC, heure ASC;
```

### Count archived vs active:
```sql
SELECT 
  archived,
  COUNT(*) as count 
FROM rendez_vous 
GROUP BY archived;
```

### Manually archive a date (if needed):
```sql
UPDATE rendez_vous 
SET archived = 1 
WHERE date = '2026-04-26';
```

### Manually unarchive (for testing):
```sql
UPDATE rendez_vous 
SET archived = 0 
WHERE date = '2026-04-26';
```

## Success Criteria

✅ Archive button works without errors
✅ Appointments move to Historique immediately
✅ Page refresh preserves archive status
✅ Database shows archived = 1
✅ No console errors in frontend or backend
✅ Toast messages appear correctly

## Status: Ready for Testing

All code changes are complete and ready for manual testing.
