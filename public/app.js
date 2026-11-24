/* ============================================================
   MARVEL AI — Client Application
   by Divyansh Khatter
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // ---- STATE ----
  const state = {
    soundEnabled: true,
    reducedMotion: false,
    audioInitialized: false,
    isGenerating: false,
    messages: [], // { role: 'user' | 'assistant', content: string }
  };

  // ---- AUDIO SYNTHESIZER (Web Audio API) ----
  class MarvelAudioEngine {
    constructor() {
      this.ctx = null;
      this.masterGain = null;
      this.bgOsc1 = null;
      this.bgOsc2 = null;
      this.bgGain = null;
    }

    init() {
      if (this.ctx) return;
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      } catch (e) {
        console.warn('Web Audio not supported', e);
      }
    }

    resume() {
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    // Cinematic Intro Swell / Avengers Brass-like synth chords
    playIntroSwell() {
      if (!this.ctx || !state.soundEnabled) return;
      const now = this.ctx.currentTime;

      // Deep sub bass
      const sub = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      sub.type = 'sine';
      sub.frequency.setValueAtTime(55, now); // A1
      sub.frequency.exponentialRampToValueAtTime(110, now + 1.2);
      subGain.gain.setValueAtTime(0.01, now);
      subGain.gain.linearRampToValueAtTime(0.35, now + 0.6);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 2.5);
      sub.connect(subGain);
      subGain.connect(this.masterGain);
      sub.start(now);
      sub.stop(now + 2.5);

      // Heroic synth triad
      const chords = [220, 277.18, 329.63, 440]; // A major
      chords.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);

        // Lowpass filter for warm cinematic brass feel
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(400, now);
        filter.frequency.exponentialRampToValueAtTime(2400, now + 0.8);
        filter.frequency.exponentialRampToValueAtTime(300, now + 2.2);

        g.gain.setValueAtTime(0.001, now);
        g.gain.linearRampToValueAtTime(0.08, now + 0.5);
        g.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);

        osc.connect(filter);
        filter.connect(g);
        g.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 2.3);
      });
    }

    // Portal Warp / Transition Whoosh
    playWarpSound() {
      if (!this.ctx || !state.soundEnabled) return;
      const now = this.ctx.currentTime;

      // Frequency glide whoosh
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.8);
      osc.frequency.exponentialRampToValueAtTime(80, now + 1.4);

      g.gain.setValueAtTime(0.01, now);
      g.gain.linearRampToValueAtTime(0.3, now + 0.5);
      g.gain.exponentialRampToValueAtTime(0.001, now + 1.4);

      osc.connect(g);
      g.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 1.4);

      // White noise explosion / surge
      const bufferSize = this.ctx.sampleRate * 1.2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;
      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(300, now);
      noiseFilter.frequency.exponentialRampToValueAtTime(3200, now + 0.6);
      noiseFilter.frequency.exponentialRampToValueAtTime(200, now + 1.2);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.01, now);
      noiseGain.gain.linearRampToValueAtTime(0.2, now + 0.5);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

      whiteNoise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.masterGain);
      whiteNoise.start(now);
      whiteNoise.stop(now + 1.2);
    }

    // Stark HUD Click / Laser chirp
    playBlip(freq = 600, duration = 0.08) {
      if (!this.ctx || !state.soundEnabled) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + duration);

      g.gain.setValueAtTime(0.05, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(g);
      g.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + duration);
    }

    // Typing / streaming tick
    playTypeTick() {
      if (!this.ctx || !state.soundEnabled) return;
      if (Math.random() > 0.35) return; // Don't play every single character to keep it subtle
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800 + Math.random() * 400, now);

      g.gain.setValueAtTime(0.015, now);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);

      osc.connect(g);
      g.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.03);
    }

    // Ambient Arc Reactor Drone
    startArcReactorDrone() {
      if (!this.ctx || this.bgOsc1) return;
      const now = this.ctx.currentTime;
      this.bgOsc1 = this.ctx.createOscillator();
      this.bgOsc2 = this.ctx.createOscillator();
      this.bgGain = this.ctx.createGain();

      this.bgOsc1.type = 'sine';
      this.bgOsc1.frequency.setValueAtTime(65.41, now); // C2

      this.bgOsc2.type = 'triangle';
      this.bgOsc2.frequency.setValueAtTime(130.81, now); // C3

      this.bgGain.gain.setValueAtTime(0.001, now);
      this.bgGain.linearRampToValueAtTime(state.soundEnabled ? 0.02 : 0.0001, now + 3);

      this.bgOsc1.connect(this.bgGain);
      this.bgOsc2.connect(this.bgGain);
      this.bgGain.connect(this.masterGain);

      this.bgOsc1.start();
      this.bgOsc2.start();
    }

    setMuted(muted) {
      if (this.masterGain && this.ctx) {
        this.masterGain.gain.setValueAtTime(muted ? 0.0001 : 0.7, this.ctx.currentTime);
      }
    }
  }

  const audio = new MarvelAudioEngine();

  // ---- CUSTOM CURSOR & TRAIL ----
  const cursorDot = document.getElementById('cursor-dot');
  const cursorRing = document.getElementById('cursor-ring');
  const trailContainer = document.getElementById('cursor-trail-container');
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;
  let lastTrailTime = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (cursorDot) {
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    }

    // Emit subtle glowing particle trail
    const now = Date.now();
    if (now - lastTrailTime > 45 && trailContainer && !state.reducedMotion) {
      lastTrailTime = now;
      const particle = document.createElement('div');
      particle.className = 'cursor-trail';
      particle.style.left = `${mouseX}px`;
      particle.style.top = `${mouseY}px`;
      const colors = ['#FFD700', '#00D4FF', '#E8162A', '#9B59B6'];
      particle.style.background = colors[Math.floor(Math.random() * colors.length)];
      particle.style.boxShadow = `0 0 8px ${particle.style.background}`;
      trailContainer.appendChild(particle);
      setTimeout(() => particle.remove(), 600);
    }
  });

  // Smooth ring follow loop
  function updateRing() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    if (cursorRing) {
      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top = `${ringY}px`;
    }
    requestAnimationFrame(updateRing);
  }
  updateRing();

  // Hover detection for interactive elements
  function attachHoverEffects() {
    const interactables = document.querySelectorAll('button, a, textarea, input, .prompt-btn, .stone');
    interactables.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-hover');
        audio.playBlip(950, 0.04);
      });
      el.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-hover');
      });
    });
  }
  attachHoverEffects();

  // ---- INTRO CANVAS BACKGROUND ----
  const introCanvas = document.getElementById('intro-canvas');
  if (introCanvas) {
    const ctx = introCanvas.getContext('2d');
    let width = (introCanvas.width = window.innerWidth);
    let height = (introCanvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      if (introCanvas) {
        width = introCanvas.width = window.innerWidth;
        height = introCanvas.height = window.innerHeight;
      }
    });

    // Cosmic particles
    const particles = [];
    const particleCount = Math.min(120, Math.floor((width * height) / 12000));
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 0.5,
        color: ['#00D4FF', '#FFD700', '#E8162A', '#9B59B6', '#FFFFFF'][Math.floor(Math.random() * 5)],
        alpha: Math.random() * 0.7 + 0.2,
        pulseSpeed: Math.random() * 0.03 + 0.01,
      });
    }

    let introFrame;
    function renderIntroCanvas() {
      ctx.clearRect(0, 0, width, height);

      // Draw particles & subtle connection lines
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        p.alpha += Math.sin(Date.now() * p.pulseSpeed) * 0.01;
        const currentAlpha = Math.max(0.1, Math.min(0.9, p.alpha));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = currentAlpha;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.fill();

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 90) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = '#00D4FF';
            ctx.globalAlpha = (1 - dist / 90) * 0.15;
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;

      if (!document.getElementById('intro-screen').classList.contains('hidden')) {
        introFrame = requestAnimationFrame(renderIntroCanvas);
      }
    }
    renderIntroCanvas();
  }

  // ---- STATS NUMBER COUNTER ANIMATION ----
  function animateStats() {
    const statNums = document.querySelectorAll('.stat-num[data-count]');
    statNums.forEach((el) => {
      const target = parseInt(el.getAttribute('data-count'), 10);
      let current = 0;
      const step = Math.ceil(target / 30);
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          el.textContent = target;
          clearInterval(timer);
        } else {
          el.textContent = current;
        }
      }, 40);
    });
  }
  setTimeout(animateStats, 1200);

  // ---- CHAT CANVAS BACKGROUND (HUD & Constellation Network) ----
  const chatCanvas = document.getElementById('chat-canvas');
  let renderChatCanvas;
  if (chatCanvas) {
    const ctx = chatCanvas.getContext('2d');
    let width = (chatCanvas.width = window.innerWidth);
    let height = (chatCanvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      if (chatCanvas) {
        width = chatCanvas.width = window.innerWidth;
        height = chatCanvas.height = window.innerHeight;
      }
    });

    const nodes = [];
    const count = 50;
    for (let i = 0; i < count; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 1,
      });
    }

    renderChatCanvas = function () {
      ctx.clearRect(0, 0, width, height);

      // Connecting lines to mouse & between nodes
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;

        if (n.x < 0) n.x = width;
        if (n.x > width) n.x = 0;
        if (n.y < 0) n.y = height;
        if (n.y > height) n.y = 0;

        // Node dot
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.size, 0, Math.PI * 2);
        ctx.fillStyle = '#00D4FF';
        ctx.globalAlpha = 0.4;
        ctx.fill();

        // Connect to mouse if close
        const mDist = Math.hypot(n.x - mouseX, n.y - mouseY);
        if (mDist < 140) {
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(mouseX, mouseY);
          ctx.strokeStyle = '#FFD700';
          ctx.globalAlpha = (1 - mDist / 140) * 0.35;
          ctx.stroke();
        }

        // Connect to neighboring nodes
        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const dist = Math.hypot(n.x - n2.x, n.y - n2.y);
          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.strokeStyle = '#00D4FF';
            ctx.globalAlpha = (1 - dist / 110) * 0.12;
            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 1;
      requestAnimationFrame(renderChatCanvas);
    };
  }

  // ---- CINEMATIC TRANSITION (ENTER BUTTON) ----
  const enterBtn = document.getElementById('enter-btn');
  const introScreen = document.getElementById('intro-screen');
  const transitionOverlay = document.getElementById('transition-overlay');
  const chatScreen = document.getElementById('chat-screen');

  if (enterBtn) {
    enterBtn.addEventListener('click', () => {
      // Initialize audio on first user gesture
      audio.init();
      audio.resume();
      audio.playIntroSwell();
      audio.playWarpSound();
      audio.startArcReactorDrone();

      // Show transition portal
      transitionOverlay.classList.add('active');

      // Draw warp hyperspace lines on transition canvas
      const tCanvas = document.getElementById('transition-canvas');
      if (tCanvas) {
        const tCtx = tCanvas.getContext('2d');
        tCanvas.width = window.innerWidth;
        tCanvas.height = window.innerHeight;
        const centerX = tCanvas.width / 2;
        const centerY = tCanvas.height / 2;

        let stars = [];
        for (let i = 0; i < 300; i++) {
          stars.push({
            x: (Math.random() - 0.5) * tCanvas.width,
            y: (Math.random() - 0.5) * tCanvas.height,
            z: Math.random() * tCanvas.width,
          });
        }

        let warpActive = true;
        function warpLoop() {
          if (!warpActive) return;
          tCtx.fillStyle = 'rgba(5, 5, 8, 0.2)';
          tCtx.fillRect(0, 0, tCanvas.width, tCanvas.height);

          for (let s of stars) {
            s.z -= 16;
            if (s.z <= 0) {
              s.z = tCanvas.width;
              s.x = (Math.random() - 0.5) * tCanvas.width;
              s.y = (Math.random() - 0.5) * tCanvas.height;
            }

            const k = 250 / s.z;
            const px = s.x * k + centerX;
            const py = s.y * k + centerY;

            if (px >= 0 && px <= tCanvas.width && py >= 0 && py <= tCanvas.height) {
              const size = (1 - s.z / tCanvas.width) * 3;
              tCtx.beginPath();
              tCtx.arc(px, py, size, 0, Math.PI * 2);
              tCtx.fillStyle = '#00D4FF';
              tCtx.shadowColor = '#FFD700';
              tCtx.shadowBlur = 6;
              tCtx.fill();
            }
          }
          requestAnimationFrame(warpLoop);
        }
        warpLoop();

        setTimeout(() => {
          warpActive = false;
        }, 1600);
      }

      // Switch screens
      setTimeout(() => {
        introScreen.classList.add('hidden');
        document.body.classList.remove('no-scroll');
        chatScreen.classList.remove('hidden');
        chatScreen.classList.add('fade-in');

        // Start chat background loop
        if (renderChatCanvas) renderChatCanvas();

        setTimeout(() => {
          transitionOverlay.classList.remove('active');
          attachHoverEffects();
          document.getElementById('chat-input')?.focus();
        }, 400);
      }, 1500);
    });
  }

  // ---- CONTROLS (Sound, Clear, Motion) ----
  const soundToggle = document.getElementById('sound-toggle');
  const iconSoundOn = document.querySelector('.icon-sound-on');
  const iconSoundOff = document.querySelector('.icon-sound-off');

  soundToggle?.addEventListener('click', () => {
    state.soundEnabled = !state.soundEnabled;
    audio.setMuted(!state.soundEnabled);

    if (state.soundEnabled) {
      iconSoundOn.classList.remove('hidden');
      iconSoundOff.classList.add('hidden');
      audio.playBlip(750, 0.08);
    } else {
      iconSoundOn.classList.add('hidden');
      iconSoundOff.classList.remove('hidden');
    }
  });

  const motionToggle = document.getElementById('motion-toggle');
  motionToggle?.addEventListener('click', () => {
    state.reducedMotion = !state.reducedMotion;
    document.body.classList.toggle('reduced-motion', state.reducedMotion);
    audio.playBlip(600, 0.06);
    showToast(state.reducedMotion ? 'Reduced motion enabled' : 'Full animations enabled');
  });

  const clearChatBtn = document.getElementById('clear-chat');
  clearChatBtn?.addEventListener('click', () => {
    if (state.messages.length === 0) return;
    if (confirm('Avengers Protocol: Clear current conversation logs?')) {
      state.messages = [];
      const messagesContainer = document.getElementById('chat-messages');
      const welcomeArea = document.getElementById('welcome-area');
      if (messagesContainer) {
        messagesContainer.innerHTML = '';
        messagesContainer.classList.add('hidden');
      }
      if (welcomeArea) welcomeArea.classList.remove('hidden');
      audio.playBlip(400, 0.1);
      showToast('Conversation matrix cleared');
    }
  });

  // ---- TOAST NOTIFICATION ----
  const errorToast = document.getElementById('error-toast');
  const errorMessage = document.getElementById('error-message');
  let toastTimer;

  function showToast(msg, isError = false) {
    if (!errorToast || !errorMessage) return;
    clearTimeout(toastTimer);
    errorMessage.textContent = msg;
    if (isError) {
      errorToast.style.borderColor = 'rgba(232, 22, 42, 0.6)';
      errorToast.style.color = '#FF6B6B';
    } else {
      errorToast.style.borderColor = 'rgba(0, 212, 255, 0.6)';
      errorToast.style.color = '#00D4FF';
    }
    errorToast.classList.remove('hidden');
    toastTimer = setTimeout(() => {
      errorToast.classList.add('hidden');
    }, 4500);
  }

  // ---- CHAT INPUT & AUTO-RESIZE ----
  const chatInput = document.getElementById('chat-input');
  const sendBtn = document.getElementById('send-btn');
  const charCountNum = document.getElementById('char-count-num');
  const typingIndicator = document.getElementById('typing-indicator');
  const chatMessages = document.getElementById('chat-messages');
  const welcomeArea = document.getElementById('welcome-area');

  function resizeInput() {
    if (!chatInput) return;
    chatInput.style.height = 'auto';
    chatInput.style.height = `${Math.min(chatInput.scrollHeight, 180)}px`;
    if (charCountNum) charCountNum.textContent = chatInput.value.length;
  }

  chatInput?.addEventListener('input', resizeInput);

  chatInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  });

  sendBtn?.addEventListener('click', handleSend);

  // Suggested Prompts Click Handler
  const promptButtons = document.querySelectorAll('.prompt-btn');
  promptButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const promptText = btn.getAttribute('data-prompt');
      if (promptText && !state.isGenerating) {
        chatInput.value = promptText;
        resizeInput();
        handleSend();
      }
    });
  });

  // ---- MARKDOWN FORMATTER ----
  function formatMarkdown(text) {
    if (!text) return '';
    let html = text
      // Escape HTML entities to prevent XSS
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Code blocks ```code```
    html = html.replace(/```([\s\S]*?)```/g, (match, p1) => {
      return `<pre><code>${p1.trim()}</code></pre>`;
    });

    // Inline code `code`
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Headers ###, ##, #
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    // Bold **text**
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

    // Italic *text*
    html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');

    // Bullet lists
    html = html.replace(/^\s*[-*]\s+(.*)$/gim, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

    // Line breaks to paragraphs
    const paragraphs = html.split(/\n\n+/);
    html = paragraphs
      .map((p) => {
        p = p.trim();
        if (!p) return '';
        if (p.startsWith('<h') || p.startsWith('<pre') || p.startsWith('<ul>')) return p;
        return `<p>${p.replace(/\n/g, '<br>')}</p>`;
      })
      .join('');

    return html;
  }

  // Format current time HH:MM
  function getTimestamp() {
    const d = new Date();
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // Scroll to bottom smoothly
  function scrollToBottom() {
    if (chatMessages) {
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }

  // Append user message
  function appendUserMessage(text) {
    welcomeArea?.classList.add('hidden');
    chatMessages?.classList.remove('hidden');

    const msgEl = document.createElement('div');
    msgEl.className = 'message user';
    msgEl.innerHTML = `
      <div class="message-avatar">YOU</div>
      <div class="message-content">
        <div class="message-bubble">${text.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
        <div class="message-time">${getTimestamp()}</div>
      </div>
    `;
    chatMessages.appendChild(msgEl);
    scrollToBottom();
  }

  // Append empty AI message container for streaming
  function appendAIMessage() {
    welcomeArea?.classList.add('hidden');
    chatMessages?.classList.remove('hidden');

    const msgEl = document.createElement('div');
    msgEl.className = 'message ai';
    msgEl.innerHTML = `
      <div class="message-avatar">
        <svg viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="25,3 47,47 3,47" fill="none" stroke="#FFD700" stroke-width="3"/>
          <line x1="11" y1="37" x2="39" y2="37" stroke="#FFD700" stroke-width="3"/>
        </svg>
      </div>
      <div class="message-content">
        <div class="message-bubble streaming-cursor"></div>
        <div class="message-time">${getTimestamp()}</div>
      </div>
    `;
    chatMessages.appendChild(msgEl);
    scrollToBottom();
    return msgEl.querySelector('.message-bubble');
  }

  // ---- SEND MESSAGE & STREAMING HANDLER ----
  async function handleSend() {
    if (state.isGenerating) return;
    const text = chatInput?.value?.trim();
    if (!text) return;

    // Reset input
    chatInput.value = '';
    resizeInput();
    sendBtn.disabled = true;
    state.isGenerating = true;

    audio.playBlip(800, 0.08);

    // Add to messages and UI
    appendUserMessage(text);
    state.messages.push({ role: 'user', content: text });

    // Show loading state
    typingIndicator.classList.remove('hidden');
    scrollToBottom();

    let aiBubble = null;
    let fullResponse = '';

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: state.messages }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with status ${response.status}`);
      }

      typingIndicator.classList.add('hidden');
      aiBubble = appendAIMessage();

      // Read SSE stream
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop(); // keep last incomplete line

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data:')) continue;

          const dataStr = trimmed.slice(5).trim();
          if (dataStr === '[DONE]') {
            break;
          }

          try {
            const parsed = JSON.parse(dataStr);
            if (parsed.error) {
              throw new Error(parsed.error);
            }
            if (parsed.content) {
              fullResponse += parsed.content;
              aiBubble.innerHTML = formatMarkdown(fullResponse);
              audio.playTypeTick();
              scrollToBottom();
            }
          } catch (e) {
            if (e.message !== 'Unexpected end of JSON input') {
              console.warn('SSE parse error:', e);
            }
          }
        }
      }

      // Finalize message
      aiBubble.classList.remove('streaming-cursor');
      state.messages.push({ role: 'assistant', content: fullResponse });
      attachHoverEffects();
    } catch (err) {
      console.error('Chat error:', err);
      typingIndicator.classList.add('hidden');
      if (aiBubble) {
        aiBubble.classList.remove('streaming-cursor');
        aiBubble.innerHTML = `<span style="color:#FF6B6B">⚠️ Protocol Failure: ${err.message}</span>`;
      } else {
        showToast(err.message || 'Failed to connect to Marvel AI mainframe', true);
      }
    } finally {
      state.isGenerating = false;
      sendBtn.disabled = false;
      chatInput?.focus();
    }
  }
});
