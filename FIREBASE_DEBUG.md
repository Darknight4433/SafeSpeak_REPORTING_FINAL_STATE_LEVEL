# Firebase Upload Not Working - Quick Diagnosis

## Step 1: Check Browser Console

1. Open http://localhost:8080/report
2. Press F12 → Console tab
3. Submit a report
4. Look for these messages:

### If you see:
```
🔄 Attempting push to reports...
❌ push reports failed: {
  code: "PERMISSION_DENIED",
  message: "Permission denied"
}
```
**→ Go to Step 2 (Fix Firebase Rules)**

### If you see:
```
🔄 Attempting push to reports...
(nothing else)
```
**→ Check your internet connection**

### If you see:
```
Firebase: Error (auth/...)
```
**→ Authentication issue (but shouldn't be needed for this app)**

---

## Step 2: Fix Firebase Database Rules

**Most Common Issue**: Firebase Realtime Database rules are blocking writes.

### How to Fix:

1. Go to https://console.firebase.google.com/
2. Select your project: **safespeak-6c554**
3. Click **Realtime Database** in left menu
4. Click **Rules** tab
5. Replace with this:

```json
{
  "rules": {
    "reports": {
      ".write": true,
      ".read": true
    },
    "higher_authority_reports": {
      ".write": true,
      ".read": true
    },
    "report_counter": {
      ".write": true,
      ".read": true
    }
  }
}
```

6. Click **Publish**

---

## Step 3: Test Again

1. Go back to http://localhost:8080/report
2. Fill out the form:
   - Description: "tr harassed me very badly"
   - Name: "Test Student"
   - School: "Test School"
   - Class: "8A"
3. Submit
4. Check console for ✅ success messages

---

## Step 4: Verify in Firebase Console

1. Go to Firebase Console → Realtime Database
2. Click **Data** tab
3. You should see:
   ```
   safespeak-6c554-default-rtdb
   ├── reports
   │   └── -NxYz123abc (your report)
   └── higher_authority_reports
       └── -NxYz456def (escalated copy)
   ```

---

## What to Report Back

Please tell me:
1. **What error message** did you see in console? (copy/paste it)
2. **Did you update Firebase Rules?** (yes/no)
3. **Do you see the report in Firebase Console?** (yes/no)

---

## Quick Firebase Rules Check

Your current Firebase project:
- **Project ID**: safespeak-6c554
- **Database URL**: https://safespeak-6c554-default-rtdb.asia-southeast1.firebasedatabase.app
- **Region**: asia-southeast1

If rules are the issue, you'll see `PERMISSION_DENIED` in console.
