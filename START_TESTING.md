# 🚀 Quick Start - Testing Archive System

## Start the Application

### Terminal 1 - Backend:
```bash
cd api
npm start
```

### Terminal 2 - Frontend:
```bash
npm run dev
```

---

## Quick Test (2 minutes)

### 1. Create Test Appointments:
- Go to "Rendez-vous" page
- Click "Nouveau RDV"
- Create 3 appointments for today:
  - Patient A: "En attente"
  - Patient B: "En attente"  
  - Patient C: "En attente"

### 2. Test "Tout Archiver" Visibility:
- Look for "Tout Archiver" button
- ❌ Should NOT be visible (appointments are pending)

### 3. Confirm Appointments:
- Click "En attente" badge on Patient A → Confirm
- Click "En attente" badge on Patient B → Confirm
- Click "En attente" badge on Patient C → Reject (Annulé)

### 4. Verify Button Appears:
- ✅ "Tout Archiver" button should NOW be visible
- All appointments are completed (confirmé or annulé)

### 5. Archive the Day:
- Click "Tout Archiver"
- ✅ Toast: "Journée archivée"
- ✅ Appointments disappear from main list

### 6. View History:
- Click "Historique" button in header
- ✅ See archived appointments
- ✅ Delete button is disabled (grayed out)
- ✅ Hover shows protection message

### 7. Test Persistence:
- Refresh page (F5)
- ✅ Archived appointments stay archived
- ✅ They don't reappear in main list

---

## Automated Test

```bash
cd api
node test-archive-persistence.js
```

**Expected:** All tests pass ✅

---

## Check Database

```bash
cd api
node check-appointments.js
```

**Shows:** Current state of all appointments

---

## Success Criteria

- [ ] "Tout Archiver" only shows when all completed
- [ ] Archived records have disabled delete button
- [ ] Archive persists after refresh
- [ ] Toast notifications work
- [ ] Historique button always visible

---

## 🎉 Done!

If all checks pass, the system is working perfectly!

**Next:** See `TEST_ARCHIVE_PROTECTION.md` for detailed testing scenarios
