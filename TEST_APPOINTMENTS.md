# 🧪 Test Appointments - Quick Guide

## Quick Test

### Step 1: Start Backend
```bash
cd api
npm start
```

### Step 2: Add an Appointment

1. Go to "Rendez-vous" page
2. Click "Nouveau RDV"
3. Fill in:
   - Nom: "Test Patient"
   - Date: Today's date
   - Heure: "10:00"
   - Motif: "Consultation"
   - Téléphone: "0123456789"
4. Click "Ajouter"
5. ✅ See success toast: "Rendez-vous ajouté à la liste d'attente"
6. ✅ Appointment appears in list immediately
7. ✅ Shows "En attente" badge

### Step 3: Verify Persistence

1. Press F5 to refresh browser
2. ✅ Appointment still visible
3. ✅ All data intact (name, time, motif)

### Step 4: Confirm Appointment

1. Click on "En attente" badge
2. Click "Confirmer"
3. ✅ Badge changes to "Confirmé"
4. ✅ Success toast shown
5. Refresh page
6. ✅ Status still "Confirmé"

### Step 5: Delete Appointment

1. Click trash icon
2. Confirm deletion
3. ✅ Appointment removed
4. Refresh page
5. ✅ Still deleted

## Database Verification

```bash
cd api
sqlite3 dental-clinic.db

-- View all appointments
SELECT * FROM rendez_vous;

-- Should show your test appointment
.quit
```

## Expected Behavior

### ✅ Correct:
- Appointment appears immediately after adding
- Data persists after refresh (F5)
- Status changes work
- Delete works
- No errors in console

### ❌ Previous Bug (Now Fixed):
- ~~Success message but no appointment in list~~
- ~~Data disappeared on refresh~~
- ~~"Cannot read length" errors~~

## Troubleshooting

**Appointment not appearing?**
- Check backend is running
- Check browser console for errors
- Verify success toast appeared

**Data disappears on refresh?**
- Check backend is running
- Verify database file exists
- Check Network tab for API calls

**Error toast appears?**
- Backend might be offline
- Check backend terminal for errors
- Verify database is accessible

## Success Checklist

- [ ] Backend running
- [ ] Add appointment
- [ ] Appointment appears immediately ✅
- [ ] Refresh page (F5)
- [ ] Appointment still there ✅
- [ ] Confirm appointment
- [ ] Status changes ✅
- [ ] Delete appointment
- [ ] Appointment removed ✅

If all checkboxes pass, appointments are working correctly!
