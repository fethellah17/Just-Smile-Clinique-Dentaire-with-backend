# Quick Troubleshooting Guide

## 🚀 Quick Start (Clean Restart)

### Windows
```bash
# Double-click or run:
restart-all.bat
```

### Linux/Mac
```bash
chmod +x restart-all.sh
./restart-all.sh
```

## ⚡ Common Issues & Instant Fixes

### Issue: "Something went wrong" or "Erreur"

**Quick Fix:**
1. Close SQLite Studio (if open)
2. Run restart script
3. Wait 5 seconds
4. Try again

**Why:** Database was locked or old code was cached

---

### Issue: "Backend server is offline"

**Quick Fix:**
```bash
cd api
npm start
```

**Check:** Open http://localhost:3000/health
- Should see: `{"status":"ok"}`

---

### Issue: Appointments not showing

**Quick Fix:**
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for red errors
4. Check Network tab for failed requests

**Common Causes:**
- API not running → Start API first
- Wrong port → Verify API is on port 3000
- Data format error → Check backend logs

---

### Issue: "Cannot read property 'length' of undefined"

**Status:** ✅ FIXED
- UI guards now prevent this
- If still occurs, hard refresh: Ctrl+Shift+R

---

### Issue: Database locked

**Status:** ✅ AUTO-RETRY ENABLED
- System will retry 3 times automatically
- If persists: Close SQLite Studio

---

## 🔍 Where to Look for Errors

### Backend Terminal (API)
Look for these logs:
```
🔍 RECEIVING DATA: {...}     ← What frontend sent
📝 Creating rendez-vous: ... ← What backend parsed
✅ Rendez-vous created: ...  ← Success
❌ Error creating: ...       ← Failure (read this!)
```

### Frontend Browser Console (F12)
Look for:
```
API Error [/rendez-vous]: ... ← Network error
Failed to add appointment: ... ← Frontend error
```

### Network Tab (F12 → Network)
- Click on failed request (red)
- Check "Response" tab for error message
- Check "Payload" tab for what was sent

---

## 🎯 Testing Connection

### 1. Test API Health
```bash
# Open in browser:
http://localhost:3000/health

# Or use curl:
curl http://localhost:3000/health
```

### 2. Test Frontend
1. Open http://localhost:5173
2. Click "Rendez-vous"
3. Click "Nouveau RDV"
4. Fill form
5. Submit
6. Watch both terminals for logs

---

## 🔧 Emergency Commands

### Kill All Node Processes
```bash
# Windows
taskkill /F /IM node.exe

# Linux/Mac
pkill -f node
```

### Check What's Using Port 3000
```bash
# Windows
netstat -ano | findstr :3000

# Linux/Mac
lsof -i :3000
```

### Reset Database
```bash
cd api
node init-db.js
```

---

## 📊 Verify Everything is Working

### Checklist:
- [ ] API running on port 3000
- [ ] Frontend running on port 5173
- [ ] http://localhost:3000/health returns OK
- [ ] SQLite Studio is closed
- [ ] Browser console has no red errors
- [ ] Can create new appointment

### If All Checked:
✅ System is working correctly!

### If Any Unchecked:
1. Run restart script
2. Wait 5 seconds
3. Check again

---

## 💡 Pro Tips

1. **Always start API before Frontend**
   - API needs to be ready first
   - Frontend will fail if API isn't running

2. **Close database viewers before testing**
   - SQLite Studio locks the database
   - Retry logic helps but better to close it

3. **Check both terminals**
   - Backend shows what it receives
   - Frontend shows what it sends
   - Compare them to find mismatches

4. **Use browser DevTools**
   - Network tab shows actual requests
   - Console shows JavaScript errors
   - Both are essential for debugging

5. **Hard refresh after code changes**
   - Ctrl+Shift+R (Windows/Linux)
   - Cmd+Shift+R (Mac)
   - Clears cached JavaScript

---

## 📞 Still Having Issues?

Collect this information:
1. Backend terminal output (last 20 lines)
2. Frontend console errors (screenshot)
3. Network tab failed request (Response + Payload)
4. What you were trying to do

Then check FRONTEND_BACKEND_DIAGNOSTIC.md for detailed debugging.
