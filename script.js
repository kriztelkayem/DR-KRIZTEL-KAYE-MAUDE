// ==========================================
// APPOINTMENT BOOKING MODAL
// ==========================================

const appointmentModal = document.getElementById('appointmentModal');
const bookBtn = document.getElementById('bookBtn');
const closeBtn = document.querySelector('.close');
const appointmentForm = document.getElementById('appointmentForm');

// Open appointment modal
if (bookBtn) {
    bookBtn.addEventListener('click', () => {
        appointmentModal.style.display = 'block';
        appointmentModal.classList.add('modal-open');
    });
}

// Close appointment modal
if (closeBtn) {
    closeBtn.addEventListener('click', () => {
        appointmentModal.style.display = 'none';
    });
}

// Close modal when clicking outside of it
window.addEventListener('click', (event) => {
    if (event.target === appointmentModal) {
        appointmentModal.style.display = 'none';
    }
});

// Handle appointment form submission
if (appointmentForm) {
    appointmentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('apt-name').value;
        const email = document.getElementById('apt-email').value;
        const phone = document.getElementById('apt-phone').value;
        const service = document.getElementById('apt-service').value;
        const date = document.getElementById('apt-date').value;
        const time = document.getElementById('apt-time').value;
        const message = document.getElementById('apt-message').value;
        
        // Validate form
        if (!name || !email || !phone || !service || !date || !time) {
            showNotification('Please fill out all required fields', 'error');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('Please enter a valid email', 'error');
            return;
        }
        
        // Phone validation
        const phoneRegex = /^[0-9+\-\s()]+$/;
        if (!phoneRegex.test(phone)) {
            showNotification('Please enter a valid phone number', 'error');
            return;
        }
        
        // Date validation - should not be in the past
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
            showNotification('Please select a future date', 'error');
            return;
        }
        
        // Show loading state
        const submitBtn = appointmentForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Booking...';
        submitBtn.disabled = true;
        
        // Simulate appointment booking (in production, this would send to server)
        setTimeout(() => {
            // Log appointment details
            const appointmentData = {
                name,
                email,
                phone,
                service,
                date,
                time,
                message,
                bookedAt: new Date().toLocaleString()
            };
            
            console.log('Appointment Booked:', appointmentData);
            
            // Save to localStorage for demo purposes
            const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
            appointments.push(appointmentData);
            localStorage.setItem('appointments', JSON.stringify(appointments));
            
            showNotification(`✅ Appointment confirmed for ${date} at ${time}! We've sent a confirmation email to ${email}.`, 'success');
            
            // Close modal and reset form
            appointmentModal.style.display = 'none';
            appointmentForm.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1500);
    });
}

// Set minimum date to today
const dateInput = document.getElementById('apt-date');
if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
}

// ==========================================
// SCROLL-TRIGGERED ANIMATIONS
// ==========================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('scroll-animation');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all animated elements
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll(
        '.fade-in-up:not(.hero-content .fade-in-up):not(.hero-image):not(.about-image):not(.about-text *):not(.service-card):not(.timeline-item):not(.exp-item):not(.proj-item):not(.info-item):not(.form-group), .pop-in:not(.value-card), .slide-up:not(.timeline-item):not(.exp-item):not(.proj-item), .stagger-fade'
    );

    animatedElements.forEach(element => {
        observer.observe(element);
    });

    // Observe section-specific elements
    observeSectionElements();
});

function observeSectionElements() {
    // About section
    const aboutElements = document.querySelectorAll('.about-content .fade-in-left, .about-name, .biography, .value-card');
    
    aboutElements.forEach(element => {
        if (!element.style.animationDelay) {
            observer.observe(element);
        }
    });

    // Services section
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, index) => {
        observer.observe(card);
    });

    // Portfolio section
    const timelineItems = document.querySelectorAll('.timeline-item, .exp-item, .proj-item');
    timelineItems.forEach(item => {
        observer.observe(item);
    });

    // Contact section
    const contactItems = document.querySelectorAll('.info-item, .form-group');
    contactItems.forEach(item => {
        observer.observe(item);
    });
}

// ==========================================
// FORM HANDLING (CONTACT FORM)
// ==========================================

const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        // Validate form
        if (!name || !email || !message) {
            showNotification('Please fill out all fields', 'error');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('Please enter a valid email', 'error');
            return;
        }
        
        // Add submit animation
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Simulate form submission
        setTimeout(() => {
            showNotification('✅ Message sent successfully! Thank you for reaching out.', 'success');
            contactForm.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1500);
    });
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        background: ${type === 'success' ? '#27AE60' : '#E74C3C'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 10001;
        animation: slideInRight 0.5s ease-out;
        font-weight: 500;
        max-width: 400px;
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.5s ease-out';
        setTimeout(() => notification.remove(), 500);
    }, 4000);
}

// ==========================================
// SMOOTH SCROLL FOR NAVIGATION LINKS
// ==========================================

// For regular navigation links (not buttons)
document.querySelectorAll('a[href^="#"]:not(a.btn)').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// For button links - allow natural link behavior with smooth scroll
document.querySelectorAll('a.btn-secondary[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ==========================================
// BUTTON RIPPLE EFFECT
// ==========================================

document.querySelectorAll('button.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        if (e.clientX === 0 && e.clientY === 0) return;
        
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
            animation: rippleEffect 0.6s ease-out;
        `;
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// ==========================================
// NAVIGATION ACTIVE STATE
// ==========================================

window.addEventListener('scroll', () => {
    let current = '';
    
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ==========================================
// ADD STYLES FOR RIPPLE EFFECT
// ==========================================

const style = document.createElement('style');
style.textContent = `
    @keyframes rippleEffect {
        from {
            transform: scale(0);
            opacity: 1;
        }
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .nav-links a.active {
        color: var(--primary-blue);
        font-weight: 700;
    }
    
    .nav-links a.active:after {
        width: 100%;
    }
`;
document.head.appendChild(style);

// ==========================================
// PARALLAX EFFECT (OPTIONAL - SUBTLE)
// ==========================================

window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    if (hero) {
        const scrollPosition = window.scrollY;
        hero.style.backgroundPosition = `0 ${scrollPosition * 0.5}px`;
    }
});

// ==========================================
// FADE IN ANIMATIONS ON PAGE LOAD
// ==========================================

window.addEventListener('load', () => {
    // Trigger animations for hero section
    const heroElements = document.querySelectorAll('.hero .fade-in-up, .hero .fade-in-right');
    heroElements.forEach((element, index) => {
        if (!element.style.animationDelay) {
            element.style.animation = `fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.2}s forwards`;
            element.style.opacity = '0';
        }
    });
});

// ==========================================
// HAMBURGER MENU (MOBILE)
// ==========================================

const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '100%';
        navLinks.style.left = '0';
        navLinks.style.right = '0';
        navLinks.style.background = 'white';
        navLinks.style.padding = '1rem';
        navLinks.style.gap = '1rem';
        navLinks.style.boxShadow = '0 10px 20px rgba(46, 80, 144, 0.1)';
        navLinks.style.zIndex = '999';
    });
    
    // Close menu when link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.style.display = 'none';
        });
    });
}

// ==========================================
// INTERSECTION OBSERVER FOR COUNTING/STATS
// ==========================================

const countingElements = document.querySelectorAll('[data-count]');

const countingObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            animateCount(entry.target);
            entry.target.classList.add('counted');
        }
    });
}, { threshold: 0.5 });

countingElements.forEach(element => countingObserver.observe(element));

function animateCount(element) {
    const target = parseInt(element.dataset.count);
    const duration = 2000;
    const increment = target / (duration / 50);
    let current = 0;
    
    const counter = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(counter);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 50);
}

// ==========================================
// USER EXPERIENCE ENHANCEMENTS
// ==========================================

// Disable animations for users who prefer reduced motion
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion) {
    const style = document.createElement('style');
    style.textContent = `
        * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
    `;
    document.head.appendChild(style);
}

console.log('✅ Dr. Kriztel Kaye A. Maude Personal Website - All animations & booking system loaded successfully!');
