// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
        initializeNavigation();
        initializeScrollAnimations();
        initializeSmoothScrolling();
        initializeActiveNavigation();
        initializeProjectCardAnimations();
        initializeTypingEffect();
        initializeSkillsSection();
        initializeContactForm();
        initializeThemeToggle();
        initializeMobileMenu();
        initializeProjectFiltering();
});

// Navigation functionality
function initializeNavigation() {
    const nav = document.getElementById('nav');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Sticky navigation on scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });
    
    // Mobile menu functionality (if needed in future)
    // This can be expanded for hamburger menu on mobile
}

// Smooth scrolling for navigation links
function initializeSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link');
    const heroButtons = document.querySelectorAll('.btn[href^="#"]');
    
    [...navLinks, ...heroButtons].forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.getElementById('nav').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Active navigation highlighting
function initializeActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY + 150; // Offset for header
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Remove active class from all links
                navLinks.forEach(link => link.classList.remove('active'));
                
                // Add active class to current section link
                const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    });
}

// Scroll animations for elements
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
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
        const elements = document.querySelectorAll(selector);
        elements.forEach((element, index) => {
            element.classList.add('scroll-reveal');
            // Add staggered delay for multiple elements
            element.style.transitionDelay = `${index * 0.1}s`;
            observer.observe(element);
        });
    });
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
    const tagline = document.querySelector('.hero-tagline');
    if (!tagline) return;
    
    const text = tagline.textContent;
    tagline.textContent = '';
    
    // Wait for initial animations to complete
    setTimeout(() => {
        let index = 0;
        const typeChar = () => {
            if (index < text.length) {
                tagline.textContent += text.charAt(index);
                index++;
                setTimeout(typeChar, 50); // Adjust speed as needed
            }
        };
        typeChar();
    }, 1000); // Start after fade-in delay
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

// Contact form handling with validation and submission
function initializeContactForm() {
    try {
        const contactForm = document.getElementById('contact-form');
        if (!contactForm) {
            console.warn('Contact form not found');
            return;
        }

        const submitBtn = document.getElementById('submit-btn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');
        
        // Form validation
        const validators = {
            name: (value) => {
                if (!value.trim()) return 'Name is required';
                if (value.trim().length < 2) return 'Name must be at least 2 characters';
                if (value.trim().length > 100) return 'Name must be less than 100 characters';
                return null;
            },
            email: (value) => {
                if (!value.trim()) return 'Email is required';
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) return 'Please enter a valid email address';
                return null;
            },
            subject: (value) => {
                if (value.trim().length > 200) return 'Subject must be less than 200 characters';
                return null;
            },
            message: (value) => {
                if (!value.trim()) return 'Message is required';
                if (value.trim().length < 10) return 'Message must be at least 10 characters';
                if (value.trim().length > 2000) return 'Message must be less than 2000 characters';
                return null;
            }
        };
        
        // Real-time validation
        Object.keys(validators).forEach(fieldName => {
            const field = document.getElementById(fieldName);
            const errorElement = document.getElementById(`${fieldName}-error`);
            
            if (field && errorElement) {
                field.addEventListener('blur', () => validateField(fieldName, field.value, errorElement));
                field.addEventListener('input', () => {
                    if (errorElement.textContent) {
                        validateField(fieldName, field.value, errorElement);
                    }
                });
            }
        });
        
        function validateField(fieldName, value, errorElement) {
            try {
                const error = validators[fieldName](value);
                if (error) {
                    errorElement.textContent = error;
                    errorElement.style.opacity = '1';
                    return false;
                } else {
                    errorElement.textContent = '';
                    errorElement.style.opacity = '0';
                    return true;
                }
            } catch (e) {
                console.error('Validation error:', e);
                return false;
            }
        }
        
        function validateForm() {
            let isValid = true;
            
            Object.keys(validators).forEach(fieldName => {
                const field = document.getElementById(fieldName);
                const errorElement = document.getElementById(`${fieldName}-error`);
                
                if (field && errorElement) {
                    if (!validateField(fieldName, field.value, errorElement)) {
                        isValid = false;
                    }
                }
            });
            
            return isValid;
        }
        
        // Form submission
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            try {
                // Validate form
                if (!validateForm()) {
                    showNotification('Please fix the errors above', 'error');
                    return;
                }
                
                // Show loading state
                submitBtn.disabled = true;
                btnText.style.display = 'none';
                btnLoading.style.display = 'inline-flex';
                
                // Prepare form data
                const formData = new FormData(contactForm);
                const data = Object.fromEntries(formData);
                
                // Remove honeypot and form-name from display data
                delete data['bot-field'];
                delete data['form-name'];
                
                console.log('Form submission data:', data);
                
                // Submit to Netlify (or fallback to mailto)
                const response = await fetch('/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams(formData).toString()
                });
                
                if (response.ok) {
                    showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
                    contactForm.reset();
                    
                    // Clear any error messages
                    document.querySelectorAll('.form-error').forEach(error => {
                        error.textContent = '';
                        error.style.opacity = '0';
                    });
                } else {
                    throw new Error('Network response was not ok');
                }
                
            } catch (error) {
                console.error('Form submission error:', error);
                
                // Fallback to mailto
                const name = document.getElementById('name').value;
                const email = document.getElementById('email').value;
                const subject = document.getElementById('subject').value || 'Contact from Portfolio';
                const message = document.getElementById('message').value;
                
                const mailtoUrl = `mailto:nathan.green.223@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`From: ${name} (${email})\n\nMessage:\n${message}`)}`;
                window.location.href = mailtoUrl;
                
                showNotification('Opening your email client...', 'info');
                
            } finally {
                // Reset button state
                setTimeout(() => {
                    submitBtn.disabled = false;
                    btnText.style.display = 'inline';
                    btnLoading.style.display = 'none';
                }, 2000);
            }
        });
        
    } catch (error) {
        console.error('Contact form initialization failed:', error);
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

// Theme switching functionality
function initializeThemeToggle() {
    try {
        const themeToggle = document.getElementById('theme-toggle');
        
        if (!themeToggle) {
            console.warn('Theme toggle button not found');
            return;
        }
        
        // Load saved theme or detect system preference
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme === 'light' || (savedTheme === null && !systemPrefersDark)) {
            document.body.classList.add('light-theme');
        }
        
        // Theme toggle click handler
        themeToggle.addEventListener('click', function() {
            try {
                const isCurrentlyLight = document.body.classList.contains('light-theme');
                
                if (isCurrentlyLight) {
                    document.body.classList.remove('light-theme');
                    localStorage.setItem('theme', 'dark');
                } else {
                    document.body.classList.add('light-theme');
                    localStorage.setItem('theme', 'light');
                }
                
                // Update analytics if available
                if (window.portfolioAnalytics) {
                    window.portfolioAnalytics.trackEvent('theme_toggle', {
                        new_theme: isCurrentlyLight ? 'dark' : 'light'
                    });
                }
            } catch (error) {
                console.error('Error toggling theme:', error);
            }
        });
        
        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                if (e.matches) {
                    document.body.classList.remove('light-theme');
                } else {
                    document.body.classList.add('light-theme');
                }
            }
        });
        
    } catch (error) {
        console.error('Theme toggle initialization failed:', error);
    }
}

// Mobile menu functionality
function initializeMobileMenu() {
    try {
        const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (!mobileMenuToggle || !navMenu) {
            console.warn('Mobile menu elements not found');
            return;
        }
        
        // Toggle mobile menu
        mobileMenuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            
            try {
                const isActive = mobileMenuToggle.classList.contains('active');
                
                if (isActive) {
                    // Close menu
                    mobileMenuToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                    mobileMenuToggle.setAttribute('aria-expanded', 'false');
                    document.body.style.overflow = '';
                } else {
                    // Open menu
                    mobileMenuToggle.classList.add('active');
                    navMenu.classList.add('active');
                    mobileMenuToggle.setAttribute('aria-expanded', 'true');
                    document.body.style.overflow = 'hidden';
                }
            } catch (error) {
                console.error('Error toggling mobile menu:', error);
            }
        });
        
        // Close menu when clicking nav links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });
        
        // Close menu on window resize if desktop
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                mobileMenuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenuToggle.classList.contains('active')) {
                mobileMenuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
                mobileMenuToggle.focus();
            }
        });
        
        // Set initial aria-expanded
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        
    } catch (error) {
        console.error('Mobile menu initialization failed:', error);
    }
}

// Project filtering functionality
function initializeProjectFiltering() {
    try {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');
        
        if (filterBtns.length === 0 || projectCards.length === 0) {
            console.warn('Project filtering elements not found');
            return;
        }
        
        // Initialize all cards as visible
        projectCards.forEach(card => {
            card.classList.add('filtered-in');
        });
        
        // Cache project card data for performance
        const cardData = [];
        projectCards.forEach(card => {
            cardData.push({
                element: card,
                categories: card.getAttribute('data-categories') || ''
            });
        });
        
        // Filter button click handlers
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                try {
                    const filter = this.getAttribute('data-filter');
                    
                    // Update active button
                    filterBtns.forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                    
                    // Filter projects with animation using cached data
                    cardData.forEach((cardInfo, index) => {
                        const shouldShow = filter === 'all' || cardInfo.categories.includes(filter);
                        
                        // Add delay for staggered animation
                        setTimeout(() => {
                            if (shouldShow) {
                                cardInfo.element.classList.remove('filtered-out');
                                cardInfo.element.classList.add('filtered-in');
                            } else {
                                cardInfo.element.classList.remove('filtered-in');
                                cardInfo.element.classList.add('filtered-out');
                            }
                        }, index * 50);
                    });
                    
                    // Track filtering in analytics
                    if (window.portfolioAnalytics) {
                        window.portfolioAnalytics.trackEvent('project_filter', {
                            filter_type: filter
                        });
                    }
                    
                } catch (error) {
                    console.error('Error filtering projects:', error);
                }
            });
        });
        
        // Keyboard navigation for filter buttons
        filterBtns.forEach((btn, index) => {
            btn.addEventListener('keydown', (e) => {
                let targetIndex = index;
                
                switch (e.key) {
                    case 'ArrowLeft':
                        e.preventDefault();
                        targetIndex = index > 0 ? index - 1 : filterBtns.length - 1;
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        targetIndex = index < filterBtns.length - 1 ? index + 1 : 0;
                        break;
                    case 'Home':
                        e.preventDefault();
                        targetIndex = 0;
                        break;
                    case 'End':
                        e.preventDefault();
                        targetIndex = filterBtns.length - 1;
                        break;
                }
                
                if (targetIndex !== index) {
                    filterBtns[targetIndex].focus();
                }
            });
        });
        
    } catch (error) {
        console.error('Project filtering initialization failed:', error);
    }
}

// Skills Section with tabs and progress bars
function initializeSkillsSection() {
    try {
        // Tab functionality
        const skillsTabs = document.querySelectorAll('.skills-tab');
        const skillsTabContents = document.querySelectorAll('.skills-tab-content');
        
        if (skillsTabs.length === 0) {
            console.warn('Skills tabs not found');
            return;
        }
        
        // Tab switching
        skillsTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                try {
                    const targetTab = this.getAttribute('data-tab');
                    
                    // Remove active from all tabs and contents
                    skillsTabs.forEach(t => t.classList.remove('active'));
                    skillsTabContents.forEach(content => content.classList.remove('active'));
                    
                    // Add active to clicked tab and corresponding content
                    this.classList.add('active');
                    const targetContent = document.getElementById(targetTab);
                    if (targetContent) {
                        targetContent.classList.add('active');
                    }
                    
                    // Re-animate progress bars if technical tab is selected
                    if (targetTab === 'technical') {
                        setTimeout(() => {
                            animateProgressBars();
                        }, 200);
                    }
                    
                } catch (error) {
                    console.error('Error switching skills tabs:', error);
                }
            });
        });
        
        // Progress bar animation function
        function animateProgressBars() {
            const progressBars = document.querySelectorAll('.skill-progress-bar');
            
            progressBars.forEach((bar, index) => {
                const skillBar = bar.closest('.skill-bar');
                if (!skillBar) return;
                
                const level = skillBar.getAttribute('data-level');
                if (!level) return;
                
                // Reset width first
                bar.style.width = '0%';
                
                // Animate with delay for staggered effect
                setTimeout(() => {
                    bar.style.width = level + '%';
                }, index * 150);
            });
        }
        
        // Intersection Observer for animating progress bars when section comes into view
        const skillsSection = document.querySelector('#skills');
        if (skillsSection) {
            const skillsObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Only animate if technical tab is active
                        const technicalTab = document.querySelector('.skills-tab[data-tab="technical"]');
                        if (technicalTab && technicalTab.classList.contains('active')) {
                            setTimeout(() => {
                                animateProgressBars();
                            }, 300);
                        }
                        // Only observe once
                        skillsObserver.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.3
            });
            
            skillsObserver.observe(skillsSection);
        }
        
        // Keyboard navigation for skills tabs
        skillsTabs.forEach((tab, index) => {
            tab.addEventListener('keydown', (e) => {
                let targetIndex = index;
                
                switch (e.key) {
                    case 'ArrowLeft':
                        e.preventDefault();
                        targetIndex = index > 0 ? index - 1 : skillsTabs.length - 1;
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        targetIndex = index < skillsTabs.length - 1 ? index + 1 : 0;
                        break;
                    case 'Home':
                        e.preventDefault();
                        targetIndex = 0;
                        break;
                    case 'End':
                        e.preventDefault();
                        targetIndex = skillsTabs.length - 1;
                        break;
                }
                
                if (targetIndex !== index) {
                    skillsTabs[targetIndex].focus();
                    skillsTabs[targetIndex].click();
                }
            });
        });
        
        // Add scroll-reveal animations to skill elements
        const skillElements = document.querySelectorAll('.skill-bar, .soft-skill-card');
        skillElements.forEach((element, index) => {
            element.classList.add('scroll-reveal');
            element.style.transitionDelay = `${index * 0.1}s`;
        });
        
    } catch (error) {
        console.error('Skills section initialization failed:', error);
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
    initializeLoadingAnimation();
    initializeEmailCopy();
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