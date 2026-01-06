SafeSpeak™ — Student Reporting Web
📘 Overview

SafeSpeak™ is a digital child-safety platform designed to help students report bullying, harassment, or emotional distress in a private, anonymous, and secure way.
This repository contains the Student Reporting Web Portal, which allows users (students) to safely submit reports that sync directly to a Firebase database for review by the school admin/counselor dashboard.

🧠 Key Features

🔒 Anonymous Reporting — Students can submit without revealing identity.

💬 Multiple Input Modes — Supports text and voice input.

📡 Firebase Integration — Real-time database updates for admin access.

🧾 Auto Timestamp + Category — Each report is tagged with issue type and submission time.

🌙 Child-Friendly UI — Calming colors, motivational text, and minimal clicks.

🧩 Offline Compatibility (optional) — Reports saved locally if internet fails.

🧰 Tech Stack
Layer	Technology
Frontend	React + TypeScript
Backend	Firebase Realtime Database
Hosting	Render / Netlify
Styling	Tailwind CSS
Security	AES Encryption + Firebase Auth (optional)
⚙️ Installation & Setup

Clone the repository

git clone https://github.com/your-username/safespeak-reporting.git
cd safespeak-reporting


Install dependencies-

npm install


Add Firebase configuration
Create a .env file with:

VITE_API_KEY=your_firebase_api_key
VITE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_DATABASE_URL=https://your_project_id-default-rtdb.asia-southeast1.firebasedatabase.app
VITE_PROJECT_ID=your_project_id


# AI & Mobile configuration

**Local Demo AI (default)**

The web app now uses a built-in, rule-based analyzer by default and **does not require a Python AI backend**. No extra services are required to get teacher/bully detection and basic risk routing working.

If you need a hosted AI service later, you may optionally set `VITE_AI_API_URL` in your `.env` and implement an AI server that exposes an analysis endpoint; this is not necessary for normal operation.

## Mobile / APK notes

- Web Speech API (browser-based) is used by default for voice input but is not reliably supported in WebViews or packaged APKs.
- For an Android APK use Capacitor or Cordova and integrate a native speech plugin (e.g., `@capacitor-community/speech-recognition` or `cordova-plugin-speechrecognition`) or record audio and send to a server-side STT (Google/AssemblyAI/VOSK). The repository no longer contains a maintained Python-based STT server.

### Capacitor integration (recommended for Android APK)

1. Install Capacitor (if not already):

   npm install @capacitor/core @capacitor/cli --save
   npx cap init

2. Add Android platform:

   npx cap add android

3. Install the community speech plugin and sync:

   npm install @capacitor-community/speech-recognition
   npx cap sync

4. Add permission to Android manifest (`android/app/src/main/AndroidManifest.xml`):

   <uses-permission android:name="android.permission.RECORD_AUDIO" />

5. JS usage: the app already has a generalized native integration in `src/lib/speech.ts`. At runtime the app will detect Capacitor and route start/stop events through the plugin. Ensure you call `requestPermission()` or accept the permission prompt when the app asks.

6. Build & test on device:

   npx cap open android
   // Build/run from Android Studio on a device with microphone

### Privacy & permission notes

- The app will request microphone permission on first use.
- For sensitive data, prefer on-device or private STT (consider legal/privacy implications if audio is uploaded to third-party services).

Run the project

npm run dev


Deploy (optional)

Use Render, Vercel, or Netlify to host the web app.

Connect your GitHub repo and deploy the build folder (npm run build).

🧾 How It Works

The student opens the SafeSpeak Reporting Page.

They select the issue type — e.g., Bullying, Stress, Abuse, Cyber Issue, or Other.

The student submits the report (text or voice).

The system stores it in Firebase under /reports/{timestamp}.

The Admin Dashboard fetches and categorizes all reports for counselor review.

🧮 Data Format Example
{
  "reports": {
    "1731009052641": {
      "category": "Bullying",
      "description": "Someone keeps teasing me in class",
      "timestamp": "2025-11-05T09:00:52Z",
      "status": "Pending",
      "anonymous": true
    }
  }
}

🧩 Future Enhancements

🧠 AI Emotion Detection

📈 Report Analytics Dashboard

🗣️ Multi-Language Voice Input (Malayalam, English, Hindi)

📱 PWA App Version

🔔 Realtime Notifications for Counselors

🤝 Contributors

Vaishnavi (Dark) — Lead Developer & Project Founder

Catalyst Research Industries — Innovation Partner

🏫 Purpose

Developed for SafeSpeak™, an initiative promoting student safety, emotional health, and digital ethics in schools.
Built for MGM Model School, Varkala, under the CBSE Innovation Framework 2025. 
