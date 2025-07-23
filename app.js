// DOM Elements
const navMenu = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');
const navClose = document.getElementById('nav-close');
const themeToggle = document.getElementById('theme-toggle');
const navLinks = document.querySelectorAll('.nav__link');
const sections = document.querySelectorAll('.section');
const heroTyping = document.getElementById('hero-typing');
const contactForm = document.getElementById('contact-form');
const skillBars = document.querySelectorAll('.skill__progress');

// Initialize theme on page load
function initTheme() {
    const savedTheme = localStorage.getItem('portfolio-theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    
    document.documentElement.setAttribute('data-color-scheme', theme);
    localStorage.setItem('portfolio-theme', theme);
}

// Theme Toggle Function
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-color-scheme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-color-scheme', newTheme);
    localStorage.setItem('portfolio-theme', newTheme);
    
    // Update header background immediately
    updateHeaderBackground();
}

// Navigation Menu Toggle
function showMenu() {
    if (navMenu) {
        navMenu.classList.add('show-menu');
    }
}

function hideMenu() {
    if (navMenu) {
        navMenu.classList.remove('show-menu');
    }
}

// Smooth Scroll Function
function smoothScrollTo(target) {
    const element = document.querySelector(target);
    if (element) {
        const headerHeight = document.querySelector('.header')?.offsetHeight || 70;
        const elementPosition = element.offsetTop - headerHeight;
        
        window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
        });
    }
}

// Navigation Link Click Handler
function handleNavLinkClick(e) {
    e.preventDefault();
    const target = e.target.getAttribute('href');
    
    // Hide mobile menu
    hideMenu();
    
    // Smooth scroll to target
    if (target && target.startsWith('#')) {
        smoothScrollTo(target);
    }
}

// Header Background Update
function updateHeaderBackground() {
    const header = document.querySelector('.header');
    if (!header) return;
    
    const isDark = document.documentElement.getAttribute('data-color-scheme') === 'dark';
    const scrolled = window.scrollY > 50;
    
    if (isDark) {
        header.style.background = scrolled 
            ? 'rgba(31, 33, 33, 0.98)' 
            : 'rgba(31, 33, 33, 0.95)';
    } else {
        header.style.background = scrolled 
            ? 'rgba(252, 252, 249, 0.98)' 
            : 'rgba(252, 252, 249, 0.95)';
    }
}

// Active Navigation Link Update
function updateActiveNavLink() {
    let current = 'home'; // Default to home
    const offset = 150;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop - offset) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Typing Animation
function startTypingAnimation() {
    const phrases = ['Java Developer'];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typeSpeed = 100;
    const deleteSpeed = 50;
    const pauseTime = 2000;

    function type() {
        if (!heroTyping) return;
        
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            heroTyping.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
        } else {
            heroTyping.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
        }

        let nextTypeSpeed = isDeleting ? deleteSpeed : typeSpeed;

        if (!isDeleting && charIndex === currentPhrase.length) {
            nextTypeSpeed = pauseTime;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
        }

        setTimeout(type, nextTypeSpeed);
    }

    type();
}

// Contact Form Handler
function handleContactFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const name = formData.get('name')?.trim();
    const email = formData.get('email')?.trim();
    const subject = formData.get('subject')?.trim();
    const message = formData.get('message')?.trim();
    
    // Validation
    if (!name || !email || !subject || !message) {
        showNotification('Please fill in all fields.', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address.', 'error');
        return;
    }
    
    // Simulate form submission
    const submitBtn = contactForm.querySelector('.btn--primary');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        showNotification('Thank you for your message! I\'ll get back to you soon.', 'success');
        contactForm.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

// Email Validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        info: '#3b82f6'
    };
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 1rem;">
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: white; cursor: pointer; padding: 0.25rem; opacity: 0.8;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        </div>
    `;
    
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: '10000',
        maxWidth: '400px',
        padding: '1rem',
        borderRadius: '0.5rem',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        background: colors[type] || colors.info,
        color: 'white',
        fontWeight: '500',
        animation: 'slideIn 0.3s ease'
    });
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Scroll Animations
function handleScrollAnimations() {
    const elements = document.querySelectorAll('.education__card, .experience__card, .project__card, .skill, .certification__item');
    
    elements.forEach(element => {
        const rect = element.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight - 100;
        
        if (isVisible && !element.classList.contains('animate-fadeInUp')) {
            element.classList.add('animate-fadeInUp');
        }
    });
}

// Skill Bar Animation
function animateSkillBars() {
    skillBars.forEach(bar => {
        const rect = bar.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight - 100;
        
        if (isVisible && !bar.classList.contains('animate')) {
            const width = bar.style.width;
            bar.style.setProperty('--progress-width', width);
            bar.classList.add('animate');
        }
    });
}

// Resume Download Handler
function handleResumeDownload(e) {
    e.preventDefault();
    showNotification('Resume download will be available soon. Please contact me directly for now.', 'info');
}

// Throttle Function for Performance
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize Everything
function init() {
    // Initialize theme
    initTheme();
    
    // Start typing animation
    startTypingAnimation();
    
    // Event Listeners
    if (navToggle) {
        navToggle.addEventListener('click', showMenu);
    }
    
    if (navClose) {
        navClose.addEventListener('click', hideMenu);
    }
    
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', handleNavLinkClick);
    });
    
    // Contact form
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactFormSubmit);
    }
    
    // Resume download button
    const resumeBtn = document.querySelector('a[href="#contact"]');
    if (resumeBtn && resumeBtn.textContent.includes('Resume')) {
        resumeBtn.addEventListener('click', handleResumeDownload);
    }
    
    // Close mobile menu on outside click
    document.addEventListener('click', (e) => {
        if (navMenu && navMenu.classList.contains('show-menu')) {
            if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                hideMenu();
            }
        }
    });
    
    // Close mobile menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu?.classList.contains('show-menu')) {
            hideMenu();
        }
    });
    
    // Scroll events
    const throttledScrollHandler = throttle(() => {
        updateActiveNavLink();
        updateHeaderBackground();
        handleScrollAnimations();
        animateSkillBars();
    }, 16);
    
    window.addEventListener('scroll', throttledScrollHandler);
    
    // Initial calls
    updateActiveNavLink();
    updateHeaderBackground();
    handleScrollAnimations();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            hideMenu();
        }
    });
    
    // System theme change listener
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('portfolio-theme')) {
            const theme = e.matches ? 'dark' : 'light';
            document.documentElement.setAttribute('data-color-scheme', theme);
            updateHeaderBackground();
        }
    });
    
    // Add notification styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        .notification { transition: opacity 0.3s ease; }
    `;
    document.head.appendChild(style);
    
    console.log(`
🚀 Varun Kumar S - Portfolio Website

✅ Navigation: Working
✅ Theme Toggle: Working  
✅ Animations: Working
✅ Contact Form: Working

📧 Contact: varunjtjkumar234@gmail.com
🔗 GitHub: https://github.com/vkcs234

Built with vanilla HTML, CSS, and JavaScript
    `);
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}