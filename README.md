# 🌈 Emotion Tracker

**Emotion Tracker** is a modern web application for tracking and analyzing your emotional state.  
It helps users better understand their emotions, observe mood dynamics, and share statistics with friends — creating a community of emotional awareness and support.

## 📌 Table of Contents

- [About](#-about)
- [Features](#%EF%B8%8F-features)
- [Tech Stack](#%EF%B8%8F-tech-stack)
- [Installation](#-installation)
- [Usage](#-usage)
- [License](#-license)
- [Contact](#-contact)

## 🧠 About

Emotion Tracker allows users to:

- **Track emotions** and add daily notes for self-reflection.
- **View analytics** and observe emotional trends.
- **Add friends** and share personal mood statistics.
- **Assign roles** that define access levels for your friends:
  - 👁 View only the current emotion
  - 📊 View full statistics
  - 📖 View all entries and notes

## ⚙️ Features

- ✍️ **Emotion Journal** — save your daily emotions and notes.
- 📈 **Analytics Dashboard** — visualize mood dynamics and trends.
- 👥 **Friends and Roles** — share your statistics and control data visibility.
- 💬 **Collaboration** — connect with others and exchange emotional insights.
- 🌗 **Theme Support** — includes both light and dark modes.

## 🛠️ Tech Stack

Emotion Tracker is built with a modern front-end technology stack.

### ⚡️ Core Technologies

- **Next.js 15** — React framework with SSR and routing
- **React 19** — modern UI library
- **TypeScript** — static typing for safer and scalable development
- **Tailwind CSS 4** — utility-first CSS framework
- **Shadcn UI** — accessible and customizable UI components
- **Lucide React** — minimal and elegant icon library
- **Recharts** — data visualization and analytics
- **React Hook Form + Zod** — form management and validation
- **React Query (TanStack)** — server-state management and caching
- **Next Themes** — light and dark theme handling

### 🔥 Additional Libraries and Utilities

- **Firebase / Firebase Admin** — authentication and database management
- **Moment.js** — date and time handling
- **Html-to-Image** — exporting analytics and charts as images
- **React Day Picker** — date selection component
- **Sonner** — toast notifications
- **React Spinners** — loading animations
- **Qrcode.react** — generate QR codes
- **Use-Debounce** — optimized input handling
- **Tailwind Merge / Class Variance Authority / Clsx** — class and style management
- **Prettier + ESLint** — formatting and code quality control

### ☁️ Hosting & Infrastructure

- **Vercel** — hosting, deployment, and CI/CD for Next.js applications

## 🚀 Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/EugenAronsky/Emotion-tracker.git
   cd emotion-tracker
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Create a `.env.local`** file and add the following variables:

   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=<your_firebase_api_key>
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=<your_firebase_auth_domain>
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=<your_firebase_project_id>
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=<your_firebase_storage_bucket>
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=<your_firebase_messaging_sender_id>
   NEXT_PUBLIC_FIREBASE_APP_ID=<your_firebase_app_id>
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=<your_firebase_measurement_id>

   FIREBASE_CLIENT_EMAIL=<your_firebase_client_email>
   FIREBASE_PRIVATE_KEY=<your_firebase_private_key>
   ```

4. **Run locally**:

   ```bash
   npm run dev
   ```

   The app will be available at [http://localhost:3000](http://localhost:3000)

## 🧭 Usage

1. **Sign up or log in** — using Firebase Google Authentication.
2. **Add emotions** — select a mood icon and optionally write a note.
3. **View analytics** — explore charts and mood statistics.
4. **Add friends** — connect with other users and share your statistics.
5. **Assign roles** — define what each friend can see: current emotion, full statistics, or all entries.

## 📄 License

The **Emotion Tracker** project is distributed without any restrictions.

### You are free to:

- use the code for personal or commercial purposes,
- modify and distribute the project,
- publish your own versions,
- and use any part of the code without attribution.

This project is open to everyone who wants to learn, develop the idea, or use it for their own purposes.

## 📬 Contact

If you have questions or suggestions, feel free to contact us at [eugenaronskiy@gmail.com](mailto:eugenaronskiy@gmail.com)
