/* =========================================================
   ZIRAKPUR BOYS PG — script.js
   Handles: Navbar, mobile menu, scroll animations,
            lightbox gallery, form, toast
   ========================================================= */

/* ===== NAVBAR SCROLL EFFECT ===== */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 30) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

/* ===== ACTIVE NAV LINK ON SCROLL ===== */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function setActiveLink() {
  let scrollY = window.scrollY + 100;
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const id = section.getAttribute('id');
    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + id) {
          link.classList.add('active');
        }
      });
    }
  });
}
window.addEventListener('scroll', setActiveLink);

/* ===== HAMBURGER MOBILE MENU ===== */
const hamburger = document.getElementById('hamburger');
const navLinksList = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinksList.classList.toggle('open');
  // Prevent body scroll when menu is open
  document.body.style.overflow = navLinksList.classList.contains('open') ? 'hidden' : '';
});

// Close menu when a link is clicked
navLinksList.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinksList.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ===== SMOOTH SCROLLING for anchor links ===== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = navbar.offsetHeight + 8;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ===== SCROLL FADE-UP ANIMATION ===== */
const fadeEls = document.querySelectorAll('.fade-up');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target); // animate once
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

fadeEls.forEach(el => observer.observe(el));

/* ===== LIGHTBOX GALLERY ===== */
const galleryItems = document.querySelectorAll('.gal-item');
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lbImg');
const lbClose = document.getElementById('lbClose');
const lbPrev = document.getElementById('lbPrev');
const lbNext = document.getElementById('lbNext');

// Collect all image sources
const galSrcs = Array.from(galleryItems).map(item => item.getAttribute('data-src'));
let currentIdx = 0;

function openLightbox(idx) {
  currentIdx = idx;
  lbImg.src = galSrcs[currentIdx];
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
  // Delay clearing src for smooth transition
  setTimeout(() => { lbImg.src = ''; }, 300);
}

function showPrev() {
  currentIdx = (currentIdx - 1 + galSrcs.length) % galSrcs.length;
  lbImg.style.opacity = '0';
  setTimeout(() => {
    lbImg.src = galSrcs[currentIdx];
    lbImg.style.opacity = '1';
  }, 150);
}

function showNext() {
  currentIdx = (currentIdx + 1) % galSrcs.length;
  lbImg.style.opacity = '0';
  setTimeout(() => {
    lbImg.src = galSrcs[currentIdx];
    lbImg.style.opacity = '1';
  }, 150);
}

// Smooth image transition
lbImg.style.transition = 'opacity .15s ease';

galleryItems.forEach((item, idx) => {
  item.addEventListener('click', () => openLightbox(idx));
});
lbClose.addEventListener('click', closeLightbox);
lbPrev.addEventListener('click', showPrev);
lbNext.addEventListener('click', showNext);

// Close on backdrop click
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('active')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') showPrev();
  if (e.key === 'ArrowRight') showNext();
});

/* ===== CONTACT FORM (WhatsApp redirect) ===== */
const cForm = document.getElementById('cForm');
const toast = document.getElementById('toast');

function showToast(msg) {
  toast.textContent = '✅ ' + msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4000);
}

cForm.addEventListener('submit', function (e) {
  e.preventDefault();
  const name = document.getElementById('fn').value.trim();
  const phone = document.getElementById('fp').value.trim();
  const message = document.getElementById('fm').value.trim();

  // Simple validation
  if (!name || !phone) {
    showToast('Please enter your name and phone number.');
    return;
  }
  if (!/^\d{10}$/.test(phone.replace(/\s/g, ''))) {
    showToast('Please enter a valid 10-digit phone number.');
    return;
  }

  // Build WhatsApp message
  const waMsg = encodeURIComponent(
    `Hi, I'm ${name}.\nPhone: ${phone}.\n${message ? 'Message: ' + message : 'I want to enquire about room availability.'}`
  );
  window.open(`https://wa.me/919914135267?text=${waMsg}`, '_blank');
  showToast('Enquiry sent! We\'ll get back to you soon.');
  cForm.reset();
});

/* ===== NAVBAR ACTIVE STYLE (optional enhancement) ===== */
const style = document.createElement('style');
style.textContent = `.nav-link.active { color: var(--blue) !important; background: var(--blue-light) !important; }`;
document.head.appendChild(style);