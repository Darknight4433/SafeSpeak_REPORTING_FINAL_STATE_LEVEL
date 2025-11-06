# Firebase Setup Instructions

## IMPORTANT: You need to set up your own Firebase project

The current Firebase configuration uses placeholder credentials. To make the app work, you need to:

1. **Create a Firebase Project**:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Add project" or select existing project
   - Follow the setup wizard

2. **Enable Realtime Database**:
   - In Firebase Console, go to "Realtime Database"
   - Click "Create Database"
   - Choose "Start in test mode" (you'll secure it later)
   - Select a location (e.g., asia-southeast1)

3. **Enable Authentication**:
   - Go to "Authentication" > "Sign-in method"
   - Enable "Email/Password" authentication

4. **Get Your Firebase Config**:
   - Go to Project Settings (gear icon)
   - Scroll to "Your apps" section
   - Click the web icon (</>)
   - Register your app
   - Copy the firebaseConfig object

5. **Update `src/lib/firebase.ts`**:
   Replace the placeholder config with your actual Firebase config:
   ```typescript
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
     databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.REGION.firebasedatabase.app",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_PROJECT_ID.appspot.com",
     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
     appId: "YOUR_APP_ID"
   };
   ```

6. **Set up Firebase Security Rules**:
   
   **Realtime Database Rules** (for production):
   ```json
   {
     "rules": {
       "reports": {
         ".write": true,
         ".read": "auth != null"
       },
       "reportCounter": {
         ".write": true,
         ".read": true
       }
     }
   }
   ```

   **Authentication** - Create an admin user:
   - Go to Authentication > Users
   - Click "Add user"
   - Enter admin email and password
   - Use these credentials to log into the admin dashboard

## Features

- **Anonymous Reporting**: Sequential report numbering (no1, no2, no3...)
- **Admin Dashboard**: Real-time report monitoring
- **Secure**: 256-bit encryption messaging
- **Child-Friendly**: Simple, safe interface

## Database Structure

```
/
├── reports/
│   ├── {firebase-generated-id}/
│   │   ├── reportId: "no1"
│   │   ├── reportNumber: 1
│   │   ├── category: "bullying"
│   │   ├── description: "..."
│   │   ├── isAnonymous: true
│   │   ├── timestamp: 1234567890
│   │   └── status: "pending"
└── reportCounter: 56
```

## Troubleshooting

- **Data not saving**: Check Firebase config and database rules
- **Login not working**: Verify Authentication is enabled and user exists
- **Connection errors**: Ensure databaseURL matches your Firebase project region
