/**
 * Anantha Kumar M R — Portfolio Scripts
 * Features: Mobile nav, scroll animations, active section tracking, contact form
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ============================================================
       1. NAVBAR — Mobile toggle + scroll shadow
       ============================================================ */
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.querySelector('.navbar');

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

    // Add scrolled class to navbar
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, { passive: true });

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
       3. SCROLL REVEAL — Fade-in on scroll
       ============================================================ */
    const revealElements = document.querySelectorAll(
        '.skill-category, .project-card, .timeline-item, .edu-card, ' +
        '.stat-card, .detail-item, .contact-form, .contact-info'
    );

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger delay for multiple items
                const delay = Array.from(entry.target.parentNode.children)
                    .indexOf(entry.target) * 80;
                entry.target.style.transitionDelay = `${delay}ms`;
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        rootMargin: '0px 0px -80px 0px',
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
            showFormMessage('Please fill in all fields.', 'error');
            return;
        }

        if (!isValidEmail(email)) {
            showFormMessage('Please enter a valid email address.', 'error');
            return;
        }

        // Success (you can replace this with Formspree or similar)
        showFormMessage(
            'Thank you for your message, ' + name.split(' ')[0] +
            '! I will get back to you soon.',
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
        messageEl.style.cssText = `
            padding: 12px 16px;
            border-radius: 4px;
            font-size: 0.88rem;
            margin-top: 16px;
            text-align: center;
            font-weight: 500;
            animation: fadeInUp 0.3s ease forwards;
            background: ${type === 'error'
                ? 'rgba(237, 29, 54, 0.1)'
                : 'rgba(0, 215, 34, 0.1)'};
            color: ${type === 'error' ? '#ee1d36' : '#00d722'};
            border: 1px solid ${type === 'error'
                ? 'rgba(237, 29, 54, 0.2)'
                : 'rgba(0, 215, 34, 0.2)'};
        `;

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
       6. PARALLAX PARTICLES — Subtle movement on scroll
       ============================================================ */
    const particles = document.querySelectorAll('.hero-particles span');
    if (particles.length) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            particles.forEach((p, i) => {
                const speed = 0.03 + (i * 0.01);
                p.style.transform = `translateY(${scrollY * speed}px)`;
            });
        }, { passive: true });
    }

    /* ============================================================
        7. KEYBOARD — Escape closes mobile nav
        ============================================================ */
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        }
    });

    /* ============================================================
       8. 3D BACKGROUND SCROLL ROTATION — Parallax effect
       ============================================================ */
    const bg3d = document.getElementById('bg3d');
    const sketchIframe = document.querySelector('#bg3d iframe');
    let apiReady = false;

    // Detect when Sketchfab API is ready
    if (sketchIframe) {
        window.addEventListener('message', (e) => {
            if (e.source === sketchIframe.contentWindow && e.data && e.data.type === 'ready') {
                apiReady = true;
            }
        });
    }

    if (bg3d) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            const maxScroll = Math.max(
                document.documentElement.scrollHeight - window.innerHeight,
                1
            );
            const scrollPercent = Math.min(scrollY / maxScroll, 1);

            // Full 360° rotation over the entire scroll range
            const angleDeg = scrollPercent * 360;
            const angleRad = scrollPercent * Math.PI * 2;

            // CSS 3D transform — rotates the entire scene container for a parallax feel
            bg3d.style.transform = `rotateY(${angleDeg}deg)`;

            // Sketchfab native API — rotates the actual 3D model in the viewer
            if (apiReady && sketchIframe && sketchIframe.contentWindow) {
                sketchIframe.contentWindow.postMessage({
                    type: 'setCameraLookAt',
                    data: {
                        target: [0, 0, 0],
                        rotation: [0, angleRad, 0]
                    }
                }, '*');
            }
        }, { passive: true });
    }
});
