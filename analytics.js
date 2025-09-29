/**
 * Analytics Configuration
 * Privacy-friendly analytics setup with multiple provider support
 */

class Analytics {
    constructor() {
        this.providers = [];
        this.isEnabled = false;
        this.config = {
            // Set this to your analytics provider preference
            provider: 'none', // Options: 'google', 'plausible', 'none'
            
            // Google Analytics 4
            googleAnalytics: {
                measurementId: 'GA_MEASUREMENT_ID', // Replace with your GA4 ID
                config: {
                    anonymize_ip: true,
                    send_page_view: false // We'll send manually for better control
                }
            },
            
            // Plausible Analytics (Privacy-friendly alternative)
            plausible: {
                domain: 'nathangreen.dev', // Replace with your domain
                apiHost: 'https://plausible.io' // Or self-hosted instance
            }
        };
    }

    /**
     * Initialize analytics based on configuration
     */
    init() {
        // Check for Do Not Track
        if (this.respectsDoNotTrack()) {
            console.log('Analytics disabled: Do Not Track enabled');
            return;
        }

        switch (this.config.provider) {
            case 'google':
                this.initGoogleAnalytics();
                break;
            case 'plausible':
                this.initPlausible();
                break;
            case 'none':
            default:
                console.log('Analytics disabled by configuration');
                return;
        }
    }

    /**
     * Check if user has Do Not Track enabled
     */
    respectsDoNotTrack() {
        return navigator.doNotTrack === '1' || 
               navigator.doNotTrack === 'yes' || 
               navigator.msDoNotTrack === '1' ||
               window.doNotTrack === '1';
    }

    /**
     * Initialize Google Analytics 4
     */
    initGoogleAnalytics() {
        const { measurementId, config } = this.config.googleAnalytics;
        
        // Load Google Analytics
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
        document.head.appendChild(script);

        // Configure gtag
        window.dataLayer = window.dataLayer || [];
        window.gtag = function() { dataLayer.push(arguments); };
        
        gtag('js', new Date());
        gtag('config', measurementId, config);
        
        this.isEnabled = true;
        console.log('Google Analytics initialized');
    }

    /**
     * Initialize Plausible Analytics
     */
    initPlausible() {
        const { domain, apiHost } = this.config.plausible;
        
        // Load Plausible script
        const script = document.createElement('script');
        script.async = true;
        script.defer = true;
        script.setAttribute('data-domain', domain);
        script.src = `${apiHost}/js/script.js`;
        document.head.appendChild(script);
        
        this.isEnabled = true;
        console.log('Plausible Analytics initialized');
    }

    /**
     * Track page view
     */
    trackPageView(path = null) {
        if (!this.isEnabled) return;

        path = path || window.location.pathname;
        
        switch (this.config.provider) {
            case 'google':
                if (window.gtag) {
                    gtag('event', 'page_view', {
                        page_path: path,
                        page_title: document.title
                    });
                }
                break;
            case 'plausible':
                if (window.plausible) {
                    window.plausible('pageview', { u: window.location.href });
                }
                break;
        }
    }

    /**
     * Track custom event
     */
    trackEvent(eventName, parameters = {}) {
        if (!this.isEnabled) return;

        switch (this.config.provider) {
            case 'google':
                if (window.gtag) {
                    gtag('event', eventName, parameters);
                }
                break;
            case 'plausible':
                if (window.plausible) {
                    window.plausible(eventName, { props: parameters });
                }
                break;
        }
    }

    /**
     * Track portfolio interactions
     */
    trackPortfolioEvent(action, project = null) {
        const params = { action };
        if (project) params.project = project;
        
        this.trackEvent('portfolio_interaction', params);
    }
}

// Initialize analytics
const analytics = new Analytics();

// Export for global use
window.portfolioAnalytics = analytics;

// Auto-initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => analytics.init());
} else {
    analytics.init();
}

// Track initial page view after a short delay
setTimeout(() => analytics.trackPageView(), 1000);

// Track portfolio interactions
document.addEventListener('DOMContentLoaded', function() {
    // Track project clicks
    document.querySelectorAll('.project-link').forEach(link => {
        link.addEventListener('click', (e) => {
            const projectName = e.target.closest('.project-card')?.querySelector('h3')?.textContent;
            analytics.trackPortfolioEvent('project_click', projectName);
        });
    });
    
    // Track contact button clicks
    document.querySelectorAll('.contact-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const contactType = e.target.textContent.trim();
            analytics.trackPortfolioEvent('contact_click', contactType);
        });
    });
    
    // Track section navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            const section = e.target.getAttribute('href').replace('#', '');
            analytics.trackPortfolioEvent('navigation', section);
        });
    });
});