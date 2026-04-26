# Quick Archive Guide

## What Changed? ✅

### Before
- ❌ Archived appointments returned after page refresh
- ❌ Archive status only in local state
- ❌ Historique button at bottom of page

### After
- ✅ Archived appointments persist in database
- ✅ Archive status saved to SQLite (archived = 1)
- ✅ Historique button in top-right header

## How to Use

### 1. Create Appointment
```
Click "Nouveau RDV" → Fill form → Submit
Status: "en attente" (pending)
```

### 2. Process Appointment
```
Click status badge → Confirm or Reject
Status: "confirmé" or "annulé"
Appointment stays in main list ✅
```

### 3. Archive Finished Appointments
```
When all appointments for a date are processed:
Click "Archiver" button on date card
→ Appointments move to Historique
→ Saved to database (archived = 1)
```

### 4. View Archive
```
Click "Historique (X)" button in top-right
→ Shows all archived appointments
→ Persists after page refresh ✅
```

## Key Rules

### Archive Button Appears When:
- ✅ Date has appointments
- ✅ All appointments are "confirmé" or "annulé"
- ❌ No "en attente" appointments remain

### Archive Button Does NOT Appear When:
- ❌ Date has pending ("en attente") appointments
- ❌ Date has no appointments
- ❌ Date is already archived

## Technical Details

### Database
```sql
-- Active appointments
SELECT * FROM rendez_vous WHERE archived = 0;

-- Archived appointments
SELECT * FROM rendez_vous WHERE archived = 1;

-- Archive a date
UPDATE rendez_vous 
SET archived = 1 
WHERE date = '2026-04-26' AND archived = 0;
```

### API Endpoint
```http
PATCH /api/rendez-vous/archive-by-date
Body: { "date": "2026-04-26" }
```

### Frontend
```typescript
// Archive function (async)
await archiveByDate(date);

// Filtering
const { active, archived } = separateActiveAndArchived(rendezVous);
```

## Troubleshooting

### Issue: Appointments reappear after refresh
**Solution:** Already fixed! Archive now persists to database.

### Issue: Archive button doesn't appear
**Cause:** Some appointments still "en attente"
**Solution:** Confirm or reject all pending appointments first

### Issue: Can't see archived appointments
**Solution:** Click "Historique (X)" button in top-right header

## Testing

### Quick Test
1. Create appointment for today
2. Confirm it (click status badge)
3. Click "Archiver" on date card
4. Verify it moves to Historique
5. Press F5 to refresh page
6. ✅ Appointment stays in Historique

### Database Verification
```bash
cd api
sqlite3 dental-clinic.db
SELECT patient_nom, date, archived FROM rendez_vous;
.exit
```

## Status: ✅ Ready to Use

All features are implemented and tested. The archive system now works correctly with full database persistence.
