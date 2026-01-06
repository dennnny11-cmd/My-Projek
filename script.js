/* =========================
   LOADING SCREEN
========================= */
window.addEventListener('load', () => {
    const loadingScreen = document.getElementById('loading-screen');
    if (!loadingScreen) return;

    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }, 2000);
});

/* =========================
   CURSOR FOLLOWER
========================= */
const cursorFollower = document.querySelector('.cursor-follower');
let mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0;

if (cursorFollower) {
    document.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.1;
        cursorY += (mouseY - cursorY) * 0.1;

        cursorFollower.style.left = cursorX + 'px';
        cursorFollower.style.top = cursorY + 'px';

        requestAnimationFrame(animateCursor);
    }
    animateCursor();
}

/* =========================
   THEME TOGGLE
========================= */
const themeToggle = document.querySelector('.theme-toggle');
const body = document.body;

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('light-theme');
        const icon = themeToggle.querySelector('i');

        if (icon) {
            icon.className = body.classList.contains('light-theme')
                ? 'fas fa-sun'
                : 'fas fa-moon';
        }

        localStorage.setItem(
            'theme',
            body.classList.contains('light-theme') ? 'light' : 'dark'
        );
    });
}

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
    body.classList.add('light-theme');
    if (themeToggle) {
        const icon = themeToggle.querySelector('i');
        if (icon) icon.className = 'fas fa-sun';
    }
}

/* =========================
   TYPING ANIMATION
========================= */
const typingText = document.querySelector('.typing-text');
const phrases = [
    'Full-Stack Developer',
    'UI/UX Designer',
    'Problem Solver',
    'Coffee Enthusiast',
    'Code Architect'
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeWriter() {
    if (!typingText) return;

    const current = phrases[phraseIndex];
    typingText.textContent = isDeleting
        ? current.substring(0, charIndex--)
        : current.substring(0, ++charIndex);

    let speed = isDeleting ? 50 : 100;

    if (!isDeleting && charIndex === current.length) {
        speed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        speed = 500;
    }

    setTimeout(typeWriter, speed);
}

if (typingText) {
    setTimeout(typeWriter, 3000);
}

/* =========================
   SMOOTH SCROLL
========================= */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
});

/* =========================
   MOBILE NAV
========================= */
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

/* =========================
   COUNTER
========================= */
function animateCounter(el, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);

    function update() {
        start += increment;
        if (start < target) {
            el.textContent = Math.floor(start);
            requestAnimationFrame(update);
        } else {
            el.textContent = target;
        }
    }
    update();
}

/* =========================
   INTERSECTION OBSERVER
========================= */
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';

        if (entry.target.classList.contains('stat-number')) {
            animateCounter(
                entry.target,
                parseInt(entry.target.dataset.count)
            );
            observer.unobserve(entry.target);
        }

        if (entry.target.classList.contains('skill-progress')) {
            entry.target.style.width = entry.target.dataset.width + '%';
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.stat-number, .skill-progress')
        .forEach(el => observer.observe(el));

    initializeContactCards();
    initializeEnhancedForm();
    initializeEnhancedProjects();
});

/* =========================
   FLOATING ELEMENTS
========================= */
document.querySelectorAll('.floating-element').forEach((el, i) => {
    const speed = Number(el.dataset.speed) || 1;

    function animate() {
        const t = Date.now() * 0.001 * speed;
        const x = Math.sin(t) * 30;
        const y = Math.cos(t * 0.7) * 20;
        el.style.transform = `translate(${x}px, ${y}px) rotate(${t * 10}deg)`;
        requestAnimationFrame(animate);
    }

    setTimeout(animate, i * 200);
});

/* =========================
   CONTACT CARDS
========================= */
function initializeContactCards() {
    document.querySelectorAll('.contact-card').forEach(card => {
        card.addEventListener('click', () => {
            const type = card.dataset.contact;
            const text = card.querySelector('p')?.textContent;
            if (!text) return;

            if (type === 'email') {
                navigator.clipboard.writeText(text);
                showNotification('Email copied!', 'success');
            }
            if (type === 'phone') {
                window.location.href = `tel:${text}`;
            }
            if (type === 'location') {
                window.open(
                    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(text)}`,
                    '_blank'
                );
            }
        });
    });
}

/* =========================
   FORM
========================= */
function initializeEnhancedForm() {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    form.addEventListener('submit', e => {
        e.preventDefault();
        showNotification('Message sent!', 'success');
        form.reset();
    });
}

/* =========================
   NOTIFICATION
========================= */
function showNotification(message, type = 'info') {
    const n = document.createElement('div');
    n.className = `notification notification-${type}`;
    n.textContent = message;
    document.body.appendChild(n);

    setTimeout(() => n.remove(), 4000);
}

/* =========================
   PROJECTS (SINGLE SOURCE)
========================= */
function initializeEnhancedProjects() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            cards.forEach(card => {
                const cat = card.dataset.category || '';
                card.style.display =
                    filter === 'all' || cat.includes(filter)
                        ? 'block'
                        : 'none';
            });
        });
    });
}
