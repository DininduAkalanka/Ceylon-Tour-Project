// Testimonials Swiper Initialization
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing testimonials swiper...');
    
    // Check if Swiper is loaded
    if (typeof Swiper === 'undefined') {
        console.error('Swiper library not loaded!');
        return;
    }
    
    // Initialize testimonials swiper
    const testimonialsSwiper = new Swiper('.testimonials-swiper', {
        // Basic settings
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        grabCursor: true,
        centeredSlides: true,
        
        // Autoplay
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
        },
        
        // Pagination
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            dynamicBullets: true,
            dynamicMainBullets: 3,
        },
        
        // Navigation arrows
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        
        // Responsive breakpoints
        breakpoints: {
            // Mobile devices
            576: {
                slidesPerView: 1,
                spaceBetween: 20,
            },
            // Tablets
            768: {
                slidesPerView: 1,
                spaceBetween: 25,
            },
            // Desktop
            992: {
                slidesPerView: 1,
                spaceBetween: 30,
            },
            // Large desktop
            1200: {
                slidesPerView: 1,
                spaceBetween: 40,
            }
        },
        
        // Effects
        effect: 'slide',
        speed: 800,
        
        // Accessibility
        a11y: {
            prevSlideMessage: 'Previous testimonial',
            nextSlideMessage: 'Next testimonial',
            paginationBulletMessage: 'Go to testimonial {{index}}',
        },
        
        // Keyboard control
        keyboard: {
            enabled: true,
            onlyInViewport: true,
        },
        
        // Mouse wheel
        mousewheel: {
            enabled: false,
        },
        
        // Events
        on: {
            init: function() {
                console.log('Testimonials swiper initialized successfully');
                // Add custom class for styling
                this.el.classList.add('swiper-initialized');
            },
            slideChange: function() {
                console.log('Testimonial slide changed to:', this.activeIndex);
            },
            reachEnd: function() {
                console.log('Reached last testimonial');
            },
            reachBeginning: function() {
                console.log('Reached first testimonial');
            }
        }
    });
    
    // Add hover pause functionality
    const swiperContainer = document.querySelector('.testimonials-swiper');
    if (swiperContainer && testimonialsSwiper) {
        swiperContainer.addEventListener('mouseenter', () => {
            testimonialsSwiper.autoplay.stop();
        });
        
        swiperContainer.addEventListener('mouseleave', () => {
            testimonialsSwiper.autoplay.start();
        });
    }
    
    // Error handling
    if (!testimonialsSwiper) {
        console.error('Failed to initialize testimonials swiper');
    }
});