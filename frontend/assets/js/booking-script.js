// Gallery functionality
document.addEventListener('DOMContentLoaded', function() {
    // Gallery image switching
    const mainGalleryImg = document.querySelector('.main-gallery img');
    const thumbnails = document.querySelectorAll('.gallery-thumb');
    
    if (thumbnails.length > 0 && mainGalleryImg) {
        thumbnails.forEach((thumb, index) => {
            thumb.addEventListener('click', function() {
                // Remove active class from all thumbnails
                thumbnails.forEach(t => t.classList.remove('active'));
                
                // Add active class to clicked thumbnail
                this.classList.add('active');
                
                // Change main image
                mainGalleryImg.src = this.src;
                mainGalleryImg.alt = this.alt;
            });
        });
        
        // Set first thumbnail as active by default
        if (thumbnails[0]) {
            thumbnails[0].classList.add('active');
        }
    }
    
    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Form validation and enhancement
    const bookingForm = document.querySelector('.booking-form form');
    if (bookingForm) {
        // Add notification display function
        function showBookingNotification(type, message) {
            // Remove existing notifications
            document.querySelectorAll('.booking-notification').forEach(el => el.remove());
            
            const notification = document.createElement('div');
            notification.className = `booking-notification booking-notification-${type}`;
            notification.innerHTML = `
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
                <span>${message}</span>
            `;
            
            bookingForm.insertAdjacentElement('beforebegin', notification);
            notification.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            setTimeout(() => notification.remove(), 8000);
        }
        
        bookingForm.addEventListener('submit', function(e) {
            const name = this.querySelector('input[name="fullName"]');
            const email = this.querySelector('input[name="email"]');
            const phone = this.querySelector('input[name="phone"]');
            const travelers = this.querySelector('input[name="numTravelers"]');
            
            let isValid = true;
            
            // Basic validation
            if (name && name.value.trim().length < 2) {
                alert('Please enter a valid name (at least 2 characters)');
                name.focus();
                e.preventDefault();
                return;
            }
            
            if (email && !isValidEmail(email.value)) {
                alert('Please enter a valid email address');
                email.focus();
                e.preventDefault();
                return;
            }
            
            if (phone && !isValidPhone(phone.value)) {
                alert('Please enter a valid phone number');
                phone.focus();
                e.preventDefault();
                return;
            }
            
            if (travelers && (travelers.value < 1 || travelers.value > 20)) {
                alert('Number of travelers must be between 1 and 20');
                travelers.focus();
                e.preventDefault();
                return;
            }
        });
    }
    
    // Date picker enhancement
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
        // Set minimum date to today
        const today = new Date().toISOString().split('T')[0];
        input.setAttribute('min', today);
    });
    
    // Add loading animation to form submission
    const submitBtn = document.querySelector('.booking-form button[type="submit"]');
    if (submitBtn) {
        submitBtn.addEventListener('click', function() {
            const form = this.closest('form');
            if (form && form.checkValidity()) {
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Booking...';
                this.disabled = true;
                
                // Re-enable after 3 seconds if form doesn't submit
                setTimeout(() => {
                    this.innerHTML = 'Book Now';
                    this.disabled = false;
                }, 3000);
            }
        });
    }
    
    // Animated counters for statistics
    const animateCounters = () => {
        const counters = document.querySelectorAll('.feature-card h3');
        counters.forEach(counter => {
            const text = counter.textContent;
            const match = text.match(/(\d+)/);
            if (match) {
                const targetNumber = parseInt(match[1]);
                animateCounter(counter, 0, targetNumber, 2000, text);
            }
        });
    };
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.feature-card, .testimonial-card, .highlight-card, .itinerary-day');
    animateElements.forEach(el => {
        observer.observe(el);
    });
});

// Helper functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{9,14}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

function animateCounter(element, start, end, duration, originalText) {
    const startTime = performance.now();
    const update = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const current = Math.floor(start + (end - start) * progress);
        
        element.textContent = originalText.replace(/\d+/, current);
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    };
    requestAnimationFrame(update);
}

// Add CSS for booking notifications
const style = document.createElement('style');
style.textContent = `
    .booking-notification {
        padding: 15px 20px;
        margin-bottom: 20px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        gap: 10px;
        animation: slideDown 0.3s ease-out;
    }
    
    .booking-notification-success {
        background-color: #d4edda;
        color: #155724;
        border-left: 4px solid #28a745;
    }
    
    .booking-notification-success i {
        color: #28a745;
        font-size: 20px;
    }
    
    .booking-notification-error {
        background-color: #f8d7da;
        color: #721c24;
        border-left: 4px solid #dc3545;
    }
    
    .booking-notification-error i {
        color: #dc3545;
        font-size: 20px;
    }
    
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .fade-in-up {
        opacity: 1 !important;
        transform: translateY(0) !important;
        transition: all 0.6s ease-out;
    }
    
    .feature-card,
    .testimonial-card,
    .highlight-card,
    .itinerary-day {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease-out;
    }
    
    .gallery-thumb {
        transition: all 0.3s ease;
    }
    
    .gallery-thumb:hover {
        transform: scale(1.05);
    }
    
    .booking-form button[type="submit"]:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
`;
document.head.appendChild(style);

