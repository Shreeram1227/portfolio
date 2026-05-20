/* ==========================================================================
   INTERACTIVE SCRIPT FOR SHREERAM DANGAL PORTFOLIO
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initTheme();
    initMobileMenu();
    initTypewriter();
    initScrollObserver();
    initScrollSpy();
    initBackToTop();
    initContactForm();
    initCurrentYear();
});

/* --------------------------------------------------------------------------
   1. THEME TOGGLE (LIGHT / DARK)
   -------------------------------------------------------------------------- */
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Retrieve saved theme or default to system preference or dark
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    
    if (savedTheme) {
        body.setAttribute('data-theme', savedTheme);
    } else if (systemPrefersLight) {
        body.setAttribute('data-theme', 'light');
    } else {
        body.setAttribute('data-theme', 'dark'); // Default
    }

    // Toggle click handler
    themeToggle.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

/* --------------------------------------------------------------------------
   2. MOBILE BURGER MENU DRAWER
   -------------------------------------------------------------------------- */
function initMobileMenu() {
    const burgerBtn = document.getElementById('burger-menu');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    const toggleMenu = () => {
        const isOpen = burgerBtn.classList.contains('active');
        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    };

    const openMenu = () => {
        burgerBtn.classList.add('active');
        burgerBtn.setAttribute('aria-expanded', 'true');
        mobileDrawer.classList.add('active');
        mobileDrawer.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // Lock body scroll when menu open
    };

    const closeMenu = () => {
        burgerBtn.classList.remove('active');
        burgerBtn.setAttribute('aria-expanded', 'false');
        mobileDrawer.classList.remove('active');
        mobileDrawer.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = ''; // Unlock scroll
    };

    burgerBtn.addEventListener('click', toggleMenu);

    // Close menu when clicking link
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMenu();
        });
    });

    // Close menu if clicking outside the drawer
    document.addEventListener('click', (e) => {
        const isClickInsideMenu = mobileDrawer.contains(e.target);
        const isClickBurger = burgerBtn.contains(e.target);
        if (!isClickInsideMenu && !isClickBurger && mobileDrawer.classList.contains('active')) {
            closeMenu();
        }
    });

    // Handle escape key to close menu
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileDrawer.classList.contains('active')) {
            closeMenu();
        }
    });
}

/* --------------------------------------------------------------------------
   3. HERO TYPEWRITER EFFECT
   -------------------------------------------------------------------------- */
function initTypewriter() {
    const typewriterElement = document.getElementById('typewriter');
    if (!typewriterElement) return;

    const words = ["Data Science Consultant", "Data Analyst", "Technical Support Specialist", "Problem Solver"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    const type = () => {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // Speed up when erasing
        } else {
            typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100; // Normal typing speed
        }

        if (!isDeleting && charIndex === currentWord.length) {
            typingSpeed = 2000; // Pause at end of word
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typingSpeed = 500; // Pause before typing next word
        }

        setTimeout(type, typingSpeed);
    };

    // Start effect
    setTimeout(type, 1000);
}

/* --------------------------------------------------------------------------
   4. SCROLL OBSERVER (FADE IN + SKILL BARS)
   -------------------------------------------------------------------------- */
function initScrollObserver() {
    // Elements to reveal
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    
    // Intersection Observer Options
    const observerOptions = {
        root: null,
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // If it is the skills section, animate the progress bars
                if (entry.target.id === 'skills') {
                    animateSkillBars();
                }
                
                observer.unobserve(entry.target); // Trigger only once
            }
        });
    };

    const observer = new IntersectionObserver(revealCallback, observerOptions);
    revealElements.forEach(el => observer.observe(el));

    // Fallback if IntersectionObserver is not supported
    if (!window.IntersectionObserver) {
        revealElements.forEach(el => el.classList.add('active'));
        animateSkillBars();
    }
}

function animateSkillBars() {
    const fills = document.querySelectorAll('.skill-bar-fill');
    fills.forEach(fill => {
        // Read target width from style and assign it to trigger animation
        const width = fill.style.width;
        fill.style.width = '0';
        // Force reflow
        fill.offsetHeight;
        fill.style.width = width;
    });
}

/* --------------------------------------------------------------------------
   5. NAVIGATION SCROLL SPY (ACTIVE LINKS)
   -------------------------------------------------------------------------- */
function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const header = document.getElementById('navbar');

    const spy = () => {
        const scrollY = window.scrollY;

        // Sticky Navbar subtle shadows on scroll
        if (scrollY > 50) {
            header.style.boxShadow = 'var(--shadow-md)';
            header.style.padding = '0.25rem 0';
        } else {
            header.style.boxShadow = '';
            header.style.padding = '';
        }

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120; // Accounting for sticky header offset
            const sectionId = current.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', spy);
    // Trigger on load once
    spy();
}

/* --------------------------------------------------------------------------
   6. BACK TO TOP BUTTON
   -------------------------------------------------------------------------- */
function initBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    if (!backToTopBtn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 600) {
            backToTopBtn.classList.add('active');
        } else {
            backToTopBtn.classList.remove('active');
        }
    });
}

/* --------------------------------------------------------------------------
   7. CONTACT FORM VALIDATION & HANDLING
   -------------------------------------------------------------------------- */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const nameInput = document.getElementById('form-name');
    const emailInput = document.getElementById('form-email');
    const messageInput = document.getElementById('form-message');
    const submitBtn = document.getElementById('form-submit-btn');
    const alertBox = document.getElementById('form-alert');

    // Validation patterns
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Helper: Show/hide validation error
    const toggleFieldError = (input, isValid) => {
        const formGroup = input.closest('.form-group');
        if (isValid) {
            formGroup.classList.remove('error');
        } else {
            formGroup.classList.add('error');
        }
    };

    // Inline inputs focus/blur cleaning
    [nameInput, emailInput, messageInput].forEach(input => {
        input.addEventListener('input', () => {
            toggleFieldError(input, true); // Hide error on type
        });
        input.addEventListener('blur', () => {
            if (input === nameInput) toggleFieldError(input, input.value.trim() !== '');
            if (input === emailInput) toggleFieldError(input, emailRegex.test(input.value.trim()));
            if (input === messageInput) toggleFieldError(input, input.value.trim() !== '');
        });
    });

    // Form submit listener
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Perform final check
        const isNameValid = nameInput.value.trim() !== '';
        const isEmailValid = emailRegex.test(emailInput.value.trim());
        const isMsgValid = messageInput.value.trim() !== '';

        toggleFieldError(nameInput, isNameValid);
        toggleFieldError(emailInput, isEmailValid);
        toggleFieldError(messageInput, isMsgValid);

        if (!isNameValid || !isEmailValid || !isMsgValid) {
            // Focus on first invalid field
            if (!isNameValid) nameInput.focus();
            else if (!isEmailValid) emailInput.focus();
            else messageInput.focus();
            return;
        }

        // Form is valid - Mock server API submit
        sendFormData();
    });

    function sendFormData() {
        // UI updates during sending
        submitBtn.disabled = true;
        const originalBtnHTML = submitBtn.innerHTML;
        submitBtn.innerHTML = `<span>Sending...</span> <i class="fa-solid fa-circle-notch fa-spin icon-right"></i>`;
        
        // Close alert if visible
        alertBox.className = 'form-response-alert';
        alertBox.style.display = 'none';

        // Read form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        const formspreeEndpoint = 'https://formspree.io/f/xnjrpadb';

        fetch(formspreeEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (response.ok) {
                // Success response
                alertBox.classList.add('success');
                alertBox.innerHTML = `<i class="fa-solid fa-circle-check icon-left"></i> Message sent successfully! Shreeram will get in touch with you shortly.`;
                alertBox.style.display = 'block';
                form.reset();
            } else {
                return response.json().then(errorData => {
                    throw new Error(errorData.errors ? errorData.errors.map(err => err.message).join(', ') : 'Failed to submit form');
                });
            }
        })
        .catch(error => {
            alertBox.classList.add('error');
            alertBox.innerHTML = `<i class="fa-solid fa-triangle-exclamation icon-left"></i> Oops! ${error.message || 'There was a problem sending your message.'}`;
            alertBox.style.display = 'block';
        })
        .finally(() => {
            // Restore button
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnHTML;
            
            // Auto fade out alert message after 7 seconds
            setTimeout(() => {
                alertBox.style.transition = 'opacity 0.5s ease';
                alertBox.style.opacity = '0';
                setTimeout(() => {
                    alertBox.style.display = 'none';
                    alertBox.style.opacity = '1';
                    alertBox.className = 'form-response-alert';
                }, 500);
            }, 7000);
        });
    }
}

/* --------------------------------------------------------------------------
   8. DYNAMIC CURRENT YEAR
   -------------------------------------------------------------------------- */
function initCurrentYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear().toString();
    }
}
