# 🩸 RaktSetu (रक्तसेतु)

**A real-time, AI-assisted prototype to connect hospitals with blood donors during emergencies.**

Live Demo: https://rakt-setu-kappa.vercel.app/  
GitHub Repository: https://github.com/KumarNayan11/RaktSetu  

---

## 📌 About the Project

RaktSetu is a functional **prototype web application** designed to address a critical real-world challenge:  
**delay and misinformation in emergency blood procurement.**

Hospitals often rely on WhatsApp forwards, phone calls, or unverified social media posts to arrange blood donors, which can lead to confusion, delays, and fake requests.

RaktSetu demonstrates how **real-time systems, verified access, and AI assistance** can improve emergency response efficiency and trust.

⚠️ This project is a **prototype built for a hackathon** to demonstrate feasibility, architecture, and impact. Some features are intentionally scoped and listed as future enhancements.

---

## 🎯 Objectives

- Enable verified hospitals to raise urgent blood requests  
- Allow donors to instantly view requests without login friction  
- Reduce misinformation through authentication and trust  
- Use AI meaningfully to assist donors and hospitals  

---

## ✨ Key Features (Prototype Scope)

### ⚡ Real-Time Blood Request Feed
- Live feed powered by Firebase Firestore  
- Real-time updates using Firestore listeners  
- Displays blood group, hospital name, urgency, and timestamp  
- No login required for donors to view requests  

### 🏥 Verified Hospital Access
- Only authenticated hospitals can create blood requests  
- Prevents fake or misleading donation appeals  
- Each request originates from a verified source  

### 🤖 AI Assistance (Gemini-powered)
- RaktSahayak AI assists donors with:
  - Blood group compatibility  
  - Basic donation eligibility  
  - Post-donation guidance  
- AI-generated shareable emergency messages:
  - Optimized for WhatsApp and social platforms  
  - Available in English and Hindi  

### 📢 Smart Sharing
- One-click generation of formatted emergency messages  
- Helps hospitals reach the community without spreading misinformation  

---

## 🏗️ System Architecture (Prototype)

### Architecture Overview

1. Client Layer  
   - Next.js web application  
   - Public donor feed (no authentication)  
   - Hospital dashboard (authenticated)  

2. Application Layer  
   - Next.js App Router  
   - Server Actions / API routes  
   - Zod-based input validation  

3. Data Layer  
   - Firebase Firestore  
   - Real-time data synchronization  

4. Authentication Layer  
   - Firebase Authentication  
   - Restricts request creation to hospitals  

5. AI Layer  
   - Firebase Genkit for AI flow orchestration  
   - Google Gemini API for chatbot and content generation  

6. Deployment  
   - Hosted on Vercel  

---

## 🛠️ Tech Stack

### Frontend
- Next.js 15 (App Router)  
- Tailwind CSS  
- shadcn/ui  
- Framer Motion  

### Backend & Infrastructure
- Firebase Firestore  
- Firebase Authentication  
- Firebase Genkit  

### AI
- Google Gemini API  

### Tooling
- Zod (validation)  
- Lucide React (icons)  

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+  
- Firebase / Google Cloud project  
- Gemini API access  

### Installation
git clone https://github.com/KumarNayan11/RaktSetu.git  
cd RaktSetu  
npm install  

### Environment Variables

Create a `.env.local` file:

NEXT_PUBLIC_FIREBASE_API_KEY=your_key  
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com  
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id  
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com  
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_id  
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id  

GEMINI_API_KEY=your_gemini_api_key  

### Run Locally
npm run dev  

### Deployment
vercel deploy  

---

## 📁 Project Structure

src/  
├── app/            # Next.js routes (feed, dashboards)  
├── components/     # Reusable UI components  
├── lib/            # Firebase config & helpers  
├── ai/             # Genkit AI flows  
└── types/          # TypeScript types  

---

## 🔮 Future Enhancements

- GPS & radius-based donor matching  
- Donor availability and response tracking  
- Admin analytics dashboard  
- Mobile application (Flutter / React Native)  
- Map-based hospital discovery  

---

## 🏆 Hackathon Context

This project was built for **DevSprint – Leveraging the Power of AI**, organized by  
**GDG on Campus – MITS DU**, under the **Open Innovation / Healthcare** track.

The project demonstrates:
- Real-world problem identification  
- Purposeful AI integration  
- Scalable system design using Google technologies  

---

## 👥 Team Setu

- Nayan Jain (Kumar Nayan)  
  Application Developer (Firestudio)  
  GitHub: https://github.com/KumarNayan11  

- Pankaj Sahu  
  Team Lead  

- Mayank Shrivastava  

- Neha Sharma  

---

## 📄 License

MIT License