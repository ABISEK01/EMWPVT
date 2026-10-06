
// ===== ENVISION MEDIA WORKS — interactions =====
document.addEventListener('DOMContentLoaded', () => {

  /* header scroll state */
  const header = document.querySelector('.site-header');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
  onScroll(); window.addEventListener('scroll', onScroll, {passive:true});

  /* mobile menu */
  const burger = document.querySelector('.burger');
  if (burger) burger.addEventListener('click', () => document.body.classList.toggle('menu-open'));
  document.querySelectorAll('.m-toggle').forEach(t => {
    t.addEventListener('click', e => {
      e.preventDefault();
      const sub = t.nextElementSibling;
      if (sub && sub.classList.contains('m-sub')) sub.style.display = sub.style.display === 'block' ? 'none' : 'block';
    });
  });

  /* hero sliders (auto) */
  document.querySelectorAll('.hero-slider').forEach(slider => {
    const slides = slider.querySelectorAll('.slide');
    if (slides.length <= 1) return;
    const dotsBox = slider.querySelector('.hero-dots');
    let idx = 0, timer;
    slides.forEach((_, i) => {
      const b = document.createElement('button');
      if (i === 0) b.classList.add('active');
      b.addEventListener('click', () => go(i, true));
      dotsBox.appendChild(b);
    });
    const dots = dotsBox.querySelectorAll('button');
    const prev = slider.querySelector('.prev'), next = slider.querySelector('.next');
    function go(n, manual) {
      slides[idx].classList.remove('active'); dots[idx].classList.remove('active');
      idx = (n + slides.length) % slides.length;
      slides[idx].classList.add('active'); dots[idx].classList.add('active');
      if (manual) restart();
    }
    function restart() { clearInterval(timer); timer = setInterval(() => go(idx + 1), 5600); }
    slider.addEventListener('mouseenter', () => clearInterval(timer));
    slider.addEventListener('mouseleave', restart);
    slider.addEventListener('focusin', () => clearInterval(timer));
    slider.addEventListener('focusout', restart);
    if (prev) prev.addEventListener('click', () => go(idx - 1, true));
    if (next) next.addEventListener('click', () => go(idx + 1, true));
    restart();
  });

  /* animated counters */
  const counters = document.querySelectorAll('.stat b[data-count]');
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target, target = +el.dataset.count, suf = el.dataset.suffix || '';
      const t0 = performance.now(), dur = 1800;
      (function tick(t) {
        const p = Math.min((t - t0) / dur, 1), e = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * e) + suf;
        if (p < 1) requestAnimationFrame(tick);
      })(t0);
      io.unobserve(el);
    });
  }, {threshold:.5});
  counters.forEach(c => io.observe(c));

  /* scroll reveal */
  const rio = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); rio.unobserve(en.target); } });
  }, {threshold:.12});
  document.querySelectorAll('.reveal').forEach(el => rio.observe(el));

  /* youtube lazy embed */
  document.querySelectorAll('.video-overlay').forEach(ov => {
    ov.addEventListener('click', () => {
      const wrap = ov.parentElement;
      const id = wrap.dataset.video;
      wrap.innerHTML = '<iframe src="https://www.youtube.com/embed/' + id + '?autoplay=1&rel=0" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>';
    });
  });

  /* page fade transitions */
  document.querySelectorAll('a[href$=".html"], a[href*=".html#"]').forEach(a => {
    const href = a.getAttribute('href');
    if (href.startsWith('http') || href.startsWith('#')) return;
    a.addEventListener('click', e => {
      if (e.metaKey || e.ctrlKey) return;
      e.preventDefault();
      document.body.classList.add('fade-out');
      setTimeout(() => { location.href = href; }, 320);
    });
  });

  /* contact form */
  const form = document.getElementById('enrollForm');
  if (form) form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.innerHTML = '✓ Request Received — We Will Contact You';
    btn.style.background = '#1faa59'; btn.style.color = '#fff';
    form.querySelectorAll('input,select,textarea').forEach(i => i.value = '');
    setTimeout(() => { btn.innerHTML = 'Enroll Now'; btn.style.background = ''; btn.style.color = ''; }, 4200);
  });
});
