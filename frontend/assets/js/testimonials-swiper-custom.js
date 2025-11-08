/* Custom Testimonials Swiper JavaScript - Home Swiper Pattern with Dynamic Pagination */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing testimonials swiper with dynamic pagination...');
    
    // Get swiper elements
    const testimonialsSwiper = document.getElementById('testimonialsSwiper');
    const slides = testimonialsSwiper?.querySelectorAll('.swiper-slide');
    const prevButton = testimonialsSwiper?.querySelector('.swiper-prev');
    const nextButton = testimonialsSwiper?.querySelector('.swiper-next');
    const paginationContainer = testimonialsSwiper?.querySelector('.swiper-pagination');
    
    if (!testimonialsSwiper || !slides.length) {
        console.error('Testimonials swiper elements not found');
        return;
    }
    
    let currentSlide = 0;
    let autoplayInterval;
    let progressInterval;
    const totalSlides = slides.length;
    const maxVisibleDots = 4; // Show only 4 dots at a time
    const autoplayDuration = 5000; // 5 seconds
    
    // Create dynamic pagination dots
    function createPaginationDots() {
        paginationContainer.innerHTML = '';
        
        // Calculate which dots to show
        let startDot = Math.max(0, currentSlide - Math.floor(maxVisibleDots / 2));
        let endDot = Math.min(totalSlides - 1, startDot + maxVisibleDots - 1);
        
        // Adjust if we're near the end
        if (endDot - startDot < maxVisibleDots - 1) {
            startDot = Math.max(0, endDot - maxVisibleDots + 1);
        }
        
        for (let i = startDot; i <= endDot; i++) {
            const dot = document.createElement('button');
            dot.className = 'pagination-dot';
            dot.setAttribute('data-slide', i);
            dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
            
            if (i === currentSlide) {
                dot.classList.add('active');
            }
            
            dot.addEventListener('click', () => {
                console.log('Pagination dot clicked:', i + 1);
                showSlide(i);
                setTimeout(startAutoplay, 2000); // Restart after 2 seconds
            });
            
            paginationContainer.appendChild(dot);
        }
    }
    
    // Initialize swiper
    function initSwiper() {
        // Set first slide as active
        slides[0].classList.add('active');
        createPaginationDots();
        
        // Start autoplay after a short delay
        setTimeout(() => {
            startAutoplay();
        }, 1000);
        
        console.log('Testimonials swiper initialized with', slides.length, 'slides');
    }
    
    // Show specific slide
    function showSlide(index) {
        // Remove active class from all slides
        slides.forEach(slide => slide.classList.remove('active'));
        
        // Add active class to new slide
        slides[index].classList.add('active');
        
        currentSlide = index;
        
        // Update pagination dots
        createPaginationDots();
        
        console.log('Showing testimonial slide:', index + 1);
    }
    
    // Next slide
    function nextSlide() {
        const nextIndex = (currentSlide + 1) % slides.length;
        showSlide(nextIndex);
    }
    
    // Previous slide
    function prevSlide() {
        const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(prevIndex);
    }
    
    // Start autoplay
    function startAutoplay() {
        stopAutoplay();
        
        // Start the main autoplay interval
        autoplayInterval = setInterval(() => {
            console.log('Autoplay: moving to next slide');
            nextSlide();
        }, autoplayDuration);
        
        console.log('Autoplay started with', autoplayDuration / 1000, 'second intervals');
    }
    
    // Stop autoplay
    function stopAutoplay() {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
            autoplayInterval = null;
            console.log('Autoplay stopped');
        }
        if (progressInterval) {
            clearInterval(progressInterval);
            progressInterval = null;
        }
    }
    
    // Check if autoplay is working
    function checkAutoplayStatus() {
        console.log('Autoplay status:', autoplayInterval ? 'RUNNING' : 'STOPPED');
        return !!autoplayInterval;
    }
    
    // Event listeners
    
    // Navigation buttons
    nextButton?.addEventListener('click', () => {
        console.log('Next button clicked');
        nextSlide();
        setTimeout(startAutoplay, 2000); // Restart after 2 seconds
    });
    
    prevButton?.addEventListener('click', () => {
        console.log('Previous button clicked');
        prevSlide();
        setTimeout(startAutoplay, 2000); // Restart after 2 seconds
    });
    
    // Pause autoplay on hover
    testimonialsSwiper.addEventListener('mouseenter', () => {
        console.log('Mouse entered - pausing autoplay');
        stopAutoplay();
    });
    
    testimonialsSwiper.addEventListener('mouseleave', () => {
        console.log('Mouse left - resuming autoplay');
        setTimeout(startAutoplay, 1000); // Resume after 1 second
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (testimonialsSwiper.matches(':hover')) {
            if (e.key === 'ArrowLeft') {
                prevSlide();
                startAutoplay();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
                startAutoplay();
            }
        }
    });
    
    // Touch support for mobile
    let startX = 0;
    let startY = 0;
    
    testimonialsSwiper.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        stopAutoplay();
    });
    
    testimonialsSwiper.addEventListener('touchend', (e) => {
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        
        const diffX = startX - endX;
        const diffY = startY - endY;
        
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
            if (diffX > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
        
        startAutoplay();
        startX = 0;
        startY = 0;
    });
    
    // Handle visibility change
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stopAutoplay();
        } else {
            startAutoplay();
        }
    });
    
    // Initialize the swiper
    initSwiper();
    
    // Debug function for checking status
    window.testimonialsDebug = function() {
        console.log('=== TESTIMONIALS SWIPER DEBUG ===');
        console.log('Current slide:', currentSlide + 1, '/', totalSlides);
        console.log('Autoplay status:', checkAutoplayStatus());
        console.log('Active slide element:', slides[currentSlide]);
        console.log('Total slides found:', slides.length);
        console.log('===================================');
        return {
            currentSlide: currentSlide + 1,
            totalSlides: totalSlides,
            autoplayRunning: checkAutoplayStatus(),
            slidesFound: slides.length
        };
    };
    
    console.log('Dynamic testimonials swiper setup complete');
    console.log('Type testimonialsDebug() in console to check status');
});