# 🩸 RaktSetu (रक्तसेतु)

**A Real-Time AI-Powered Bridge Between Life and Hope.**  

RaktSetu ("Blood Bridge") is a centralized, public-facing web application designed to connect hospitals in urgent need of blood with potential donors quickly and reliably. It serves as a verified platform where hospitals broadcast requirements, and the public can view and share these needs in real-time.

🔗 **Live Demo:** https://rakt-setu-kappa.vercel.app/  
📦 **GitHub Repository:** https://github.com/KumarNayan11/RaktSetu  

---

## 📌 About the Project

**RaktSetu** is a functional **prototype web application** designed to address a critical real-world challenge:  
**delay and misinformation in emergency blood procurement.**

### 🧠 Problem Statement

In emergency situations, hospitals often rely on manual calls, WhatsApp forwards, or unverified social posts to arrange blood donors.  
This leads to:

- Delays  
- Misinformation  
- Fake or outdated requests  
- Poor donor coordination  

RaktSetu addresses this gap by providing a verified, real-time, and AI-assisted system for emergency blood requests.

### 💡 Solution Overview

RaktSetu acts as a digital bridge between:

- Verified hospitals who raise urgent blood requests  
- Local donors who can instantly view and respond  

The platform prioritizes speed, trust, and accessibility.

RaktSetu demonstrates how **real-time systems, verified access, and AI assistance** can improve emergency response efficiency and trust.

⚠️ This project is a **prototype built for a hackathon** to demonstrate feasibility, architecture, and impact. Some features are intentionally scoped and listed as future enhancements.

---

## 🎯 Core Objectives

- Enable verified hospitals to raise urgent blood requests  
- Allow donors to instantly view requests without login friction  
- Reduce misinformation through verification  
- Use AI meaningfully to assist donors and hospitals  

---

## ✨ Key Features (Prototype Scope)

### 👥 Public Live Feed (Zero-Friction Access)

- **Zero-Login Access:** Anyone can visit the homepage to view a live grid of all open blood requests from registered hospitals.  
- **Real-Time Updates:** Powered by a direct connection to Firebase Firestore, new requests appear and fulfilled ones disappear automatically without a page refresh.  
- **Smart Filtering:** Users can quickly filter the live feed by specific hospitals or blood groups to find the most relevant needs.  
- **Ethical Sharing:** Each request card includes a "Share" button that opens pre-written messages in both English and Hindi.  
- **Built-in Verification:** To combat misinformation, every shared message includes a unique verification link (`?requestId=...`) that takes users to a dedicated page confirming the request's current status.

### 🏥 Hospital Dashboard (Staff Portal)

- **Request Management:** A secure dashboard for hospital staff to create new requests by selecting blood group, number of units, and urgency level.  
- **Live Status Control:** Staff can monitor their own active requests, edit details, or mark them as "closed" once fulfilled.

### 🛡️ Admin Panel (Platform Oversight)

- **Hospital Management:** An admin-only interface to onboard new hospitals to the platform.  
- **Activation Control:** Admins can activate or deactivate hospital accounts to ensure only verified institutions can post public requests.  
- **System Maintenance:** Includes tools to delete specific hospital records and a "Reset Database" feature for system-wide clearing.

### 🤖 RaktSahayak (AI Assistant)

- **Interactive Chatbot:** A floating chat widget powered by Google’s Gemini AI via the Genkit SDK.  
- **Purpose-Driven Guidance:** Programmed specifically to answer queries regarding donation eligibility, safety protocols, and post-donation care.

---

## 🛠️ Technology Stack

### Frontend
- Built with **Next.js (App Router)** and **React** for a high-performance, SEO-friendly experience.

### Styling
- Styled using **Tailwind CSS** with **shadcn/ui** for a modern, component-based user interface.

### Backend & Database
- Utilizes **Firebase Firestore** as a real-time NoSQL database.

### Server Logic
- Core application logic and database interactions are handled via **Next.js Server Actions**.

### Generative AI
- Integrates the **Google Gemini model** using the **Genkit SDK** to power the RaktSahayak chatbot.

### Tooling
- **Zod** – type-safe form validation  
- **Lucide React** – icons  
- **Vercel** – deployment & hosting  

---

## 📸 Interface Preview

*(You can add screenshots here later)*

- **Public Feed:** A clean, card-based layout showing blood groups (A+, O-, etc.) and hospital locations.  
- **Hospital Portal:** A robust dashboard for managing active/past requests.  
- **AI Chat:** A sleek sidebar/modal for RaktSahayak.

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

The following are planned extensions, not part of the current prototype:

- 📍 GPS & radius-based donor matching  
- 🔔 Donor availability and response tracking  
- 📊 Admin analytics dashboard  
- 📱 Mobile application (Flutter / React Native)  
- 🗺️ Map-based hospital discovery  

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

- Nayan Jain  
- Pankaj Sahu  
- Mayank Shrivastava  
- Neha Sharma  

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create.

1. Fork the Project  
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)  
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)  
4. Push to the Branch (`git push origin feature/AmazingFeature`)  
5. Open a Pull Request  

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## ✉️ Contact

**Nayan Jain** – @KumarNayan11  

**Project Link:** https://github.com/KumarNayan11/RaktSetu  

---

**Developed with ❤️ to save lives.**


