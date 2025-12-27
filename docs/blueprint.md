# **App Name**: RaktSetu

## Core Features:

- Hospital Dashboard: Secure interface for verified hospitals to create, manage, and close blood requests. Fields include Blood Group, Units, Urgency Level, and a CLOSE REQUEST toggle.
- Public Request Page: Zero-login landing page for citizens to view live blood request statuses with VERIFIED hospital badge and CLOSED banner upon fulfillment.
- AI Communication Engine: Generates an ethical and urgent WhatsApp-ready message in both Hindi and English using hospital input. Leverages Gemini 1.5 via Firebase AI Logic SDK to function as a tool for drafting suitable communications.
- Real-time Updates: Utilizes Firestore to provide real-time updates on blood request statuses.
- Hospital Verification: Admin tool to manage hospitals in the system (create, verify and deactivate).

## Style Guidelines:

- Primary color: A deep crimson (#B71C1C) evokes urgency and criticality.
- Background color: Light grayish-red (#F2E8E8) provides a clean, non-distracting backdrop.
- Accent color: A complementary, muted orange-red (#C62828) used for subtle highlights and less critical CTAs.
- Body and headline font: 'Inter' sans-serif for modern readability and a neutral tone.
- Use universally recognized blood drop icons with color-coded urgency levels (red for critical, orange for high, gray for normal).
- Prioritize mobile responsiveness and information hierarchy with a clear call to action.
- Subtle transitions for status updates and message displays to maintain user awareness.