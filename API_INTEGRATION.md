# API Integration Guide

## Overview

The frontend is now connected to the live backend API running at `http://localhost:3000`.

## What's Been Integrated

### Categories Management ✅

The categories system is fully integrated with the backend API:

- **Fetch Categories**: On app load, categories are fetched from `GET /api/categories`
- **Create Category**: When adding a new category, data is sent via `POST /api/categories`
- **Update Category**: Category updates are sent via `PUT /api/categories/:id`
- **Delete Category**: Category deletion is handled via `DELETE /api/categories/:id`

### Key Files Modified

1. **src/lib/api.ts** (NEW)
   - API service layer with fetch wrappers
   - Category API functions (getAll, create, update, delete)
   - Placeholder functions for patients and appointments (to be implemented)

2. **src/lib/data-context.tsx**
   - Updated to fetch categories from API on mount
   - Category operations now use async/await
   - Local state is updated after successful API calls

3. **src/components/modals/NewCategoryModal.tsx**
   - Updated to handle async category creation
   - Shows loading state during submission

4. **src/components/modals/ManageCategoryModal.tsx**
   - Updated to handle async category updates
   - Shows loading state during submission

5. **src/routes/configurations.categories.tsx**
   - Updated to handle async operations
   - Shows loading state while fetching categories
   - Proper error handling with user feedback

6. **src/components/ActesModule.tsx**
   - Updated delete operations to be async

## How It Works

### Data Flow

1. **App Initialization**:
   ```
   App Loads → DataProvider fetches categories → Updates state → UI renders
   ```

2. **Creating a Category**:
   ```
   User fills form → Clicks "Ajouter" → POST to API → Success → Update local state → Close modal
   ```

3. **Updating a Category**:
   ```
   User edits category → Clicks "Mettre à jour" → PUT to API → Success → Update local state → Close modal
   ```

4. **Deleting a Category**:
   ```
   User clicks delete → Confirms → DELETE to API → Success → Remove from local state
   ```

### Hierarchical Data Structure

The API properly handles the hierarchical relationship:
- **Category** (e.g., "Chirurgie")
  - **Category Types** (e.g., "Extraction simple", "Implant")
    - **Type Steps** (e.g., "Consultation", "Radiographie", "Extraction")

## UI Features Preserved

✅ Teal/Burgundy theme maintained
✅ "Ajouter catégorie" button present and functional
✅ All modals work as before
✅ Responsive design intact
✅ Loading states added for better UX
✅ Error handling with user feedback

## Testing the Integration

1. **Start the backend**:
   ```bash
   cd api
   npm start
   ```

2. **Start the frontend**:
   ```bash
   npm run dev
   ```

3. **Test operations**:
   - Navigate to "Configurations" → "Catégories"
   - Try creating a new category
   - Try editing an existing category
   - Try deleting a category
   - Check the browser console for API calls
   - Check the backend terminal for request logs

## Next Steps (To Be Implemented)

### Patients API Integration
- Create backend routes for patients (GET, POST, PUT, DELETE)
- Update `src/lib/api.ts` with patient functions
- Update `src/lib/data-context.tsx` to use patient API

### Appointments API Integration
- Create backend routes for appointments (GET, POST, PUT, DELETE)
- Update `src/lib/api.ts` with appointment functions
- Update `src/lib/data-context.tsx` to use appointment API

### Actes API Integration
- Create backend routes for actes (GET, POST, PUT, DELETE)
- Update `src/lib/api.ts` with actes functions
- Update `src/lib/data-context.tsx` to use actes API

## Error Handling

The integration includes proper error handling:
- Network errors are caught and logged
- User-friendly error messages are displayed
- Failed operations don't break the UI
- Loading states prevent duplicate submissions

## LocalStorage Removed

All localStorage operations for categories have been removed. The app now relies entirely on the backend API for data persistence.
