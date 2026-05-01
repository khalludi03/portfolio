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
