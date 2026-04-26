# Archive Persistence Fix - Complete Implementation

## Problem Summary
When clicking the "Archiver" button, appointments moved to Historique correctly, but after a page refresh (F5), they reappeared in the main list. The archive status was not being saved to the SQLite database.

## Root Cause
The `archiveByDate` function in `data-context.tsx` only updated local React state without calling the backend API to persist changes to the database.

## Solution Implemented

### 1. Backend API Route (api/routes/rendez-vous.js)
Added a new PATCH endpoint to archive appointments by date:

```javascript
// PATCH archive rendez-vous by date
router.patch('/archive-by-date', async (req, res) => {
  try {
    const db = await getDb();
    const { date } = req.body;
    
    if (!date) {
      return res.status(400).json({ error: 'Missing required field: date' });
    }
    
    console.log('📦 Archiving appointments for date:', date);
    
    await executeWithRetry(async () => {
      return await db.run(
        'UPDATE rendez_vous SET archived = 1, updated_at = CURRENT_TIMESTAMP WHERE date = ? AND archived = 0',
        date
      );
    });
    
    const archivedCount = await db.get(
      'SELECT COUNT(*) as count FROM rendez_vous WHERE date = ? AND archived = 1',
      date
    );
    
    console.log('✅ Archived', archivedCount.count, 'appointments for', date);
    
    res.json({ 
      message: 'Appointments archived successfully',
      count: archivedCount.count 
    });
  } catch (error) {
    console.error('Error archiving appointments:', error);
    res.status(500).json({ error: 'Failed to archive appointments' });
  }
});
```

**Key Features:**
- Updates `archived` column to `1` for all appointments on the specified date
- Uses retry logic to handle database locks
- Returns count of archived appointments
- Updates `updated_at` timestamp

### 2. Frontend API Client (src/lib/api.ts)
Added the archive method to the rendezVousApi:

```typescript
archiveByDate: (date: string) => apiFetch<{ message: string; count: number }>('/rendez-vous/archive-by-date', {
  method: 'PATCH',
  body: JSON.stringify({ date }),
}),
```

### 3. Data Context (src/lib/data-context.tsx)
Updated `archiveRendezVousByDate` to call the backend API:

```typescript
const archiveRendezVousByDate = async (date: string) => {
  try {
    await rendezVousApi.archiveByDate(date);
    
    // Update local state to reflect the archived appointments
    setRendezVous((rendezVous ?? []).map(r => {
      if (r.date === date && !r.archived) {
        return { ...r, archived: true };
      }
      return r;
    }));
  } catch (error) {
    console.error('Failed to archive rendez-vous:', error);
    throw error;
  }
};
```

**Key Changes:**
- Made function `async`
- Calls `rendezVousApi.archiveByDate()` to persist to database
- Updates local state after successful API call
- Throws error for proper error handling

### 4. UI Component (src/routes/rendez-vous.tsx)
Updated the archive handler to be async with error handling:

```typescript
const handleArchiveDate = async (date: string) => {
  try {
    await archiveByDate(date);
    showToast("Journée archivée");
  } catch (error) {
    console.error('Failed to archive date:', error);
    showToast("Erreur lors de l'archivage", "error");
  }
};
```

**Key Changes:**
- Made function `async`
- Added try-catch for error handling
- Shows error toast if archiving fails

## Database Schema
The `rendez_vous` table already has the `archived` column:

```sql
archived INTEGER DEFAULT 0,
```

The GET endpoint filters by `archived = 0` to show only active appointments:

```javascript
SELECT * FROM rendez_vous 
WHERE archived = 0
ORDER BY date ASC, heure ASC
```

## Data Flow

### Before Fix:
1. User clicks "Archiver" → Local state updated
2. Page refresh → Data fetched from DB (archived = 0)
3. Appointments reappear ❌

### After Fix:
1. User clicks "Archiver" → API call to backend
2. Backend updates DB: `archived = 1`
3. Local state updated to match
4. Page refresh → Data fetched from DB (archived = 0)
5. Archived appointments stay hidden ✅

## Testing

### Manual Test Steps:
1. Start the backend server: `cd api && npm start`
2. Start the frontend: `npm run dev`
3. Create a test appointment for today
4. Click "Archiver" button for that date
5. Verify appointment moves to Historique
6. Refresh page (F5)
7. Verify appointment stays in Historique ✅

### Automated Test:
Run the test script:
```bash
cd api
node test-archive.js
```

This will:
- Create a test appointment
- Verify it's active (archived = 0)
- Archive it via API
- Verify it's archived (archived = 1)
- Clean up test data

## Additional Fixes in This Session

### 1. Schema Update (patient_id nullable)
Updated `rendez_vous` table to allow NULL `patient_id`:

```sql
patient_id TEXT,  -- Changed from TEXT NOT NULL
```

This allows appointments without linked patients (walk-ins).

### 2. Backend Error Handling
Enhanced error logging in POST route:

```javascript
console.error('❌ SQL Error Details:', error.message);
console.error('❌ Request body:', JSON.stringify(req.body, null, 2));
res.status(500).json({ 
  error: 'Failed to create rendez-vous', 
  details: error.message,
  sqlError: error.code 
});
```

### 3. Frontend Error Display
Improved error messages in `api.ts`:

```typescript
const errorMessage = errorData.details 
  ? `${errorData.error}: ${errorData.details}` 
  : errorData.error || `HTTP ${response.status}`;
```

## Files Modified

1. ✅ `api/routes/rendez-vous.js` - Added archive endpoint
2. ✅ `src/lib/api.ts` - Added archiveByDate method
3. ✅ `src/lib/data-context.tsx` - Made archiveByDate async with API call
4. ✅ `src/routes/rendez-vous.tsx` - Updated handler with error handling
5. ✅ `api/schema.sql` - Made patient_id nullable
6. ✅ `api/update-schema.js` - Created migration script

## Verification Checklist

- [x] Backend route created and tested
- [x] Frontend API method added
- [x] Data context updated to call API
- [x] UI handler updated with error handling
- [x] Database schema supports nullable patient_id
- [x] Error messages are descriptive
- [x] Local state syncs with database
- [x] Page refresh preserves archive status

## Status: ✅ COMPLETE

The archive persistence issue is now fully resolved. Appointments archived via the "Archiver" button will persist in the database and remain in the Historique section after page refresh.
