# 🧪 Test CASCADE Delete Fix

## Quick Test

### Step 1: Clean Up Orphaned Data

```bash
cd api
node cleanup-orphaned-data.js
```

**Expected Output:**
```
🧹 Cleaning up orphaned data...
✓ Foreign keys enabled
📊 Found X orphaned category types
📊 Found Y orphaned type steps
🗑️  Deleting orphaned data...
✅ Cleanup complete!
```

### Step 2: Restart Backend

```bash
cd api
npm start
```

Look for this in the logs:
```
🚀 Server running on http://localhost:3000
```

### Step 3: Create Test Category

1. Go to "Configurations" → "Catégories"
2. Click "Nouvelle Catégorie"
3. Create a category named "Test CASCADE"
4. Click edit button
5. Add a type: "Test Type"
6. Add steps: "Step 1", "Step 2"
7. Save

### Step 4: Verify Data in Database

```bash
cd api
sqlite3 dental-clinic.db

-- Find your test category ID
SELECT id, name FROM categories WHERE name = 'Test CASCADE';
-- Note the ID (e.g., "7")

-- Check types exist
SELECT * FROM category_types WHERE category_id = '7';
-- Should show "Test Type"

-- Check steps exist
SELECT * FROM type_steps WHERE type_id LIKE '7-%';
-- Should show "Step 1" and "Step 2"

.quit
```

### Step 5: Delete the Category

1. Go back to "Catégories" page
2. Click delete button on "Test CASCADE"
3. Confirm deletion
4. ✅ Category disappears from list

### Step 6: Verify CASCADE Worked

```bash
cd api
sqlite3 dental-clinic.db

-- Check category is gone
SELECT * FROM categories WHERE name = 'Test CASCADE';
-- Should return 0 rows ✅

-- Check types are gone (CASCADE)
SELECT * FROM category_types WHERE category_id = '7';
-- Should return 0 rows ✅

-- Check steps are gone (CASCADE)
SELECT * FROM type_steps WHERE type_id LIKE '7-%';
-- Should return 0 rows ✅

.quit
```

### Step 7: Verify No Orphaned Data

```bash
cd api
node cleanup-orphaned-data.js
```

**Expected Output:**
```
✅ No orphaned data found! Database is clean.
```

## Visual Test

### Before Fix (BUG):
```
1. Delete "Chirurgie" category
2. Types remain in database ❌
3. Open "Orthodontie" category
4. See "Extraction simple" type ❌ (wrong category!)
5. Data corruption ❌
```

### After Fix (WORKING):
```
1. Delete "Test CASCADE" category
2. Types deleted automatically ✅
3. Steps deleted automatically ✅
4. Open any other category
5. Only correct types shown ✅
6. No data corruption ✅
```

## Verify Foreign Keys Enabled

```bash
cd api
sqlite3 dental-clinic.db

PRAGMA foreign_keys;
-- Should return: 1 ✅

.quit
```

If it returns 0, foreign keys are NOT enabled (bug not fixed).

## Test with API

```bash
# Create test category
curl -X POST http://localhost:3000/api/categories \
  -H "Content-Type: application/json" \
  -d '{
    "id": "test-999",
    "name": "API Test",
    "icon": "Test",
    "color": "#FF0000",
    "types": [
      {
        "id": "test-999-t1",
        "name": "Test Type",
        "steps": [
          {"id": "test-999-s1", "name": "Test Step", "order": 1}
        ]
      }
    ],
    "stages": []
  }'

# Verify created
sqlite3 dental-clinic.db "SELECT COUNT(*) FROM category_types WHERE category_id = 'test-999';"
# Should return: 1

# Delete category
curl -X DELETE http://localhost:3000/api/categories/test-999

# Verify CASCADE worked
sqlite3 dental-clinic.db "SELECT COUNT(*) FROM category_types WHERE category_id = 'test-999';"
# Should return: 0 ✅
```

## Troubleshooting

**Types not deleting?**
- Check foreign keys: `PRAGMA foreign_keys;` should return 1
- Restart backend server
- Run cleanup script

**Orphaned data still exists?**
- Run: `node api/cleanup-orphaned-data.js`
- Restart backend
- Try deleting again

**Error when deleting?**
- Check backend logs
- Verify category exists
- Check database permissions

## Success Checklist

- [ ] Run cleanup script
- [ ] Restart backend
- [ ] Create test category with types and steps
- [ ] Delete test category
- [ ] Verify types deleted (0 rows in database)
- [ ] Verify steps deleted (0 rows in database)
- [ ] Run cleanup script again (should find 0 orphaned)
- [ ] No orphaned types appear in other categories

If all checkboxes pass, CASCADE is working correctly!
