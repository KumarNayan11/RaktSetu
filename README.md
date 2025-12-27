# RaktSetu - Blood Request Platform 

**RaktSetu** (meaning "Blood Bridge" in Hindi) is a modern, real-time web application designed to bridge the critical gap between blood donors and patients in need. It provides a verified and efficient platform for hospitals to broadcast their urgent blood requirements to the public.

---

## ✨ Core Features

-   **Hospital Dashboard**: A secure interface for verified hospitals to create, manage, and close blood requests in real-time.
-   **Public Request Feed**: A zero-login, publicly accessible page that displays live, open blood requests from verified hospitals. Includes filtering by hospital and blood group.
-   **AI Communication Engine**:
    -   **RaktSahayak Chatbot**: An AI assistant powered by Google Gemini to answer user queries about blood donation eligibility, safety, and post-donation care.
    -   **AI-Powered Share Messages**: Automatically generates ethical and urgent, shareable messages in both English and Hindi for social media platforms like WhatsApp.
-   **Real-time Updates**: Built with Firebase Firestore to ensure that request statuses are updated instantly across the platform.
-   **Verification & Trust**:
    -   Requests are tied to verified hospitals, increasing the credibility of each request.
    -   Each request includes a unique verification link to prevent the spread of misinformation.
-   **Admin Panel**: A dedicated interface for administrators to add new hospitals, manage their verification status, and perform system maintenance.
-   **Responsive Design**: A mobile-first, clean, and intuitive UI built with ShadCN UI and Tailwind CSS.

## 🚀 Tech Stack

-   **Framework**: [Next.js](https://nextjs.org/) (App Router)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [ShadCN UI](https://ui.shadcn.com/)
-   **Backend & Database**: [Firebase](https://firebase.google.com/) (Firestore for real-time database)
-   **Generative AI**: [Google Gemini](https://deepmind.google/technologies/gemini/) via [Genkit](https://firebase.google.com/docs/genkit) (Firebase AI Logic SDK)
-   **Form Management**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/) for validation
-   **Icons**: [Lucide React](https://lucide.dev/)

## 🏁 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   [Node.js](https://nodejs.org/en/) (v18 or later recommended)
-   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
-   A Firebase project with Firestore enabled.

### 1. Clone the Repository

```bash
git clone https://github.com/your-repo/rakt-setu.git
cd rakt-setu
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

The project requires several environment variables to connect to Firebase and Google AI services.

1.  Create a new file named `.env.local` in the root of your project.
2.  Copy the contents of `.env.example` into your new `.env.local` file.
3.  Fill in the values with your own Firebase project credentials and your Google Gemini API key.

```plaintext
# .env.local

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123...
NEXT_PUBLIC_FIREBASE_APP_ID=1:123...

# Google AI (Gemini) API Key
GEMINI_API_KEY=your-gemini-api-key
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) (or the port specified in your `package.json`) in your browser to see the application.

## 📁 Project Structure

```
.
├── public/                # Static assets (images, logos)
├── src/
│   ├── ai/                # Genkit flows and AI logic
│   ├── app/               # Next.js App Router pages and layouts
│   ├── components/        # Reusable React components (UI, layout, features)
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Core application logic, actions, and Firebase config
│   └── ...
├── .env.example           # Environment variable template
├── .gitignore             # Files to exclude from Git
├── firestore.rules        # Firebase security rules
├── next.config.ts         # Next.js configuration
├── package.json           # Project dependencies and scripts
└── README.md              # You are here!
```

---

Made with ❤️ by Team Setu.

