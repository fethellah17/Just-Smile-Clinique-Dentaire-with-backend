# 🔄 Complete Archive Flow Diagram

## 📊 System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              rendez-vous.tsx (UI Component)              │   │
│  │                                                           │   │
│  │  • Header with "Historique" button (fixed)              │   │
│  │  • Active appointments list                              │   │
│  │  • Archive section (toggleable)                          │   │
│  │  • "Archiver" button per date                           │   │
│  └─────────────────────────────────────────────────────────┘   │
│                            ↕                                     │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │         use-rendez-vous.tsx (Hook)                       │   │
│  │                                                           │   │
│  │  • archiveByDate(date)                                   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                            ↕                                     │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │         data-context.tsx (State Management)              │   │
│  │                                                           │   │
│  │  • Fetches active + archived appointments                │   │
│  │  • archiveRendezVousByDate(date)                        │   │
│  │  • Updates local state after archive                     │   │
│  └─────────────────────────────────────────────────────────┘   │
│                            ↕                                     │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              api.ts (API Client)                         │   │
│  │                                                           │   │
│  │  • getAll(archived?: boolean)                           │   │
│  │  • archiveByDate(date)                                   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                │ HTTP Requests
                                │
┌───────────────────────────────┴─────────────────────────────────┐
│                      BACKEND (Express API)                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │         routes/rendez-vous.js (API Routes)               │   │
│  │                                                           │   │
│  │  GET  /api/rendez-vous                                   │   │
│  │       → Returns archived=0 by default                    │   │
│  │                                                           │   │
│  │  GET  /api/rendez-vous?archived=true                     │   │
│  │       → Returns archived=1                               │   │
│  │                                                           │   │
│  │  PUT  /api/rendez-vous/archive-day                       │   │
│  │       → Updates archived=1 for completed appointments    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                            ↕                                     │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              db.js (Database Connection)                 │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                │ SQL Queries
                                │
┌───────────────────────────────┴─────────────────────────────────┐
│                    DATABASE (SQLite)                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              rendez_vous table                           │   │
│  │                                                           │   │
│  │  • id (TEXT PRIMARY KEY)                                 │   │
│  │  • patient_nom (TEXT)                                    │   │
│  │  • date (DATE)                                           │   │
│  │  • heure (TEXT)                                          │   │
│  │  • statut (TEXT) - en attente/confirmé/annulé           │   │
│  │  • archived (INTEGER) - 0=active, 1=archived            │   │
│  │  • created_at (DATETIME)                                 │   │
│  │  • updated_at (DATETIME)                                 │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## 🔄 Complete User Flow

### 1️⃣ Creating an Appointment

```
User Action                    System Response
───────────                    ───────────────

Click "Nouveau RDV"     →     Modal opens
                              
Fill form & submit      →     POST /api/rendez-vous
                              {
                                statut: "en attente",
                                archived: 0
                              }
                              
                        →     INSERT INTO rendez_vous
                              (archived = 0)
                              
                        →     Appointment appears in main list
                              with "En attente" badge
```

### 2️⃣ Confirming an Appointment

```
User Action                    System Response
───────────                    ───────────────

Click "En attente"      →     Modal opens with details
badge                         
                              
Click "Confirmer"       →     PUT /api/rendez-vous/:id
                              { statut: "confirmé" }
                              
                        →     UPDATE rendez_vous
                              SET statut = 'confirmé'
                              WHERE id = ?
                              
                        →     Badge changes to "Confirmé"
                              Appointment STAYS in main list
                              
                        →     If all appointments for date
                              are completed, "Archiver"
                              button appears
```

### 3️⃣ Archiving a Date

```
User Action                    System Response
───────────                    ───────────────

Click "Archiver"        →     PUT /api/rendez-vous/archive-day
button for date               { date: "2024-01-15" }
                              
                        →     UPDATE rendez_vous
                              SET archived = 1
                              WHERE date = ?
                              AND archived = 0
                              AND statut IN ('confirmé', 'annulé')
                              
                        →     Returns { count: 3 }
                              
                        →     Frontend updates local state
                              Appointments move to archive
                              
                        →     Main list no longer shows
                              these appointments
```

### 4️⃣ Viewing Archive

```
User Action                    System Response
───────────                    ───────────────

Click "Historique"      →     Archive section expands
button in header              
                              
                        →     Shows archived appointments
                              grouped by date
                              
                        →     Delete buttons disabled
                              Status badges read-only
                              
Click "Masquer          →     Archive section collapses
l'historique"
```

### 5️⃣ Page Refresh (F5)

```
User Action                    System Response
───────────                    ───────────────

Press F5                →     GET /api/rendez-vous
                              (defaults to archived=false)
                              
                        →     SELECT * FROM rendez_vous
                              WHERE archived = 0
                              
                        →     GET /api/rendez-vous?archived=true
                              
                        →     SELECT * FROM rendez_vous
                              WHERE archived = 1
                              
                        →     Combines both results
                              
                        →     Active appointments in main list
                              Archived appointments in history
                              
                        →     NO DATA LOSS
                              Everything persists correctly
```

## 🎯 State Transitions

### Appointment Status Flow

```
┌─────────────┐
│ En attente  │ ← Initial state when created
└──────┬──────┘
       │
       ├─────→ Confirm ─────→ ┌───────────┐
       │                       │ Confirmé  │
       │                       └─────┬─────┘
       │                             │
       └─────→ Reject  ─────→ ┌───────────┐
                               │  Annulé   │
                               └─────┬─────┘
                                     │
                                     │ When all appointments
                                     │ for date are complete
                                     ↓
                               ┌───────────┐
                               │ Archived  │ ← archived = 1
                               └───────────┘
```

### Archive State Flow

```
┌──────────────────────────────────────────────────────────┐
│                    ACTIVE (archived = 0)                  │
│                                                            │
│  • Visible in main list                                   │
│  • Can change status                                      │
│  • Can delete                                             │
│  • Can modify                                             │
└────────────────────────┬─────────────────────────────────┘
                         │
                         │ User clicks "Archiver"
                         │ (only if all completed)
                         ↓
┌──────────────────────────────────────────────────────────┐
│                   ARCHIVED (archived = 1)                 │
│                                                            │
│  • Visible only in history section                        │
│  • Cannot change status (read-only)                       │
│  • Cannot delete (protected)                              │
│  • Cannot modify (protected)                              │
└──────────────────────────────────────────────────────────┘
```

## 🔐 Protection Logic

### Archive Button Visibility

```javascript
function canArchiveDate(appointments, date) {
  const dateAppointments = appointments.filter(
    rdv => rdv.date === date && !rdv.archived
  );
  
  // Must have appointments
  if (dateAppointments.length === 0) return false;
  
  // Must have NO pending appointments
  const hasPending = dateAppointments.some(
    rdv => rdv.statut === "en attente"
  );
  
  return !hasPending;
}
```

### Archive Operation

```javascript
// Backend: Only archives completed appointments
UPDATE rendez_vous 
SET archived = 1 
WHERE date = ? 
  AND archived = 0 
  AND statut IN ('confirmé', 'annulé')
```

### Delete Protection

```javascript
// Frontend: Disable delete for archived
<Button
  disabled={rdv.archived}
  title="Les enregistrements archivés ne peuvent pas être supprimés"
>
  <Trash2 />
</Button>
```

## 📊 Data Flow Summary

```
CREATE
  User → Frontend → API → Database
  ↓
  archived = 0, statut = "en attente"

CONFIRM/CANCEL
  User → Frontend → API → Database
  ↓
  statut = "confirmé" or "annulé"
  (archived stays 0)

ARCHIVE
  User → Frontend → API → Database
  ↓
  archived = 1 (only for completed)

FETCH
  Frontend → API → Database
  ↓
  Active: WHERE archived = 0
  Archived: WHERE archived = 1
  ↓
  Separate display in UI

REFRESH
  Frontend → API → Database
  ↓
  Fetches both active and archived
  ↓
  Persists correctly
```

## ✅ Key Features

1. **Manual Control**: User decides when to archive
2. **Persistence**: Archive status stored in database
3. **Protection**: Archived records are read-only
4. **Separation**: Clear visual separation of active vs archived
5. **Navigation**: Fixed header button for easy access
6. **Validation**: Only completed appointments can be archived
7. **Compliance**: Medical records protected from deletion

---

**System Status**: ✅ Fully Operational
**Last Updated**: Archive Reconstruction Complete
