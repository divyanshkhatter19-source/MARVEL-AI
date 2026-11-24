# 🦸 MARVEL AI

> **Earth's Mightiest Intelligence** — An immersive, cinematic Marvel Avengers-themed AI chatbot.  
> **Creator Credit:** by Divyansh Khatter  
> **Theme:** Marvel Avengers Cinematic Universe

---

## 🌟 Overview

**MARVEL AI** is a fully functional, cinematic AI experience designed to feel like operating an advanced Tony Stark / Avengers Compound holographic HUD rather than a generic chatbot.

### Key Highlights
1. **Cinematic Entry Portal:**
   - Deep-space cosmic particle background with interactive floating Infinity Stones (Space, Mind, Reality, Power, Time, Soul).
   - Animated Avengers "A" insignia with pulsing gold and energy glow.
   - Live running superhero silhouettes traversing the cinematic lower horizon.
   - Interactive stats counters with dynamic numeric animations.
   - Multi-layer glowing **ENTER THE UNIVERSE** button with energy rings and light shimmer.
   - Hyperspace warp/portal transition with synchronized visual acceleration and audio whoosh.

2. **Avengers HUD Chatbot Interface:**
   - Tony Stark holographic interface with arc reactor core animation.
   - Dynamic canvas constellation network that reacts to cursor proximity.
   - Custom futuristic glowing cursor with dynamic trailing particles and interactive hover expansions.
   - Sound engine powered by the **Web Audio API** (Avengers brass chords, warp whoosh, laser blips, Stark HUD clicks, arc reactor ambient hum, and subtle typing chatter) — 100% legal, synthesized in real-time with zero copyrighted external audio files.
   - Real-time Markdown rendering for responses (bolding, lists, headers, code, quotes).
   - Streaming SSE (Server-Sent Events) with live cursor indicator.
   - Quick-start prompt chips for classic MCU debates.

3. **Secure Backend & AI Matrix:**
   - Express.js backend with full CORS & security headers.
   - Reads `OPENAI_API_KEY` securely from `.env` — never exposed to client-side code.
   - `.env` protected by `.gitignore`; `.env.example` provided for safe public repo commits.
   - Powered by OpenAI `gpt-4o` with a temperature of `0.9` for maximum creative Marvel lore depth.
   - Intelligent Marvel Neural Knowledge Base fallback that gracefully handles API quota limits (429) so users can explore and experience every feature seamlessly.

4. **Controls & Accessibility:**
   - 🔊 Sound toggle (mute/unmute with visual icon change).
   - 🧹 Clear conversation protocol with confirmation dialog.
   - ♿ Reduced motion toggle for accessibility compliance.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create or verify your `.env` file in the project root:
```env
OPENAI_API_KEY=your_openai_api_key_here
PORT=3000
```
*(Your `.env.example` contains placeholders and can be committed safely to version control).*

### 3. Start the Server
```bash
npm start
```
Then open your browser and navigate to:
```
http://localhost:3000
```

---

## 📁 Project Architecture

```
Marvel AI/
├── .env                # Private API key (excluded from git)
├── .env.example        # Public placeholder template
├── .gitignore          # Git exclusion rules
├── package.json        # Dependencies & scripts
├── server.js           # Secure Express backend & OpenAI streaming API
├── public/
│   ├── index.html      # Cinematic Entry & HUD Chatbot markup
│   ├── style.css       # Marvel color palette, animations & responsive styling
│   └── app.js          # Web Audio synth, particles, cursor, and SSE stream handling
└── README.md           # Documentation
```

---

## 🎨 Color Palette & Design Tokens

- **Iron Man Crimson:** `#E8162A`
- **Arc Reactor Electric Blue:** `#00D4FF`
- **Stark Gold:** `#FFD700`
- **Cosmic Violet:** `#9B59B6`
- **Void Space Black:** `#050508`
- **HUD Glass Border:** `rgba(0, 212, 255, 0.2)`

---

*Designed & Developed by **Divyansh Khatter**.*
