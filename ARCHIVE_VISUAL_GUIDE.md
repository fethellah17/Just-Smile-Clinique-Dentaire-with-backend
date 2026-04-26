# Archive System - Visual Guide

## UI Layout

```
┌────────────────────────────────────────────────────────────────┐
│  Gestion des Rendez-vous                                       │
│  5 rendez-vous actifs • 12 archivés                            │
│                                                                 │
│                        [📦 Historique (12)]  [+ Nouveau RDV]   │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│  📅 Dimanche 26 avril 2026                    [+ Ajouter]      │
├────────────────────────────────────────────────────────────────┤
│  📞  10:00  Dupont Jean                    [En attente]  🗑️   │
│            Consultation                                         │
│                                                                 │
│  📞  14:00  Martin Sophie                  [Confirmé]    🗑️   │
│            Détartrage                                           │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│  📅 Lundi 27 avril 2026      [+ Ajouter]  [📦 Archiver]       │
├────────────────────────────────────────────────────────────────┤
│  📞  09:00  Bernard Paul                   [Confirmé]    🗑️   │
│            Implant                                              │
│                                                                 │
│  📞  11:00  Petit Marie                    [Annulé]      🗑️   │
│            Couronne                                             │
└────────────────────────────────────────────────────────────────┘
```

## Appointment States

### State 1: Pending (En attente)
```
┌─────────────────────────────────────────────┐
│  📞  10:00  Dupont Jean                     │
│            Consultation                     │
│                                             │
│  Status: [En attente] ← Click to process   │
│  Archive: ❌ Not available yet              │
└─────────────────────────────────────────────┘
```

### State 2: Confirmed (Confirmé)
```
┌─────────────────────────────────────────────┐
│  📞  10:00  Dupont Jean                     │
│            Consultation                     │
│                                             │
│  Status: [Confirmé] ← Click to create file │
│  Archive: ✅ Available when all processed  │
└─────────────────────────────────────────────┘
```

### State 3: Archived
```
┌─────────────────────────────────────────────┐
│  📦 HISTORIQUE                              │
├─────────────────────────────────────────────┤
│  📞  10:00  Dupont Jean                     │
│            Consultation                     │
│                                             │
│  Status: [Confirmé]                         │
│  Archive: ✅ Persisted in database          │
└─────────────────────────────────────────────┘
```

## Data Flow Diagram

```
┌─────────────┐
│   User      │
│  Creates    │
│ Appointment │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────┐
│  Frontend: NewRendezVousModal   │
│  Collects: nom, prenom, date... │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  API: POST /api/rendez-vous     │
│  Body: { ...appointment data }  │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  Database: INSERT INTO          │
│  rendez_vous (archived = 0)     │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  UI: Shows in main list         │
│  Status: "en attente"           │
└─────────────────────────────────┘
       │
       │ User confirms/rejects
       ▼
┌─────────────────────────────────┐
│  Status: "confirmé" or "annulé" │
│  Still in main list (not yet    │
│  archived)                      │
└─────────────────────────────────┘
       │
       │ User clicks "Archiver"
       ▼
┌─────────────────────────────────┐
│  API: PATCH /archive-by-date    │
│  Body: { "date": "2026-04-26" } │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  Database: UPDATE rendez_vous   │
│  SET archived = 1               │
│  WHERE date = '2026-04-26'      │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  UI: Moves to Historique        │
│  Removed from main list         │
└─────────────────────────────────┘
       │
       │ User refreshes page (F5)
       ▼
┌─────────────────────────────────┐
│  API: GET /api/rendez-vous      │
│  Returns: WHERE archived = 0    │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  UI: Archived appointments      │
│  stay in Historique ✅          │
└─────────────────────────────────┘
```

## Archive Button Logic

```
┌─────────────────────────────────────────┐
│  Date: 2026-04-26                       │
│  Appointments:                          │
│    - 10:00 Dupont (en attente)          │
│    - 14:00 Martin (confirmé)            │
│                                         │
│  Archive Button: ❌ NOT SHOWN           │
│  Reason: Has pending appointment        │
└─────────────────────────────────────────┘

         User confirms Dupont
                 ↓

┌─────────────────────────────────────────┐
│  Date: 2026-04-26                       │
│  Appointments:                          │
│    - 10:00 Dupont (confirmé)            │
│    - 14:00 Martin (confirmé)            │
│                                         │
│  Archive Button: ✅ SHOWN               │
│  Reason: All appointments processed     │
└─────────────────────────────────────────┘

         User clicks "Archiver"
                 ↓

┌─────────────────────────────────────────┐
│  Date: 2026-04-26                       │
│  Status: ARCHIVED                       │
│                                         │
│  Main List: ❌ Not shown                │
│  Historique: ✅ Shown                   │
│  Database: archived = 1                 │
└─────────────────────────────────────────┘
```

## Database States

### Before Archive
```sql
sqlite> SELECT id, patient_nom, date, statut, archived FROM rendez_vous;

┌──────┬──────────────┬────────────┬──────────┬──────────┐
│  id  │ patient_nom  │    date    │  statut  │ archived │
├──────┼──────────────┼────────────┼──────────┼──────────┤
│  1   │ Dupont Jean  │ 2026-04-26 │ confirmé │    0     │
│  2   │ Martin Sophie│ 2026-04-26 │ confirmé │    0     │
│  3   │ Bernard Paul │ 2026-04-27 │ confirmé │    0     │
└──────┴──────────────┴────────────┴──────────┴──────────┘
```

### After Archive (2026-04-26)
```sql
sqlite> SELECT id, patient_nom, date, statut, archived FROM rendez_vous;

┌──────┬──────────────┬────────────┬──────────┬──────────┐
│  id  │ patient_nom  │    date    │  statut  │ archived │
├──────┼──────────────┼────────────┼──────────┼──────────┤
│  1   │ Dupont Jean  │ 2026-04-26 │ confirmé │    1     │ ← Archived
│  2   │ Martin Sophie│ 2026-04-26 │ confirmé │    1     │ ← Archived
│  3   │ Bernard Paul │ 2026-04-27 │ confirmé │    0     │ ← Still active
└──────┴──────────────┴────────────┴──────────┴──────────┘
```

## API Responses

### GET /api/rendez-vous (Active Only)
```json
[
  {
    "id": "3",
    "patientNom": "Bernard Paul",
    "date": "2026-04-27",
    "statut": "confirmé",
    "archived": false
  }
]
```
Note: IDs 1 and 2 are NOT returned (archived = 1)

### PATCH /api/rendez-vous/archive-by-date
```json
Request:
{
  "date": "2026-04-26"
}

Response:
{
  "message": "Appointments archived successfully",
  "count": 2
}
```

## User Journey

```
1. Morning: Create appointments
   ┌─────────────────────────┐
   │ Today (2026-04-26)      │
   │ • 10:00 Dupont (pending)│
   │ • 14:00 Martin (pending)│
   └─────────────────────────┘

2. During day: Process appointments
   ┌─────────────────────────┐
   │ Today (2026-04-26)      │
   │ • 10:00 Dupont ✅       │
   │ • 14:00 Martin ✅       │
   │                         │
   │ [Archiver] ← Available  │
   └─────────────────────────┘

3. End of day: Archive
   ┌─────────────────────────┐
   │ No active appointments  │
   │                         │
   │ [Historique (2)] ← View │
   └─────────────────────────┘

4. Next day: Clean slate
   ┌─────────────────────────┐
   │ Tomorrow (2026-04-27)   │
   │ • 09:00 Bernard (pending)│
   │                         │
   │ Yesterday archived ✅   │
   └─────────────────────────┘
```

## Color Coding

```
Status Colors:
┌────────────────────────────────┐
│ [En attente]  ← Yellow/Warning │
│ [Confirmé]    ← Green/Success  │
│ [Annulé]      ← Red/Destructive│
└────────────────────────────────┘

UI Elements:
┌────────────────────────────────┐
│ 📞 Phone icon (clickable)      │
│ 📅 Calendar icon               │
│ 📦 Archive icon                │
│ 🗑️ Delete icon                 │
│ ➕ Add icon                     │
└────────────────────────────────┘
```

## Mobile View

```
┌──────────────────────┐
│ Rendez-vous          │
│ 5 actifs • 12 archivés│
│                      │
│ [📦 Hist] [+ RDV]   │
├──────────────────────┤
│ 📅 Aujourd'hui       │
│ [+ Ajouter]          │
├──────────────────────┤
│ 📞 10:00 Dupont      │
│    Consultation      │
│    [En attente] 🗑️  │
├──────────────────────┤
│ 📞 14:00 Martin      │
│    Détartrage        │
│    [Confirmé]   🗑️  │
└──────────────────────┘
```

## Success Indicators

### ✅ Working Correctly When:
- Archive button appears after all appointments processed
- Clicking archive moves appointments to Historique
- Page refresh keeps archived appointments in Historique
- Database shows archived = 1
- Main list only shows active appointments
- Historique button shows count: "Historique (12)"

### ❌ Problem Indicators:
- Archived appointments reappear in main list after refresh
- Archive button doesn't appear when it should
- Historique section is empty
- Database shows archived = 0 for archived appointments

## Status: ✅ All Visual Elements Implemented

The UI is clean, intuitive, and fully functional with database persistence.
