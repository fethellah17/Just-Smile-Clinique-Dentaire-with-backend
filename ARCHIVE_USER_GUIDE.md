# 📚 Archive System - User Guide

## 🎯 Overview

The archive system allows you to manually archive completed appointments while keeping them permanently stored in the database for medical record compliance.

## 🔑 Key Concepts

### Appointment Statuses
- **En attente** (Pending) - Waiting for confirmation
- **Confirmé** (Confirmed) - Appointment confirmed
- **Annulé** (Cancelled) - Appointment cancelled

### Archive States
- **Active** (archived = 0) - Visible in main list
- **Archived** (archived = 1) - Visible only in history section

## 📋 How to Use

### 1. Creating an Appointment

1. Click **"Nouveau RDV"** button at top right
2. Fill in appointment details:
   - Patient name
   - Date and time
   - Reason (motif)
   - Phone number (optional)
   - Age (optional)
3. Click **"Ajouter"**
4. Appointment appears in main list with status **"En attente"**

### 2. Processing an Appointment

#### Confirming
1. Click on the **"En attente"** badge
2. Review appointment details
3. Click **"Confirmer"**
4. Status changes to **"Confirmé"**
5. Appointment STAYS in main list (not hidden)

#### Rejecting
1. Click on the **"En attente"** badge
2. Click **"Rejeter"**
3. Status changes to **"Annulé"**
4. Appointment STAYS in main list (not hidden)

### 3. Archiving Appointments

#### When Can You Archive?
The **"Archiver"** button appears for a date when:
- ✅ ALL appointments for that date are completed (confirmé or annulé)
- ✅ NO appointments are still pending (en attente)

#### How to Archive
1. Complete all appointments for a date (confirm or cancel)
2. **"Archiver"** button appears next to the date
3. Click **"Archiver"**
4. All completed appointments for that date move to archive
5. They disappear from main list

### 4. Viewing Archive

#### Opening Archive
1. Look at top right header
2. If you have archived appointments, you'll see **"Historique (X)"** button
3. Click to expand archive section
4. Click again to hide

#### Archive Features
- 📅 Grouped by date (same as main list)
- 👁️ Read-only view (cannot modify)
- 🔒 Cannot delete (medical records protection)
- 📞 Can still call phone numbers
- 🔄 Persists after page refresh

## 🛡️ Protection Features

### Medical Records Protection
- Archived appointments **CANNOT be deleted**
- Delete button is disabled with explanation
- Ensures compliance with medical record laws

### Status Protection
- Archived appointments **CANNOT change status**
- Status badges are not clickable
- Prevents accidental modifications

### Archive Protection
- **ONLY completed** appointments can be archived
- Pending appointments stay in active list
- Prevents premature archiving

## 🔄 Data Persistence

### What Persists?
- ✅ All appointment data
- ✅ Archive status (archived = 0 or 1)
- ✅ Status (en attente, confirmé, annulé)
- ✅ All patient information

### After Page Refresh (F5)
- Active appointments stay in main list
- Archived appointments stay in archive
- **NO DATA LOSS**

### After Server Restart
- All data persists in SQLite database
- Archive status is maintained
- Everything loads correctly

## 💡 Best Practices

### Daily Workflow
1. **Morning**: Review pending appointments
2. **During Day**: Confirm or cancel as patients arrive/call
3. **End of Day**: Archive completed appointments
4. **Weekly**: Review archive for record-keeping

### When to Archive
- ✅ End of each day
- ✅ After all appointments are processed
- ✅ When you want to clean up the main view

### When NOT to Archive
- ❌ While appointments are still pending
- ❌ If you need to modify appointment details
- ❌ Before confirming patient showed up

## 🎨 Visual Indicators

### Main List
- 🟡 **Yellow badge** - En attente (clickable)
- 🟢 **Green badge** - Confirmé (clickable to create patient file)
- 🔴 **Red badge** - Annulé (read-only)
- 📦 **Archive button** - Appears when date is complete

### Archive Section
- 🔒 **Disabled delete button** - Cannot delete archived records
- 📊 **Reduced opacity** - Visual indicator of historical data
- 📅 **Archive icon** - Section header with icon

## 🚨 Common Questions

### Q: Why can't I see the "Archiver" button?
**A:** The button only appears when ALL appointments for that date are completed (no pending appointments).

### Q: Where did my archived appointments go?
**A:** Click the **"Historique"** button at the top right to view them.

### Q: Can I un-archive an appointment?
**A:** Not through the UI. This is intentional to protect medical records. Contact system administrator if needed.

### Q: Why can't I delete archived appointments?
**A:** Medical records must be retained for legal compliance. Archived appointments are protected from deletion.

### Q: What happens if I refresh the page?
**A:** Nothing! All data persists. Active appointments stay active, archived appointments stay archived.

### Q: Can I archive individual appointments?
**A:** No, archiving is done by date. This ensures all appointments for a day are archived together.

## 🔧 Troubleshooting

### Appointments disappeared after confirming
- ✅ **FIXED**: Appointments now stay visible until manually archived

### Archive button not appearing
- Check if ALL appointments for that date are completed
- Ensure no appointments are still "en attente"

### Archived appointments reappear after refresh
- ✅ **FIXED**: Archive status now persists in database

### Can't find archived appointments
- Click **"Historique"** button at top right
- Button only appears if you have archived appointments

## 📞 Support

If you encounter any issues:
1. Check this guide first
2. Verify backend server is running
3. Check browser console for errors
4. Contact system administrator

## 🎯 Quick Reference

| Action | Location | Result |
|--------|----------|--------|
| Create appointment | "Nouveau RDV" button | Appears in main list |
| Confirm appointment | Click "En attente" badge | Status → Confirmé |
| Cancel appointment | Click "En attente" → Rejeter | Status → Annulé |
| Archive date | Click "Archiver" button | Moves to archive |
| View archive | Click "Historique" button | Shows archived appointments |
| Hide archive | Click "Masquer l'historique" | Hides archive section |

---

**Last Updated**: Archive System Reconstruction Complete
**Version**: 2.0 - Full Persistence
