/**
 * WhatsApp Floating Button Script
 * Handles WhatsApp contact functionality
 * Version: 1.0.0
 */

(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    phoneNumber: '+94715336122', // Your WhatsApp business number (include country code)
    defaultMessage: 'Hello, I am interested in booking a tour package with Ceylon Tour. Could you please provide more information about your available packages and pricing? Thank you.', // Professional pre-filled message
    showDelay: 1000, // Delay before showing the button (ms)
    hideOnScroll: false, // Set to true to hide when scrolling up
    sendEmailNotification: true, // Send email notification when clicked
    emailEndpoint: 'whatsapp_notification.php' // PHP endpoint for email
  };

  // Wait for DOM to load
  document.addEventListener('DOMContentLoaded', function() {
    initWhatsAppButton();
  });

  /**
   * Initialize WhatsApp button functionality
   */
  function initWhatsAppButton() {
    const whatsappButton = document.querySelector('.whatsapp-button');
    
    if (!whatsappButton) {
      console.warn('WhatsApp button not found in DOM');
      return;
    }

    // Show button with delay
    setTimeout(() => {
      const whatsappFloat = document.querySelector('.whatsapp-float');
      if (whatsappFloat) {
        whatsappFloat.style.opacity = '0';
        whatsappFloat.style.display = 'block';
        fadeIn(whatsappFloat, 500);
      }
    }, CONFIG.showDelay);

    // Handle button click
    whatsappButton.addEventListener('click', handleWhatsAppClick);

    // Handle keyboard accessibility
    whatsappButton.addEventListener('keypress', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleWhatsAppClick(e);
      }
    });

    // Optional: Hide/show on scroll
    if (CONFIG.hideOnScroll) {
      handleScrollBehavior();
    }

    // Track analytics (if you have Google Analytics)
    trackWhatsAppInteraction();
  }

  /**
   * Handle WhatsApp button click
   */
  function handleWhatsAppClick(e) {
    e.preventDefault();

    // Get custom message if available
    const message = getCustomMessage() || CONFIG.defaultMessage;
    
    // Format phone number (remove spaces and special characters)
    const formattedPhone = CONFIG.phoneNumber.replace(/[^\d+]/g, '');
    
    // Create WhatsApp URL
    const whatsappURL = createWhatsAppURL(formattedPhone, message);
    
    // Send email notification before opening WhatsApp
    if (CONFIG.sendEmailNotification) {
      sendEmailNotification(message);
    }
    
    // Open WhatsApp - different method for mobile vs desktop
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isMobile) {
      // Mobile: Use window.location to open WhatsApp app directly
      window.location.href = whatsappURL;
    } else {
      // Desktop: Use window.open for WhatsApp Web
      window.open(whatsappURL, '_blank', 'noopener,noreferrer');
    }
    
    // Add click animation
    addClickAnimation(e.currentTarget);
    
    // Log interaction for analytics
    logWhatsAppClick();
  }

  /**
   * Create WhatsApp URL based on device
   */
  function createWhatsAppURL(phone, message) {
    const encodedMessage = encodeURIComponent(message);
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    // Use universal WhatsApp URL that works on both mobile and desktop
    // This URL automatically detects the platform and opens the right interface
    return `https://wa.me/${phone}?text=${encodedMessage}`;
  }

  /**
   * Get custom message based on page context
   */
  function getCustomMessage() {
    // Check if user is on a specific package page
    const packageTitle = document.querySelector('.package-title');
    if (packageTitle) {
      return `Good day! I am interested in the "${packageTitle.textContent.trim()}" tour package. Could you please provide detailed information including itinerary, pricing, and availability? Thank you.`;
    }

    // Check if user clicked from a specific section
    const hash = window.location.hash;
    if (hash === '#packages') {
      return 'Good day! I would like to inquire about your tour packages. Could you please share the available options, pricing details, and booking process? Thank you.';
    } else if (hash === '#contact') {
      return 'Hello, I would like to get in touch with Ceylon Tour regarding your services. Could you please assist me? Thank you.';
    } else if (hash === '#testimonials') {
      return 'Hello! I have read the positive reviews about Ceylon Tour and would like to discuss booking a tour package. Could you please contact me? Thank you.';
    } else if (hash === '#category') {
      return 'Good day! I am interested in learning more about your tour activities and packages. Could you please provide more information? Thank you.';
    }

    return null; // Use default message
  }

  /**
   * Add click animation effect
   */
  function addClickAnimation(button) {
    button.style.transform = 'scale(0.9)';
    setTimeout(() => {
      button.style.transform = '';
    }, 150);
  }

  /**
   * Handle scroll behavior (optional feature)
   */
  function handleScrollBehavior() {
    let lastScrollTop = 0;
    const whatsappFloat = document.querySelector('.whatsapp-float');
    
    window.addEventListener('scroll', function() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      if (scrollTop > lastScrollTop && scrollTop > 300) {
        // Scrolling down
        whatsappFloat.style.transform = 'translateY(100px)';
        whatsappFloat.style.opacity = '0';
      } else {
        // Scrolling up
        whatsappFloat.style.transform = 'translateY(0)';
        whatsappFloat.style.opacity = '1';
      }
      
      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }, false);
  }

  /**
   * Send email notification when WhatsApp button is clicked
   */
  function sendEmailNotification(message) {
    // Get user info from browser
    const userAgent = navigator.userAgent;
    const timestamp = new Date().toISOString();
    const pageUrl = window.location.href;
    const referrer = document.referrer || 'Direct visit';
    
    // Prepare data to send
    const data = {
      message: message,
      timestamp: timestamp,
      pageUrl: pageUrl,
      referrer: referrer,
      userAgent: userAgent,
      action: 'whatsapp_click'
    };

    // Send to PHP backend using Fetch API
    fetch(CONFIG.emailEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        console.log('Email notification sent successfully');
      } else {
        console.warn('Email notification failed:', data.message);
      }
    })
    .catch(error => {
      console.error('Error sending email notification:', error);
    });
  }

  /**
   * Track WhatsApp interactions for analytics
   */
  function trackWhatsAppInteraction() {
    const whatsappButton = document.querySelector('.whatsapp-button');
    
    if (whatsappButton) {
      whatsappButton.addEventListener('click', function() {
        // Google Analytics 4
        if (typeof gtag !== 'undefined') {
          gtag('event', 'whatsapp_click', {
            event_category: 'engagement',
            event_label: 'WhatsApp Contact Button',
            value: 1
          });
        }
        
        // Facebook Pixel
        if (typeof fbq !== 'undefined') {
          fbq('track', 'Contact', {
            content_name: 'WhatsApp Button'
          });
        }
      });
    }
  }

  /**
   * Log WhatsApp click to console (for debugging)
   */
  function logWhatsAppClick() {
    console.log('WhatsApp button clicked at:', new Date().toISOString());
  }

  /**
   * Fade in animation helper
   */
  function fadeIn(element, duration) {
    let opacity = 0;
    const interval = 50;
    const gap = interval / duration;

    const fading = setInterval(function() {
      opacity += gap;
      element.style.opacity = opacity;

      if (opacity >= 1) {
        clearInterval(fading);
      }
    }, interval);
  }

  /**
   * Update phone number dynamically (if needed)
   */
  window.updateWhatsAppNumber = function(newNumber) {
    CONFIG.phoneNumber = newNumber;
    console.log('WhatsApp number updated to:', newNumber);
  };

  /**
   * Update default message dynamically (if needed)
   */
  window.updateWhatsAppMessage = function(newMessage) {
    CONFIG.defaultMessage = newMessage;
    console.log('WhatsApp message updated');
  };

  /**
   * Show/hide WhatsApp button programmatically
   */
  window.toggleWhatsAppButton = function(show) {
    const whatsappFloat = document.querySelector('.whatsapp-float');
    if (whatsappFloat) {
      whatsappFloat.style.display = show ? 'block' : 'none';
    }
  };

})();

/**
 * Alternative: Simple implementation without IIFE
 * Uncomment if you prefer a simpler approach
 */

/*
function openWhatsApp() {
  const phone = '+94715336122'; // Your WhatsApp number
  const message = encodeURIComponent('Hello! I\'m interested in Ceylon Tour packages.');
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  
  const url = isMobile 
    ? `whatsapp://send?phone=${phone}&text=${message}`
    : `https://web.whatsapp.com/send?phone=${phone}&text=${message}`;
  
  window.open(url, '_blank');
}
*/

