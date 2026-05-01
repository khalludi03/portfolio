/* ============================================================
   Nav: scroll shrink + hamburger toggle
   ============================================================ */
const nav = document.getElementById('nav');
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav__links');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

document.querySelectorAll('.nav__links a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* ============================================================
   Typewriter
   ============================================================ */
const phrases = ['Full-Stack Developer', 'Competitive Programmer', 'Problem Solver'];
const el = document.getElementById('typewriter-text');
let phraseIdx = 0;
let charIdx = 0;
let deleting = false;

function typewrite() {
  const phrase = phrases[phraseIdx];

  if (!deleting) {
    el.textContent = phrase.slice(0, ++charIdx);
    if (charIdx === phrase.length) {
      deleting = true;
      setTimeout(typewrite, 1800);
      return;
    }
  } else {
    el.textContent = phrase.slice(0, --charIdx);
    if (charIdx === 0) {
      deleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
    }
  }

  setTimeout(typewrite, deleting ? 55 : 90);
}

typewrite();

/* ============================================================
   Nav: active section highlight
   ============================================================ */
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav__links a');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navAnchors.forEach(a => a.classList.remove('active'));
        const active = document.querySelector(`.nav__links a[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  },
  { threshold: 0.35 }
);

sections.forEach(s => sectionObserver.observe(s));

/* ============================================================
   Scroll fade-in (IntersectionObserver)
   ============================================================ */
const fadeEls = document.querySelectorAll('.fade-in');

const fadeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

fadeEls.forEach(el => fadeObserver.observe(el));

/* ============================================================
   Animated stat counters
   ============================================================ */
const statsSection = document.getElementById('stats');
let countersDone = false;

function animateCounter(el, target, duration) {
  const start = performance.now();
  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target).toLocaleString();
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target.toLocaleString();
  }
  requestAnimationFrame(update);
}

const statsObserver = new IntersectionObserver(
  (entries) => {
    if (entries[0].isIntersecting && !countersDone) {
      countersDone = true;
      document.querySelectorAll('.stat__number').forEach(el => {
        animateCounter(el, parseInt(el.dataset.target, 10), 1500);
      });
      statsObserver.unobserve(statsSection);
    }
  },
  { threshold: 0.3 }
);

statsObserver.observe(statsSection);

/* ============================================================
   Contact form (Formspree AJAX)
   ============================================================ */
const contactForm = document.querySelector('.contact__form');
if (contactForm) {
  const statusEl = contactForm.querySelector('.contact__form-status');
  const btn = contactForm.querySelector('button[type="submit"]');

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(contactForm));
    if (!data.name.trim() || !data.email.trim() || !data.message.trim()) {
      showStatus('Please fill in all fields.', 'error');
      return;
    }
    btn.disabled = true;
    btn.textContent = 'Sending…';
    try {
      const res = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        showStatus("Message sent! I'll get back to you soon.", 'success');
        contactForm.reset();
      } else {
        throw new Error();
      }
    } catch {
      showStatus('Failed to send. Please try again.', 'error');
    } finally {
      btn.disabled = false;
      btn.textContent = 'Send Message';
    }
  });

  function showStatus(msg, type) {
    statusEl.textContent = msg;
    statusEl.className = `contact__form-status contact__form-status--${type}`;
    statusEl.style.display = 'block';
    setTimeout(() => { statusEl.style.display = 'none'; }, 5000);
  }
}
