# NurAl-Amal (نور العمل) — 30 Days of Quranic Good Deeds & Habit Planner

> *"And whoever does righteous deeds while being a believer - he will have no fear of injustice or deprivation."* — Surah Ta-Ha (20:112)

**NurAl-Amal** (`v1.0.1`) is an interactive, colorful web application and spiritual habit planner designed to help you cultivate 30 transformative daily deeds drawn directly from the Holy Quran. It provides an intuitive, four-tier curriculum: **Monthly Plan**, **Weekly Milestones**, **Daily Focus Mode**, and a **Yearly 365-Day Consistency Heatmap & 12-Month Virtues Roadmap**.

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

### 2. 🧠 Ayah Memorization & Audio Assistant
- **Web Speech Synthesis Recitation**: Listen to English voice audio readout of the Quranic translation and reflection.
- **Transliteration Assistance**: Phonetic readings for every single day to support non-Arabic speakers.
- **Recall Testing (Flashcard Mode)**: Hide/reveal Arabic script or translation with 1 click to test your memory.

### 3. 📿 Upgraded Digital Tasbih Companion
- **Phrase Selector**: SubhanAllah, Alhamdulillah, Allahu Akbar, Astaghfirullah, and La ilaha illallah.
- **Rounds & Progress Ring**: Live visual progress bar and automatic round tracking with haptic vibration feedback (`navigator.vibrate`).
- **Keyboard Shortcut**: Spacebar tap to count while in Daily Focus mode.

### 4. ⏰ Daily Reminders & Floating Alarm Banner
- **Customizable Daily Reminders**: Schedule custom alarms for morning, midday, evening, or night.
- **In-App Alarm Banner**: Displays an animated floating reminder card with chime sound when an alarm triggers.
- **Push Notification Support**: Browser-level push notification alerts.
- **Alarm Sound Test**: Test harmonic reflection chimes directly inside the reminders manager.

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
2. No build tools, NPM packages, or backend servers required — 100% client-side, offline, and private.

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
