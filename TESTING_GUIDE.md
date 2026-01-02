# SafeSpeak Testing Guide

## Issues Fixed

### 1. Teacher Detection Not Working ✅
**Problem**: "tr harassed me very badly" wasn't being detected as teacher involvement

**Fix Applied**:
- Updated `src/lib/utils.ts` to detect "tr" as a teacher abbreviation
- Removed the strict "by" requirement from the regex pattern
- Expanded the context window from 50 to 80 characters
- Added more harmful verbs including "harass", "harassed", "slap", "kick"
- Made regex case-insensitive with `/gi` flag
- Updated Python backend (`safespeak-ai/intent_model.py`) with matching logic

**Test Cases**:
1. "tr harassed me very badly" → Should detect teacher_involved ✅
2. "my teacher hit me" → Should detect teacher_involved ✅
3. "teacher helped me" → Should detect teacher_protector (non-escalating) ✅
4. "the teacher is nice" → Should detect teacher_mentioned (neutral) ✅

### 2. Demo AI Toggle Removed ✅
**Problem**: The "Enable Demo AI" toggle was hidden, making it hard to test without backend

**Fix Applied**:
- Restored the Demo AI checkbox in `src/pages/Report.tsx` (line ~1135)
- Restored the "Check AI Now" button for manual testing
- Both controls are now visible in the description section

**How to Use**:
1. Check the "Demo AI" checkbox to use client-side rule-based AI
2. Click "Check AI Now" to manually trigger AI analysis
3. Useful when Python backend isn't running

### 3. Enhanced Firebase Debugging ✅
**Problem**: Reports not saving to Firebase, but errors were unclear

**Fix Applied**:
- Added detailed console logging with emojis for easy scanning:
  - 🔄 = Attempting push
  - ✅ = Success
  - ❌ = Failure
- Logs now include:
  - Full payload being sent
  - Error codes
  - Error messages
  - Stack traces
- Better error messages shown to users

## Testing Instructions

### Step 1: Test Teacher Detection (Frontend Only)

1. Open the app in your browser
2. Navigate to the Report page
3. Enable "Demo AI" checkbox (bottom of description field)
4. Type in the description field: **"tr harassed me very badly"**
5. Watch for the yellow banner that says "Teacher/Staff reference detected"
6. The Live AI section should show "High — immediate attention recommended"

### Step 2: Test Firebase Submission

1. Fill out a complete report:
   - Category: Bullying / Harassment
   - Intensity: High
   - Description: "tr harassed me very badly"
   - Name: "Test Student"
   - Location: "MGM Model School"
   - Class: "8A"

2. Open Browser DevTools (F12) → Console tab

3. Click "Submit Report Safely"

4. Watch the console for:
   ```
   🔄 Attempting push to reports...
   ✅ push reports succeeded [some-key]
   🔄 Attempting push to higher_authority_reports...
   ✅ push higher_authority_reports succeeded [some-key]
   ```

5. If you see ❌ errors, check:
   - Firebase configuration in `src/lib/firebase.ts`
   - Firebase Realtime Database rules
   - Network connectivity
   - Browser console for detailed error info

### Step 3: Test AI Backend (Optional)

If you want to test with the real AI backend:

1. Start the Python backend:
   ```bash
   cd safespeak-ai
   python -m uvicorn api:app --reload --port 8000
   ```

2. Uncheck "Demo AI" in the UI

3. Type a description (at least 20 characters)

4. Watch for "Live AI: analyzing..." to change to a risk level

5. Check browser console for:
   ```
   🧠 Sending to SafeSpeak AI...
   ✅ AI Analysis Complete: {risk_level: "L3", ...}
   ```

## Common Issues & Solutions

### Issue: "Teacher/staff reference detected" banner doesn't appear

**Solution**:
- Make sure you're typing "tr" or "teacher" with a harmful verb nearby
- Try: "tr hit me", "teacher harassed me", "my tr beat me"
- Check browser console for keyword detection logs

### Issue: Reports not saving to Firebase

**Check**:
1. Open browser console (F12)
2. Look for ❌ error messages
3. Common errors:
   - `PERMISSION_DENIED`: Check Firebase Database Rules
   - `Network error`: Check internet connection
   - `Firebase not initialized`: Check `src/lib/firebase.ts` config

**Firebase Rules** should allow writes:
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
    }
  }
}
```

### Issue: AI not analyzing

**If using Demo AI**:
- Make sure "Demo AI" checkbox is checked
- Type at least 10 characters
- Click "Check AI Now" button

**If using Real AI Backend**:
- Make sure Python server is running on port 8000
- Check `VITE_AI_API_URL` environment variable
- Look for network errors in browser console

## Verification Checklist

- [ ] "tr harassed me very badly" shows yellow teacher detection banner
- [ ] Demo AI toggle is visible and functional
- [ ] "Check AI Now" button is visible and functional
- [ ] Console shows detailed Firebase push logs with 🔄 ✅ ❌ emojis
- [ ] Reports successfully save to Firebase (check Firebase Console)
- [ ] Teacher reports escalate to `higher_authority_reports` node
- [ ] Error messages are clear and actionable

## Next Steps

1. **Test the fixes** using the instructions above
2. **Check Firebase Console** to verify reports are being saved
3. **Review console logs** for any remaining errors
4. **Report back** with:
   - What you typed in the description
   - Whether the teacher banner appeared
   - Whether Demo AI was enabled
   - Any console errors you see
   - Whether the report saved to Firebase

## Files Changed

1. `src/lib/utils.ts` - Enhanced teacher detection
2. `safespeak-ai/intent_model.py` - Enhanced teacher detection (backend)
3. `src/pages/Report.tsx` - Restored Demo AI toggle, enhanced logging
