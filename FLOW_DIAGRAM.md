# SafeSpeak Report Flow - Fixed Version

## Teacher Detection Flow

```
User types: "tr harassed me very badly"
                    ↓
┌─────────────────────────────────────────────────────────┐
│  Step 1: Client-Side Keyword Detection (utils.ts)      │
│  ────────────────────────────────────────────────       │
│  • Regex: /\b(teacher|tr|mr|ms|...)\b/gi               │
│  • Found: "tr" at position 0                            │
│  • Context window: 80 chars around "tr"                 │
│  • Search for harmful verbs: ["harass", "beat", ...]    │
│  • Found: "harassed" in window                          │
│  • Result: ✅ teacher_involved                          │
└─────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────┐
│  Step 2: UI Updates                                     │
│  ────────────────────────────────────────────────       │
│  • Yellow banner appears:                               │
│    "Teacher/Staff reference detected"                   │
│  • Live AI shows: "High — immediate attention"          │
│  • Form requires: Name, School, Class                   │
└─────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────┐
│  Step 3: AI Analysis (if Demo AI enabled)              │
│  ────────────────────────────────────────────────       │
│  • analyzeReportDemo() in safeSpeakAI.ts                │
│  • Checks: /\b(teacher|tr|...)\b/                       │
│  • Returns: risk_level = "L3"                           │
│  • Returns: route_to = "higher_authority"               │
└─────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────┐
│  Step 4: Form Submission                                │
│  ────────────────────────────────────────────────       │
│  • User fills: Name, School, Class                      │
│  • Clicks "Submit Report Safely"                        │
│  • isAnonymous = false (required for escalation)        │
└─────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────┐
│  Step 5: Firebase Push (with enhanced logging)         │
│  ────────────────────────────────────────────────       │
│  Console: 🔄 Attempting push to reports...              │
│  Console: ✅ push reports succeeded [key-123]           │
│                                                          │
│  Console: 🔄 Attempting push to higher_authority...     │
│  Console: ✅ push higher_authority succeeded [key-456]  │
└─────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────┐
│  Step 6: Success!                                       │
│  ────────────────────────────────────────────────       │
│  • Toast: "Report submitted successfully!"              │
│  • Toast: "Report automatically escalated to            │
│           Higher Authority for immediate review."       │
│  • Form resets after 500ms                              │
└─────────────────────────────────────────────────────────┘
```

## Before vs After Comparison

### BEFORE (Broken)
```
Input: "tr harassed me very badly"
       ↓
Regex: /by\s+(my\s+)?(teacher|tr|...)/
       ↓
Result: ❌ NO MATCH (no "by" prefix)
       ↓
No teacher detection
No escalation
Regular report
```

### AFTER (Fixed)
```
Input: "tr harassed me very badly"
       ↓
Regex: /\b(teacher|tr|...)\b/gi
       ↓
Found: "tr" ✅
       ↓
Check context window (80 chars)
       ↓
Found harmful verb: "harassed" ✅
       ↓
Result: teacher_involved
       ↓
Yellow banner shown
Requires name/school/class
Escalates to higher_authority_reports
```

## Demo AI vs Real AI

### Demo AI (Client-Side)
```
┌──────────────────────────┐
│  Browser (JavaScript)    │
│  ──────────────────────  │
│  • No server needed      │
│  • Rule-based detection  │
│  • Instant results       │
│  • Good for testing      │
│  • Limited accuracy      │
└──────────────────────────┘
```

### Real AI (Server-Side)
```
┌──────────────────────────┐     HTTP POST      ┌──────────────────────────┐
│  Browser (JavaScript)    │ ─────────────────→ │  Python Backend          │
│  ──────────────────────  │                     │  ──────────────────────  │
│  • Sends text to server  │                     │  • BART-Large model      │
│  • Waits for response    │                     │  • Zero-shot learning    │
│  • Shows AI results      │ ←───────────────── │  • High accuracy         │
└──────────────────────────┘     JSON Response   └──────────────────────────┘
                                                  • Requires: uvicorn server
                                                  • Port: 8000
```

## Firebase Data Structure

```
safespeak-6c554 (Firebase Project)
│
├── reports/
│   ├── -NxYz123abc/
│   │   ├── reportId: "SS-0001"
│   │   ├── category: "bullying"
│   │   ├── description: "tr harassed me very badly"
│   │   ├── name: "Test Student"
│   │   ├── location: "MGM Model School"
│   │   ├── classroom: "8A"
│   │   ├── status: "escalated"
│   │   ├── riskLevel: "L3"
│   │   ├── timestamp: 1234567890
│   │   └── override: {
│   │         type: "keyword",
│   │         patternId: "teacher_involved",
│   │         reason: "Teacher/staff implicated"
│   │       }
│   │
│   └── -NxYz456def/
│       └── ... (another report)
│
└── higher_authority_reports/
    └── -NxYz789ghi/
        ├── (same fields as above)
        └── escalationMeta: {
              escalated_by: "teacher_keyword",
              escalated_reason: "teacher_involved",
              original_report_key: "-NxYz123abc",
              timestamp: 1234567890
            }
```

## Console Output Example

### Successful Submission
```
🔄 Attempting push to reports...
{
  payload: {
    reportId: "SS-0001",
    description: "tr harassed me very badly",
    category: "bullying",
    ...
  }
}
✅ push reports succeeded -NxYz123abc

🔄 Attempting push to higher_authority_reports...
✅ push higher_authority_reports succeeded -NxYz789ghi

Report submitted successfully to reports/ -NxYz123abc
Escalated to higher_authority_reports { escalated_by: "teacher_keyword", ... } -NxYz789ghi
```

### Failed Submission (Example)
```
🔄 Attempting push to reports...
❌ push reports failed: {
  code: "PERMISSION_DENIED",
  message: "Permission denied",
  fullError: FirebaseError {...},
  stack: "Error: Permission denied\n  at ..."
}

Failed to save report: Permission denied
Report saved locally and will retry automatically when connection is restored.
```

## Testing Checklist

- [ ] Server running at http://localhost:8080
- [ ] Browser DevTools Console open (F12)
- [ ] Type "tr harassed me very badly" in description
- [ ] Yellow "Teacher/Staff reference detected" banner appears
- [ ] "Demo AI" checkbox is visible
- [ ] "Check AI Now" button is visible
- [ ] Fill in Name, School, Class fields
- [ ] Click "Submit Report Safely"
- [ ] See 🔄 console logs
- [ ] See ✅ success messages
- [ ] Check Firebase Console for saved reports
- [ ] Verify report appears in both:
  - reports/
  - higher_authority_reports/
