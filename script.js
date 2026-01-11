(() => {
  const root = document.documentElement;

  // Year
  const y = document.getElementById('y');
  if (y) y.textContent = String(new Date().getFullYear());

  // Smooth scroll for in-page anchors (keeps it feeling "2026")
  document.addEventListener('click', (e) => {
    const a = e.target && e.target.closest ? e.target.closest('a[href^="#"]') : null;
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.pushState(null, '', href);
  });


  // Cursor glow (desktop only)
  const cursor = document.querySelector('.fx__cursor');
  const isCoarse = window.matchMedia('(pointer: coarse)').matches;
  if (cursor && !isCoarse) {
    cursor.style.opacity = '1';
    let raf = 0;

    const onMove = (e) => {
      const x = e.clientX;
      const y = e.clientY;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        root.style.setProperty('--mx', x + 'px');
        root.style.setProperty('--my', y + 'px');
        raf = 0;
      });
    };

    window.addEventListener('mousemove', onMove, { passive: true });
  }

  // Reveal on scroll
  const els = Array.from(document.querySelectorAll('.reveal'));
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      }
    }, { threshold: 0.12 });
    els.forEach(el => io.observe(el));
  } else {
    els.forEach(el => el.classList.add('is-in'));
  }

  // Project hover "spotlight" follows cursor inside each project
  const projects = Array.from(document.querySelectorAll('.project'));
  for (const p of projects) {
    p.addEventListener('mousemove', (e) => {
      const r = p.getBoundingClientRect();
      const px = ((e.clientX - r.left) / r.width) * 100;
      const py = ((e.clientY - r.top) / r.height) * 100;
      p.style.setProperty('--pxx', px + '%');
      p.style.setProperty('--pyy', py + '%');
    }, { passive: true });
  }


  // Lightbox for project galleries (click any element with [data-zoom] or .zoomable)
  (function(){
    const items = Array.from(document.querySelectorAll('[data-zoom], .zoomable, .gcard[data-src]'));
    if (!items.length) return;

    // Build a single lightbox once (no HTML required in each page)
    const lb = document.createElement('div');
    lb.className = 'lb';
    lb.setAttribute('aria-hidden', 'true');
    lb.innerHTML = `
      <div class="lb__panel" role="dialog" aria-modal="true" aria-label="Image preview">
        <div class="lb__top">
          <p class="lb__title" id="lbTitle">Preview</p>
          <div class="lb__actions">
            <button class="lb__btn" type="button" data-lb="prev" aria-label="Previous">←</button>
            <button class="lb__btn" type="button" data-lb="next" aria-label="Next">→</button>
            <button class="lb__btn" type="button" data-lb="close" aria-label="Close">Close</button>
          </div>
        </div>
        <div class="lb__body">
          <img id="lbImg" alt="" />
          <p class="lb__cap" id="lbCap"></p>
        </div>
      </div>
    `;
    document.body.appendChild(lb);

    const lbImg = lb.querySelector('#lbImg');
    const lbTitle = lb.querySelector('#lbTitle');
    const lbCap = lb.querySelector('#lbCap');

    const normalized = items.map((el) => {
      const src = el.dataset.src || el.dataset.zoom || el.getAttribute('href') || el.querySelector('img')?.getAttribute('src') || '';
      const title = el.dataset.title || el.querySelector('.t')?.textContent || 'Preview';
      const caption = el.dataset.caption || el.dataset.cap || el.querySelector('.d')?.textContent || '';
      return { el, src, title, caption };
    }).filter(x => x.src);

    let idx = 0;

    const openAt = (i) => {
      idx = (i + normalized.length) % normalized.length;
      const it = normalized[idx];
      lbImg.src = it.src;
      lbImg.alt = it.title || 'Preview';
      lbTitle.textContent = it.title || 'Preview';
      lbCap.textContent = it.caption || '';
      lb.classList.add('is-open');
      lb.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    };
    const close = () => {
      lb.classList.remove('is-open');
      lb.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };
    const next = () => openAt(idx + 1);
    const prev = () => openAt(idx - 1);

    normalized.forEach((it, i) => {
      it.el.addEventListener('click', (e) => { e.preventDefault(); openAt(i); });
      it.el.setAttribute('tabindex', '0');
      it.el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openAt(i); }
      });
    });

    lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
    lb.querySelector('[data-lb="close"]').addEventListener('click', close);
    lb.querySelector('[data-lb="next"]').addEventListener('click', next);
    lb.querySelector('[data-lb="prev"]').addEventListener('click', prev);

    window.addEventListener('keydown', (e) => {
      if (!lb.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    });
  })();

  // Subtle tilt on photo (tasteful)
  const tilt = document.querySelector('[data-tilt]');
  if (tilt && !isCoarse) {
    tilt.addEventListener('mousemove', (e) => {
      const r = tilt.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
      const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
      root.style.setProperty('--tiltX', (dx * 16).toFixed(2) + 'px');
      root.style.setProperty('--tiltY', (dy * 16).toFixed(2) + 'px');
    }, { passive: true });

    tilt.addEventListener('mouseleave', () => {
      root.style.setProperty('--tiltX', '0px');
      root.style.setProperty('--tiltY', '0px');
    }, { passive: true });
  }
})();
document.querySelectorAll(".gcard").forEach(card => {
  card.addEventListener("mousemove", (e) => {
    const r = card.getBoundingClientRect();
    const mx = ((e.clientX - r.left) / r.width) * 100;
    const my = ((e.clientY - r.top) / r.height) * 100;
    card.style.setProperty("--mx", `${mx}%`);
    card.style.setProperty("--my", `${my}%`);
  });
});
document.querySelectorAll(".figItem").forEach(card => {
  card.addEventListener("mousemove", (e) => {
    const r = card.getBoundingClientRect();
    const mx = ((e.clientX - r.left) / r.width) * 100;
    const my = ((e.clientY - r.top) / r.height) * 100;
    card.style.setProperty("--mx", `${mx}%`);
    card.style.setProperty("--my", `${my}%`);
  });
});
