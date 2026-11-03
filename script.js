(() => {
  'use strict';

  // ---------- Configuration ----------

  const RULES = [
    { label: 'At least 8 characters',                                  test: pw => pw.length >= 8 },
    { label: 'At least one uppercase letter (A–Z)',                    test: pw => /[A-Z]/.test(pw) },
    { label: 'At least one lowercase letter (a–z)',                    test: pw => /[a-z]/.test(pw) },
    { label: 'At least one number (0–9)',                              test: pw => /[0-9]/.test(pw) },
    { label: 'At least one special character (!@#$%^&*(),.?":{}|<>)', test: pw => /[!@#$%^&*(),.?":{}|<>]/.test(pw) }
  ];

  const LEVELS = [
    { label: '',           color: '' },
    { label: 'Very weak',  color: '#ef4444' },
    { label: 'Weak',       color: '#f97316' },
    { label: 'Fair',       color: '#eab308' },
    { label: 'Good',       color: '#84cc16' },
    { label: 'Strong',     color: '#22c55e' }
  ];

  const UPPER   = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const LOWER   = 'abcdefghijklmnopqrstuvwxyz';
  const DIGITS  = '0123456789';
  const SPECIAL = '!@#$%^&*(),.?":{}|<>';
  const ALL     = UPPER + LOWER + DIGITS + SPECIAL;

  const EYE_ICON = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
         stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>`;

  const EYE_OFF_ICON = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
         stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>`;

  // ---------- DOM references ----------

  const input       = document.getElementById('password');
  const toggleBtn   = document.getElementById('toggle');
  const segmentsEl  = document.getElementById('segments');
  const labelEl     = document.getElementById('strength-label');
  const rulesEl     = document.getElementById('rules');
  const generateBtn = document.getElementById('generate');
  const hintEl      = document.getElementById('hint');

  const segments = RULES.map(() => {
    const seg = document.createElement('span');
    seg.className = 'segment';
    segmentsEl.appendChild(seg);
    return seg;
  });

  const ruleItems = RULES.map(rule => {
    const li = document.createElement('li');
    li.className = 'rule';

    const icon = document.createElement('span');
    icon.className = 'icon';
    icon.textContent = '❌';

    const text = document.createElement('span');
    text.textContent = rule.label;

    li.append(icon, text);
    rulesEl.appendChild(li);
    return li;
  });

  toggleBtn.innerHTML = EYE_ICON;

  // ---------- Core logic ----------

  function updateUI() {
    const pw = input.value;

    const results = RULES.map(rule => rule.test(pw));
    const score = results.filter(Boolean).length;

    results.forEach((passed, i) => {
      ruleItems[i].classList.toggle('met', passed);
      ruleItems[i].firstElementChild.textContent = passed ? '✅' : '❌';
    });

    const level = LEVELS[score];
    segments.forEach((seg, i) => {
      seg.style.backgroundColor = i < score ? level.color : '';
    });

    labelEl.textContent = pw ? level.label : '';
    labelEl.style.color = level.color;

    if (!pw) {
      hintEl.textContent = 'Start typing, or generate a strong password below.';
    } else if (score === RULES.length && pw.length < 12) {
      hintEl.textContent = 'Tip: 12+ characters makes a password even harder to crack.';
    } else {
      hintEl.textContent = '';
    }
  }

  // ---------- Secure random generation ----------

  function randomInt(max) {
    const limit = Math.floor(0x100000000 / max) * max;
    const buf = new Uint32Array(1);
    let x;
    do {
      crypto.getRandomValues(buf);
      x = buf[0];
    } while (x >= limit);
    return x % max;
  }

  const pick = str => str[randomInt(str.length)];

  function generatePassword(length = 12) {
    const chars = [pick(UPPER), pick(LOWER), pick(DIGITS), pick(SPECIAL)];
    while (chars.length < length) chars.push(pick(ALL));

    for (let i = chars.length - 1; i > 0; i--) {
      const j = randomInt(i + 1);
      [chars[i], chars[j]] = [chars[j], chars[i]];
    }
    return chars.join('');
  }

  // ---------- Event listeners ----------

  input.addEventListener('input', updateUI);

  toggleBtn.addEventListener('click', () => {
    const showing = input.type === 'password';
    input.type = showing ? 'text' : 'password';
    toggleBtn.innerHTML = showing ? EYE_OFF_ICON : EYE_ICON;
    toggleBtn.setAttribute('aria-pressed', String(showing));
    toggleBtn.setAttribute('aria-label', showing ? 'Hide password' : 'Show password');
    input.focus();
  });

  generateBtn.addEventListener('click', () => {
    input.value = generatePassword(12);
    updateUI();
    hintEl.textContent = 'Strong password generated. Store it in a password manager.';
  });

  updateUI();
})();
