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
