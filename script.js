// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
        initializeNavigation();
        initializeScrollAnimations();
        initializeSmoothScrolling();
        initializeActiveNavigation();
        initializeProjectCardAnimations();
        initializeTypingEffect();
        initializeProjectFiltering();
        initializeSkillsSection();
        initializeGitHubIntegration();
        initializeContactForm();
        initializeThemeToggle();
        initializeMobileMenu();
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

// Case Study Modal Functions
function openCaseStudy(projectId) {
    try {
        // Input validation - only allow alphanumeric and hyphens
        if (!projectId || typeof projectId !== 'string' || !/^[a-zA-Z0-9\-]+$/.test(projectId)) {
            console.error('Invalid project ID provided');
            return;
        }
        
        const modal = document.getElementById('case-study-modal');
        const title = document.getElementById('case-study-title');
        const content = document.getElementById('case-study-content');
        
        if (!modal || !title || !content) {
            console.error('Case study modal elements not found');
            return;
        }
        
        const caseStudyData = getCaseStudyData(projectId);
        if (!caseStudyData) {
            console.error('Case study data not found for:', projectId);
            return;
        }
        
        title.textContent = caseStudyData.title;
        content.innerHTML = caseStudyData.content; // Content is predefined and safe
        
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        
        // Focus on modal for accessibility
        modal.focus();
        
    } catch (error) {
        console.error('Error opening case study:', error);
    }
}

function closeCaseStudy() {
    try {
        const modal = document.getElementById('case-study-modal');
        if (!modal) return;
        
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        
    } catch (error) {
        console.error('Error closing case study:', error);
    }
}

// Blog Modal Functions
function showBlogModal(articleId) {
    try {
        // Input validation - only allow alphanumeric and hyphens
        if (!articleId || typeof articleId !== 'string' || !/^[a-zA-Z0-9\-]+$/.test(articleId)) {
            console.error('Invalid article ID provided');
            return;
        }
        
        const modal = document.getElementById('blog-modal');
        const title = document.getElementById('blog-title');
        const content = document.getElementById('blog-content');
        
        if (!modal || !title || !content) {
            console.error('Blog modal elements not found');
            return;
        }
        
        const blogData = getBlogData(articleId);
        if (!blogData) {
            console.error('Blog data not found for:', articleId);
            return;
        }
        
        title.textContent = blogData.title;
        content.innerHTML = blogData.content; // Content is predefined and safe
        
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        
        // Focus on modal for accessibility
        modal.focus();
        
    } catch (error) {
        console.error('Error opening blog modal:', error);
    }
}

function closeBlogModal() {
    try {
        const modal = document.getElementById('blog-modal');
        if (!modal) return;
        
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        
    } catch (error) {
        console.error('Error closing blog modal:', error);
    }
}

// Resume Download Function
function downloadResume() {
    try {
        // For now, we'll provide feedback that the resume is not available
        // In production, this would link to an actual PDF file
        showNotification('Resume download will be available soon. Please contact me directly for now.', 'info');
        
        // Alternative: Open contact form or email
        setTimeout(() => {
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }
        }, 1000);
        
        // Track download attempt in analytics
        if (window.portfolioAnalytics) {
            window.portfolioAnalytics.trackEvent('resume_download_attempt');
        }
        
    } catch (error) {
        console.error('Error in resume download:', error);
        showNotification('Unable to process resume download. Please try again.', 'error');
    }
}

// Case Study Data
function getCaseStudyData(projectId) {
    const caseStudies = {
        'cli-tool': {
            title: 'Advanced CLI Development Tool - Case Study',
            content: `
                <div class="case-study-section">
                    <h3>Project Overview</h3>
                    <p>The Advanced CLI Development Tool is a sophisticated command-line interface application built with TypeScript and Node.js. This project showcases modern software engineering practices including modular architecture, extensible plugin systems, and comprehensive testing.</p>
                    
                    <div class="case-study-metrics">
                        <div class="case-study-metric">
                            <span class="case-study-metric-value">2.5k+</span>
                            <span class="case-study-metric-label">Lines of Code</span>
                        </div>
                        <div class="case-study-metric">
                            <span class="case-study-metric-value">15+</span>
                            <span class="case-study-metric-label">Commands</span>
                        </div>
                        <div class="case-study-metric">
                            <span class="case-study-metric-value">3</span>
                            <span class="case-study-metric-label">Months</span>
                        </div>
                        <div class="case-study-metric">
                            <span class="case-study-metric-value">95%</span>
                            <span class="case-study-metric-label">Test Coverage</span>
                        </div>
                    </div>
                </div>
                
                <div class="case-study-section">
                    <h3>Technical Architecture</h3>
                    <h4>Core Technologies</h4>
                    <ul>
                        <li><strong>TypeScript:</strong> Provides type safety and modern JavaScript features</li>
                        <li><strong>Node.js:</strong> Runtime environment for cross-platform compatibility</li>
                        <li><strong>Commander.js:</strong> Command-line interface framework</li>
                        <li><strong>Inquirer.js:</strong> Interactive command line user interfaces</li>
                        <li><strong>Jest:</strong> Testing framework for unit and integration tests</li>
                    </ul>
                </div>
                
                <div class="case-study-section">
                    <div class="challenge-solution">
                        <div class="challenge">
                            <h4>Challenge</h4>
                            <p>Creating a flexible CLI tool that could handle multiple developer workflows while maintaining clean, maintainable code and providing excellent user experience.</p>
                        </div>
                        <div class="solution">
                            <h4>Solution</h4>
                            <p>Implemented a modular plugin architecture with clear separation of concerns, comprehensive error handling, and interactive command interfaces for better usability.</p>
                        </div>
                    </div>
                </div>
                
                <div class="case-study-section">
                    <h3>Key Features</h3>
                    <ul>
                        <li>Modular plugin system for extensibility</li>
                        <li>Interactive command prompts with validation</li>
                        <li>Comprehensive configuration management</li>
                        <li>Automated task execution and scheduling</li>
                        <li>Cross-platform compatibility</li>
                        <li>Detailed logging and error reporting</li>
                    </ul>
                </div>
                
                <div class="case-study-section">
                    <h3>Results & Impact</h3>
                    <p>The CLI tool has streamlined development workflows, reducing repetitive task time by approximately 60% and providing a consistent interface for team collaboration. The modular architecture allows for easy extension and maintenance.</p>
                </div>
            `
        },
        'email-system': {
            title: 'Python Email Integration System - Case Study',
            content: `
                <div class="case-study-section">
                    <h3>Project Overview</h3>
                    <p>A robust email processing system that connects to email servers via IMAP, intelligently parses and categorizes emails, and provides clean summary displays. Built with Python and focuses on security and reliability.</p>
                    
                    <div class="case-study-metrics">
                        <div class="case-study-metric">
                            <span class="case-study-metric-value">1.8k+</span>
                            <span class="case-study-metric-label">Lines of Code</span>
                        </div>
                        <div class="case-study-metric">
                            <span class="case-study-metric-value">95%</span>
                            <span class="case-study-metric-label">Parse Accuracy</span>
                        </div>
                        <div class="case-study-metric">
                            <span class="case-study-metric-value">2</span>
                            <span class="case-study-metric-label">Weeks</span>
                        </div>
                        <div class="case-study-metric">
                            <span class="case-study-metric-value">5</span>
                            <span class="case-study-metric-label">Email Providers</span>
                        </div>
                    </div>
                </div>
                
                <div class="case-study-section">
                    <div class="challenge-solution">
                        <div class="challenge">
                            <h4>Challenge</h4>
                            <p>Safely connecting to various email providers, parsing different email formats, and extracting meaningful information while maintaining security and privacy.</p>
                        </div>
                        <div class="solution">
                            <h4>Solution</h4>
                            <p>Implemented secure IMAP connections with OAuth2, created robust parsing algorithms for multiple email formats, and built intelligent categorization system.</p>
                        </div>
                    </div>
                </div>
                
                <div class="case-study-section">
                    <h3>Technical Highlights</h3>
                    <ul>
                        <li>Secure IMAP protocol implementation with SSL/TLS</li>
                        <li>Multi-format email parsing (HTML, plaintext, multipart)</li>
                        <li>Intelligent email categorization and filtering</li>
                        <li>Robust error handling and connection management</li>
                        <li>Clean, readable output formatting</li>
                        <li>Configuration management for multiple accounts</li>
                    </ul>
                </div>
            `
        },
        'ui-framework': {
            title: 'Sh4d0w UI Framework - Case Study',
            content: `
                <div class="case-study-section">
                    <h3>Project Overview</h3>
                    <p>A custom UI framework built from scratch in JavaScript, featuring modern component architecture, advanced theming capabilities, and responsive design patterns for professional web applications.</p>
                    
                    <div class="case-study-metrics">
                        <div class="case-study-metric">
                            <span class="case-study-metric-value">3.2k+</span>
                            <span class="case-study-metric-label">Lines of Code</span>
                        </div>
                        <div class="case-study-metric">
                            <span class="case-study-metric-value">12</span>
                            <span class="case-study-metric-label">Components</span>
                        </div>
                        <div class="case-study-metric">
                            <span class="case-study-metric-value">4</span>
                            <span class="case-study-metric-label">Months</span>
                        </div>
                        <div class="case-study-metric">
                            <span class="case-study-metric-value">100%</span>
                            <span class="case-study-metric-label">Mobile Responsive</span>
                        </div>
                    </div>
                </div>
                
                <div class="case-study-section">
                    <div class="challenge-solution">
                        <div class="challenge">
                            <h4>Challenge</h4>
                            <p>Building a complete UI framework that rivals established frameworks while maintaining performance, flexibility, and ease of use.</p>
                        </div>
                        <div class="solution">
                            <h4>Solution</h4>
                            <p>Designed a modular component system with virtual DOM concepts, implemented advanced theming through CSS custom properties, and created comprehensive documentation.</p>
                        </div>
                    </div>
                </div>
                
                <div class="case-study-section">
                    <h3>Architecture Features</h3>
                    <ul>
                        <li>Component-based architecture with lifecycle methods</li>
                        <li>Advanced theming system with CSS custom properties</li>
                        <li>Responsive grid system and layout utilities</li>
                        <li>Event delegation and efficient DOM manipulation</li>
                        <li>Plugin system for extending functionality</li>
                        <li>Comprehensive documentation and examples</li>
                    </ul>
                </div>
            `
        },
        'kanban-board': {
            title: 'Python Kanban Board System - Case Study',
            content: `
                <div class="case-study-section">
                    <h3>Project Overview</h3>
                    <p>A sophisticated command-line Kanban board application implementing agile workflow principles with persistent data storage, intuitive task management, and automated progress tracking.</p>
                    
                    <div class="case-study-metrics">
                        <div class="case-study-metric">
                            <span class="case-study-metric-value">1.5k+</span>
                            <span class="case-study-metric-label">Lines of Code</span>
                        </div>
                        <div class="case-study-metric">
                            <span class="case-study-metric-value">8</span>
                            <span class="case-study-metric-label">Core Features</span>
                        </div>
                        <div class="case-study-metric">
                            <span class="case-study-metric-value">6</span>
                            <span class="case-study-metric-label">Weeks</span>
                        </div>
                        <div class="case-study-metric">
                            <span class="case-study-metric-value">JSON</span>
                            <span class="case-study-metric-label">Data Storage</span>
                        </div>
                    </div>
                </div>
                
                <div class="case-study-section">
                    <div class="challenge-solution">
                        <div class="challenge">
                            <h4>Challenge</h4>
                            <p>Creating an intuitive command-line interface for complex Kanban board operations while maintaining data integrity and providing a smooth user experience.</p>
                        </div>
                        <div class="solution">
                            <h4>Solution</h4>
                            <p>Implemented a clean CLI with interactive menus, robust data validation, and persistent storage with automated backups for reliability.</p>
                        </div>
                    </div>
                </div>
                
                <div class="case-study-section">
                    <h3>Key Features</h3>
                    <ul>
                        <li>Interactive command-line interface with colored output</li>
                        <li>Customizable board columns and workflows</li>
                        <li>Task priority and deadline management</li>
                        <li>Progress tracking and reporting</li>
                        <li>Data persistence with JSON storage</li>
                        <li>Automated backup and recovery systems</li>
                        <li>Search and filtering capabilities</li>
                        <li>Team collaboration features</li>
                    </ul>
                </div>
            `
        }
    };
    
    return caseStudies[projectId] || null;
}

// Blog Data
function getBlogData(articleId) {
    const blogArticles = {
        'fastapi-microservices': {
            title: 'Building Scalable Microservices with Python FastAPI',
            content: `
                <div class="case-study-section">
                    <h3>Introduction</h3>
                    <p>FastAPI has revolutionized Python web development by combining the simplicity of Flask with the performance of asynchronous programming. In this article, we explore advanced patterns for building production-ready microservices.</p>
                </div>
                
                <div class="case-study-section">
                    <h3>Architecture Patterns</h3>
                    <h4>Service Layer Pattern</h4>
                    <p>Implementing a clear separation between your API routes and business logic ensures maintainability and testability.</p>
                    
                    <h4>Repository Pattern</h4>
                    <p>Abstract your data access layer to enable easier testing and database migrations.</p>
                </div>
                
                <div class="case-study-section">
                    <h3>Key Implementation Details</h3>
                    <ul>
                        <li>Dependency injection for database connections</li>
                        <li>Pydantic models for request/response validation</li>
                        <li>Async/await patterns for I/O operations</li>
                        <li>Comprehensive error handling and logging</li>
                        <li>API versioning strategies</li>
                        <li>Authentication and authorization patterns</li>
                    </ul>
                </div>
                
                <div class="case-study-section">
                    <h3>Performance Considerations</h3>
                    <p>Learn about connection pooling, caching strategies, and monitoring that can make your FastAPI services handle thousands of requests per second.</p>
                </div>
            `
        },
        'js-performance': {
            title: 'Optimizing JavaScript Performance: From 3s to 300ms',
            content: `
                <div class="case-study-section">
                    <h3>The Performance Challenge</h3>
                    <p>We inherited a web application with a 3-second initial load time. Through systematic optimization, we achieved a 90% reduction in load time. Here's how we did it.</p>
                </div>
                
                <div class="case-study-section">
                    <h3>Optimization Strategies</h3>
                    <h4>Code Splitting</h4>
                    <p>Breaking the application into smaller chunks that load on-demand dramatically reduced the initial bundle size.</p>
                    
                    <h4>Tree Shaking</h4>
                    <p>Eliminating unused code from third-party libraries and our own codebase.</p>
                    
                    <h4>Lazy Loading</h4>
                    <p>Deferring non-critical resources until they're actually needed.</p>
                </div>
                
                <div class="case-study-section">
                    <h3>Technical Implementation</h3>
                    <ul>
                        <li>Webpack bundle analysis and optimization</li>
                        <li>Service worker implementation for caching</li>
                        <li>Critical CSS extraction and inlining</li>
                        <li>Image optimization and WebP conversion</li>
                        <li>HTTP/2 push for critical resources</li>
                        <li>Database query optimization</li>
                    </ul>
                </div>
                
                <div class="case-study-section">
                    <h3>Results</h3>
                    <p>The optimizations resulted in a 90% reduction in load time, 50% reduction in bounce rate, and significantly improved user engagement metrics.</p>
                </div>
            `
        },
        'docker-production': {
            title: 'Docker in Production: Lessons from Real Deployments',
            content: `
                <div class="case-study-section">
                    <h3>Production Docker Challenges</h3>
                    <p>Running Docker in production environments presents unique challenges around security, monitoring, and orchestration. This article shares hard-learned lessons from multiple production deployments.</p>
                </div>
                
                <div class="case-study-section">
                    <h3>Security Best Practices</h3>
                    <ul>
                        <li>Running containers as non-root users</li>
                        <li>Implementing proper secrets management</li>
                        <li>Regular security scanning of base images</li>
                        <li>Network segmentation and firewall rules</li>
                        <li>Resource limits and quotas</li>
                    </ul>
                </div>
                
                <div class="case-study-section">
                    <h3>Monitoring and Logging</h3>
                    <h4>Container Health Checks</h4>
                    <p>Implementing robust health check endpoints that accurately reflect service health.</p>
                    
                    <h4>Log Aggregation</h4>
                    <p>Centralized logging strategies that work across containerized environments.</p>
                </div>
                
                <div class="case-study-section">
                    <h3>Orchestration Patterns</h3>
                    <p>Whether using Docker Swarm, Kubernetes, or cloud-managed services, understanding orchestration patterns is crucial for production success.</p>
                    
                    <ul>
                        <li>Zero-downtime deployments</li>
                        <li>Auto-scaling strategies</li>
                        <li>Service discovery and load balancing</li>
                        <li>Persistent volume management</li>
                        <li>Disaster recovery planning</li>
                    </ul>
                </div>
            `
        }
    };
    
    return blogArticles[articleId] || null;
}

// Modal Keyboard Handlers
function initializeModalKeyboardHandlers() {
    try {
        document.addEventListener('keydown', function(e) {
            // Close modals on Escape key
            if (e.key === 'Escape') {
                const caseStudyModal = document.getElementById('case-study-modal');
                const blogModal = document.getElementById('blog-modal');
                
                if (caseStudyModal && caseStudyModal.classList.contains('active')) {
                    closeCaseStudy();
                } else if (blogModal && blogModal.classList.contains('active')) {
                    closeBlogModal();
                }
            }
        });
        
        // Click outside to close modals
        const modals = document.querySelectorAll('.modal-overlay');
        modals.forEach(modal => {
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    if (modal.id === 'case-study-modal') {
                        closeCaseStudy();
                    } else if (modal.id === 'blog-modal') {
                        closeBlogModal();
                    }
                }
            });
        });
        
    } catch (error) {
        console.error('Error initializing modal keyboard handlers:', error);
    }
}

// GitHub Integration
function initializeGitHubIntegration() {
    try {
        const username = 'NathanGr33n';
        
        // Check if GitHub section exists
        const githubSection = document.getElementById('github-stats-grid');
        if (!githubSection) {
            console.warn('GitHub section not found');
            return;
        }
        
        // Fetch GitHub data with rate limiting awareness
        fetchGitHubData(username);
        
    } catch (error) {
        console.error('GitHub integration initialization failed:', error);
    }
}

async function fetchGitHubData(username) {
    try {
        // Input validation for username
        if (!username || typeof username !== 'string' || !/^[a-zA-Z0-9\-]+$/.test(username)) {
            throw new Error('Invalid username provided');
        }
        
        // Check for rate limiting
        const lastFetch = localStorage.getItem('github-last-fetch');
        const now = Date.now();
        const fiveMinutes = 5 * 60 * 1000;
        
        if (lastFetch && (now - parseInt(lastFetch)) < fiveMinutes) {
            console.log('Rate limiting: GitHub data fetched recently, skipping');
            return;
        }
        
        // Set timeout for API requests (10 seconds)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        
        // Use GitHub's public API (no authentication required but with rate limits)
        const userResponse = await fetch(`https://api.github.com/users/${username}`, {
            signal: controller.signal,
            headers: {
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        
        const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, {
            signal: controller.signal,
            headers: {
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        
        clearTimeout(timeoutId);
        
        if (!userResponse.ok || !reposResponse.ok) {
            if (userResponse.status === 403 || reposResponse.status === 403) {
                throw new Error('GitHub API rate limit exceeded');
            }
            throw new Error(`GitHub API request failed: ${userResponse.status} ${reposResponse.status}`);
        }
        
        const userData = await userResponse.json();
        const reposData = await reposResponse.json();
        
        // Validate response data
        if (!userData || !reposData || !Array.isArray(reposData)) {
            throw new Error('Invalid response data from GitHub API');
        }
        
        // Store last fetch time
        localStorage.setItem('github-last-fetch', now.toString());
        
        // Update statistics
        updateGitHubStats(userData, reposData);
        
        // Update recent activity (simulated from repos data)
        updateRecentActivity(reposData.slice(0, 5));
        
        // Update languages chart
        await updateLanguagesChart(username, reposData.slice(0, 10));
        
    } catch (error) {
        console.error('Error fetching GitHub data:', error);
        showGitHubError();
    }
}

function updateGitHubStats(userData, reposData) {
    try {
        // Calculate stats from repos data
        const totalStars = reposData.reduce((sum, repo) => sum + repo.stargazers_count, 0);
        const totalForks = reposData.reduce((sum, repo) => sum + repo.forks_count, 0);
        const languages = new Set(reposData.map(repo => repo.language).filter(Boolean));
        
        // Update DOM elements with animation
        animateCounterTo('total-repos', userData.public_repos);
        animateCounterTo('total-stars', totalStars);
        animateCounterTo('total-forks', totalForks);
        animateCounterTo('languages-count', languages.size);
        
    } catch (error) {
        console.error('Error updating GitHub stats:', error);
    }
}

function updateRecentActivity(recentRepos) {
    try {
        const activityContainer = document.getElementById('github-activity');
        if (!activityContainer) return;
        
        // Clear existing content
        activityContainer.innerHTML = '';
        
        // Create activity items safely using DOM methods
        recentRepos.forEach(repo => {
            const activityItem = document.createElement('div');
            activityItem.className = 'activity-item';
            
            const activityIcon = document.createElement('div');
            activityIcon.className = 'activity-icon';
            activityIcon.innerHTML = getActivityIcon(repo); // SVG is safe
            
            const activityContent = document.createElement('div');
            activityContent.className = 'activity-content';
            
            const activityTitle = document.createElement('div');
            activityTitle.className = 'activity-title';
            activityTitle.textContent = 'Updated repository';
            
            const activityRepo = document.createElement('div');
            activityRepo.className = 'activity-repo';
            activityRepo.textContent = sanitizeText(repo.name || 'Unknown');
            
            const activityTime = document.createElement('div');
            activityTime.className = 'activity-time';
            const updatedDate = new Date(repo.updated_at);
            activityTime.textContent = getTimeAgo(updatedDate);
            
            activityContent.appendChild(activityTitle);
            activityContent.appendChild(activityRepo);
            activityContent.appendChild(activityTime);
            
            activityItem.appendChild(activityIcon);
            activityItem.appendChild(activityContent);
            
            activityContainer.appendChild(activityItem);
        });
        
    } catch (error) {
        console.error('Error updating recent activity:', error);
        showActivityError();
    }
}

async function updateLanguagesChart(username, repos) {
    try {
        const languagesContainer = document.getElementById('languages-chart');
        if (!languagesContainer) return;
        
        // Count languages from repos (simplified approach)
        const languageCount = {};
        
        repos.forEach(repo => {
            if (repo.language) {
                languageCount[repo.language] = (languageCount[repo.language] || 0) + 1;
            }
        });
        
        // Convert to array and sort
        const languageArray = Object.entries(languageCount)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 6); // Top 6 languages
        
        const total = languageArray.reduce((sum, [, count]) => sum + count, 0);
        
        // Clear existing content
        languagesContainer.innerHTML = '';
        
        // Create language items safely using DOM methods
        languageArray.forEach(([language, count]) => {
            const percentage = Math.round((count / total) * 100);
            const color = getLanguageColor(sanitizeText(language));
            
            const languageItem = document.createElement('div');
            languageItem.className = 'language-item';
            
            const languageColor = document.createElement('div');
            languageColor.className = 'language-color';
            languageColor.style.backgroundColor = color;
            
            const languageInfo = document.createElement('div');
            languageInfo.className = 'language-info';
            
            const languageName = document.createElement('span');
            languageName.className = 'language-name';
            languageName.textContent = sanitizeText(language);
            
            const languagePercentage = document.createElement('span');
            languagePercentage.className = 'language-percentage';
            languagePercentage.textContent = percentage + '%';
            
            languageInfo.appendChild(languageName);
            languageInfo.appendChild(languagePercentage);
            
            const languageBar = document.createElement('div');
            languageBar.className = 'language-bar';
            
            const languageProgress = document.createElement('div');
            languageProgress.className = 'language-progress';
            languageProgress.style.backgroundColor = color;
            languageProgress.style.width = '0%';
            languageProgress.setAttribute('data-width', percentage + '%');
            
            languageBar.appendChild(languageProgress);
            
            languageItem.appendChild(languageColor);
            languageItem.appendChild(languageInfo);
            languageItem.appendChild(languageBar);
            
            languagesContainer.appendChild(languageItem);
        });
        
        // Animate language progress bars
        setTimeout(() => {
            const progressBars = languagesContainer.querySelectorAll('.language-progress');
            progressBars.forEach((bar, index) => {
                setTimeout(() => {
                    bar.style.width = bar.getAttribute('data-width');
                }, index * 100);
            });
        }, 300);
        
    } catch (error) {
        console.error('Error updating languages chart:', error);
        showLanguagesError();
    }
}

// Helper Functions
function sanitizeText(text) {
    if (typeof text !== 'string') return '';
    
    // Remove any potential HTML/script tags and dangerous characters
    return text
        .replace(/[<>&"']/g, function(match) {
            const replacements = {
                '<': '&lt;',
                '>': '&gt;',
                '&': '&amp;',
                '"': '&quot;',
                "'": '&#x27;'
            };
            return replacements[match];
        })
        .trim()
        .substring(0, 200); // Limit length to prevent overflow
}

function animateCounterTo(elementId, targetValue) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const startValue = 0;
    const duration = 1500;
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.floor(startValue + (targetValue - startValue) * easeOut);
        
        element.textContent = currentValue.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = targetValue.toLocaleString();
        }
    }
    
    requestAnimationFrame(updateCounter);
}

function getTimeAgo(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
}

function getActivityIcon(repo) {
    // Return appropriate SVG icon based on repo activity
    return `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
        </svg>
    `;
}

function getLanguageColor(language) {
    const colors = {
        'JavaScript': '#f1e05a',
        'TypeScript': '#2b7489',
        'Python': '#3572A5',
        'Java': '#b07219',
        'C++': '#f34b7d',
        'C#': '#239120',
        'Go': '#00ADD8',
        'Rust': '#dea584',
        'PHP': '#4F5D95',
        'Ruby': '#701516',
        'Swift': '#ffac45',
        'Kotlin': '#F18E33',
        'CSS': '#563d7c',
        'HTML': '#e34c26',
        'Shell': '#89e051',
        'Dockerfile': '#384d54'
    };
    return colors[language] || '#8b949e';
}

function showGitHubError() {
    const containers = ['github-activity', 'languages-chart'];
    containers.forEach(containerId => {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = `
                <div class="github-error">
                    <div class="github-error-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="15" y1="9" x2="9" y2="15"></line>
                            <line x1="9" y1="9" x2="15" y2="15"></line>
                        </svg>
                    </div>
                    <p>Unable to load GitHub data.<br>API rate limit may have been exceeded.</p>
                </div>
            `;
        }
    });
}

function showActivityError() {
    const container = document.getElementById('github-activity');
    if (container) {
        container.innerHTML = `
            <div class="github-error">
                <p>Unable to load recent activity</p>
            </div>
        `;
    }
}

function showLanguagesError() {
    const container = document.getElementById('languages-chart');
    if (container) {
        container.innerHTML = `
            <div class="github-error">
                <p>Unable to load language data</p>
            </div>
        `;
    }
}

// Initialize all enhancements
function initializeEnhancements() {
    initializeOptimizedScrollHandlers();
    initializeLoadingAnimation();
    initializeEmailCopy();
    initializeParallaxEffect();
    initializeModalKeyboardHandlers();
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