// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    try {
        // Initialize all functionality with error handling
        console.log('Initializing PersonalDevPage functionality...');
        
        initializeNavigation();
        initializeScrollAnimations();
        initializeSmoothScrolling();
        initializeActiveNavigation();
        initializeProjectCardAnimations();
        initializeTypingEffect();
        
        console.log('PersonalDevPage initialization complete');
    } catch (error) {
        console.error('Critical error during page initialization:', error);
    }
});

// Navigation functionality
function initializeNavigation() {
    try {
        const nav = document.getElementById('nav');
        const navLinks = document.querySelectorAll('.nav-link');
        
        if (!nav) {
            console.warn('Navigation element not found');
            return;
        }
        
        // Sticky navigation on scroll
        window.addEventListener('scroll', function() {
            try {
                if (window.scrollY > 100) {
                    nav.classList.add('scrolled');
                } else {
                    nav.classList.remove('scrolled');
                }
            } catch (error) {
                console.error('Error in scroll handler:', error);
            }
        });
        
        // Mobile menu functionality (if needed in future)
        // This can be expanded for hamburger menu on mobile
    } catch (error) {
        console.error('Navigation initialization failed:', error);
    }
}

// Smooth scrolling for navigation links
function initializeSmoothScrolling() {
    try {
        const navLinks = document.querySelectorAll('.nav-link');
        const heroButtons = document.querySelectorAll('.btn[href^="#"]');
        
        [...navLinks, ...heroButtons].forEach(link => {
            link.addEventListener('click', function(e) {
                try {
                    e.preventDefault();
                    
                    const targetId = this.getAttribute('href');
                    const targetSection = document.querySelector(targetId);
                    
                    if (targetSection) {
                        const nav = document.getElementById('nav');
                        const headerHeight = nav ? nav.offsetHeight : 80;
                        const targetPosition = targetSection.offsetTop - headerHeight;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    } else {
                        console.warn('Target section not found:', targetId);
                    }
                } catch (error) {
                    console.error('Error in smooth scrolling:', error);
                }
            });
        });
    } catch (error) {
        console.error('Smooth scrolling initialization failed:', error);
    }
}

// Active navigation highlighting
function initializeActiveNavigation() {
    try {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        if (sections.length === 0) {
            console.warn('No sections with IDs found for active navigation');
            return;
        }
        
        window.addEventListener('scroll', function() {
            try {
                const scrollPosition = window.scrollY + 150; // Offset for header
                
                sections.forEach(section => {
                    const sectionTop = section.offsetTop;
                    const sectionHeight = section.offsetHeight;
                    const sectionId = section.getAttribute('id');
                    
                    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                        // Remove active class from all links
                        navLinks.forEach(link => {
                            try {
                                link.classList.remove('active');
                            } catch (e) {
                                console.warn('Error removing active class:', e);
                            }
                        });
                        
                        // Add active class to current section link
                        const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                        if (activeLink) {
                            activeLink.classList.add('active');
                        }
                    }
                });
            } catch (error) {
                console.error('Error in active navigation scroll handler:', error);
            }
        });
    } catch (error) {
        console.error('Active navigation initialization failed:', error);
    }
}

// Scroll animations for elements
function initializeScrollAnimations() {
    try {
        // Check if IntersectionObserver is supported
        if (!window.IntersectionObserver) {
            console.warn('IntersectionObserver not supported, scroll animations disabled');
            return;
        }
        
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                try {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed');
                    }
                } catch (error) {
                    console.warn('Error adding revealed class:', error);
                }
            });
        }, observerOptions);
    
    // Add scroll-reveal class to elements that should animate
    const animatedElements = [
        '.section-title',
        '.about-text p',
        '.about-image',
        '.skill-category',
        '.project-card',
        '.experience-item',
        '.contact-content'
    ];
    
        animatedElements.forEach(selector => {
            try {
                const elements = document.querySelectorAll(selector);
                elements.forEach((element, index) => {
                    try {
                        element.classList.add('scroll-reveal');
                        // Add staggered delay for multiple elements
                        element.style.transitionDelay = `${index * 0.1}s`;
                        observer.observe(element);
                    } catch (error) {
                        console.warn(`Error observing element ${selector}:`, error);
                    }
                });
            } catch (error) {
                console.warn(`Error processing selector ${selector}:`, error);
            }
        });
    } catch (error) {
        console.error('Scroll animations initialization failed:', error);
    }
}

// Project card hover effects and animations
function initializeProjectCardAnimations() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // Add subtle rotation effect
            this.style.transform = 'translateY(-8px) rotateX(5deg)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) rotateX(0)';
        });
    });
}

// Typing effect for hero tagline (subtle enhancement)
function initializeTypingEffect() {
    try {
        const tagline = document.querySelector('.hero-tagline');
        if (!tagline) {
            console.warn('Hero tagline element not found');
            return;
        }
        
        const text = tagline.textContent;
        if (!text || text.trim().length === 0) {
            console.warn('No text content found for typing effect');
            return;
        }
        
        tagline.textContent = '';
        
        // Wait for initial animations to complete
        setTimeout(() => {
            try {
                let index = 0;
                const typeChar = () => {
                    try {
                        if (index < text.length) {
                            tagline.textContent += text.charAt(index);
                            index++;
                            setTimeout(typeChar, 50); // Adjust speed as needed
                        }
                    } catch (error) {
                        console.error('Error in typing character:', error);
                        // Fallback: show full text
                        tagline.textContent = text;
                    }
                };
                typeChar();
            } catch (error) {
                console.error('Error starting typing effect:', error);
                // Fallback: show full text immediately
                tagline.textContent = text;
            }
        }, 1000); // Start after fade-in delay
    } catch (error) {
        console.error('Typing effect initialization failed:', error);
    }
}

// Parallax effect for hero section
function initializeParallaxEffect() {
    const hero = document.querySelector('.hero');
    const heroBackground = document.querySelector('.hero::before');
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        if (hero) {
            hero.style.transform = `translateY(${rate}px)`;
        }
    });
}

// Contact form handling (if form is added later)
function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Handle form submission
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // You can integrate with a service like Formspree, Netlify Forms, etc.
            console.log('Form submitted:', data);
            
            // Show success message
            showNotification('Message sent successfully!', 'success');
        });
    }
}

// Utility function for notifications
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '15px 25px',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '500',
        zIndex: '10000',
        transform: 'translateX(400px)',
        transition: 'transform 0.3s ease-in-out',
        backgroundColor: type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#6366F1'
    });
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Performance optimization: Debounced scroll handler
function debounce(func, wait) {
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

// Initialize performance optimized scroll handlers
function initializeOptimizedScrollHandlers() {
    const debouncedScrollHandler = debounce(() => {
        // Handle expensive scroll operations here
        updateActiveNavigation();
    }, 10);
    
    window.addEventListener('scroll', debouncedScrollHandler);
}

// Theme switching functionality (optional enhancement)
function initializeThemeToggle() {
    // This could be used for light/dark theme toggle in the future
    const themeToggle = document.getElementById('theme-toggle');
    
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('light-theme');
            localStorage.setItem('theme', document.body.classList.contains('light-theme') ? 'light' : 'dark');
        });
        
        // Load saved theme
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            document.body.classList.add('light-theme');
        }
    }
}

// Loading animation
function initializeLoadingAnimation() {
    window.addEventListener('load', function() {
        const body = document.body;
        body.classList.add('loaded');
        
        // Remove loading class if it exists
        const loader = document.querySelector('.loader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }
    });
}

// Copy email to clipboard functionality
function initializeEmailCopy() {
    const emailBtn = document.querySelector('a[href^="mailto:"]');
    
    if (emailBtn) {
        emailBtn.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            
            const email = this.getAttribute('href').replace('mailto:', '');
            
            if (navigator.clipboard) {
                navigator.clipboard.writeText(email).then(() => {
                    showNotification('Email copied to clipboard!', 'success');
                });
            } else {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = email;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                showNotification('Email copied to clipboard!', 'success');
            }
        });
    }
}

// Initialize all enhancements
function initializeEnhancements() {
    initializeOptimizedScrollHandlers();
    initializeThemeToggle();
    initializeLoadingAnimation();
    initializeEmailCopy();
    initializeContactForm();
    initializeParallaxEffect();
}

// Call enhancements after DOM is loaded
document.addEventListener('DOMContentLoaded', initializeEnhancements);

// Add CSS for additional animations
const additionalStyles = `
    .loaded {
        overflow-x: hidden;
    }
    
    .notification {
        font-family: var(--font-family);
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        backdrop-filter: blur(10px);
    }
    
    @media (max-width: 768px) {
        .notification {
            right: 10px;
            left: 10px;
            transform: translateY(-100px);
        }
        
        .notification.show {
            transform: translateY(0);
        }
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);