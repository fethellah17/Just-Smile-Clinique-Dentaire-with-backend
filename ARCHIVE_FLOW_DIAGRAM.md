# 📊 Archive System Flow Diagram

## Complete User Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    APPOINTMENT LIFECYCLE                     │
└─────────────────────────────────────────────────────────────┘

1. CREATE APPOINTMENT
   ┌──────────────────────┐
   │  Click "Nouveau RDV" │
   └──────────┬───────────┘
              ↓
   ┌──────────────────────┐
   │  Status: En attente  │
   │  Archived: false     │
   └──────────┬───────────┘
              ↓
   ┌──────────────────────────────────────┐
   │  Visible in ACTIVE APPOINTMENTS      │
   │  ✅ Delete button enabled            │
   │  ✅ Status badge clickable           │
   │  ❌ "Tout Archiver" NOT visible      │
   └──────────┬───────────────────────────┘
              ↓

2. CONFIRM/REJECT APPOINTMENT
   ┌──────────────────────────────────────┐
   │  Click "En attente" badge            │
   └──────────┬───────────────────────────┘
              ↓
   ┌──────────────────────┐
   │  Choose action:      │
   │  • Confirmer         │
   │  • Rejeter           │
   └──────────┬───────────┘
              ↓
   ┌──────────────────────┐
   │  Status: Confirmé    │
   │    OR                │
   │  Status: Annulé      │
   │  Archived: false     │
   └──────────┬───────────┘
              ↓
   ┌──────────────────────────────────────┐
   │  STAYS in ACTIVE APPOINTMENTS        │
   │  ✅ Delete button enabled            │
   │  ✅ Status badge clickable           │
   │  ⏳ Waiting for all to complete      │
   └──────────┬───────────────────────────┘
              ↓

3. ALL APPOINTMENTS COMPLETED
   ┌──────────────────────────────────────┐
   │  Check: All appointments for date    │
   │  are either Confirmé or Annulé       │
   └──────────┬───────────────────────────┘
              ↓
   ┌──────────────────────────────────────┐
   │  ✅ "Tout Archiver" button appears   │
   │  Button styled with primary colors   │
   └──────────┬───────────────────────────┘
              ↓

4. MANUAL ARCHIVING
   ┌──────────────────────────────────────┐
   │  User clicks "Tout Archiver"         │
   └──────────┬───────────────────────────┘
              ↓
   ┌──────────────────────────────────────┐
   │  Frontend → API Call                 │
   │  PUT /api/rendez-vous/archive-day    │
   │  Body: { date: "2026-06-03" }        │
   └──────────┬───────────────────────────┘
              ↓
   ┌──────────────────────────────────────┐
   │  Backend → Database Update           │
   │  UPDATE rendez_vous                  │
   │  SET archived = 1                    │
   │  WHERE date = ? AND                  │
   │    statut IN ('confirmé', 'annulé')  │
   └──────────┬───────────────────────────┘
              ↓
   ┌──────────────────────────────────────┐
   │  Response: { count: 3, date: "..." }│
   └──────────┬───────────────────────────┘
              ↓
   ┌──────────────────────────────────────┐
   │  Frontend → Update Local State       │
   │  Mark appointments as archived       │
   └──────────┬───────────────────────────┘
              ↓
   ┌──────────────────────────────────────┐
   │  UI → Toast Notification             │
   │  "Journée archivée"                  │
   └──────────┬───────────────────────────┘
              ↓

5. ARCHIVED STATE
   ┌──────────────────────┐
   │  Status: Confirmé    │
   │    OR                │
   │  Status: Annulé      │
   │  Archived: true      │
   └──────────┬───────────┘
              ↓
   ┌──────────────────────────────────────┐
   │  Moved to HISTORIQUE section         │
   │  ❌ Delete button DISABLED           │
   │  ❌ Status badge NOT clickable       │
   │  ✅ Read-only display                │
   │  ✅ Medical records protected        │
   └──────────┬───────────────────────────┘
              ↓

6. PAGE REFRESH (F5)
   ┌──────────────────────────────────────┐
   │  Frontend → Fetch from API           │
   │  GET /api/rendez-vous                │
   └──────────┬───────────────────────────┘
              ↓
   ┌──────────────────────────────────────┐
   │  Backend → Query Database            │
   │  SELECT * FROM rendez_vous           │
   │  WHERE archived = 0 (active)         │
   │  WHERE archived = 1 (history)        │
   └──────────┬───────────────────────────┘
              ↓
   ┌──────────────────────────────────────┐
   │  ✅ Archived appointments stay       │
   │     in Historique section            │
   │  ✅ State persists correctly         │
   └──────────────────────────────────────┘
```

---

## Button Visibility Logic

```
┌─────────────────────────────────────────────────────────────┐
│              "TOUT ARCHIVER" BUTTON LOGIC                    │
└─────────────────────────────────────────────────────────────┘

For each date:
  ↓
  Get all appointments for that date
  ↓
  Filter: archived = false (only active)
  ↓
  Check: appointments.length > 0?
  ├─ NO → ❌ Don't show button (no appointments)
  └─ YES → Continue
      ↓
      Check: Any appointment with status "en attente"?
      ├─ YES → ❌ Don't show button (not all completed)
      └─ NO → ✅ SHOW BUTTON (all completed)

Example 1: [En attente, Confirmé, Annulé]
  → Has "en attente" → ❌ Button hidden

Example 2: [Confirmé, Confirmé, Annulé]
  → No "en attente" → ✅ Button visible

Example 3: []
  → No appointments → ❌ Button hidden
```

---

## Protection Mechanism

```
┌─────────────────────────────────────────────────────────────┐
│              MEDICAL RECORDS PROTECTION                      │
└─────────────────────────────────────────────────────────────┘

ACTIVE APPOINTMENTS (archived = false)
┌──────────────────────────────────────┐
│  Patient A - Confirmé                │
│  [Confirmé] [🗑️ Delete]              │
│     ↑         ↑                      │
│  Clickable  Enabled                  │
└──────────────────────────────────────┘

ARCHIVED APPOINTMENTS (archived = true)
┌──────────────────────────────────────┐
│  Patient B - Confirmé                │
│  [Confirmé] [🗑️ Delete]              │
│     ↑         ↑                      │
│  Read-only  DISABLED                 │
│             (grayed out)             │
│             cursor: not-allowed      │
└──────────────────────────────────────┘

Protection Layers:
1. UI: Button disabled attribute
2. CSS: Grayed out appearance
3. Cursor: not-allowed icon
4. Tooltip: Explanation message
5. State: No onClick handler
```

---

## Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    DATA SYNCHRONIZATION                      │
└─────────────────────────────────────────────────────────────┘

USER ACTION: Click "Tout Archiver"
     ↓
┌─────────────────────────────────────┐
│  Frontend (React State)             │
│  rendezVous: [                      │
│    { id: 1, archived: false },      │
│    { id: 2, archived: false }       │
│  ]                                  │
└─────────────┬───────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  API Call                           │
│  PUT /api/rendez-vous/archive-day   │
│  { date: "2026-06-03" }             │
└─────────────┬───────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  Backend (Express Route)            │
│  Execute SQL UPDATE                 │
└─────────────┬───────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  Database (SQLite)                  │
│  UPDATE rendez_vous                 │
│  SET archived = 1                   │
│  WHERE date = '2026-06-03'          │
│    AND statut IN ('confirmé',       │
│                    'annulé')        │
└─────────────┬───────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  Response                           │
│  { count: 2, date: "2026-06-03" }   │
└─────────────┬───────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  Frontend (Update State)            │
│  rendezVous: [                      │
│    { id: 1, archived: true },       │
│    { id: 2, archived: true }        │
│  ]                                  │
└─────────────┬───────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  UI Re-render                       │
│  • Move to Historique section       │
│  • Disable delete buttons           │
│  • Show toast notification          │
└─────────────────────────────────────┘
```

---

## State Management

```
┌─────────────────────────────────────────────────────────────┐
│                    COMPONENT STATE                           │
└─────────────────────────────────────────────────────────────┘

DataContext (Global State)
├─ rendezVous: RendezVous[]
│  ├─ Active: archived = false
│  └─ Archived: archived = true
│
├─ archiveRendezVousByDate(date)
│  ├─ Call API
│  ├─ Update database
│  └─ Sync local state
│
└─ Provides to all components

RendezVousPage (Component State)
├─ showArchive: boolean
│  └─ Toggle Historique visibility
│
├─ toast: { message, type }
│  └─ Show notifications
│
└─ Uses DataContext

Derived State (Computed)
├─ activeAppointments
│  └─ Filter: archived = false
│
├─ archivedAppointments
│  └─ Filter: archived = true
│
├─ activeGrouped
│  └─ Group by date
│
└─ archivedGrouped
   └─ Group by date
```

---

## Visual States

```
┌─────────────────────────────────────────────────────────────┐
│                    UI VISUAL STATES                          │
└─────────────────────────────────────────────────────────────┘

STATE 1: PENDING APPOINTMENT
┌──────────────────────────────────────┐
│ 09:00  Patient A  Consultation       │
│ [En attente] [🗑️]                    │
│   ↑ Yellow    ↑ Red                  │
│   Clickable   Enabled                │
└──────────────────────────────────────┘

STATE 2: CONFIRMED APPOINTMENT (Active)
┌──────────────────────────────────────┐
│ 09:00  Patient A  Consultation       │
│ [Confirmé] [🗑️]                      │
│   ↑ Green   ↑ Red                    │
│   Clickable Enabled                  │
└──────────────────────────────────────┘

STATE 3: CANCELLED APPOINTMENT (Active)
┌──────────────────────────────────────┐
│ 09:00  Patient A  Consultation       │
│ [Annulé] [🗑️]                        │
│   ↑ Red   ↑ Red                      │
│   Static  Enabled                    │
│   Opacity: 60%                       │
└──────────────────────────────────────┘

STATE 4: ARCHIVED APPOINTMENT (History)
┌──────────────────────────────────────┐
│ 09:00  Patient A  Consultation       │
│ [Confirmé] [🗑️]                      │
│   ↑ Green   ↑ Gray                   │
│   Read-only DISABLED                 │
│   Opacity: 75%                       │
│   Cursor: not-allowed                │
└──────────────────────────────────────┘
```

---

## Summary

This archive system provides:
- ✅ Clear visual flow from creation to archiving
- ✅ Smart button visibility based on completion status
- ✅ Protected medical records in Historique
- ✅ Persistent storage with database synchronization
- ✅ Multiple protection layers for data integrity
- ✅ Intuitive user experience with visual feedback
