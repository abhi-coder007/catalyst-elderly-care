# 🏥 CareSync: Smart Elderly Care & Medication Management Platform

Built for **Catalyst Hackathon 2026** (Powered by Google for Developers & Hack2Skill).

## 🎯 Problem Statement
Elderly individuals often struggle with complex daily medication schedules and medical appointments, while family members and caretakers lack real-time visibility into adherence and well-being. Basic reminder apps fail because they do not connect the care circle or prioritize senior accessibility.

## 💡 Our Solution
**CareSync** is an interconnected, dual-interface healthcare ecosystem that places elderly individuals at the center of their healthcare decisions while keeping family members and caretakers proactively informed.

### ✨ Key Features
1. **Secure Passcode-Protected Care Ecosystem (`Passcode: 1234`):**
   - **Senior View:** High-contrast, oversized touch buttons designed for visual and motor accessibility.
   - **Caretaker / Family Dashboard:** Passcode-gated control center to view, add, edit, and delete medication schedules and monitor adherence metrics.
2. **Proactive Email Reminder Engine:**
   - Automatically tracks missed medications, upcoming doses, and scheduled doctor appointments, dispatching instant email notifications and maintaining an auditable dispatch log.
3. **Going Beyond a Basic Reminder App:**
   - **🔊 Voice-Guided Senior Assistant (Web Speech API):** Reads remaining daily medications and instructions aloud in a clear, slow-paced voice for visually impaired seniors.
   - **❤️ Elderly Autonomy Wellness Check-In:** Allows seniors to log how they feel daily (*Feeling Good*, *Tired*, *Need Checkup*), immediately updating the family dashboard.
   - **🤖 AI Medication Simplifier & Safety Guide:** Translates medical jargon into simple senior-friendly precautions and interaction warnings.

## 🛠️ Technology Stack & Architecture
- **Frontend:** Semantic HTML5, Tailwind CSS, Custom High-Contrast Accessibility CSS (`styles.css`)
- **Logic & State:** Modular Vanilla JavaScript (`app.js`) with `localStorage` state persistence
- **Accessibility & Smart APIs:** Browser Web Speech Synthesis API (`window.speechSynthesis`), Mailto SMTP Client Trigger, AI Medication Knowledge Engine
- **Deployment:** Vercel / GitHub Pages

## 🚀 How to Run Locally
1. Clone this repository.
2. Open `index.html` in any modern web browser.
3. Use passcode **`1234`** to unlock the **Family / Caretaker** dashboard.
