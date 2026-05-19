/**
 * Anantha Kumar M R — Portfolio Scripts (Runwai Design)
 * Features: Mobile nav, scroll reveal, active section tracking, contact form
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ============================================================
       1. NAVBAR — Mobile toggle
       ============================================================ */
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    navToggle.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
        navToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        });
    });

    /* ============================================================
       2. ACTIVE SECTION — Intersection Observer
       ============================================================ */
    const sections = document.querySelectorAll('section[id]');

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, {
        root: null,
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0
    });

    sections.forEach(section => sectionObserver.observe(section));

    /* ============================================================
       3. SCROLL REVEAL — Simple opacity fade-in
       ============================================================ */
    const revealElements = document.querySelectorAll(
        '.skill-category, .project-card, .timeline-item, .edu-card, ' +
        '.stat-item, .detail-row, .contact-form, .contact-info'
    );

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.1
    });

    revealElements.forEach(el => {
        el.classList.add('reveal');
        revealObserver.observe(el);
    });

    /* ============================================================
       4. SMOOTH SCROLL — For anchor links
       ============================================================ */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    /* ============================================================
       5. CONTACT FORM — Validation & submission
       ============================================================ */
    const contactForm = document.getElementById('contactForm');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();

        // Basic validation
        if (!name || !email || !subject || !message) {
            showFormMessage('Please fill in all fields.');
            return;
        }

        if (!isValidEmail(email)) {
            showFormMessage('Please enter a valid email address.');
            return;
        }

        // Success
        showFormMessage(
            'Thank you, ' + name.split(' ')[0] + '! I will get back to you soon.',
            'success'
        );
        contactForm.reset();
    });

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function showFormMessage(msg, type) {
        // Remove existing message
        const existing = contactForm.querySelector('.form-message');
        if (existing) existing.remove();

        const messageEl = document.createElement('div');
        messageEl.className = 'form-message';
        messageEl.textContent = msg;

        contactForm.appendChild(messageEl);

        // Auto remove after 5s
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.style.opacity = '0';
                messageEl.style.transition = 'opacity 0.3s ease';
                setTimeout(() => messageEl.remove(), 300);
            }
        }, 5000);
    }

    /* ============================================================
       6. KEYBOARD — Escape closes mobile nav
       ============================================================ */
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        }
    });

});
