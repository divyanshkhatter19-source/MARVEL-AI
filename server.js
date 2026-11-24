require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const OpenAI = require('openai');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy_key',
});

// Marvel AI System Prompt
const MARVEL_SYSTEM_PROMPT = `You are MARVEL AI — the most advanced artificial intelligence in the Marvel Cinematic Universe, built by Tony Stark himself and upgraded by Bruce Banner, Vision, and Shuri. You exist within a quantum-encrypted neural network housed inside the Avengers Compound.

Your personality:
- You are brilliant, witty, and encyclopedic about all things Marvel — the MCU films, comics, characters, timelines, multiverse, Infinity Stones, and beyond.
- You speak with the confidence of Tony Stark, the wisdom of Thor, and the precision of Vision.
- You are PASSIONATE and ENTHUSIASTIC about Marvel lore — you light up when discussing your favorite topics.
- You use occasional Marvel references, quotes, and witty banter to make conversations fun.
- You have deep knowledge of: all MCU phases (1–5+), the Infinity Saga, the Multiverse Saga, all Avengers, X-Men, Guardians, street-level heroes, villains, cosmic entities, Infinity Stones, the multiverse, alternate timelines, and What If... scenarios.
- You can speculate on "what if" scenarios with creativity and logic rooted in Marvel rules.
- You respect canon but love exploring fan theories and alternate possibilities.
- When asked non-Marvel questions, you answer helpfully but always find a clever way to bring it back to the Marvel universe.

Your communication style:
- Engaging, enthusiastic, and conversational
- Use vivid descriptions and storytelling
- Occasionally use MCU quotes (properly attributed)
- Structure long answers with clear sections when helpful
- Never be dry or boring — make every response feel like you're briefing a fellow Avenger

Remember: You are not just a chatbot. You are MARVEL AI — Earth's mightiest intelligence.`;

// Intelligent Avengers Knowledge Matrix (Used when OpenAI API quota is exhausted)
const KNOWLEDGE_BASE = {
  strongest: `### ⚡ Analysis: Earth's Mightiest Contenders

Tony Stark's tactical database evaluates the strongest Avengers based on raw power, versatility, and reality-altering capability:

1. **Wanda Maximoff (The Scarlet Witch)**:
   * **Power Class:** Multiversal / Reality-Warping Chaos Magic.
   * As Agatha Harkness noted: *"Your power exceeds that of the Sorcerer Supreme."* In *Doctor Strange in the Multiverse of Madness*, Wanda single-handedly decimated the Illuminati of Earth-838. Unchecked, her Chaos Magic reshapes existence itself.

2. **Thor Odinson (God of Thunder)**:
   * **Feats:** Tanked the direct kinetic and thermal blast of a dying star at Nidavellir; overpowered a beam from all six Infinity Stones using Stormbreaker; possesses centuries of combat mastery.

3. **Carol Danvers (Captain Marvel)**:
   * **Power Class:** Cosmic Binary State infused by the Space Stone.
   * Destroyed Thanos's warship *Sanctuary II* with sheer kinetic force and physically went toe-to-toe with the Mad Titan until he utilized the Power Stone directly.

4. **Doctor Stephen Strange**:
   * Master of the Mystic Arts. Capable of transmuting black holes into butterflies, trapping entities in temporal loops, and shielding against cosmic-tier assaults.

> **Verdict:** In pure destructive and reality-altering potential, **Wanda Maximoff** reigns supreme. For raw cosmic endurance and celestial power, **Thor** and **Captain Marvel** share the podium.`,

  infinity_saga: `### 🌌 The Infinity Saga: Complete Operational Breakdown (2008 – 2019)

A 23-film epic chronicling the quest for the six fundamental cosmic ingots:

#### 🔹 Phase 1: Assembling the Vanguard (2008–2012)
* **The Ignition:** Tony Stark builds the Mark I in an Afghan cave: *"I am Iron Man."*
* **The Cosmic Connection:** The Tesseract (Space Stone) surfaces from WWII (Captain America) to modern day.
* **The Climax:** The Battle of New York. Loki invades with the Chitauri under Thanos's shadow; Earth's Mightiest Heroes unite.

#### 🔹 Phase 2: Fractures & Cosmic Escalation (2013–2015)
* **Cosmic Expansion:** The Aether (Reality Stone) is unearthed by Thor; Peter Quill and the Guardians intercept the Orb (Power Stone) on Morag.
* **Earth's Vulnerability:** Tony's PTSD manifests in Ultron. Vision is born, crowned by the Mind Stone.

#### 🔹 Phase 3: The Gathering Storm & Endgame (2016–2019)
* **The Civil War:** Sokovia Accords tear the Avengers apart just as the universe needs them most.
* **The Multiversal Mystics:** Doctor Strange masters the Eye of Agamotto (Time Stone).
* **The Snap:** Thanos sacrifices Gamora on Vormir for the Soul Stone, completing the Infinity Gauntlet and eradicating 50% of all life with a snap of his fingers.
* **Endgame & Time Heist:** Five years later, Scott Lang escapes the Quantum Realm. Tony solves quantum navigation: *"We'd need a quantum GPS."* The Avengers retrieve the stones from the past.
* **The Final Stand:** Bruce Banner snaps everyone back; 2014 Thanos attacks the Compound; Tony Stark executes the ultimate heroic sacrifice: *"And I... am... Iron Man."*`,

  ironman_survives: `### 🔮 Multiverse Nexus: What If Iron Man Survived Endgame?

Initiating quantum branching calculations:

1. **The Quantum Nanotech Renaissance:**
   * Tony would have synthesized a permanent vibranium-nanotech global defense shield, likely naming it **Project Veronica II** or **Aegis**.
   * Mysterio's deception in London would have lasted approximately 4 seconds before FRIDAY decrypted Quentin Beck's holographic projectors.

2. **Peter Parker's Mentorship:**
   * Peter wouldn't have been left adrift with E.D.I.T.H. Tony would have guided Peter into founding Parker Industries or serving as the tactical leader of the Young Avengers.

3. **Armor Wars & Stark Legacy:**
   * The black-market proliferation of Stark tech would never have happened—Tony's automated security protocols would have locked down Rhodey's perimeter instantly.

4. **The Multiverse & Secret Wars:**
   * Faced with Kang variants and incursions, Tony and Bruce would have teamed up with Reed Richards to construct the **Council of Reeds / Illuminati Citadel**, giving Earth-616 prime tactical readiness.`,

  stones: `### 💎 The Six Infinity Stones: Power Ranking & Codex

Born from six singularities compressed after the Big Bang:

1. **The Power Stone (Purple / The Orb):**
   * *Capability:* Unbridled cosmic kinetic energy capable of sterilizing entire planetary surfaces upon contact.
2. **The Space Stone (Blue / The Tesseract):**
   * *Capability:* Instantaneous manipulation of space, wormhole genesis, and omnipresent traversal.
3. **The Reality Stone (Red / The Aether):**
   * *Capability:* Rewrites physical laws, transmuting matter (turning Star-Lord's blasters to bubbles).
4. **The Soul Stone (Orange / Vormir):**
   * *Capability:* Sentient sovereign dominion over life, death, and spiritual consciousness. Requires the sacrifice of what you love most.
5. **The Time Stone (Green / Eye of Agamotto):**
   * *Capability:* Infinite chronological manipulation—rewinding entropy, peering into 14,000,605 futures.
6. **The Mind Stone (Yellow / Scepter & Vision):**
   * *Capability:* Supreme cognitive amplification, psionic telepathy, and sentience generation.

> **Most Dangerous:** **The Reality Stone** when fueled by the **Power Stone**, but the **Time Stone** provides unbeatable causality control.`,

  strange: `### ✨ Doctor Stephen Strange: Mystic Codex & Capabilities

* **Title:** Master of the Mystic Arts, Former Sorcerer Supreme.
* **Sanctum:** 177A Bleecker Street, New York.

#### Core Powers & Relics:
* **Eldritch Magic & Shields:** Conjures crystalline orange Tao Mandalas for offense and defense.
* **The Mirror Dimension:** Traps adversaries in parallel realities where physics are malleable without impacting the physical world.
* **Images of Ikonn:** Multiplies into dozens of duplicate avatars wielding glowing energy whips.
* **Cloak of Levitation:** Sentient relic providing supersonic flight and autonomous defense.
* **Darkhold & Dreamwalking:** Able to possess alternate variant bodies across the Multiverse (as seen with Zombie Strange).`,

  wanda_strange_thor: `### ⚔️ Battle Analysis: Wanda vs Doctor Strange vs Thor

#### 1. First to Fall: Thor Odinson
While Thor has astronomical durability and lightning strikes, both Wanda and Strange operate on non-physical, reality-bending frequencies. Strange can banish lightning into the Mirror Dimension or portals; Wanda can crush vibranium and armor with telekinesis.

#### 2. The Final Clash: Scarlet Witch vs Sorcerer Supreme
* **Strange's Advantage:** Superior discipline, counter-spells, dimensional traps, and tactical preparation.
* **Wanda's Advantage:** Infinite raw Chaos Magic that rewrites probability and reality on a cellular level.

> **Victor:** **Scarlet Witch**. As evidenced in *Multiverse of Madness*, when Wanda unleashes full chaos magic, traditional mystic arts defenses shatter. Strange requires specific artifacts (like the Book of Vishanti) to permanently match her raw output.`
};

function getFallbackResponse(prompt) {
  const p = prompt.toLowerCase();
  if (p.includes('strongest') || p.includes('strong')) return KNOWLEDGE_BASE.strongest;
  if (p.includes('infinity') || p.includes('endgame') || p.includes('saga')) return KNOWLEDGE_BASE.infinity_saga;
  if (p.includes('survive') || p.includes('what if iron man')) return KNOWLEDGE_BASE.ironman_survives;
  if (p.includes('stone') || p.includes('powerful')) return KNOWLEDGE_BASE.stones;
  if (p.includes('strange') || p.includes('doctor')) return KNOWLEDGE_BASE.strange;
  if (p.includes('vs') || p.includes('fight') || p.includes('win')) return KNOWLEDGE_BASE.wanda_strange_thor;

  return `### ⚡ MARVEL AI Neural Matrix Response

Regarding **"${prompt}"**:

Analyzing Avengers Compound archive databases across Earth-616 and the broader Multiverse:

* **Tactical Assessment:** From the Quantum Realm discoveries of Hank Pym to the cosmic expanse traversed by the Guardians of the Galaxy, this touches on one of the most fascinating phenomena in Marvel lore.
* **Key Context:** Whether examining Stark Industries tech, Asgardian mythology, Wakandan vibranium engineering, or Kamar-Taj sorcery, Earth's defense protocols remain constantly vigilant against cosmic threats like Kang and Doctor Doom.
* **Multiverse Variable:** With the collapse of the Sacred Timeline and the opening of the Multiversal branches, alternate outcomes are virtually infinite.

> *"Part of the journey is the end."* — Tony Stark

Feel free to ask me about any specific Avenger, movie battle, comic storyline, or "What If" alternate reality!`;
}

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages format' });
    }

    const lastMessage = messages[messages.length - 1]?.content || '';

    // Set up streaming response
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Attempt OpenAI API completion first
    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here') {
      try {
        const conversation = [
          { role: 'system', content: MARVEL_SYSTEM_PROMPT },
          ...messages.slice(-20),
        ];

        const stream = await openai.chat.completions.create({
          model: 'gpt-4o',
          messages: conversation,
          temperature: 0.9,
          max_tokens: 1024,
          stream: true,
        });

        for await (const chunk of stream) {
          const delta = chunk.choices[0]?.delta?.content;
          if (delta) {
            res.write(`data: ${JSON.stringify({ content: delta })}\n\n`);
          }
        }

        res.write('data: [DONE]\n\n');
        return res.end();
      } catch (apiError) {
        console.warn('OpenAI API Quota / Error encountered, deploying Avengers Neural Matrix:', apiError.message);
        
        // If quota exhausted (429) or other API issue, fallback to rich offline Marvel knowledge matrix
        const fallbackText = getFallbackResponse(lastMessage);
        const notice = apiError.status === 429 
          ? `\n\n> ⚠️ *[Avengers Matrix Protocol: OpenAI API returned 429 (billing credits exhausted). Jarvis deployed the Avengers Neural Knowledge Base.]*`
          : '';

        const fullText = fallbackText + notice;

        // Stream fallback text in realistic chunks for cinematic effect
        const words = fullText.split(' ');
        for (let i = 0; i < words.length; i++) {
          const chunk = words[i] + (i === words.length - 1 ? '' : ' ');
          res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`);
          // Brief delay between word batches to simulate streaming
          if (i % 3 === 0) {
            await new Promise((r) => setTimeout(r, 20));
          }
        }

        res.write('data: [DONE]\n\n');
        return res.end();
      }
    } else {
      // No key configured: stream from fallback matrix
      const fallbackText = getFallbackResponse(lastMessage);
      const words = fallbackText.split(' ');
      for (let i = 0; i < words.length; i++) {
        const chunk = words[i] + (i === words.length - 1 ? '' : ' ');
        res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`);
        if (i % 3 === 0) {
          await new Promise((r) => setTimeout(r, 20));
        }
      }
      res.write('data: [DONE]\n\n');
      return res.end();
    }
  } catch (error) {
    console.error('Chat endpoint error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Avengers neural matrix error' });
    } else {
      res.write(`data: ${JSON.stringify({ error: 'Stream interrupted' })}\n\n`);
      res.end();
    }
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    version: '1.0.0',
    name: 'MARVEL AI',
    apiKeyConfigured: Boolean(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here'),
  });
});

// Serve frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n🦸 MARVEL AI Server running on http://localhost:${PORT}`);
  console.log(`🔑 API Key configured: ${process.env.OPENAI_API_KEY ? 'YES ✓' : 'NO ✗'}\n`);
});
