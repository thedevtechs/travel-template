/* ════════════════════════════════════════════
   SCROLL ANIMATION
════════════════════════════════════════════ */
const stage = document.getElementById('stage');
const seyClip = document.getElementById('sey-clip');
const seyImg = document.getElementById('sey-img');
const pRing = document.getElementById('p-ring');
const pInner = document.getElementById('p-inner');
const bloom = document.getElementById('bloom');
const cabinEl = document.getElementById('cabin');
const cabinGlow = document.getElementById('cabin-glow');
const heroL1 = document.getElementById('hero-l1');
const heroL3 = document.getElementById('hero-l3');
const arrivalWord = heroL3.querySelector('.arrival-word');
const arrivalCoord = heroL3.querySelector('.arrival-coord');
const nudge = document.getElementById('nudge');
const nav = document.getElementById('nav');
const navToggle = document.getElementById('nav-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const bookSection = document.getElementById('book');
const mobileBreakpoint = window.matchMedia('(max-width: 768px)');

let zoomIntensity = 1;

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const lerp = (a, b, t) => a + (b - a) * t;

function easeInOut(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function easeOut(t) {
  return 1 - Math.pow(1 - t, 3);
}

function easeIn(t) {
  return t * t * t;
}

// Smooth, cinematic zoom curve — no explosive jump
function zoomCurve(t) {
  // Gentle ease-in, then steady ease-out. No sudden acceleration.
  return easeInOut(t);
}

function getWindowConfig() {
  if (mobileBreakpoint.matches) {
    return {
      x: 50,
      y: 41,
      baseScale: 1.70771,
      baseOpacity: 0.882048,
      clipX: 39.3,
      clipY: 51.3,
      imageStart: 1.02,
      imageEnd: 1.22,
      arrivalY: 47
    };
  }

  return {
    x: 50,
    y: 50,
    baseScale: 1,
    baseOpacity: 1,
    clipX: 23,
    clipY: 30,
    imageStart: 1.08,
    imageEnd: 1.28,
    arrivalY: 50
  };
}

function tick() {
  const rect = stage.getBoundingClientRect();
  const scrollable = stage.offsetHeight - window.innerHeight;
  const raw = clamp(-rect.top / scrollable, 0, 1);
  const p = clamp(raw * zoomIntensity, 0, 1);
  const config = getWindowConfig();

  // zE drives everything — 0 = porthole at rest, 1 = fully open
  const zE = zoomCurve(clamp(p / 0.85, 0, 1));

  // Scale factor for porthole ring
  const k = lerp(config.baseScale, 20, zE);
  const clipScale = k / config.baseScale;
  pRing.style.top = `${config.y}%`;
  pRing.style.left = `${config.x}%`;
  pInner.style.top = `${config.y}%`;
  pInner.style.left = `${config.x}%`;
  pRing.style.transform = `translate(-50%,-50%) scale(${k})`;
  pInner.style.transform = `translate(-50%,-50%) scale(${k * 0.88})`;

  // Clip path tracks ring
  seyClip.style.clipPath = `ellipse(${config.clipX * clipScale}vmin ${config.clipY * clipScale}vmin at ${config.x}% ${config.y}%)`;
  seyClip.style.opacity = config.baseOpacity + ((1 - config.baseOpacity) * easeOut(zE));

  // Image creeps forward as we punch through
  seyImg.style.transform = `scale(${lerp(config.imageStart, config.imageEnd, easeInOut(zE))})`;

  // Ring fades as it expands past the screen
  pRing.style.opacity = Math.max(0, config.baseOpacity - (k - config.baseScale) / 6);
  pInner.style.opacity = Math.max(0, config.baseOpacity - (k - config.baseScale) / 5);

  // Cabin layers fade out together, smoothly
  const cabinFade = Math.max(0, 1 - easeInOut(clamp(p / 0.55, 0, 1)));
  cabinEl.style.opacity = cabinFade;
  cabinGlow.style.opacity = cabinFade;
  document
    .querySelectorAll('.cabin-overhead,.cabin-vignette-l,.cabin-vignette-r,.cabin-seats')
    .forEach(el => {
      el.style.opacity = Math.max(0, 1 - easeInOut(clamp(p / 0.45, 0, 1)));
    });

  // ── BLOOM — gentle warm glow that rises WITH the arrival text, not before ──
  // Starts fading in at p=0.60, peaks at p=0.80, holds
  const bloomIn = clamp((p - 0.60) / 0.25, 0, 1);
  bloom.style.opacity = easeOut(bloomIn) * 0.7;

  // ── HERO COPY ──
  // L1 fades out in the first 20% of scroll
  const l1Out = clamp(p / 0.20, 0, 1);
  heroL1.style.opacity = 1 - easeOut(l1Out);
  heroL1.style.transform = `translateX(-50%) translateY(${l1Out * 24}px)`;
  nudge.style.opacity = 1 - easeOut(clamp(p / 0.12, 0, 1));

  // L3 — animate the entire arrival lockup onto the screen as the image settles
  const l3In = clamp((p - 0.58) / 0.24, 0, 1);
  const l3E = easeOut(l3In);
  const l3Scale = lerp(0.9, 1, l3E);
  const l3Blur = lerp(18, 0, l3E);
  const l3Y = lerp(90, 0, l3E);
  const coordIn = easeOut(clamp((l3In - 0.15) / 0.85, 0, 1));

  heroL3.style.top = `${config.arrivalY}%`;
  heroL3.style.opacity = l3E;
  heroL3.style.filter = `blur(${l3Blur}px)`;
  heroL3.style.transform = `translate(-50%, calc(-50% + ${l3Y}px)) scale(${l3Scale})`;

  arrivalWord.style.opacity = lerp(0.65, 1, l3E);
  arrivalWord.style.transform = `translateY(${lerp(20, 0, l3E)}px)`;

  arrivalCoord.style.opacity = coordIn;
  arrivalCoord.style.transform = `translateY(${lerp(28, 0, coordIn)}px)`;

  // Nav bg on scroll
  nav.classList.toggle('scrolled', window.scrollY > 100);
}

window.addEventListener('scroll', tick, { passive: true });
tick();

function setNavOpen(isOpen) {
  nav.classList.toggle('open', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));
  navToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
  document.body.classList.toggle('menu-open', isOpen && mobileBreakpoint.matches);
}

navToggle.addEventListener('click', () => {
  setNavOpen(!nav.classList.contains('open'));
});

mobileMenu.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('click', () => setNavOpen(false));
});

document.querySelectorAll('.nav-cta').forEach(el => {
  el.addEventListener('click', () => {
    setNavOpen(false);
    bookSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

document.addEventListener('click', e => {
  if (!mobileBreakpoint.matches || !nav.classList.contains('open')) return;
  if (!nav.contains(e.target)) setNavOpen(false);
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && nav.classList.contains('open')) {
    setNavOpen(false);
    navToggle.focus();
  }
});

nudge.addEventListener('click', () => {
  const stageScrollRange = stage.offsetHeight - window.innerHeight;
  const targetProgress = mobileBreakpoint.matches ? 0.8 : 0.76;
  const targetTop = stage.offsetTop + (stageScrollRange * targetProgress);

  window.scrollTo({
    top: targetTop,
    behavior: 'smooth'
  });

  requestAnimationFrame(tick);
});

mobileBreakpoint.addEventListener('change', () => {
  setNavOpen(false);
  tick();
});

/* ════════════════════════════════════════════
   INTERSECTION REVEALS
════════════════════════════════════════════ */
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.15 });

document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));

/* ════════════════════════════════════════════
   TWEAKS
════════════════════════════════════════════ */
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "gold",
  "zoomIntensity": 1,
  "voice": "poetic"
}/*EDITMODE-END*/;

const accentMap = {
  gold: { gold: 'oklch(72% .13 72)', gold2: 'oklch(56% .09 72)', teal: 'oklch(76% .115 192)' },
  teal: { gold: 'oklch(76% .115 192)', gold2: 'oklch(58% .09 192)', teal: 'oklch(72% .115 192)' },
  silver: { gold: 'oklch(72% .022 240)', gold2: 'oklch(55% .015 240)', teal: 'oklch(76% .115 192)' },
  rose: { gold: 'oklch(72% .12 15)', gold2: 'oklch(56% .09 15)', teal: 'oklch(76% .115 192)' }
};

const voiceMap = {
  poetic: { l1a: 'Leave the noise below.', l1b: 'Keep only what matters.' },
  spare: { l1a: 'Seychelles.', l1b: 'By private jet.' },
  bold: { l1a: 'Your aircraft.', l1b: 'Your island. Your time.' }
};

function applyAccent(name) {
  const a = accentMap[name] || accentMap.gold;
  const rootStyle = document.documentElement.style;
  rootStyle.setProperty('--gold', a.gold);
  rootStyle.setProperty('--gold2', a.gold2);
  rootStyle.setProperty('--teal', a.teal);
  document.querySelectorAll('.tw-sw').forEach(s => s.classList.toggle('on', s.dataset.a === name));
}

window.addEventListener('message', ev => {
  if (ev.data?.type === '__activate_edit_mode') document.getElementById('tweaks').classList.add('open');
  if (ev.data?.type === '__deactivate_edit_mode') document.getElementById('tweaks').classList.remove('open');
});

window.parent.postMessage({ type: '__edit_mode_available' }, '*');

document.querySelectorAll('.tw-sw').forEach(s => {
  s.addEventListener('click', () => {
    applyAccent(s.dataset.a);
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { accent: s.dataset.a } }, '*');
  });
});

document.getElementById('tw-zoom').addEventListener('input', e => {
  zoomIntensity = parseFloat(e.target.value);
  tick();
  window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { zoomIntensity } }, '*');
});

document.getElementById('tw-voice').addEventListener('change', e => {
  const v = voiceMap[e.target.value] || voiceMap.poetic;
  document.querySelector('.hero-l1-line1').textContent = v.l1a;
  document.querySelector('.hero-l1-line2').textContent = v.l1b;
  window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { voice: e.target.value } }, '*');
});

// Init from defaults
applyAccent(TWEAK_DEFAULTS.accent);
zoomIntensity = TWEAK_DEFAULTS.zoomIntensity;
document.getElementById('tw-zoom').value = zoomIntensity;
document.getElementById('tw-voice').value = TWEAK_DEFAULTS.voice;
const initVoice = voiceMap[TWEAK_DEFAULTS.voice] || voiceMap.poetic;
document.querySelector('.hero-l1-line1').textContent = initVoice.l1a;
document.querySelector('.hero-l1-line2').textContent = initVoice.l1b;
