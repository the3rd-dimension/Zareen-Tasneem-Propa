(function() {
            // Current year
            document.getElementById('currentYear').textContent = new Date().getFullYear();

            // Theme selection
            const themeSelect = document.getElementById('themeSelect');
            const themeIcon = document.querySelector('.theme-switcher-icon');
            const systemThemeQuery = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

            function getStoredThemePreference() {
                try {
                    return localStorage.getItem('themePreference') || 'auto';
                } catch (error) {
                    return 'auto';
                }
            }

            function storeThemePreference(preference) {
                try {
                    localStorage.setItem('themePreference', preference);
                } catch (error) {
                    // Theme still changes for this session if storage is unavailable.
                }
            }

            function resolveTheme(preference) {
                if (preference === 'dark' || preference === 'light') {
                    return preference;
                }
                return systemThemeQuery && systemThemeQuery.matches ? 'dark' : 'light';
            }

            function applyTheme(preference) {
                const activeTheme = resolveTheme(preference);
                document.documentElement.dataset.theme = activeTheme;
                document.documentElement.dataset.themePreference = preference;
                if (themeSelect) {
                    themeSelect.value = preference;
                }
                if (themeIcon) {
                    themeIcon.textContent = activeTheme === 'dark' ? '☾' : '☼';
                }
            }

            const initialThemePreference = getStoredThemePreference();
            applyTheme(initialThemePreference);

            if (themeSelect) {
                themeSelect.addEventListener('change', () => {
                    const preference = themeSelect.value;
                    storeThemePreference(preference);
                    applyTheme(preference);
                });
            }

            if (systemThemeQuery) {
                const handleSystemThemeChange = () => {
                    if (getStoredThemePreference() === 'auto') {
                        applyTheme('auto');
                    }
                };
                if (systemThemeQuery.addEventListener) {
                    systemThemeQuery.addEventListener('change', handleSystemThemeChange);
                } else if (systemThemeQuery.addListener) {
                    systemThemeQuery.addListener(handleSystemThemeChange);
                }
            }

            // Scroll progress bar
            const scrollProgress = document.getElementById('scrollProgress');
            window.addEventListener('scroll', () => {
                const scrollTop = window.scrollY;
                const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
                scrollProgress.style.width = progress + '%';
            });

            // Navigation scroll effect
            const nav = document.getElementById('nav');
            window.addEventListener('scroll', () => {
                if (window.scrollY > 50) {
                    nav.classList.add('scrolled');
                } else {
                    nav.classList.remove('scrolled');
                }
            });

            // Mobile menu
            const hamburger = document.getElementById('hamburger');
            const navLinks = document.getElementById('navLinks');
            const navOverlay = document.getElementById('navOverlay');

            function closeMenu() {
                hamburger.classList.remove('active');
                navLinks.classList.remove('open');
                navOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }

            function openMenu() {
                hamburger.classList.add('active');
                navLinks.classList.add('open');
                navOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            }

            hamburger.addEventListener('click', () => {
                if (navLinks.classList.contains('open')) {
                    closeMenu();
                } else {
                    openMenu();
                }
            });

            navOverlay.addEventListener('click', closeMenu);

            // Close menu on nav link click
            navLinks.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    if (navLinks.classList.contains('open')) {
                        closeMenu();
                    }
                });
            });

            // Active nav link based on scroll
            const allSections = document.querySelectorAll('section[id]');
            const navLinkElements = document.querySelectorAll('.nav-links a[data-nav]');

            function updateActiveNav() {
                let currentSection = '';
                const scrollPos = window.scrollY + 120;
                allSections.forEach(section => {
                    const top = section.offsetTop;
                    const height = section.offsetHeight;
                    if (scrollPos >= top && scrollPos < top + height) {
                        currentSection = section.getAttribute('id');
                    }
                });
                navLinkElements.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('data-nav') === currentSection) {
                        link.classList.add('active');
                    }
                });
            }
            window.addEventListener('scroll', updateActiveNav);

            // Intersection Observer for reveal animations
            const revealElements = document.querySelectorAll('.reveal');
            const revealObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        // Don't unobserve so we can re-trigger if needed (or unobserve for performance)
                        revealObserver.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.15,
                rootMargin: '0px 0px -30px 0px'
            });

            revealElements.forEach(el => revealObserver.observe(el));

            // Animate language bars
            const langBars = document.querySelectorAll('.lang-bar-fill');
            const langObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const bar = entry.target;
                        const fill = bar.getAttribute('data-fill');
                        bar.classList.add('animated');
                        bar.style.setProperty('--fill', fill + '%');
                        langObserver.unobserve(bar);
                    }
                });
            }, { threshold: 0.5 });

            langBars.forEach(bar => langObserver.observe(bar));

            // Typing effect
            const typingTextEl = document.getElementById('typingText');
            const phrases = [
                'Bridging business needs with technical implementation.',
                'Driving data-driven decision-making.',
                'Optimizing workflows for real impact.',
                'Turning requirements into actionable solutions.',
            ];
            let phraseIndex = 0;
            let charIndex = 0;
            let isDeleting = false;
            let typingSpeed = 70;

            function typeEffect() {
                const currentPhrase = phrases[phraseIndex];

                if (!isDeleting) {
                    typingTextEl.textContent = currentPhrase.substring(0, charIndex + 1);
                    charIndex++;
                    if (charIndex === currentPhrase.length) {
                        isDeleting = true;
                        typingSpeed = 1800; // Pause at end
                    } else {
                        typingSpeed = 55 + Math.random() * 40;
                    }
                } else {
                    typingTextEl.textContent = currentPhrase.substring(0, charIndex - 1);
                    charIndex--;
                    if (charIndex === 0) {
                        isDeleting = false;
                        phraseIndex = (phraseIndex + 1) % phrases.length;
                        typingSpeed = 400;
                    } else {
                        typingSpeed = 30;
                    }
                }
                setTimeout(typeEffect, typingSpeed);
            }
            setTimeout(typeEffect, 800);

            // Form submission handler
            window.handleFormSubmit = function(event) {
                event.preventDefault();
                const name = document.getElementById('name').value.trim();
                const email = document.getElementById('email').value.trim();
                const message = document.getElementById('message').value.trim();
                if (name && email && message) {
                    const subject = encodeURIComponent('Portfolio Inquiry from ' + name);
                    const body = encodeURIComponent(
                        `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
                        );
                    window.location.href = `mailto:zareentasneem92@gmail.com?subject=${subject}&body=${body}`;
                }
            };

            // Initial trigger for elements already in view
            setTimeout(() => {
                revealElements.forEach(el => {
                    const rect = el.getBoundingClientRect();
                    if (rect.top < window.innerHeight - 50) {
                        el.classList.add('visible');
                        revealObserver.unobserve(el);
                    }
                });
                // Check language bars too
                langBars.forEach(bar => {
                    const rect = bar.getBoundingClientRect();
                    if (rect.top < window.innerHeight - 50) {
                        const fill = bar.getAttribute('data-fill');
                        bar.classList.add('animated');
                        bar.style.setProperty('--fill', fill + '%');
                        langObserver.unobserve(bar);
                    }
                });
            }, 400);

            // Smooth keyboard navigation
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && navLinks.classList.contains('open')) {
                    closeMenu();
                }
            });

            console.log('✨ Zareen Tasneem — Portfolio ready. Thanks for visiting!');
        })();
