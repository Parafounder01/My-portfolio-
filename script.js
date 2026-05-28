/* ============================================================
   1. PORTFOLIO SCRIPTS — Enhanced Dark Theme + Micro-interactions
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* ============================================================
       0. PRELOADER
       ============================================================ */
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.classList.add('hidden');
            }, 400);
        });
        setTimeout(() => {
            if (!preloader.classList.contains('hidden')) {
                preloader.classList.add('hidden');
            }
        }, 3000);
    }

    /* ============================================================
       1. THEME TOGGLE — Dark/Light with localStorage
       ============================================================ */
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;

    const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
    html.setAttribute('data-theme', savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const current = html.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';
            html.setAttribute('data-theme', next);
            localStorage.setItem('portfolio-theme', next);
        });
    }

    /* ============================================================
       2. CUSTOM CURSOR — Glow dot + ring follower
       ============================================================ */
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorRing = document.querySelector('.cursor-ring');

    if (cursorDot && cursorRing) {
        let mouseX = 0, mouseY = 0;
        let ringX = 0, ringY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
        });

        function animateCursor() {
            ringX += (mouseX - ringX) * 0.15;
            ringY += (mouseY - ringY) * 0.15;
            cursorRing.style.transform = `translate(${ringX}px, ${ringY}px)`;
            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        const hoverTargets = document.querySelectorAll(
            'a, button, .project-card, .skill-tag, .edu-card, .filter-btn, .theme-toggle, .social-link'
        );

        hoverTargets.forEach(el => {
            el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
        });

        document.addEventListener('mouseleave', () => {
            cursorDot.style.opacity = '0';
            cursorRing.style.opacity = '0';
        });

        document.addEventListener('mouseenter', () => {
            cursorDot.style.opacity = '1';
            cursorRing.style.opacity = '0.6';
        });

        if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
            cursorDot.style.display = 'none';
            cursorRing.style.display = 'none';
        }
    }

    /* ============================================================
       3. ACTIVE SECTION — Intersection Observer
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
       3. NAV BAR — Scroll shrink + background
       ============================================================ */
    const navBar = document.querySelector('.nav-bar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const expanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !expanded);
            navMenu.classList.toggle('active');
            document.body.classList.toggle('nav-open');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.classList.remove('nav-open');
            });
        });
    }

    /* ============================================================
       4. UNIFIED SCROLL — rAF-throttled for all scroll-driven UIs
       ============================================================ */
    let ticking = false;

    function onScroll() {
        const scrollY = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollY / docHeight) : 0;

        // Nav bar scrolled class
        if (navBar) {
            navBar.classList.toggle('scrolled', scrollY > 50);
        }

        // Scroll progress bar
        const bar = document.getElementById('scrollProgress');
        if (bar) bar.style.width = (progress * 100) + '%';

        // Back to top button
        const backToTop = document.getElementById('backToTop');
        if (backToTop) {
            backToTop.classList.toggle('visible', scrollY > 500);
            const progressCircle = document.querySelector('#backToTop .progress-ring circle');
            if (progressCircle) {
                const circumference = 138.23;
                progressCircle.style.strokeDashoffset = circumference * (1 - progress);
            }
        }

        // Hero parallax (skip on mobile)
        const heroParallaxLayer = document.querySelector('.hero-parallax-layer');
        const heroPhoto = document.querySelector('.hero-photo');
        const heroContent = document.querySelector('.hero-photo-content');
        if (heroParallaxLayer && heroPhoto && window.innerWidth > 768) {
            const rect = heroPhoto.getBoundingClientRect();
            const sp = Math.max(0, Math.min(1, 1 - (rect.bottom / (window.innerHeight + rect.height))));
            heroParallaxLayer.style.transform = `translateY(${sp * 60}px)`;
            if (heroContent) {
                heroContent.style.opacity = Math.max(0, 1 - sp * 2);
            }
        }

        // Section parallax (skip on mobile)
        if (window.innerWidth > 768) {
            document.querySelectorAll('.parallax-section').forEach(section => {
                const rect = section.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    const speed = parseFloat(section.dataset.parallaxSpeed || 0.15);
                    const bg = section.querySelector('.parallax-bg');
                    if (bg) {
                        bg.style.transform = `translateY(${(window.innerHeight - rect.top) * speed}px)`;
                    }
                }
            });
        }

        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(onScroll);
            ticking = true;
        }
    }, { passive: true });

    /* ============================================================
       5. SCROLL REVEAL — Intersection Observer
    const revealElements = document.querySelectorAll(
        '.skill-category, .project-card, .timeline-item, .edu-card, ' +
        '.stat-item, .detail-row, .contact-form, .contact-info, ' +
        '.about-text, .hero-photo-content, .project-filter, .education-block'
    );

    revealElements.forEach((el, i) => {
        if (!el.closest('.hero-photo')) {
            const delayClass = `delay-${(i % 8) + 1}`;
            el.classList.add('reveal', delayClass);
        }
    });

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
        threshold: 0.05
    });

    document.querySelectorAll('.reveal').forEach(el => {
        revealObserver.observe(el);
    });

    /* ============================================================
       8. MOUSE TILT EFFECT — Project cards
       ============================================================ */
    const projectCards = document.querySelectorAll('.project-card');

    projectCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 12;
            const rotateY = (centerX - x) / 12;

            card.style.transform =
                `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });

    /* ============================================================
       9. SMOOTH SCROLL — For anchor links with page transition
       ============================================================ */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId === '') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const navOffset = 80;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - navOffset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    /* ============================================================
       10. TYPING ANIMATION — Hero subtitle rotation
       ============================================================ */
    const typingElement = document.getElementById('typingText');
    if (typingElement) {
        const roles = [
            'Full Stack Web Developer',
            'UI/UX Enthusiast',
            'System Administrator',
            'Automation Engineer',
            'Tech Innovator'
        ];

        let roleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 80;

        function typeEffect() {
            const currentRole = roles[roleIndex];

            if (isDeleting) {
                typingElement.textContent = currentRole.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 40;
            } else {
                typingElement.textContent = currentRole.substring(0, charIndex + 1);
                charIndex++;
                typeSpeed = 80;
            }

            if (!isDeleting && charIndex === currentRole.length) {
                typeSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                typeSpeed = 400;
            }

            setTimeout(typeEffect, typeSpeed);
        }

        setTimeout(typeEffect, 1500);
    }

    /* ============================================================
       11. PROJECT FILTER — Tag-based filtering
       ============================================================ */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projects = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            projects.forEach(card => {
                if (filter === 'all') {
                    card.classList.remove('filtered-out');
                } else {
                    const tags = card.dataset.tags || '';
                    if (tags.includes(filter)) {
                        card.classList.remove('filtered-out');
                    } else {
                        card.classList.add('filtered-out');
                    }
                }
            });
        });
    });

    /* ============================================================
       12. SCROLL-TRIGGERED COUNTER ANIMATION
       ============================================================ */
    const counters = document.querySelectorAll('.stat-value[data-target]');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseFloat(el.dataset.target);
                const suffix = el.dataset.suffix || '';
                const duration = parseInt(el.dataset.duration) || 1500;
                const startTime = performance.now();

                function updateCounter(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    const current = eased * target;
                    el.textContent = current.toFixed(1) + suffix;
                    el.style.opacity = 1;

                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    } else {
                        el.textContent = target + suffix;
                    }
                }

                requestAnimationFrame(updateCounter);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(el => counterObserver.observe(el));

    /* ============================================================
       13. BACK TO TOP BUTTON — With progress ring
       ============================================================ */
    const backToTop = document.getElementById('backToTop');
    const progressCircle = document.querySelector('#backToTop .progress-ring circle');

    if (backToTop) {
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = docHeight > 0 ? (scrollTop / docHeight) : 0;

            if (scrollTop > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }

            if (progressCircle) {
                const circumference = 138.23;
                const offset = circumference * (1 - progress);
                progressCircle.style.strokeDashoffset = offset;
            }
        }, { passive: true });

        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    /* ============================================================
       14. CONTACT FORM — Validation & submission
       ============================================================ */
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();

            if (!name || !email || !subject || !message) {
                showFormMessage('Please fill in all fields.');
                return;
            }

            if (!isValidEmail(email)) {
                showFormMessage('Please enter a valid email address.');
                return;
            }

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
            const existing = contactForm.querySelector('.form-message');
            if (existing) existing.remove();

            const messageEl = document.createElement('div');
            messageEl.className = 'form-message';
            messageEl.textContent = msg;

            if (type === 'success') {
                messageEl.style.borderLeft = '3px solid #22c55e';
            }

            contactForm.appendChild(messageEl);

            setTimeout(() => {
                if (messageEl.parentNode) {
                    messageEl.style.opacity = '0';
                    messageEl.style.transition = 'opacity 0.3s ease';
                    setTimeout(() => messageEl.remove(), 300);
                }
            }, 5000);
        }
    }

    /* ============================================================
       15. FLOATING PARTICLES — Hero decoration
       ============================================================ */
    const heroSection = document.getElementById('home');
    if (heroSection) {
        const existingParticles = document.getElementById('heroParticles');
        if (!existingParticles) {
            const particlesContainer = document.createElement('div');
            particlesContainer.id = 'heroParticles';

            for (let i = 0; i < 12; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.top = (70 + Math.random() * 30) + '%';
                particle.style.width = (2 + Math.random() * 4) + 'px';
                particle.style.height = particle.style.width;
                particle.style.animationDelay = (Math.random() * 6) + 's';
                particle.style.animationDuration = (4 + Math.random() * 6) + 's';
                particle.style.opacity = 0.1 + Math.random() * 0.3;
                particlesContainer.appendChild(particle);
            }

            heroSection.appendChild(particlesContainer);
        }
    }

    /* ============================================================
       16. BUTTON RIPPLE EFFECT
       ============================================================ */
    document.querySelectorAll('.btn-primary, .btn-ghost, .filter-btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            const rect = this.getBoundingClientRect();
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
            ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });

    /* ============================================================
       17. CARD SHINE EFFECT — Project cards
       ============================================================ */
    projectCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            card.style.setProperty('--shine-x', x + '%');
            card.style.setProperty('--shine-y', y + '%');

            let shine = card.querySelector('.card-shine');
            if (!shine) {
                shine = document.createElement('div');
                shine.className = 'card-shine';
                shine.style.cssText = `
                    position: absolute; inset: 0; pointer-events: none;
                    background: radial-gradient(circle at var(--shine-x, 50%) var(--shine-y, 50%), 
                        rgba(255,255,255,0.04) 0%, transparent 60%);
                    z-index: 1;
                    transition: background 0.1s;
                `;
                card.appendChild(shine);
            } else {
                shine.style.background = `
                    radial-gradient(circle at ${x}% ${y}%, 
                        rgba(255,255,255,0.04) 0%, transparent 60%)
                `;
            }
        });

        card.addEventListener('mouseleave', () => {
            const shine = card.querySelector('.card-shine');
            if (shine) {
                shine.style.background = 'transparent';
            }
        });
    });

    /* ============================================================
       18. REDUCED-MOTION CHECK
       ============================================================ */
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (prefersReducedMotion.matches) {
        if (cursorDot) cursorDot.style.display = 'none';
        if (cursorRing) cursorRing.style.display = 'none';
        if (typingElement) {
            typingElement.textContent = 'Full Stack Web Developer';
        }
    }

});
