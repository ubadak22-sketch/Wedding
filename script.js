/* =========================================
   HUDA'S WEDDING SITE — script.js
   ========================================= */

/* ── ENTRY SCREEN ── */
function enterSite() {
  const entry = document.getElementById('entry-screen');
  const main  = document.getElementById('main-site');

  entry.classList.add('fade-out');

  setTimeout(() => {
    entry.style.display = 'none';
    main.classList.remove('hidden');
    // Kick off scroll observer after reveal
    initScrollObserver();
    initLevelBars();
  }, 950);
}

/* ── SCROLL FADE OBSERVER ── */
function initScrollObserver() {
  const targets = document.querySelectorAll('.scroll-fade');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  targets.forEach(el => observer.observe(el));
}

/* ── LEVEL BAR ANIMATION ── */
// Level bars start at width:0 via CSS; once the card is visible,
// we restore their intended width so the fill animates in.
function initLevelBars() {
  const fills = document.querySelectorAll('.level-fill');

  // Store target widths from inline style before zeroing
  const targets = [];
  fills.forEach(fill => {
    // Read the current inline style (set in HTML)
    const raw = fill.getAttribute('style') || '';
    const match = raw.match(/width\s*:\s*([\d.]+%)/);
    targets.push(match ? match[1] : '0%');
    // Zero it out for entrance animation
    fill.style.width = '0%';
  });

  const barObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const fill = entry.target;
          const idx  = Array.from(fills).indexOf(fill);
          // Short delay so the card fade-in plays first
          setTimeout(() => {
            fill.style.width = targets[idx];
          }, 300);
          barObserver.unobserve(fill);
        }
      });
    },
    { threshold: 0.4 }
  );

  fills.forEach(fill => barObserver.observe(fill));
}

/* ── MEME CARD IMAGE FALLBACK ── */
// If the user drops real images into memes/, swap the placeholder divs.
// Naming convention: meme-1.jpg, meme-2.jpg, … meme-6.jpg
(function swapMemePlaceholders() {
  // Wait until DOM is ready
  window.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.meme-card');
    cards.forEach((card, i) => {
      const num  = i + 1;
      const exts = ['jpg', 'jpeg', 'png', 'webp', 'gif'];

      // Try each extension; use first that loads
      function tryNext(extIdx) {
        if (extIdx >= exts.length) return; // no image found, keep placeholder
        const img = new Image();
        img.src = `memes/meme-${num}.${exts[extIdx]}`;
        img.onload = () => {
          // Replace placeholder with real image
          const placeholder = card.querySelector('.meme-placeholder');
          if (placeholder) {
            img.alt = `Meme ${num}`;
            img.style.cssText = 'width:100%;height:200px;object-fit:cover;display:block;';
            placeholder.replaceWith(img);
          }
        };
        img.onerror = () => tryNext(extIdx + 1);
      }

      tryNext(0);
    });
  });
})();

/* ── SMOOTH SCROLL ANCHOR HELPER ── */
// (Not strictly needed but nice for any future nav links)
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ── EASTER EGG: triple-click the boss name ── */
document.addEventListener('DOMContentLoaded', () => {
  const bossName = document.querySelector('.boss-name');
  if (!bossName) return;

  let clickCount = 0;
  let clickTimer;

  bossName.addEventListener('click', () => {
    clickCount++;
    clearTimeout(clickTimer);
    clickTimer = setTimeout(() => { clickCount = 0; }, 600);

    if (clickCount >= 3) {
      clickCount = 0;
      // Shower of confetti-ish emojis
      spawnEmojiBurst(bossName);
    }
  });
});

function spawnEmojiBurst(anchor) {
  const emojis = ['👑','✨','💛','🌟','🏆','💍','🌸','💐'];
  const rect   = anchor.getBoundingClientRect();

  for (let i = 0; i < 18; i++) {
    const span = document.createElement('span');
    span.textContent = emojis[Math.floor(Math.random() * emojis.length)];

    const size = 1.4 + Math.random() * 1.2;
    const x    = rect.left + rect.width  * Math.random();
    const y    = rect.top  + rect.height * Math.random() + window.scrollY;
    const tx   = (Math.random() - 0.5) * 220;
    const ty   = -(80 + Math.random() * 160);
    const rot  = (Math.random() - 0.5) * 360;
    const dur  = 0.9 + Math.random() * 0.7;

    Object.assign(span.style, {
      position:   'absolute',
      left:       `${x}px`,
      top:        `${y}px`,
      fontSize:   `${size}rem`,
      pointerEvents: 'none',
      zIndex:     '99999',
      transition: `transform ${dur}s ease-out, opacity ${dur}s ease-out`,
      opacity:    '1',
      transform:  'translate(0, 0) rotate(0deg)',
      lineHeight: '1',
    });

    document.body.appendChild(span);

    // Trigger animation next frame
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        span.style.transform = `translate(${tx}px, ${ty}px) rotate(${rot}deg)`;
        span.style.opacity   = '0';
      });
    });

    setTimeout(() => span.remove(), (dur + 0.1) * 1000);
  }
}
