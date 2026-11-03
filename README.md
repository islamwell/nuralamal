# NurAl-Amal (نور العمل) — 30 Days of Quranic Good Deeds & Habit Planner

> *"And whoever does righteous deeds while being a believer - he will have no fear of injustice or deprivation."* — Surah Ta-Ha (20:112)

**NurAl-Amal** (`v1.0.3 (updated 2026-11-03 17:21)`) is an interactive, colorful web application, spiritual habit planner, and Progressive Web App (PWA) designed to help you cultivate 30 transformative daily deeds drawn directly from the Holy Quran. It provides an intuitive, four-tier curriculum: **Monthly Plan**, **Weekly Milestones**, **Daily Focus Mode**, and a **Yearly 365-Day Consistency Heatmap & 12-Month Virtues Roadmap**.

---

## 📱 Mobile Support: Android & iOS Progressive Web App (PWA)

**NurAl-Amal is 100% compatible with both Android and iOS!** It functions as an installable Progressive Web App (PWA) that looks, feels, and behaves like a native mobile app without requiring App Store or Google Play downloads:

- **🍎 Apple iOS (iPhone & iPad)**:
  1. Open [https://nuralamal.pages.dev](https://nuralamal.pages.dev) in **Safari**.
  2. Tap the **Share** button (the square with an arrow pointing up ⎋) in the bottom toolbar.
  3. Scroll down and select **"Add to Home Screen"** (➕).
  4. Tap **Add**. The app installs with a high-resolution Apple touch icon, opens in standalone fullscreen mode (no browser address bar), and respects iOS safe-area notches and home indicators.

- **🤖 Android (Chrome, Brave, Edge, Samsung Internet)**:
  1. Open [https://nuralamal.pages.dev](https://nuralamal.pages.dev) in **Google Chrome** (or any Chromium browser).
  2. Tap the **Install** prompt banner or tap the **three dots menu (⋮)** and select **"Install app"** / **"Add to Home screen"**.
  3. The app is added directly to your home screen and Android App Drawer with its standalone theme color (`#059669`).

- **⚡ 100% Offline Capability**:
  - Precached via a custom Service Worker (`sw.js`). All deeds, Arabic calligraphy, theme engines, and the Sheikh Saad Al-Ghamdi audio recitation are available even in airplane mode without internet access.
  - Native haptic feedback (`navigator.vibrate`) on supported mobile devices when clicking the Tasbih counter.

---

## ✨ Features & Highlights

### 1. 📖 Authentic 30-Day Quranic Curriculum
- **30 Verified Quranic Deeds**: Each day features authentic Arabic text with diacritics (Tashkeel), Surah citation, transliteration, clear English translation, practical micro-tasks, and spiritual wisdom/Tafsir insight.
- **8 Spiritual Categories**:
  - 🗣️ **Speech & Character** (*Husn al-Kalam*)
  - 👨‍👩‍👧 **Family & Kin** (*Birr al-Walidayn & Silat ar-Rahim*)
  - 🤲 **Charity & Giving** (*Sadaqah & Infaq*)
  - 🕊️ **Patience & Forgiveness** (*Sabr & 'Afw*)
  - ⚖️ **Justice & Integrity** (*'Adl & Amanah*)
  - 🤝 **Mercy & Community** (*Rahmah & Ta'awun*)
  - 📚 **Seeking Knowledge** (*'Ilm Nafi'*)
  - 📿 **Worship & Dhikr** (*Dhikrullah & Shukr*)

### 2. 🎙️ Sheikh Saad Al-Ghamdi Bismillah Audio & Voice Recitation
- **Authentic Bismillah Recitation**: The chime has been replaced with the authentic recitation of *Bismillah ar-Rahman ar-Rahim* (Surah Al-Fatihah 1:1) by world-renowned Qari **Sheikh Saad Al-Ghamdi**, sourced from [EveryAyah.com](https://everyayah.com/).
- **Dual Offline & CDN Fallback**: Cached locally in `audio/bismillah_ghamadi.mp3` for offline PWA use, with seamless fallback to EveryAyah CDN and Web Audio synthesizer.
- **Web Speech Synthesis Audio**: English voice audio readout of the Quranic translation and reflection.
- **Transliteration Assistance**: Phonetic readings for every single day to support non-Arabic speakers.
- **Recall Testing (Flashcard Mode)**: Hide/reveal Arabic script or translation with 1 click to test your memory.

### 3. 📿 Upgraded Digital Tasbih Companion
- **Phrase Selector**: SubhanAllah, Alhamdulillah, Allahu Akbar, Astaghfirullah, and La ilaha illallah.
- **Rounds & Progress Ring**: Live visual progress bar and automatic round tracking with haptic vibration feedback (`navigator.vibrate`).
- **Keyboard Shortcut**: Spacebar tap to count while in Daily Focus mode.

### 4. ⏰ Daily Reminders & Floating Alarm Banner
- **Customizable Daily Reminders**: Schedule custom alarms for morning, midday, evening, or night.
- **In-App Alarm Banner**: Displays an animated floating reminder card playing Sheikh Saad Al-Ghamdi's Bismillah when an alarm triggers.
- **Push Notification Support**: Browser-level push notification alerts.
- **Alarm Sound Test**: Test the Bismillah audio directly inside the reminders manager.

### 5. 🎨 Vibrant, Interactive UI & Themes
- **4 Custom Themes**:
  - 🌿 *Emerald Oasis* (Soothing green & gold)
  - 💎 *Royal Sapphire* (Majestic blue & amber)
  - 🔮 *Velvet Amethyst* (Royal violet & rose)
  - 🌅 *Desert Sunset* (Warm terracotta & golden amber)
- **Dark & Light Mode**: Smooth transitions with preserved user preference.
- **Glassmorphism & Ornate Accents**: Modern backdrop blur filters, glowing borders, and classic Arabic typography (`Amiri` and `Scheherazade New`).
- **Celebration Particle Canvas**: Dynamic fireworks of stars, crescent moons (🌙), and sparkles when completing deeds.

### 6. 🗓️ Four Multi-Scale Planning Views
1. **📅 Monthly Plan (30-Day Grid)**:
   - Interactive 30-day cards with completion checkmarks, search by keyword/Surah, clear button, and category filters with live count badges.
2. **📆 Weekly Plan (Milestones & Habit Board)**:
   - 4 Thematic Weeks + Celebration Days 29–30 with completion ratio and weekly reflection notebook.
3. **☀️ Daily Focus Mode (Immersive View)**:
   - Deep-dive into today's deed with large Arabic calligraphy, transliteration, wisdom breakdown, checkable micro-actions, and social sharing (Copy Card, WhatsApp, Telegram).
4. **🌌 Yearly Virtues & 365-Day Activity Heatmap**:
   - Real date-stamped activity tracking matrix showing your spiritual consistency across the full year, plus the 12-Month Quranic Virtues Roadmap.

### 7. ✏️ Fully Customizable & Editable
- **Add Custom Deeds**: Create new deeds or customize existing ones with custom action items and steps.
- **Export & Import**: Download a complete JSON backup of your progress and notes, or import previous backups.
- **Print / PDF Ready**: Dedicated print stylesheet (`@media print`) for clean offline study.

---

## 🚀 Quick Start

1. Open `index.html` in any modern web browser (Chrome, Edge, Firefox, Safari, Brave).
2. Live production deployment: [https://nuralamal.pages.dev](https://nuralamal.pages.dev)
3. No build tools, NPM packages, or backend servers required — 100% client-side, offline, and private.

```bash
# Optional: Serve with a local HTTP server
python3 -m http.server 8080
```

---

## ⌨️ Keyboard Shortcuts
- **Spacebar**: Count on the Digital Tasbih when in Daily Focus Mode.
- **ArrowLeft (←)**: Navigate to Previous Day in Daily Focus Mode.
- **ArrowRight (→)**: Navigate to Next Day in Daily Focus Mode.
- **Esc**: Dismiss any open modal dialog (Native `<dialog closedby="any">`).

---

## 🛡️ Privacy & Offline Guarantee
All your completion progress, streaks, daily reflections, and customized reminders are saved locally in your browser's `localStorage`. No personal data leaves your device.

