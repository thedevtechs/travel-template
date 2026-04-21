/* ════════════════════════════════════════════
   SCROLL ANIMATION
════════════════════════════════════════════ */
const stage = document.getElementById('stage');
const seyClip = document.getElementById('sey-clip');
const seyVisual = document.getElementById('sey-visual');
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
const contactModal = document.getElementById('contact-modal');
const contactForm = document.getElementById('contact-form');
const bookingImage = document.querySelector('.booking-bg img');
const contactModalScene = document.getElementById('contact-modal-scene');
const contactRouteField = contactForm?.elements.namedItem('route');
const contactNotesField = contactForm?.elements.namedItem('notes');
const contactViews = contactModal ? Array.from(contactModal.querySelectorAll('[data-modal-view]')) : [];
const contactTriggers = Array.from(document.querySelectorAll('[data-contact-trigger]'));
const islandCards = Array.from(document.querySelectorAll('.islands .island'));
const islandModal = document.getElementById('island-modal');
const islandModalKicker = document.getElementById('island-modal-kicker');
const islandModalIndex = document.getElementById('island-modal-index');
const islandModalTitle = document.getElementById('island-modal-title');
const islandModalDescription = document.getElementById('island-modal-description');
const islandModalMedia = document.getElementById('island-modal-media');
const islandModalChips = [
  document.getElementById('island-modal-chip-1'),
  document.getElementById('island-modal-chip-2'),
  document.getElementById('island-modal-chip-3')
];
const islandModalSpotlight = document.getElementById('island-modal-spotlight');
const islandModalStatValues = [
  document.getElementById('island-modal-stat-value-1'),
  document.getElementById('island-modal-stat-value-2'),
  document.getElementById('island-modal-stat-value-3')
];
const islandModalStatLabels = [
  document.getElementById('island-modal-stat-label-1'),
  document.getElementById('island-modal-stat-label-2'),
  document.getElementById('island-modal-stat-label-3')
];
const islandModalLabels = [
  document.getElementById('island-modal-label-1'),
  document.getElementById('island-modal-label-2'),
  document.getElementById('island-modal-label-3')
];
const islandModalDetails = [
  document.getElementById('island-modal-detail-1'),
  document.getElementById('island-modal-detail-2'),
  document.getElementById('island-modal-detail-3')
];
const islandModalCharter = document.getElementById('island-modal-charter');
const mobileBreakpoint = window.matchMedia('(max-width: 768px)');
const HERO_IMAGE_SRC = 'assets/images/seychelles-hero-aerial.jpg';

let zoomIntensity = 1;
let lastContactTrigger = null;
let lastIslandTrigger = null;
let activeIslandId = null;
let lockedScrollY = 0;
let bodyLockStyles = null;

const islandContent = {
  mahe: {
    kicker: 'Island One',
    index: '01',
    title: 'Mahé',
    description: 'The principal arrival island, where private aviation, marina departures, and hillside estates connect in the most seamless way.',
    chips: ['Private arrivals', 'Villa access', 'Marina links'],
    spotlight: 'The polished gateway into Seychelles.',
    stats: [
      { value: '01', label: 'Primary arrival island' },
      { value: '24/7', label: 'Charter coordination' },
      { value: 'Fast', label: 'Runway to resort timing' }
    ],
    cards: [
      { label: 'Arrival Rhythm', detail: 'A refined first touchdown with straightforward ground handling, resort transfers, and the easiest onward coordination.' },
      { label: 'Why It Matters', detail: 'Best when the trip starts with a major villa arrival, yacht connection, or guests who want everything lined up from the runway forward.' },
      { label: 'Best For', detail: 'Travellers wanting the strongest mix of access, privacy, and polished logistics before moving through the rest of Seychelles.' }
    ],
    charterNote: 'Interested in planning a Mahé arrival and onward charter coordination.'
  },
  praslin: {
    kicker: 'Island Two',
    index: '02',
    title: 'Praslin',
    description: 'More hushed and garden-like, with quick access to iconic beaches and a calmer pace the moment the arrival settles.',
    chips: ['Beach estates', 'Slow luxury', 'Nature-led'],
    spotlight: 'A quieter handoff into barefoot island life.',
    stats: [
      { value: '02', label: 'Second-island pace' },
      { value: 'Soft', label: 'Arrival atmosphere' },
      { value: 'Calm', label: 'Resort-first rhythm' }
    ],
    cards: [
      { label: 'Arrival Rhythm', detail: 'A softer handoff into resort life, ideal for guests who want the island portion of the journey to begin immediately.' },
      { label: 'Why It Matters', detail: 'Strong choice for couples, slow-luxury stays, and itineraries built around beach time rather than transit between stops.' },
      { label: 'Best For', detail: 'Travellers prioritising quiet villas, natural beauty, and a shorter path from aircraft planning to true downtime.' }
    ],
    charterNote: 'Interested in a Praslin-focused charter with quiet arrival planning.'
  },
  ladigue: {
    kicker: 'Island Three',
    index: '03',
    title: 'La Digue',
    description: 'The most unhurried of the three, better suited to travellers who want intimacy, low-key movement, and the feeling of slipping off-grid elegantly.',
    chips: ['Low-key', 'Timeless', 'Retreat-minded'],
    spotlight: 'The most intimate finish to a Seychelles journey.',
    stats: [
      { value: '03', label: 'Most secluded feel' },
      { value: 'Quiet', label: 'Arrival energy' },
      { value: 'Slow', label: 'Island cadence' }
    ],
    cards: [
      { label: 'Arrival Rhythm', detail: 'A more delicate transfer sequence, but one that rewards careful planning with a deeply private final approach.' },
      { label: 'Why It Matters', detail: 'This island is about texture and atmosphere, so the journey works best when every handoff is timed to feel effortless.' },
      { label: 'Best For', detail: 'Travellers who want Seychelles at its most timeless, with minimal noise and maximum sense of retreat.' }
    ],
    charterNote: 'Interested in a La Digue transfer plan with discreet charter support.'
  }
};

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

function setHeroVisualScale(scale) {
  if (seyImg instanceof HTMLImageElement) {
    seyImg.style.transform = `scale(${scale}) translateZ(0)`;
  }
}

function primeHeroImage() {
  if (!(seyImg instanceof HTMLImageElement)) return;

  seyImg.loading = 'eager';
  seyImg.decoding = 'async';
  seyImg.fetchPriority = 'high';

  if (seyImg.getAttribute('src') !== HERO_IMAGE_SRC) {
    seyImg.setAttribute('src', HERO_IMAGE_SRC);
  }

  if (seyVisual) {
    seyVisual.style.display = 'none';
  }

  if (seyImg.complete) {
    requestAnimationFrame(tick);
    return;
  }

  seyImg.addEventListener('load', () => {
    requestAnimationFrame(tick);
  }, { once: true });
}

function scheduleStageSync() {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(tick);
    });
  });
}

function hasOpenModal() {
  return Boolean(
    contactModal?.classList.contains('is-open') ||
    islandModal?.classList.contains('is-open')
  );
}

function getActiveModal() {
  if (contactModal?.classList.contains('is-open')) return contactModal;
  if (islandModal?.classList.contains('is-open')) return islandModal;
  return null;
}

function isInsideActiveModal(target) {
  const modal = getActiveModal();
  return Boolean(modal && target instanceof Node && modal.contains(target));
}

function findScrollableAncestor(node) {
  let el = node instanceof Element ? node : null;
  const modal = getActiveModal();

  while (el && modal && modal.contains(el)) {
    const style = window.getComputedStyle(el);
    const canScrollY =
      /(auto|scroll|overlay)/.test(style.overflowY) &&
      el.scrollHeight > el.clientHeight + 1;

    if (canScrollY) return el;
    el = el.parentElement;
  }

  return null;
}

function allowTouchScrollWithinModal(event) {
  const scrollable = findScrollableAncestor(event.target);
  if (!scrollable) return false;

  const touch = event.touches?.[0];
  if (!touch) return true;

  const currentY = touch.clientY;
  const lastY = allowTouchScrollWithinModal.lastY ?? currentY;
  const deltaY = currentY - lastY;
  allowTouchScrollWithinModal.lastY = currentY;

  const atTop = scrollable.scrollTop <= 0;
  const atBottom =
    scrollable.scrollTop + scrollable.clientHeight >= scrollable.scrollHeight - 1;

  if ((atTop && deltaY > 0) || (atBottom && deltaY < 0)) {
    return false;
  }

  return true;
}
allowTouchScrollWithinModal.lastY = null;

function resetTouchTracking() {
  allowTouchScrollWithinModal.lastY = null;
}

function handleGlobalWheelLock(event) {
  if (!hasOpenModal()) return;
  if (!isInsideActiveModal(event.target)) {
    event.preventDefault();
    return;
  }

  const scrollable = findScrollableAncestor(event.target);
  if (!scrollable) {
    event.preventDefault();
    return;
  }

  const deltaY = event.deltaY;
  const atTop = scrollable.scrollTop <= 0;
  const atBottom =
    scrollable.scrollTop + scrollable.clientHeight >= scrollable.scrollHeight - 1;

  if ((atTop && deltaY < 0) || (atBottom && deltaY > 0)) {
    event.preventDefault();
  }
}

function handleGlobalTouchMoveLock(event) {
  if (!hasOpenModal()) return;
  if (!isInsideActiveModal(event.target)) {
    event.preventDefault();
    return;
  }

  if (!allowTouchScrollWithinModal(event)) {
    event.preventDefault();
  }
}

function handleGlobalTouchStartLock() {
  if (!hasOpenModal()) return;
  resetTouchTracking();
}

function lockPageScroll() {
  lockedScrollY = window.scrollY || document.documentElement.scrollTop || 0;

  if (!bodyLockStyles) {
    bodyLockStyles = {
      position: document.body.style.position,
      top: document.body.style.top,
      left: document.body.style.left,
      right: document.body.style.right,
      width: document.body.style.width,
      overflow: document.body.style.overflow
    };
  }

  document.body.style.position = 'fixed';
  document.body.style.top = `-${lockedScrollY}px`;
  document.body.style.left = '0';
  document.body.style.right = '0';
  document.body.style.width = '100%';
  document.body.style.overflow = 'hidden';
}

function unlockPageScroll() {
  const y = lockedScrollY;
  const saved = bodyLockStyles;

  document.body.style.position = saved?.position ?? '';
  document.body.style.top = saved?.top ?? '';
  document.body.style.left = saved?.left ?? '';
  document.body.style.right = saved?.right ?? '';
  document.body.style.width = saved?.width ?? '';
  document.body.style.overflow = saved?.overflow ?? '';

  bodyLockStyles = null;
  resetTouchTracking();

  requestAnimationFrame(() => {
    window.scrollTo(0, y);
    requestAnimationFrame(() => {
      window.scrollTo(0, y);
    });
  });
}

function syncModalState() {
  const open = hasOpenModal();

  document.body.classList.toggle('modal-open', open);

  if (open) {
    if (document.body.style.position !== 'fixed') {
      lockPageScroll();
    }
  } else if (document.body.style.position === 'fixed') {
    unlockPageScroll();
  }
}

// Smooth, cinematic zoom curve — no explosive jump
function zoomCurve(t) {
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

function resetStageToInitial(config = getWindowConfig()) {
  seyClip.style.top = '';
  seyClip.style.left = '';
  seyClip.style.transform = '';
  seyClip.style.clipPath = `ellipse(${config.clipX}vmin ${config.clipY}vmin at ${config.x}% ${config.y}%)`;
  pRing.style.top = `${config.y}%`;
  pRing.style.left = `${config.x}%`;
  pInner.style.top = `${config.y}%`;
  pInner.style.left = `${config.x}%`;
  pRing.style.transform = `translate(-50%,-50%) scale(${config.baseScale})`;
  pInner.style.transform = `translate(-50%,-50%) scale(${config.baseScale * 0.88})`;
  pRing.style.opacity = String(config.baseOpacity);
  pInner.style.opacity = String(config.baseOpacity);

  seyClip.style.opacity = String(config.baseOpacity);
  setHeroVisualScale(config.imageStart);

  cabinEl.style.opacity = '1';
  cabinGlow.style.opacity = '1';
  document
    .querySelectorAll('.cabin-overhead,.cabin-vignette-l,.cabin-vignette-r,.cabin-seats')
    .forEach(el => {
      el.style.opacity = '1';
    });

  bloom.style.opacity = '0';

  heroL1.style.opacity = '1';
  heroL1.style.transform = 'translateX(-50%) translateY(0px)';
  nudge.style.opacity = '1';

  heroL3.style.top = `${config.arrivalY}%`;
  heroL3.style.opacity = '0';
  heroL3.style.filter = 'blur(18px)';
  heroL3.style.transform = 'translate(-50%, calc(-50% + 90px)) scale(0.9)';

  arrivalWord.style.opacity = '0.65';
  arrivalWord.style.transform = 'translateY(20px)';
  arrivalCoord.style.opacity = '0';
  arrivalCoord.style.transform = 'translateY(28px)';

  nav.classList.remove('scrolled');
}

function tick() {
  if (hasOpenModal()) return;

  const stageStart = stage.offsetTop;
  const stageScrollRange = Math.max(stage.offsetHeight - window.innerHeight, 1);
  const pageTop = window.scrollY || document.documentElement.scrollTop || 0;
  const config = getWindowConfig();

  if (pageTop <= stageStart + 1) {
    resetStageToInitial(config);
    return;
  }

  const raw = clamp((pageTop - stageStart) / stageScrollRange, 0, 1);
  const p = clamp(raw * zoomIntensity, 0, 1);

  const zE = zoomCurve(clamp(p / 0.85, 0, 1));

  const k = lerp(config.baseScale, 20, zE);
  const clipScale = k / config.baseScale;
  seyClip.style.top = '';
  seyClip.style.left = '';
  seyClip.style.transform = '';
  pRing.style.top = `${config.y}%`;
  pRing.style.left = `${config.x}%`;
  pInner.style.top = `${config.y}%`;
  pInner.style.left = `${config.x}%`;
  pRing.style.transform = `translate(-50%,-50%) scale(${k})`;
  pInner.style.transform = `translate(-50%,-50%) scale(${k * 0.88})`;

  seyClip.style.clipPath = `ellipse(${config.clipX * clipScale}vmin ${config.clipY * clipScale}vmin at ${config.x}% ${config.y}%)`;
  seyClip.style.opacity = config.baseOpacity + ((1 - config.baseOpacity) * easeOut(zE));

  setHeroVisualScale(lerp(config.imageStart, config.imageEnd, easeInOut(zE)));

  pRing.style.opacity = Math.max(0, config.baseOpacity - (k - config.baseScale) / 6);
  pInner.style.opacity = Math.max(0, config.baseOpacity - (k - config.baseScale) / 5);

  const cabinFade = Math.max(0, 1 - easeInOut(clamp(p / 0.55, 0, 1)));
  cabinEl.style.opacity = cabinFade;
  cabinGlow.style.opacity = cabinFade;
  document
    .querySelectorAll('.cabin-overhead,.cabin-vignette-l,.cabin-vignette-r,.cabin-seats')
    .forEach(el => {
      el.style.opacity = Math.max(0, 1 - easeInOut(clamp(p / 0.45, 0, 1)));
    });

  const bloomIn = clamp((p - 0.60) / 0.25, 0, 1);
  bloom.style.opacity = easeOut(bloomIn) * 0.7;

  const l1Out = clamp(p / 0.20, 0, 1);
  heroL1.style.opacity = 1 - easeOut(l1Out);
  heroL1.style.transform = `translateX(-50%) translateY(${l1Out * 24}px)`;
  nudge.style.opacity = 1 - easeOut(clamp(p / 0.12, 0, 1));

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

  nav.classList.toggle('scrolled', window.scrollY > 100);
}

window.addEventListener('scroll', tick, { passive: true });
window.addEventListener('resize', scheduleStageSync);
window.addEventListener('pageshow', scheduleStageSync);
window.addEventListener('load', scheduleStageSync);
document.addEventListener('wheel', handleGlobalWheelLock, { passive: false });
document.addEventListener('touchstart', handleGlobalTouchStartLock, { passive: true });
document.addEventListener('touchmove', handleGlobalTouchMoveLock, { passive: false });

primeHeroImage();
tick();
scheduleStageSync();

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
  el.addEventListener('click', () => {
    setNavOpen(false);
  });
});

document.querySelectorAll('.nav-cta').forEach(el => {
  el.addEventListener('click', () => {
    setNavOpen(false);
    openContactModal(el);
  });
});

document.addEventListener('click', e => {
  if (!mobileBreakpoint.matches || !nav.classList.contains('open')) return;
  if (!nav.contains(e.target)) setNavOpen(false);
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && islandModal?.classList.contains('is-open')) {
    closeIslandModal();
    return;
  }

  if (e.key === 'Escape' && contactModal?.classList.contains('is-open')) {
    closeContactModal();
    return;
  }

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
  scheduleStageSync();
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

const dayObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      dayObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.itin-day').forEach(el => dayObserver.observe(el));

/* ════════════════════════════════════════════
   CONTACT MODAL
════════════════════════════════════════════ */
function setContactView(viewName) {
  contactViews.forEach(view => {
    view.classList.toggle('is-active', view.dataset.modalView === viewName);
  });
}

function openContactModal(trigger, preset = {}) {
  if (!contactModal) return;
  lastContactTrigger = trigger ?? null;
  setContactView('form');
  contactModal.classList.add('is-open');
  contactModal.setAttribute('aria-hidden', 'false');

  if (typeof preset.route === 'string' && contactRouteField instanceof HTMLSelectElement) {
    contactRouteField.value = preset.route;
  }

  if (typeof preset.notes === 'string' && contactNotesField instanceof HTMLTextAreaElement) {
    contactNotesField.value = preset.notes;
  }

  syncModalState();
  contactModal.querySelector('input, textarea, button')?.focus({ preventScroll: true });
  scheduleStageSync();
}

function closeContactModal() {
  if (!contactModal) return;
  contactModal.classList.remove('is-open');
  contactModal.setAttribute('aria-hidden', 'true');
  setContactView('form');
  syncModalState();
  lastContactTrigger?.focus({ preventScroll: true });
  scheduleStageSync();
}

function renderIslandModal(islandId) {
  const content = islandContent[islandId];
  if (!content) return;

  islandModalKicker.textContent = content.kicker;
  islandModalIndex.textContent = content.index;
  islandModalTitle.textContent = content.title;
  islandModalDescription.textContent = content.description;
  islandModalSpotlight.textContent = content.spotlight;

  content.chips.forEach((chip, index) => {
    islandModalChips[index].textContent = chip;
  });

  content.stats.forEach((stat, index) => {
    islandModalStatValues[index].textContent = stat.value;
    islandModalStatLabels[index].textContent = stat.label;
  });

  content.cards.forEach((card, index) => {
    islandModalLabels[index].textContent = card.label;
    islandModalDetails[index].textContent = card.detail;
  });
}

function openIslandModal(islandId, trigger) {
  if (!islandModal || !islandContent[islandId]) return;
  activeIslandId = islandId;
  lastIslandTrigger = trigger ?? null;
  renderIslandModal(islandId);

  const islandImage = trigger?.querySelector('img');
  if (islandImage instanceof HTMLImageElement) {
    islandModalMedia.style.backgroundImage =
      `linear-gradient(180deg, oklch(0% 0 0 / .04), oklch(0% 0 0 / .56)), url("${islandImage.src}")`;
  }

  islandModal.classList.add('is-open');
  islandModal.setAttribute('aria-hidden', 'false');
  syncModalState();
  islandModal.querySelector('[data-close-island-modal]')?.focus({ preventScroll: true });
  scheduleStageSync();
}

function closeIslandModal(restoreFocus = true) {
  if (!islandModal) return;
  islandModal.classList.remove('is-open');
  islandModal.setAttribute('aria-hidden', 'true');
  activeIslandId = null;
  syncModalState();

  if (restoreFocus) {
    lastIslandTrigger?.focus({ preventScroll: true });
  }

  scheduleStageSync();
}

contactTriggers.forEach(trigger => {
  if (trigger.classList.contains('nav-cta')) return;
  trigger.addEventListener('click', () => openContactModal(trigger));
});

contactModal?.querySelectorAll('[data-close-modal]').forEach(el => {
  el.addEventListener('click', closeContactModal);
});

contactForm?.addEventListener('submit', e => {
  e.preventDefault();
  contactForm.reset();
  setContactView('success');
  contactModal?.querySelector('.contact-modal__done')?.focus({ preventScroll: true });
});

islandCards.forEach((card, index) => {
  const islandId = ['mahe', 'praslin', 'ladigue'][index];
  if (!islandId) return;

  card.setAttribute('role', 'button');
  card.setAttribute('tabindex', '0');
  card.setAttribute('aria-haspopup', 'dialog');
  card.setAttribute('aria-label', `Open ${islandContent[islandId].title} details`);

  card.addEventListener('click', () => openIslandModal(islandId, card));
  card.addEventListener('keydown', e => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    openIslandModal(islandId, card);
  });
});

islandModal?.querySelectorAll('[data-close-island-modal]').forEach(el => {
  el.addEventListener('click', () => closeIslandModal());
});

islandModalCharter?.addEventListener('click', () => {
  const content = activeIslandId ? islandContent[activeIslandId] : null;
  const trigger = lastIslandTrigger ?? islandModalCharter;
  closeIslandModal(false);
  openContactModal(trigger, {
    notes: content?.charterNote ?? ''
  });
});

if (bookingImage instanceof HTMLImageElement && contactModalScene) {
  contactModalScene.style.backgroundImage = `linear-gradient(180deg, oklch(0% 0 0 / .08), oklch(0% 0 0 / .52)), url("${bookingImage.src}")`;
}

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

applyAccent(TWEAK_DEFAULTS.accent);
zoomIntensity = TWEAK_DEFAULTS.zoomIntensity;
document.getElementById('tw-zoom').value = zoomIntensity;
document.getElementById('tw-voice').value = TWEAK_DEFAULTS.voice;
const initVoice = voiceMap[TWEAK_DEFAULTS.voice] || voiceMap.poetic;
document.querySelector('.hero-l1-line1').textContent = initVoice.l1a;
document.querySelector('.hero-l1-line2').textContent = initVoice.l1b;